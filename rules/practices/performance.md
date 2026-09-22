---
id: performance
title: Performance
tags: [practice, performance]
globs: ["**/*"]
description: Practical performance guidance.
---

- Measure before optimizing. Profile to find the real bottleneck instead of guessing.
- Avoid N+1 queries. Batch, join, or use dataloaders for related data access.
- Add indexes for columns used in filters, joins, and sorts; verify with query plans.
- Cache expensive, stable results with explicit invalidation. A cache without an eviction/invalidation strategy is a bug.
- Paginate or stream large result sets; never load unbounded data into memory.
- On the frontend, minimize bundle size: code-split routes, lazy-load heavy components, and avoid shipping unused dependencies.
- Debounce or throttle high-frequency events (scroll, resize, input) that trigger expensive work.
- Prefer streaming and incremental rendering over blocking on the slowest resource.
- Set and track budgets (bundle size, p95 latency) so regressions are visible.
