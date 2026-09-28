# Polyrule

[![validate](https://github.com/rishbCLN/polyrule/actions/workflows/validate.yml/badge.svg)](https://github.com/rishbCLN/polyrule/actions/workflows/validate.yml)
[![npm](https://img.shields.io/npm/v/polyrule.svg)](https://www.npmjs.com/package/polyrule)
[![node](https://img.shields.io/node/v/polyrule.svg)](https://www.npmjs.com/package/polyrule)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Write your AI coding rules once. Compile them for every assistant.**

Cursor wants `.cursorrules`. Claude Code wants `CLAUDE.md`. Copilot wants `.github/copilot-instructions.md`. Windsurf, Cline, Zed, Aider, Gemini, Codex — each has its own file, its own format, its own quirks. So teams copy-paste the same rules into six files and let them rot out of sync.

Polyrule fixes that. You maintain a set of small, curated rule **modules**. One command compiles them into the exact file each assistant expects.

```bash
node compile.mjs --preset nextjs-fullstack --target all
```

```
Polyrule: 10 rule module(s) -> 11 target(s)

  wrote Cursor                       .cursor/rules/polyrule.mdc
  wrote Claude Code                  CLAUDE.md
  wrote GitHub Copilot               .github/copilot-instructions.md
  wrote Windsurf                     .windsurfrules
  ...
```

No dependencies. No build step. No account. Just Node 18+ and a folder of Markdown.

---

## Why

- **One source of truth.** Change a rule once; every assistant gets the update on the next compile.
- **Curated, not generic.** Each module is a tight, opinionated set of real practices — not a wall of "write clean code" filler.
- **Composable.** Mix and match modules per project. A Rust service and a Next.js app share the security and git modules but nothing else.
- **Portable.** Switch from Cursor to Claude Code — or add a new team member on a different tool — without rewriting anything.
- **Yours to fork.** It's plain Markdown and one script. Bend it to your stack.

## Quick start

Run it straight from npm — no install, no clone:

```bash
# See everything available
npx polyrule --list

# Compile a preset to specific assistants
npx polyrule --preset python-api --target cursor,claude

# Or hand-pick modules
npx polyrule --rules core/security-baseline,languages/go --target all

# Preview without writing files
npx polyrule --preset react-frontend --dry-run
```

Or install it globally so the `polyrule` command is always on your PATH:

```bash
npm install -g polyrule
polyrule --list
```

Prefer to hack on the catalog directly? Clone it and run the script:

```bash
git clone https://github.com/rishbCLN/polyrule.git
cd polyrule

# Compile a preset to specific assistants
node compile.mjs --preset python-api --target cursor,claude

# Validate the whole catalog (used in CI)
node compile.mjs --check

# Fail if any generated file has drifted from the rules (CI / pre-commit)
node compile.mjs --verify
```

To use it in your own project, either run the compiler with `--out /path/to/your/project`, or copy `rules/`, `config/`, and `compile.mjs` in and commit a `polyrule.config.json`:

```json
{
  "preset": "nextjs-fullstack",
  "targets": ["cursor", "claude", "copilot"]
}
```

Then just run `node compile.mjs` — it reads the config automatically. Commit the generated files so your whole team shares the same guidance.

## Bring your own rules

You don't have to fork the catalog to add house rules. Point Polyrule at a local rules directory and it's searched **before** the built-in catalog, so a local module with the same id overrides the shipped one, and brand-new modules just work.

```
your-project/
  ai-rules/
    local/
      company-conventions.md   # id: local/company-conventions
      core/
        clean-code.md          # overrides the built-in core/clean-code
  polyrule.config.json
```

```json
{
  "preset": "nextjs-fullstack",
  "rules": ["local/company-conventions"],
  "rulesDir": "./ai-rules",
  "targets": ["cursor", "claude", "copilot"]
}
```

`rulesDir` is resolved relative to the config file, so it's portable. On the CLI the equivalent is `--rules-dir ./ai-rules`. Run `node compile.mjs --list` and local modules are tagged `(local)`.

## Keeping generated files in sync

The generated files are just artifacts — they go stale the moment someone edits a rule. `--verify` renders everything in memory and diffs it against what's on disk, exiting non-zero if anything is `STALE` or `MISSING`. Wire it into CI (already included) or a pre-commit hook:

```bash
# .git/hooks/pre-commit
node compile.mjs --verify || {
  echo "AI rule files are out of date. Run: node compile.mjs"
  exit 1
}
```

## Supported assistants

| Target | Assistant | Output file |
| --- | --- | --- |
| `cursor` | Cursor | `.cursor/rules/polyrule.mdc` |
| `cursor-legacy` | Cursor (legacy) | `.cursorrules` |
| `claude` | Claude Code | `CLAUDE.md` |
| `copilot` | GitHub Copilot | `.github/copilot-instructions.md` |
| `windsurf` | Windsurf | `.windsurfrules` |
| `cline` | Cline | `.clinerules` |
| `codex` | OpenAI Codex | `AGENTS.md` |
| `continue` | Continue | `.continue/rules/polyrule.md` |
| `zed` | Zed | `.rules` |
| `aider` | Aider | `CONVENTIONS.md` |
| `gemini` | Gemini CLI | `GEMINI.md` |

Missing your tool? [Add a target](CONTRIBUTING.md) — it's one entry in `config/targets.json`.

## Rule catalog

**Core** (universal)
- `core/clean-code` — readability and code-quality baseline
- `core/security-baseline` — secure-by-default practices
- `core/git-commits` — commit and version-control hygiene
- `core/testing` — when and how to write tests

**Languages**
- `languages/typescript` · `languages/python` · `languages/rust` · `languages/go` · `languages/java` · `languages/csharp` · `languages/sql`

**Frameworks**
- `frameworks/react` · `frameworks/nextjs` · `frameworks/vue` · `frameworks/svelte` · `frameworks/tailwind` · `frameworks/fastapi` · `frameworks/django` · `frameworks/express` · `frameworks/spring-boot`

**Practices**
- `practices/accessibility` · `practices/performance` · `practices/api-design` · `practices/error-handling` · `practices/logging` · `practices/docker`

## Presets

Presets bundle modules for common stacks. They can `extend` another preset (all of them build on `base`).

| Preset | Stack |
| --- | --- |
| `base` | Universal engineering baseline |
| `nextjs-fullstack` | Next.js App Router + TS + Tailwind |
| `react-frontend` | React + TS + Tailwind |
| `vue-frontend` | Vue 3 + TS + Tailwind |
| `svelte-frontend` | SvelteKit + TS + Tailwind |
| `python-api` | FastAPI service |
| `django-api` | Django / DRF service |
| `node-api` | Express + TS service |
| `rust-service` | Rust backend / systems |
| `go-service` | Go backend / microservice |
| `java-spring` | Spring Boot service |
| `dotnet-api` | ASP.NET Core service |

## Writing your own module

A module is a Markdown file with a small frontmatter block:

```markdown
---
id: my-rule
title: My Rule
tags: [practice]
globs: ["**/*.ts"]
description: What this module covers.
---

- Keep each rule a single, actionable line.
- Say what to do, not just what to avoid.
```

Drop it anywhere under `rules/`, reference it by path (minus `.md`) in a preset or `--rules`, and recompile. The `globs` are unioned and used by tools that scope rules to file patterns (like Cursor's `.mdc`).

## How it works

`compile.mjs` reads your selected modules (local dirs first, then the catalog), parses their frontmatter, resolves any preset `extends` chains, de-duplicates, and renders each target in its native format (Markdown for most, `.mdc` with unioned globs for Cursor). It's a single dependency-free Node file. Read it — there's no magic.

## Development

```bash
node --test            # run the test suite (Node built-in, no deps)
node compile.mjs --check   # validate rules, presets, and targets
```

CI runs `--check`, the test suite, and a dry-run of every preset on Node 18/20/22.

## Contributing

New rule modules, presets, and assistant targets are all welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). The bar for rules: specific, actionable, and something you'd actually enforce in review.

## License

MIT. See [LICENSE](LICENSE).
