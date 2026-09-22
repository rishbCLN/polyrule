---
id: testing
title: Testing Discipline
tags: [core, testing, quality]
globs: ["**/*"]
description: How and when to write tests.
---

- Write tests alongside new features and bug fixes. A bug fix should include a regression test that fails before the fix.
- Follow the existing test framework and conventions in the project. Do not introduce a new test runner without reason.
- Test behavior and public contracts, not implementation details. Avoid asserting on internal state that is likely to change.
- Name tests to describe the scenario and expected outcome: `returns 404 when the user does not exist`.
- Keep tests deterministic. No reliance on real network, wall-clock time, random seeds, or test execution order.
- Prefer a few high-value integration tests over many brittle mocks when testing critical paths.
- Run the relevant tests before claiming a change is complete.
