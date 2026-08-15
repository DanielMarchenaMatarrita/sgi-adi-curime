## Why

The backend build and unit tests pass, but the current ESLint command reports 25 errors in existing services and tests. These findings reduce confidence in the quality gate and should be corrected separately from the project-foundation documentation work.

## What Changes

- Correct unsafe `any` assignments and member access in backend tests and E2E tests.
- Remove or use the unused activation-token delivery constructor parameter without weakening lint rules.
- Preserve existing runtime behavior, API contracts, and test coverage.
- Keep the existing ESLint configuration enabled.

## Capabilities

### New Capabilities

No new runtime capabilities. This is a focused code-quality refactor.

### Modified Capabilities

None. No runtime requirements or API contracts change.

## Impact

- Backend test files and `src/user-requests/activation-token-delivery.service.ts`.
- ESLint verification and developer quality workflow.
- No database, API, authentication, authorization, or dependency changes are intended.
