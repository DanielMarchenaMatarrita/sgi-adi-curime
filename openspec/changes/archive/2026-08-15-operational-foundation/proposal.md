## Why

The project currently depends on manually configured local services and machine-specific Node.js versions. This makes the frontend, backend, and PostgreSQL stack harder to start consistently and leaves quality checks outside a shared automated gate.

## What Changes

- Add a reproducible local Docker Compose stack containing frontend, backend, and PostgreSQL services.
- Add service healthchecks and startup dependencies so the backend does not assume PostgreSQL is immediately ready.
- Define development environment contracts without committing credentials or populated environment files.
- Add a repository Node.js version declaration through `.nvmrc`.
- Add CI that installs both applications, provisions PostgreSQL, applies the existing database migrations, and runs tests, lint, and builds.
- Update project documentation to describe the containerized workflow, CI checks, environment variables, and the current backend lint status.
- Preserve the two independent npm applications and existing REST, database, and authentication behavior.

## Capabilities

### New Capabilities

- `local-runtime`: Reproducible local execution of the frontend, backend, and PostgreSQL services with explicit configuration and readiness behavior.
- `continuous-integration`: Automated verification of both applications against the supported Node.js version and a PostgreSQL service.

### Modified Capabilities

None.

## Impact

- Root Docker Compose and service container configuration.
- Frontend and backend environment examples and startup documentation.
- Repository CI workflow and Node.js version declaration.
- Existing Prisma migration deployment in CI; no schema or API contract changes are intended.
- No production deployment or cloud infrastructure is introduced by this change.
