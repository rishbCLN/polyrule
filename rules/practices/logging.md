---
id: logging
title: Logging & Observability
tags: [practice, logging, observability]
globs: ["**/*"]
description: Structured, useful, safe logging.
---

- Log in a structured format (JSON) with consistent field names, not free-form string concatenation.
- Use appropriate levels: `error` for failures needing attention, `warn` for recoverable anomalies, `info` for key events, `debug` for diagnostics.
- Never log secrets, tokens, passwords, or full PII. Redact sensitive fields at the logging boundary.
- Include a correlation/request ID on every log line so a single request can be traced across services.
- Log the cause with context ("failed to charge order 123: gateway timeout"), not just "error occurred".
- Do not log inside tight loops or hot paths at `info`; it drowns signal and costs money.
- Emit metrics for rates, errors, and durations (RED/USE) rather than parsing logs for numbers.
- Make logging non-blocking; a logging failure must never crash the request path.
- Set retention and sampling deliberately; high-volume debug logs should be sampled or short-lived.
