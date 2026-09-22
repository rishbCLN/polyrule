---
id: django
title: Django
tags: [framework, django, python, backend]
globs: ["**/*.py"]
description: Django application conventions.
---

- Keep business logic out of views. Use service functions or model methods; keep views thin.
- Use the ORM safely: avoid N+1 with `select_related`/`prefetch_related`; use `.only()`/`.defer()` for wide tables.
- Never build raw SQL from user input; if raw SQL is unavoidable, use parameterized `params=`.
- Validate and clean input through forms or serializers (DRF), not ad hoc in views.
- Use migrations for all schema changes; never edit the database by hand. Keep migrations reversible.
- Store configuration and secrets in environment variables; never commit `SECRET_KEY` or `DEBUG=True` for production.
- Use `select_for_update` within transactions for row-level locking on critical updates.
- Set `DEBUG = False`, configure `ALLOWED_HOSTS`, and enable security middleware in production.
- Prefer class-based views or DRF viewsets for CRUD; keep custom logic explicit and tested.
- Use `django.utils.timezone` for time; store UTC and enable `USE_TZ`.
