## Purpose

Provides an automated verification gate that exercises both independent npm applications against the supported runtime and a PostgreSQL service before changes are integrated.

## Requirements

### Requirement: Supported runtime verification
The continuous integration workflow SHALL execute using the repository's declared Node.js version and SHALL install frontend and backend dependencies from their committed lockfiles.

#### Scenario: Clean checkout is verified
- **WHEN** the CI workflow runs for a change from a clean checkout
- **THEN** it uses the declared Node.js version and installs each application reproducibly without generating a third package manager lockfile

### Requirement: PostgreSQL-backed verification
The continuous integration workflow SHALL provision a PostgreSQL service, expose its connection through CI-only environment values, and apply the committed Prisma migrations before database-dependent verification.

#### Scenario: Backend database verification runs
- **WHEN** CI reaches database-dependent backend checks
- **THEN** PostgreSQL is ready, the committed migrations are applied, and the backend checks use the CI database rather than a developer's local database

#### Scenario: Database service is unavailable
- **WHEN** PostgreSQL cannot become ready or migrations fail
- **THEN** the workflow fails before reporting the backend verification as successful and exposes actionable non-secret logs

### Requirement: Complete application quality gate
The workflow SHALL run the frontend and backend tests, lint, and builds, and SHALL fail when any required check fails.

#### Scenario: All checks pass
- **WHEN** dependency installation, database setup, tests, lint, and builds complete successfully
- **THEN** CI reports the change as verified

#### Scenario: A required check fails
- **WHEN** any required test, lint, build, migration, or setup step fails
- **THEN** CI reports failure and does not present the change as verified

### Requirement: Secret-safe automation
The CI workflow SHALL use placeholders or CI-managed secrets for credentials and SHALL not print database passwords, JWT secrets, access tokens, or populated environment files in logs or artifacts.

#### Scenario: CI logs are inspected
- **WHEN** a workflow completes successfully or unsuccessfully
- **THEN** its logs and uploaded artifacts contain no populated credentials, tokens, password hashes, or secret environment files
