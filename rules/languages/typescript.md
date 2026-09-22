---
id: typescript
title: TypeScript
tags: [language, typescript]
globs: ["**/*.ts", "**/*.tsx"]
description: Idiomatic, type-safe TypeScript.
---

- Enable `strict` mode. Do not disable it per-file to silence errors.
- Avoid `any`. Use `unknown` at boundaries and narrow with type guards. Reach for generics before escape hatches.
- Prefer `type` aliases for unions and function signatures; use `interface` for object shapes that may be extended.
- Do not use non-null assertions (`!`) to hide real nullability. Handle the `null`/`undefined` case.
- Model domain state with discriminated unions instead of loose optional flags.
- Derive types from a single source of truth (`typeof`, `keyof`, `ReturnType`, schema inference) rather than duplicating shapes.
- Keep functions' return types explicit for exported/public APIs.
- Prefer `readonly` and immutable data structures where practical.
- Use `satisfies` to validate a value against a type without widening it.
