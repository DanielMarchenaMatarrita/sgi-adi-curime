## 1. Environment And Repository Contract

- [x] 1.1 Restore `backend/.env.example` to non-secret placeholders and document that populated local values belong in ignored `backend/.env`.
- [x] 1.2 Verify the repository keeps independent `frontend/` and `backend/` npm applications, committed lockfiles, and no unnecessary root workspace or production dependency changes.
- [x] 1.3 Document the supported Node.js/npm assumptions and the canonical `npm --prefix frontend|backend` commands.

## 2. Project Documentation

- [x] 2.1 Replace the generic backend starter README with SGI-Curime setup, environment, scripts, architecture boundaries, and verification guidance.
- [x] 2.2 Update the root README to describe the current implementation without claiming Docker, CI, or future modules are already available.
- [x] 2.3 Create `docs/frontend-foundation-progress.md` with the delivered frontend scope, routes, session limitations, validation results, and next phases.

## 3. Verification And Handoff

- [x] 3.1 Run frontend tests, lint, and build using the documented commands.
- [x] 3.2 Run backend tests and build, then run backend lint and inspect any formatter-written diff. Record the existing lint failure without weakening the lint configuration.
- [x] 3.3 Review the final diff for secrets, generated noise, unrelated changes, and broken documentation links.
- [x] 3.4 Validate the OpenSpec change and confirm the worktree contains only intended changes before proposing a commit.
