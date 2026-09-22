---
id: rust
title: Rust
tags: [language, rust]
globs: ["**/*.rs"]
description: Idiomatic, safe Rust.
---

- Let the type system do the work. Model invalid states as unrepresentable.
- Return `Result<T, E>` for fallible operations. Reserve `panic!`, `unwrap`, and `expect` for truly unrecoverable cases or tests.
- Use `?` for error propagation. Define error types with `thiserror` for libraries; use `anyhow` for applications.
- Prefer borrowing over cloning. Reach for `Rc`/`Arc` and interior mutability only when ownership genuinely requires it.
- Run `cargo clippy` and treat its lints as errors. Format with `cargo fmt`.
- Write iterator chains over manual index loops where it stays clear.
- Keep `unsafe` blocks minimal, isolated, and documented with a safety comment explaining the invariants upheld.
- Prefer `&str` over `String` and `&[T]` over `Vec<T>` in function parameters.
