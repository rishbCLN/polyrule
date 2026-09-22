---
id: git-commits
title: Git & Commits
tags: [core, git, workflow]
globs: ["**/*"]
description: Version control and commit hygiene.
---

- Write commit messages in the imperative mood: "Add cache layer", not "Added cache layer".
- Keep the subject line under 72 characters. Use the body to explain *why*, not *what*.
- Make each commit a single logical change. Do not mix refactors, features, and formatting in one commit.
- Never commit secrets, `.env` files, credentials, or large binaries.
- Do not force-push shared branches. Prefer new commits over rewriting published history.
- Reference issues or tickets in the commit body when relevant.
- Do not amend or squash commits that others may have already pulled unless coordinated.
