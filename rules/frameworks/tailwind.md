---
id: tailwind
title: Tailwind CSS
tags: [framework, tailwind, css, frontend]
globs: ["**/*.tsx", "**/*.jsx", "**/*.html", "**/*.vue"]
description: Utility-first styling conventions.
---

- Use design tokens from the Tailwind config (spacing, colors, typography). Avoid arbitrary values like `w-[473px]` unless truly one-off.
- Extract repeated utility clusters into components, not `@apply` soup. Reserve `@apply` for genuinely shared primitives.
- Order responsive and state variants consistently: base first, then `sm: md: lg:`, then `hover: focus: disabled:`.
- Use semantic color tokens (e.g. `bg-surface`, `text-muted`) via config, not raw palette values scattered across markup.
- Ensure interactive elements have visible `focus-visible` styles for accessibility.
- Prefer `gap` utilities with flex/grid over margin hacks for spacing between items.
- Keep dark mode handled through the `dark:` variant and tokens, not duplicated components.
