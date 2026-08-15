## 1. Type Existing Test Boundaries

- [ ] 1.1 Type mocked account-activation, authentication, user-request, and users service values reported by ESLint.
- [ ] 1.2 Type Supertest response bodies in authentication E2E assertions without changing test scenarios.

## 2. Clean Service Boundary

- [ ] 2.1 Inspect activation-token delivery wiring and remove or safely consume the unused constructor parameter.
- [ ] 2.2 Run backend tests and build to confirm behavior is unchanged.

## 3. Quality Verification

- [ ] 3.1 Run backend lint until it passes without configuration weakening or formatter noise.
- [ ] 3.2 Review the final diff and confirm no API, schema, dependency, or secret changes.
