---
id: api-design
title: API Design
tags: [practice, api, backend]
globs: ["**/*"]
description: Consistent, predictable HTTP API design.
---

- Use nouns for resources and HTTP verbs for actions: `GET /users/{id}`, `POST /users`, not `/getUser`.
- Return correct status codes: 200/201 for success, 400 for client errors, 401/403 for auth, 404 for missing, 409 for conflicts, 422 for validation, 5xx for server faults.
- Keep responses consistent. Use a stable envelope or shape across endpoints and document it.
- Validate all inputs server-side and return actionable, field-level error messages.
- Version the API (`/v1`) so breaking changes do not break existing clients.
- Paginate list endpoints with clear params (`limit`, `cursor`/`offset`) and return pagination metadata.
- Make write operations idempotent where possible; support idempotency keys for critical POSTs.
- Never trust client-supplied IDs for authorization; check ownership on every access.
- Document with OpenAPI and keep it in sync with the implementation.
