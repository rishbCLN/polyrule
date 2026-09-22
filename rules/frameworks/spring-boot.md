---
id: spring-boot
title: Spring Boot
tags: [framework, spring-boot, java, backend]
globs: ["**/*.java"]
description: Spring Boot service conventions.
---

- Use constructor injection (not field `@Autowired`); make dependencies `final`.
- Keep controllers thin: validate with `@Valid` DTOs, delegate to services, return DTOs — never expose entities directly.
- Separate layers cleanly: controller, service, repository. Put transactions (`@Transactional`) at the service layer.
- Externalize configuration in `application.yml` and environment variables; never hardcode secrets.
- Use `@ControllerAdvice` for centralized exception handling and consistent error responses.
- Prefer constructor-based `@ConfigurationProperties` beans over scattered `@Value` injections.
- Use Spring Data repositories; write explicit queries with `@Query` when derived names get unwieldy, and guard against N+1 with fetch joins.
- Validate inputs with Bean Validation annotations; return 400 with field errors on failure.
- Write slice tests (`@WebMvcTest`, `@DataJpaTest`) plus focused integration tests; avoid loading the full context unnecessarily.
- Expose health and metrics via Actuator; secure sensitive endpoints.
