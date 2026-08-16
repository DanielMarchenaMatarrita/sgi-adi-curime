## 1. Runtime Version And Configuration

- [x] 1.1 Add the repository-supported Node.js version declaration and verify it matches the version used by both applications.
- [x] 1.2 Review frontend and backend environment examples and document the browser-facing API origin, internal database URL, CORS origins, JWT values, and seed values without adding secrets.
- [x] 1.3 Add Docker ignore rules and minimal service build inputs so local images do not include dependencies, local environment files, database volumes, or unrelated repository content.

## 2. Local Container Stack

- [x] 2.1 Create development container definitions for the frontend and backend while preserving their independent npm install and start commands.
- [x] 2.2 Add the root Compose configuration with frontend, backend, and PostgreSQL services, stable local ports, an isolated network, and a named PostgreSQL volume.
- [x] 2.3 Configure separate browser-facing and container-internal connection values so frontend requests reach the backend from the host browser and the backend reaches PostgreSQL by service name.
- [x] 2.4 Add PostgreSQL and backend healthchecks, dependency gating, and documented explicit Prisma migration initialization without destructive startup behavior.

## 3. Continuous Integration

- [x] 3.1 Add the CI workflow using the declared Node.js version and run `npm ci` independently in `frontend/` and `backend/`.
- [x] 3.2 Provision PostgreSQL with CI-only non-secret environment values, wait for readiness, and apply the committed Prisma migrations before database-dependent checks.
- [x] 3.3 Run frontend tests, lint, and build in CI and fail the workflow when any check fails.
- [x] 3.4 Run backend tests, E2E checks where their database requirements are satisfied, lint, and build in CI and fail the workflow when any check fails.

## 4. Documentation And Verification

- [x] 4.1 Update the root and application documentation with container startup, initialization, shutdown, environment, CI, and troubleshooting instructions.
- [x] 4.2 Correct the frontend progress documentation so it reflects the current passing backend lint status and preserves the known limitations that remain true.
- [x] 4.3 Verify the stack from a clean checkout, review CI configuration and generated diffs, and confirm no schema, API, dependency, credential, or populated environment file was added unintentionally.
