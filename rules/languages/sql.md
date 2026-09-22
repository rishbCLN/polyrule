---
id: sql
title: SQL
tags: [language, sql, database]
globs: ["**/*.sql"]
description: Safe, portable SQL and schema practices.
---

- Always use parameterized queries. Never concatenate user input into SQL.
- Select only the columns you need; avoid `SELECT *` in application queries.
- Name every constraint, index, and foreign key explicitly so migrations are readable and reversible.
- Add indexes to support your actual query patterns (filters, joins, sorts); confirm with `EXPLAIN`/query plans.
- Keep migrations forward-only and reversible; never edit a migration that has shipped.
- Use transactions for multi-statement writes that must be atomic; keep them short to avoid lock contention.
- Prefer explicit `JOIN ... ON` over implicit comma joins. Qualify columns when multiple tables are involved.
- Store timestamps in UTC with a timezone-aware type; do not store local time.
- Enforce integrity in the schema (NOT NULL, UNIQUE, FK, CHECK) rather than relying only on application code.
- Paginate with keyset/cursor pagination for large tables instead of large `OFFSET`s.
