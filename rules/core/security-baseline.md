---
id: security-baseline
title: Security Baseline
tags: [core, security]
globs: ["**/*"]
description: Secure-by-default practices for all code.
---

- Never hardcode secrets, API keys, tokens, or credentials. Read them from environment variables or a secrets manager.
- Validate and sanitize all external input: request bodies, query params, headers, file uploads, and third-party API responses.
- Use parameterized queries or an ORM. Never build SQL, shell commands, or file paths through string concatenation of user input.
- Escape output by context (HTML, attribute, URL, JS) to prevent injection and XSS.
- Apply the principle of least privilege to tokens, database roles, and file permissions.
- Do not log secrets, tokens, full request bodies with PII, or raw stack traces in production.
- Keep dependencies pinned and updated. Prefer well-maintained packages; flag unusual or typosquatting-like names.
- Fail closed: on an auth or validation error, deny access rather than defaulting to allow.
- Set security headers and enable HTTPS/TLS for anything network-exposed.
