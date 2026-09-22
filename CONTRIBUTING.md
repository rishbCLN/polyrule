# Contributing to Polyrule

Thanks for helping make Polyrule better. There are three ways to contribute: rule modules, presets, and assistant targets.

## Rule modules

A good rule module is **specific and actionable** — the kind of thing you'd point to in a code review. Vague advice ("write good code") doesn't earn its place.

1. Create a Markdown file under the right folder in `rules/`:
   - `core/` — universal, language-agnostic
   - `languages/` — one language
   - `frameworks/` — one framework or library
   - `practices/` — a cross-cutting discipline (testing, a11y, performance…)
2. Add frontmatter:

   ```markdown
   ---
   id: kebab-case-id
   title: Human Readable Title
   tags: [category, extra]
   globs: ["**/*.ext"]
   description: One line on what this covers.
   ---
   ```

3. Write the body as a flat bullet list. Each bullet is one rule. Prefer imperative phrasing ("Use X", "Never Y"). Aim for 6–12 high-signal bullets, not an exhaustive style guide.
4. Verify it compiles:

   ```bash
   node compile.mjs --rules your/module-id --target claude --dry-run
   ```

### Style bar for rules

- **Actionable.** Someone can follow or enforce it.
- **Opinionated but defensible.** Pick a lane; explain trade-offs only when genuinely contested.
- **Timeless-ish.** Avoid pinning to a version that'll be stale in six months unless the version is the point.
- **No filler.** If a bullet could apply to literally any codebase and adds nothing, cut it.

## Presets

Presets live in `config/presets.json`. A preset can `extends` another (they typically build on `base`) and lists `rules` by module id.

```json
"my-stack": {
  "description": "Short description of the stack.",
  "extends": "base",
  "rules": ["languages/typescript", "frameworks/react"]
}
```

Keep presets focused on a real, common stack rather than every possible combination.

## Assistant targets

To add support for a new AI assistant, add an entry to `config/targets.json`:

```json
"toolname": {
  "name": "Display Name",
  "output": "relative/path/to/output-file",
  "format": "markdown"
}
```

- `format` is `markdown` for most tools, or `mdc` for Cursor-style files with frontmatter + globs.
- If a tool needs a genuinely new output format, add a formatter in `compile.mjs` (`render()` switch) and reference it here.

Please link the tool's own docs for the config file location in your PR so we can verify the path.

## Before you open a PR

- Run `node compile.mjs --check` — it validates every rule's frontmatter, that all presets resolve, and that targets are well-formed. CI runs the same check.
- Run `node compile.mjs --list` to confirm your additions show up.
- Run a `--dry-run` for anything you added.
- Keep PRs focused: one module, preset, or target theme per PR is easiest to review.
