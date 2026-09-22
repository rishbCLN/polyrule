---
id: nextjs
title: Next.js (App Router)
tags: [framework, nextjs, react, frontend]
globs: ["app/**/*", "**/*.tsx"]
description: Next.js App Router conventions.
---

- Default to Server Components. Add `"use client"` only when a component needs state, effects, or browser APIs, and push it to the leaves of the tree.
- Fetch data on the server with `async` components or route handlers. Keep secrets and heavy work off the client.
- Use Server Actions for mutations; validate inputs on the server and revalidate affected paths/tags.
- Colocate `loading.tsx`, `error.tsx`, and `not-found.tsx` with routes for streaming and graceful failures.
- Use the `next/image` and `next/font` components for automatic optimization.
- Set explicit caching intent: `revalidate`, `cache`, or `dynamic` per route. Do not rely on defaults silently.
- Keep environment variables server-only unless prefixed `NEXT_PUBLIC_`. Never leak server secrets to client bundles.
- Prefer route handlers (`app/api/*/route.ts`) over legacy `pages/api` for new endpoints.
