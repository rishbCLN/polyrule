---
id: express
title: Express / Node
tags: [framework, express, node, backend]
globs: ["**/*.ts", "**/*.js"]
description: Express and Node.js service conventions.
---

- Keep route handlers thin: validate input, delegate to a service layer, return a response.
- Validate request bodies, params, and query with a schema library (Zod, Joi) before using them.
- Use a centralized error-handling middleware; never leak stack traces to clients in production.
- Wrap async handlers so rejected promises reach the error middleware (async wrapper or Express 5).
- Set security middleware: `helmet`, CORS with an explicit allowlist, and rate limiting on public routes.
- Never trust client input for authorization; verify ownership and permissions on every protected route.
- Read config and secrets from environment variables; validate them at startup and fail fast if missing.
- Use structured logging with request correlation IDs; do not log secrets or full PII payloads.
- Gracefully handle `SIGTERM`: stop accepting connections, drain in-flight requests, then exit.
- Prefer `async`/`await` over callbacks; avoid blocking the event loop with sync I/O or heavy CPU work.
