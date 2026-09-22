---
id: react
title: React
tags: [framework, react, frontend]
globs: ["**/*.tsx", "**/*.jsx"]
description: Modern React component practices.
---

- Use function components and hooks. No class components in new code.
- Keep components small and composable. Extract logic into custom hooks; extract UI into child components.
- Follow the rules of hooks: call them unconditionally at the top level, never in loops or conditions.
- Derive state; do not duplicate it. Compute values during render instead of syncing with extra `useState` + `useEffect`.
- Use `useEffect` only for synchronizing with external systems, not for reacting to prop changes you can compute inline.
- Every effect must clean up subscriptions, timers, and listeners it creates.
- Provide stable, meaningful `key` props for lists. Never use array index as key for dynamic lists.
- Memoize (`useMemo`/`useCallback`/`memo`) only after measuring a real problem, not by default.
- Keep components pure during render: no mutations, no side effects outside effects/handlers.
- Colocate state as low as possible; lift only when genuinely shared.
