---
id: docker
title: Docker & Containers
tags: [practice, docker, devops]
globs: ["**/Dockerfile", "**/*.dockerfile", "**/docker-compose*.yml"]
description: Container image and runtime best practices.
---

- Use multi-stage builds: compile in a build stage, copy only artifacts into a slim runtime image.
- Pin base images to a specific version/digest; never rely on `latest`.
- Run as a non-root user. Create and switch to an unprivileged user before the entrypoint.
- Order layers from least to most frequently changed to maximize cache reuse; copy dependency manifests before source.
- Keep images small: use slim/alpine or distroless bases and a `.dockerignore` to exclude build junk and secrets.
- Never bake secrets into images or `ENV`. Inject them at runtime via env or secret mounts.
- Add a `HEALTHCHECK` and handle `SIGTERM` for graceful shutdown.
- Set explicit resource limits in compose/orchestration; do not let containers run unbounded.
- Scan images for vulnerabilities in CI and rebuild regularly to pick up base-image patches.
