---
id: accessibility
title: Accessibility (a11y)
tags: [practice, accessibility, frontend]
globs: ["**/*.tsx", "**/*.jsx", "**/*.html", "**/*.vue"]
description: Baseline accessibility requirements.
---

- Use semantic HTML first: `button`, `a`, `nav`, `main`, `label`. Reach for ARIA only when no native element fits.
- Every interactive element must be keyboard operable and have a visible focus indicator.
- Associate every form input with a `label`. Provide descriptive error messages tied to fields via `aria-describedby`.
- Give images meaningful `alt` text; use empty `alt=""` for decorative images.
- Maintain a logical heading hierarchy (one `h1` per page, no skipped levels).
- Meet WCAG AA color contrast (4.5:1 for normal text, 3:1 for large text and UI components).
- Do not convey information by color alone; pair it with text or icons.
- Respect `prefers-reduced-motion` for animations.
- Full WCAG compliance requires manual testing with assistive technologies; treat these as a baseline, not a guarantee.
