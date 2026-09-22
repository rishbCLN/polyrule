---
id: error-handling
title: Error Handling
tags: [practice, reliability]
globs: ["**/*"]
description: Robust, predictable error handling.
---

- Fail fast and loudly during development; degrade gracefully in production.
- Never swallow errors. If you catch one, handle it, rethrow it, or log it with enough context to act on.
- Distinguish expected errors (validation, not found) from unexpected ones (bugs, outages) and treat them differently.
- Preserve the original cause when wrapping errors; do not discard stack traces or root causes.
- Validate inputs at boundaries so the core logic can assume valid data.
- Make error messages actionable: what failed, why, and ideally what to do next. Avoid leaking internals to end users.
- Use typed/domain errors over generic strings so callers can branch reliably.
- Clean up resources on every path (finally/defer/using); do not leak on the error path.
- For transient failures, retry with backoff and a cap; make retried operations idempotent.
- Set timeouts on all I/O; a hung dependency should fail, not block forever.
