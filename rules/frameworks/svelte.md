---
id: svelte
title: Svelte / SvelteKit
tags: [framework, svelte, frontend]
globs: ["**/*.svelte"]
description: Svelte 5 and SvelteKit conventions.
---

- Use runes (`$state`, `$derived`, `$effect`) for reactivity in Svelte 5; avoid legacy reactive `$:` in new code.
- Derive values with `$derived` instead of syncing state manually in effects.
- Use `$effect` only for side effects (DOM, subscriptions); return a cleanup function for anything you set up.
- In SvelteKit, load data in `+page.server.ts`/`+layout.server.ts` `load` functions; keep secrets server-side.
- Use form actions for mutations and progressive enhancement; validate on the server.
- Keep components small; extract shared logic into `.svelte.ts` modules with runes.
- Provide `key` blocks or keyed `{#each}` (`{#each items as item (item.id)}`) for correct list updates.
- Scope styles by default; reach for `:global()` deliberately, not by habit.
