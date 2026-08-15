## Context

The repository is intentionally split into independent `frontend/` and `backend/` npm applications, each with its own lockfile and scripts. The frontend foundation is already implemented, while the backend still contains framework-starter documentation. This change should improve the developer entry point without introducing a workspace, moving directories, changing runtime contracts, or adding infrastructure.

## Goals / Non-Goals

**Goals:**

- Make the current local setup discoverable from the root and application READMEs.
- Keep the existing npm, TypeScript, lint, test, and build conventions authoritative.
- Provide a project-owned frontend progress document matching the link in the root README.
- Separate committed environment templates from untracked local environment files.
- Record the exact validation commands and known limitations for the current foundation.

**Non-Goals:**

- No Docker or PostgreSQL orchestration changes.
- No API, database schema, authentication, authorization, or business-module changes.
- No migration to a monorepo or shared package workspace.
- No dependency upgrades or new production dependencies.
- No CI workflow implementation.

## Decisions

1. **Keep two independent npm applications.** The existing lockfiles, scripts, and package boundaries are already coherent. A root workspace would add migration risk without solving a current problem.
2. **Use documented `npm --prefix` commands from the repository root.** This gives contributors a consistent command style while preserving each application's independent install and lockfile.
3. **Keep environment examples non-secret.** `.env.example` files remain placeholder contracts; local values belong in ignored `.env` or `.env.local` files. This avoids turning setup documentation into credential storage.
4. **Document current behavior rather than future scope.** Docker, CI, additional modules, and production deployment remain later phases and will not be represented as implemented capabilities here.
5. **Use Markdown project documentation.** The root README provides orientation, application READMEs provide executable commands, and `docs/frontend-foundation-progress.md` records the delivered frontend slice and its limitations.

## Risks / Trade-offs

- [Risk] Documentation can become stale as scripts change → Keep commands copied from the current package manifests and validate them during this change.
- [Risk] A locally populated `.env.example` could expose credentials → Restore placeholders before completion and verify the diff for secrets.
- [Risk] Backend tests may pass without a live PostgreSQL instance → State the database-dependent verification boundary explicitly; defer full runtime validation to the infrastructure phase.
- [Trade-off] No root-level convenience scripts are added → Contributors use slightly longer `npm --prefix` commands, but application boundaries and lockfiles remain explicit.

## Migration Plan

1. Normalize documentation and environment templates without changing runtime code.
2. Run frontend and backend lint, tests, and builds.
3. Inspect formatter-written diffs and secret exposure.
4. If validation fails, revert only the documentation changes from this focused change; no database rollback is required.
