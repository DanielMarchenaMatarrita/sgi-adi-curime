## Context

The backend ESLint configuration currently reports unsafe values because mocked Prisma and Supertest responses are inferred as `any`, and one constructor parameter is unused. The existing build and tests pass, so the work should be limited to explicit typing and a safe dependency-boundary cleanup.

## Goals / Non-Goals

**Goals:**

- Make `npm --prefix backend run lint` pass without disabling rules.
- Add the smallest useful types at mock and response boundaries.
- Preserve test assertions and application behavior.

**Non-Goals:**

- No broad type-system redesign.
- No changes to ESLint severity or configuration.
- No API, schema, migration, dependency, or production behavior changes.

## Decisions

1. Type mocked Prisma delegates and HTTP response bodies at their use sites rather than introducing a shared abstraction prematurely.
2. Use `unknown` plus focused narrowing where response data is intentionally untrusted.
3. Remove the unused delivery dependency only if the service contract and its module wiring confirm it is not required; otherwise consume it explicitly without changing behavior.
4. Run unit tests and build before and after lint fixes to detect behavioral regressions.

## Risks / Trade-offs

- [Risk] Overly broad casts could hide test defects → Prefer small response and mock interfaces with only asserted fields.
- [Risk] Constructor changes could affect Nest dependency injection → Inspect module providers and preserve the runtime dependency contract.
- [Risk] E2E response types may drift from API contracts → Keep assertions aligned with the current controller responses.
