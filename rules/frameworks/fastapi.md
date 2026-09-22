---
id: fastapi
title: FastAPI
tags: [framework, fastapi, python, backend]
globs: ["**/*.py"]
description: FastAPI service conventions.
---

- Define request and response models with Pydantic. Never accept or return bare dicts for structured payloads.
- Use dependency injection (`Depends`) for db sessions, auth, and shared resources instead of globals.
- Keep route handlers thin: validate, delegate to a service/repository layer, return a response model.
- Use `async def` handlers with async I/O libraries; do not block the event loop with sync DB or HTTP calls.
- Return correct status codes and raise `HTTPException` with clear detail for error cases.
- Declare `response_model` on routes to control serialization and avoid leaking internal fields.
- Configure CORS, rate limiting, and auth explicitly. Never ship an unauthenticated write endpoint by accident.
- Group routes with `APIRouter` by domain; keep `main.py` focused on wiring.
- Manage settings with `pydantic-settings` reading from the environment.
