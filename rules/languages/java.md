---
id: java
title: Java
tags: [language, java]
globs: ["**/*.java"]
description: Idiomatic, modern Java.
---

- Target a modern LTS (17+). Use records for immutable data carriers and sealed types for closed hierarchies.
- Prefer immutability: `final` fields, unmodifiable collections, and constructor injection over setters.
- Never return `null` for collections or optionals; return an empty collection or `Optional`.
- Use `Optional` for absent return values, not as a field or method parameter.
- Handle checked exceptions meaningfully; do not catch-and-swallow or wrap everything in `RuntimeException` blindly.
- Use try-with-resources for anything `AutoCloseable`. Never leak streams, connections, or readers.
- Prefer the Streams API for transformations, but fall back to loops when a stream hurts readability.
- Depend on interfaces (`List`, `Map`), not implementations (`ArrayList`, `HashMap`), in signatures.
- Use a build tool (Maven/Gradle) with pinned versions; keep dependencies current.
- Write tests with JUnit 5 and AssertJ; name them for the behavior under test.
