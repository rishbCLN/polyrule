---
id: clean-code
title: Clean Code
tags: [core, quality]
globs: ["**/*"]
description: Baseline code quality and readability standards.
---

- Write code for humans first. Optimize for readability over cleverness.
- Prefer clear, descriptive names. Avoid abbreviations and single-letter names except for loop counters.
- Keep functions small and focused on a single responsibility. If a function needs a comment to explain a section, extract that section into a named function.
- Avoid deep nesting. Return early to reduce indentation.
- Do not leave commented-out code, dead code, or debug logging in commits.
- Match the existing style, conventions, and libraries of the file and project before introducing new ones.
- Handle errors explicitly. Never swallow exceptions silently.
- Delete code that is no longer used rather than keeping it "just in case". Version control remembers it.
- Comments explain *why*, not *what*. The code already says what it does.
