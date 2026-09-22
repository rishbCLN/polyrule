---
id: go
title: Go
tags: [language, go]
globs: ["**/*.go"]
description: Idiomatic Go.
---

- Handle every error explicitly. Wrap with context using `fmt.Errorf("doing X: %w", err)`; never discard errors with `_`.
- Accept interfaces, return concrete types. Keep interfaces small and defined at the consumer.
- Use `context.Context` as the first parameter for anything that does I/O, blocks, or can be cancelled.
- Format with `gofmt`/`goimports` and vet with `go vet` and `staticcheck`.
- Prefer composition over inheritance-style embedding gymnastics. Keep structs focused.
- Guard shared state with mutexes or channels; run tests with `-race`.
- Defer cleanup (`defer file.Close()`) immediately after acquiring a resource.
- Return early on errors to keep the happy path unindented.
- Avoid premature goroutines; only add concurrency when it solves a real problem, and always define how goroutines stop.
