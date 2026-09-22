---
id: csharp
title: C#
tags: [language, csharp, dotnet]
globs: ["**/*.cs"]
description: Idiomatic, modern C#.
---

- Enable nullable reference types (`<Nullable>enable</Nullable>`) and treat warnings as errors.
- Use `async`/`await` end to end for I/O. Never block on async with `.Result` or `.Wait()`.
- Pass `CancellationToken` through async APIs and honor it.
- Prefer records for immutable data and pattern matching over long `if`/`switch` chains.
- Use `IEnumerable<T>`/`IReadOnlyList<T>` in signatures; materialize with `.ToList()` only when needed.
- Dispose resources with `using` declarations; implement `IDisposable`/`IAsyncDisposable` when holding unmanaged or scoped resources.
- Use dependency injection via the built-in container; avoid static service locators.
- Favor `var` when the type is obvious, explicit types when it aids clarity.
- Validate arguments with guard clauses (`ArgumentNullException.ThrowIfNull`).
- Write tests with xUnit; keep them isolated and deterministic.
