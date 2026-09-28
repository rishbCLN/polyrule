#!/usr/bin/env node
// Polyrule — write your AI coding rules once, compile them for every assistant.
// Zero dependencies. Requires Node 18+.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = path.join(ROOT, "rules");
const TARGETS = readJson(path.join(ROOT, "config", "targets.json"));
const PRESETS = readJson(path.join(ROOT, "config", "presets.json"));

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function getVersion() {
  try {
    return readJson(path.join(ROOT, "package.json")).version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

// Flags Polyrule understands. Anything else is rejected so an unknown option
// never silently falls through to a full compile.
const KNOWN_FLAGS = new Set([
  "preset",
  "rules",
  "rules-dir",
  "target",
  "out",
  "config",
  "dry-run",
  "verify",
  "check",
  "list",
  "help",
  "version",
]);

// ---------- CLI ----------

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-v" || a === "-V") {
      args.version = true;
    } else if (a === "-h") {
      args.help = true;
    } else if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      // A value that itself begins with "-" is treated as the next flag, not
      // as this flag's argument, so short flags are never swallowed as values.
      if (next === undefined || next.startsWith("-")) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    } else if (a.startsWith("-") && a.length > 1) {
      // Unknown short flag (anything past -v/-V/-h): record it under its
      // stripped name so the KNOWN_FLAGS guard rejects it, instead of letting
      // it fall through as a positional and silently trigger a full compile.
      args[a.slice(1)] = true;
    } else {
      args._.push(a);
    }
  }
  return args;
}

function list(val) {
  if (!val || val === true) return [];
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------- Frontmatter parser (minimal, no deps) ----------

function parseRuleFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }
  const meta = parseFrontmatter(match[1]);
  const body = match[2].trim();
  return { meta, body };
}

function parseFrontmatter(block) {
  const meta = {};
  for (const line of block.split(/\r?\n/)) {
    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = splitList(value.slice(1, -1))
        .map((s) => unquote(s.trim()))
        .filter(Boolean);
    } else {
      meta[key] = unquote(value);
    }
  }
  return meta;
}

// Split a comma-separated inline array, ignoring commas that sit inside
// single or double quotes (e.g. globs like "src/**/*.{ts,tsx}").
function splitList(inner) {
  const out = [];
  let buf = "";
  let quote = null;
  for (const ch of inner) {
    if (quote) {
      buf += ch;
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
    } else if (ch === ",") {
      out.push(buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  out.push(buf);
  return out;
}

function unquote(s) {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

// ---------- Rule resolution ----------

function resolvePreset(name, seen = new Set()) {
  const preset = PRESETS[name];
  if (!preset) {
    throw new Error(`Unknown preset: "${name}". Run --list to see options.`);
  }
  if (seen.has(name)) {
    throw new Error(`Circular preset extension detected at "${name}".`);
  }
  seen.add(name);
  let rules = [];
  if (preset.extends) {
    rules = rules.concat(resolvePreset(preset.extends, seen));
  }
  rules = rules.concat(preset.rules || []);
  return rules;
}

function dedupe(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

// Find a rule file by id across the given directories.
// Earlier directories win, so project-local rules override the catalog.
// Rule ids are confined to their directory: a resolved path that escapes the
// search dir (via "../", an absolute path, etc.) is rejected so a crafted id
// cannot read arbitrary files outside the rules tree.
function findRuleFile(id, dirs) {
  for (const dir of dirs) {
    const base = path.resolve(dir);
    const filePath = path.resolve(base, `${id}.md`);
    const rel = path.relative(base, filePath);
    if (rel.startsWith("..") || path.isAbsolute(rel)) continue;
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

function loadRules(ruleIds, dirs) {
  return ruleIds.map((id) => {
    const filePath = findRuleFile(id, dirs);
    if (!filePath) {
      throw new Error(
        `Rule not found: "${id}" (searched: ${dirs.join(", ")})`
      );
    }
    const parsed = parseRuleFile(filePath);
    return { id, filePath, ...parsed };
  });
}

// List every rule id available across the given directories (deduped, sorted).
function allRuleIds(dirs) {
  const ids = new Set();
  const walk = (dir, prefix) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), `${prefix}${entry.name}/`);
      } else if (entry.name.endsWith(".md")) {
        ids.add(`${prefix}${entry.name.replace(/\.md$/, "")}`);
      }
    }
  };
  for (const dir of dirs) walk(dir, "");
  return [...ids].sort();
}

// ---------- Formatters ----------

const HEADER =
  "<!-- Generated by Polyrule. Edit modules in /rules and recompile; do not edit this file by hand. -->";

function formatMarkdown(rules) {
  const sections = rules.map((r) => {
    const title = r.meta.title || r.id;
    return `## ${title}\n\n${r.body}`;
  });
  return `${HEADER}\n\n# Project Rules\n\n${sections.join("\n\n")}\n`;
}

function formatMdc(rules) {
  const globs = dedupe(rules.flatMap((r) => r.meta.globs || []));
  const body = rules
    .map((r) => `## ${r.meta.title || r.id}\n\n${r.body}`)
    .join("\n\n");
  // Cursor: when globs are present, scope with them (alwaysApply false).
  // With no globs, apply the rules to the whole project.
  const fm = ["---", "description: Project rules compiled by Polyrule"];
  if (globs.length) {
    fm.push(`globs: ${globs.join(", ")}`, "alwaysApply: false");
  } else {
    fm.push("alwaysApply: true");
  }
  fm.push("---");
  return `${fm.join("\n")}\n\n${body}\n`;
}

function render(format, rules) {
  switch (format) {
    case "mdc":
      return formatMdc(rules);
    case "markdown":
    default:
      return formatMarkdown(rules);
  }
}

// ---------- Config resolution ----------

// Resolve rule directories: project-local (override) first, catalog last.
function resolveRuleDirs(args, cfg, configDir) {
  const dirs = [];
  if (typeof args["rules-dir"] === "string") {
    dirs.push(path.resolve(args["rules-dir"]));
  }
  if (cfg && cfg.rulesDir) {
    // Config-relative so it is portable regardless of where you run from.
    dirs.push(path.resolve(configDir, cfg.rulesDir));
  }
  dirs.push(CATALOG_DIR);
  return dedupe(dirs);
}

function loadConfigFile(args) {
  const configPath = path.resolve(
    typeof args.config === "string" ? args.config : "polyrule.config.json"
  );
  if (fs.existsSync(configPath)) {
    return { cfg: readJson(configPath), configDir: path.dirname(configPath) };
  }
  return { cfg: null, configDir: process.cwd() };
}

function resolveConfig(args) {
  const { cfg, configDir } = loadConfigFile(args);
  const dirs = resolveRuleDirs(args, cfg, configDir);

  let ruleIds = [];
  let targets = list(args.target);

  // Precedence: explicit CLI rules/preset > config file.
  if (args.rules || args.preset) {
    if (args.preset) ruleIds = ruleIds.concat(resolvePreset(String(args.preset)));
    if (args.rules) ruleIds = ruleIds.concat(list(args.rules));
  } else if (cfg) {
    if (cfg.preset) ruleIds = ruleIds.concat(resolvePreset(cfg.preset));
    if (cfg.rules) ruleIds = ruleIds.concat(cfg.rules);
  }

  // Targets fall back to the config independently of where the rules came
  // from: choosing rules on the CLI must not silently discard config targets
  // and fan out to every target.
  if (!targets.length && cfg && cfg.targets) targets = cfg.targets;

  // "all" anywhere in the target list means every target.
  if (!targets.length || targets.includes("all")) {
    targets = Object.keys(TARGETS);
  }

  return { ruleIds: dedupe(ruleIds), targets, dirs };
}

// ---------- Commands ----------

function printList(dirs) {
  const catalogIds = new Set(allRuleIds([CATALOG_DIR]));
  console.log("\nPresets:");
  for (const [name, p] of Object.entries(PRESETS)) {
    console.log(`  ${name.padEnd(18)} ${p.description || ""}`);
  }
  console.log("\nTargets:");
  for (const [name, t] of Object.entries(TARGETS)) {
    console.log(`  ${name.padEnd(18)} ${t.name} -> ${t.output}`);
  }
  console.log("\nRule modules:");
  for (const id of allRuleIds(dirs)) {
    const tag = catalogIds.has(id) ? "" : "  (local)";
    console.log(`  ${id}${tag}`);
  }
  console.log("");
}

// Validate the whole catalog: rule frontmatter, presets, and targets.
// Returns the number of problems found (0 = healthy).
function runCheck(dirs) {
  const problems = [];
  const ruleIds = allRuleIds(dirs);

  // Rules: required frontmatter + parseable body.
  for (const id of ruleIds) {
    const filePath = findRuleFile(id, dirs);
    const { meta, body } = parseRuleFile(filePath);
    if (!meta.id) problems.push(`rule "${id}": missing frontmatter "id"`);
    if (meta.id && meta.id !== path.basename(id))
      problems.push(`rule "${id}": frontmatter id "${meta.id}" does not match filename`);
    if (!meta.title) problems.push(`rule "${id}": missing frontmatter "title"`);
    if (!body.trim()) problems.push(`rule "${id}": empty body`);
  }

  // Presets: resolve (catches bad extends/cycles) and confirm every rule exists.
  const known = new Set(ruleIds);
  for (const name of Object.keys(PRESETS)) {
    try {
      for (const rid of resolvePreset(name)) {
        if (!known.has(rid))
          problems.push(`preset "${name}": references unknown rule "${rid}"`);
      }
    } catch (err) {
      problems.push(`preset "${name}": ${err.message}`);
    }
  }

  // Targets: required fields + known format + no output collisions.
  const formats = new Set(["markdown", "mdc"]);
  const outputs = new Map();
  for (const [name, t] of Object.entries(TARGETS)) {
    if (!t.name) problems.push(`target "${name}": missing "name"`);
    if (!t.output) problems.push(`target "${name}": missing "output"`);
    if (!formats.has(t.format))
      problems.push(`target "${name}": unknown format "${t.format}"`);
    if (t.output) {
      if (outputs.has(t.output))
        problems.push(
          `target "${name}": output "${t.output}" collides with "${outputs.get(t.output)}"`
        );
      else outputs.set(t.output, name);
    }
  }

  if (problems.length) {
    console.error(`Polyrule check: ${problems.length} problem(s) found\n`);
    for (const p of problems) console.error(`  - ${p}`);
    return problems.length;
  }
  console.log(
    `Polyrule check: OK (${ruleIds.length} rules, ${Object.keys(PRESETS).length} presets, ${Object.keys(TARGETS).length} targets)`
  );
  return 0;
}

const HELP = `
Polyrule — write your AI coding rules once, compile them for every assistant.

Usage:
  node compile.mjs [options]

Options:
  --preset <name>      Use a named preset (see --list).
  --rules <a,b,c>      Comma-separated rule modules (e.g. core/security-baseline,languages/python).
  --rules-dir <dir>    Extra rules directory searched before the built-in catalog (overrides by id).
  --target <t,t|all>   One or more targets, or "all". Default: all.
  --out <dir>          Output directory. Default: current directory.
  --config <file>      Read options from a JSON config. Default: polyrule.config.json (if present).
  --dry-run            Print what would be written without touching the filesystem.
  --verify             Check that on-disk output matches what would be generated. Non-zero if stale.
  --check              Validate all rules, presets, and targets (exits non-zero on problems).
  --list               List presets, targets, and rule modules.
  --help               Show this help.
  --version            Print the Polyrule version.

Examples:
  node compile.mjs --preset nextjs-fullstack --target cursor,claude
  node compile.mjs --rules core/security-baseline,languages/go --target all
  node compile.mjs --verify        # CI/pre-commit: fail if generated files drifted
  node compile.mjs                 # uses ./polyrule.config.json
`;

function printResolved(rules, dirs) {
  const catalogIds = new Set(allRuleIds([CATALOG_DIR]));
  console.log("Modules:");
  for (const r of rules) {
    const tag = catalogIds.has(r.id) ? "" : " (local)";
    console.log(`  - ${r.id}${tag}`);
  }
  console.log("");
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const unknown = Object.keys(args).filter(
    (k) => k !== "_" && !KNOWN_FLAGS.has(k)
  );
  if (unknown.length) {
    console.error(`Unknown option: --${unknown[0]}. Run --help.`);
    process.exit(1);
  }

  if (args.version) {
    console.log(`polyrule ${getVersion()}`);
    return;
  }

  if (args.help) {
    console.log(HELP);
    return;
  }

  // These commands still honor --rules-dir / config rulesDir.
  const preConfig = (() => {
    const { cfg, configDir } = loadConfigFile(args);
    return resolveRuleDirs(args, cfg, configDir);
  })();

  if (args.list) {
    printList(preConfig);
    return;
  }
  if (args.check) {
    process.exit(runCheck(preConfig) === 0 ? 0 : 1);
  }

  const { ruleIds, targets, dirs } = resolveConfig(args);

  if (!ruleIds.length) {
    console.error(
      "No rules selected. Use --preset, --rules, or a polyrule.config.json. Run --help."
    );
    process.exit(1);
  }

  const unknownTargets = targets.filter((t) => !TARGETS[t]);
  if (unknownTargets.length) {
    console.error(`Unknown target(s): ${unknownTargets.join(", ")}. Run --list.`);
    process.exit(1);
  }

  const rules = loadRules(ruleIds, dirs);
  const outDir = path.resolve(typeof args.out === "string" ? args.out : ".");
  const dryRun = Boolean(args["dry-run"]);
  const verify = Boolean(args.verify);

  // ----- verify mode: compare on-disk output to freshly rendered output -----
  if (verify) {
    console.log(
      `Polyrule verify: ${rules.length} module(s) -> ${targets.length} target(s)\n`
    );
    printResolved(rules, dirs);
    const stale = [];
    for (const targetKey of targets) {
      const target = TARGETS[targetKey];
      const expected = render(target.format, rules);
      const dest = path.join(outDir, target.output);
      let status;
      if (!fs.existsSync(dest)) {
        status = "MISSING";
        stale.push(targetKey);
      } else if (normalize(fs.readFileSync(dest, "utf8")) !== normalize(expected)) {
        status = "STALE";
        stale.push(targetKey);
      } else {
        status = "ok";
      }
      console.log(`  ${status.padEnd(8)} ${target.name.padEnd(28)} ${target.output}`);
    }
    if (stale.length) {
      console.error(
        `\n${stale.length} file(s) out of date. Run without --verify to regenerate.`
      );
      process.exit(1);
    }
    console.log("\nAll generated files are up to date.");
    return;
  }

  // ----- compile / dry-run -----
  console.log(
    `Polyrule: ${rules.length} rule module(s) -> ${targets.length} target(s)${
      dryRun ? " (dry run)" : ""
    }\n`
  );
  if (dryRun) printResolved(rules, dirs);

  for (const targetKey of targets) {
    const target = TARGETS[targetKey];
    const content = render(target.format, rules);
    const dest = path.join(outDir, target.output);

    if (dryRun) {
      console.log(`  would write ${target.name.padEnd(28)} ${target.output}`);
      continue;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content, "utf8");
    console.log(`  wrote ${target.name.padEnd(28)} ${target.output}`);
  }

  console.log("\nDone.");
}

// Normalize line endings so verify does not false-positive on CRLF vs LF.
function normalize(s) {
  return s.replace(/\r\n/g, "\n");
}

// Only run the CLI when executed directly, not when imported by tests.
const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

// Exported for the test suite (import side-effect free when run as a module).
export {
  parseArgs,
  parseFrontmatter,
  parseRuleFile,
  resolvePreset,
  dedupe,
  formatMarkdown,
  formatMdc,
  render,
  allRuleIds,
  findRuleFile,
  loadRules,
  normalize,
  CATALOG_DIR,
  TARGETS,
  PRESETS,
};
