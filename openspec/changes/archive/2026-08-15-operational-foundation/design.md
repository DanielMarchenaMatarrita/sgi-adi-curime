## Context

The repository contains two independent npm applications and a PostgreSQL-backed Prisma API. Local development currently depends on host-installed runtimes and manually configured services; the frontend browser also needs a host-reachable API origin while the backend needs an internal container database address. See `proposal.md` for the motivation and `specs/` for the behavioral contracts.

## Goals / Non-Goals

**Goals:**

- Provide one documented development orchestration entry point for frontend, backend, and PostgreSQL.
- Keep service-to-service networking and browser-to-service networking explicit rather than relying on one URL for both contexts.
- Make readiness, migration application, and failure behavior observable.
- Establish one CI workflow that uses the declared Node.js version, both lockfiles, and PostgreSQL.
- Preserve the current application boundaries, REST contracts, Prisma schema, and authentication behavior.

**Non-Goals:**

- No production deployment topology, cloud resources, reverse proxy, TLS termination, or image publishing.
- No database schema changes or automatic destructive reset behavior.
- No package-manager migration, monorepo conversion, or merging of the two npm applications.
- No replacement of the current frontend dev server or NestJS runtime architecture.

## Decisions

1. **Use a root Compose project with three services and one named PostgreSQL volume.** This matches the current repository boundary and makes the complete local stack reproducible without turning the repository into an npm workspace. Separate service Dockerfiles keep frontend and backend build contexts independent.

   **Alternative considered:** Running only PostgreSQL in Docker and leaving both applications on the host. This would not satisfy the agreed full-stack container workflow and would preserve the current machine-specific runtime gap.

2. **Use distinct internal and browser-facing connection values.** The backend connects to PostgreSQL through the Compose service name, while the browser uses a host-reachable `VITE_API_URL` such as `http://localhost:<backend-port>`. The frontend must not receive a container-only hostname that is unreachable from the user's browser.

   **Alternative considered:** Reusing `http://backend:<port>` everywhere. That works only inside the Compose network and fails for browser requests originating on the host.

3. **Gate backend readiness on PostgreSQL readiness.** PostgreSQL gets a native readiness check; the backend depends on that healthy state and exposes a check suitable for Compose and CI. Ordinary startup will not run migrations or reset data implicitly. Migration application remains an explicit initialization step locally and a controlled CI step.

   **Alternative considered:** Starting all containers concurrently and relying on application retries. That produces noisy, timing-dependent startup and makes failure diagnosis harder.

4. **Use the declared Node.js version as the CI source of truth.** CI will read `.nvmrc`, run `npm ci` separately in `frontend/` and `backend/`, and retain the existing lockfiles. This avoids inventing a root workspace or a second dependency-management convention.

   **Alternative considered:** Pinning a second Node.js version directly in the workflow. That would allow the workflow and local development to drift.

5. **Provision PostgreSQL as a CI service and apply committed migrations before database-dependent checks.** CI environment values are ephemeral and non-production; migration failure blocks backend verification. Existing unit tests remain part of the gate, and the backend E2E command is run where its documented database requirements are satisfied.

   **Alternative considered:** Running only mocked tests in CI. That would leave the Prisma/PostgreSQL integration path unverified despite making PostgreSQL part of the local runtime contract.

6. **Document the workflow as the operational contract.** Root and application README sections will explain prerequisites, environment templates, startup, migration, test, and shutdown commands. The frontend progress document will be corrected to reflect that backend lint now passes.

## Risks / Trade-offs

- [Risk] Container startup may be slower than host execution → Keep healthchecks focused and document a one-time initialization command separately from ordinary startup.
- [Risk] Browser and container networking can be confused → Use explicit frontend host-facing API configuration and document the distinction from the backend's internal database URL.
- [Risk] CI database setup can diverge from local setup → Reuse committed Prisma migrations and the same backend configuration contract, with CI-only values injected by the workflow.
- [Risk] Docker images may introduce generated or platform-specific noise → Keep Docker and CI files narrowly scoped, review lockfiles and generated output, and avoid committing runtime volumes or secrets.

## Migration Plan

1. Add the version and container/CI configuration without changing application contracts.
2. Verify the local stack from a clean checkout, initialize a fresh PostgreSQL volume explicitly, and run the documented checks.
3. Verify CI on a branch or pull request, including PostgreSQL readiness and migrations.
4. Update documentation and remove stale statements about backend lint failure.
5. Roll back by removing the new orchestration and workflow files; existing host-based commands and database migrations remain unchanged.
