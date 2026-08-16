## Why

The repository already contains two independently runnable applications, but the project-level setup guidance is incomplete and some documentation still reflects framework starter templates. Establishing a verified project foundation now will make the next Docker and backend work reproducible without restructuring or changing application behavior.

## What Changes

- Document the supported local toolchain and the independent frontend/backend package-manager workflow.
- Document the current application structure, development commands, environment-file boundaries, and validation commands.
- Replace stale backend starter documentation with SGI-Curime project guidance.
- Resolve the root documentation link to frontend foundation progress.
- Preserve the existing `frontend/` and `backend/` structure and current dependency lockfiles.
- Do not add Docker services, CI, new business modules, database migrations, or production dependencies in this change.

## Capabilities

### New Capabilities

No new runtime capabilities. This is a project-foundation documentation and verification change.

### Modified Capabilities

None. No runtime requirements or API contracts change.

## Impact

- Project documentation: `README.md`, `backend/README.md`, and frontend foundation progress documentation.
- Developer setup and verification guidance only.
- No database, API, authentication, dependency, or runtime behavior changes are intended.
