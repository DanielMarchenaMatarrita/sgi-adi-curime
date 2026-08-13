# SGI-Curime Agent Instructions

Apply these instructions to the entire repository. Keep instructions vendor-neutral: Codex and OpenCode may expose different commands for the same operation, especially OpenSpec workflows. Follow the operation's intent rather than assuming one agent's syntax is universal.

## Authority and Conflicts

Use this precedence order:

1. The current user's instructions.
2. Approved Architecture Decision Records (ADRs).
3. Approved specifications and the active OpenSpec change.
4. This file and any more specific nested instruction file.
5. Handbooks and technical guides.
6. Existing code patterns.

Stop when authoritative sources conflict. Present the conflicting paths and evidence, and request a decision. Do not invent business rules. At present the repository has no ADRs, OpenSpec artifacts, `DESIGN.md`, or nested agent instructions. Treat the root `README.md` as the approved product target and the source/configuration as the authority for current implementation facts. In particular, the planned modules and granular permissions in the README are not all implemented yet.

## Repository and Git Safety

- Confirm the repository root, remote, branch, and status before editing: `git rev-parse --show-toplevel`, `git remote -v`, `git status --short --branch`, and `git branch --show-current`.
- Do not work directly on `main`, `master`, or `develop`. Use a focused `feature/`, `fix/`, `chore/`, or `docs/` branch.
- Preserve unrelated and pre-existing changes in a dirty worktree. Never use destructive reset, checkout, restore, clean, or equivalent operations to discard work.
- Keep one branch and one OpenSpec change focused on one outcome.
- Use Conventional Commits in the form `type(scope): concise subject`. Keep commits small and reviewable.
- Do not commit, push, merge, rebase, or open a pull request unless the user explicitly requests it.

## Current Architecture

- The repository contains two independent npm applications; it is not a root npm workspace. Run commands in `backend/` or `frontend/`, or use `npm --prefix <directory> ...` from the root.
- Frontend: React 19, Vite 8, and TypeScript 6. It currently contains the Vite starter UI, plain global CSS, no router, no API client, and no test framework.
- Backend: a NestJS 11 and TypeScript 5.7 REST API organized by feature modules. Current capabilities are `auth`, `user-requests`, and `users`, plus a global Prisma module.
- Persistence: PostgreSQL through Prisma 7 and `@prisma/adapter-pg`. `compose.yaml` starts PostgreSQL 17 only. Prisma schema, seed, and committed migrations live under `backend/prisma/`.
- Authentication uses JWT bearer tokens. Authorization currently checks exact role names through guards; it is not a granular permission system.
- Backend controllers delegate to services. Services currently combine application/business orchestration and direct Prisma access. Separate transport, application, domain, and infrastructure layers do not yet exist.

## Approved Target Architecture

- Treat the root README modules as approved product scope: administrative, users, finance, reports and statistics, reservations, entrepreneurship, volunteering, inventory, and donations. Do not claim an unimplemented module is current functionality.
- Evolve incrementally toward a modular monolith with explicit layers, Domain-Driven Design, Clean Architecture, and small vertical slices. Use CQRS only where its added complexity provides measurable value.
- Improve boundaries through small, verifiable changes; do not perform a full rewrite.
- Do not introduce microservices without an approved ADR and OpenSpec change.
- Do not replace React, Vite, NestJS, Prisma, PostgreSQL, or REST integration without approved architectural direction.
- Preserve behavior outside the approved change.

## OpenSpec Workflow

Use OpenSpec as the source of truth for planned changes. Express and execute workflows by intent: explore, propose, implement, verify, synchronize, and archive. Agent interfaces may use different syntax for these operations.

Require an OpenSpec change for:

- New features or user-visible changes.
- Business-rule or acceptance-criteria changes.
- API contracts, database schemas, or migrations.
- Authentication, authorization, roles, or permissions.
- External integrations or changes spanning multiple modules.
- Significant refactors, architectural decisions, or security-sensitive work.

Proceed without a separate proposal only for spelling, formatting, non-behavioral documentation corrections, or a small bug whose expected behavior is already unambiguous in an approved specification. If scope grows, create or update the OpenSpec change before continuing. Do not implement a relevant change until its applicable proposal, specifications, design, and tasks have been reviewed and approved.

OpenSpec is not initialized in this repository yet. When a relevant task begins, establish the required repository artifacts through the approved OpenSpec workflow rather than treating this absence as permission to skip planning. The currently installed CLI supports strict validation with `openspec validate --all --strict --no-interactive`; run it only when artifacts exist and do not describe "No items found to validate" as successful project validation.

## Backend Rules

- Keep controllers thin. Validate transport input at system boundaries and delegate behavior to services or application handlers.
- Organize new behavior by business capability. Introduce application, domain, and infrastructure boundaries incrementally; do not describe them as already present.
- Keep business rules out of controllers and Prisma query construction. Model relevant invariants explicitly instead of relying only on generated Prisma types.
- Keep authentication separate from authorization. Enforce authorization on every protected operation and test role/permission boundaries.
- Preserve existing REST contracts unless an approved specification changes them. Return consistent errors without credentials, tokens, personal data, or internal traces.
- Retain the global Nest validation behavior: transform input, whitelist declared fields, and reject non-whitelisted fields. Follow the existing DTO use of `class-validator` and `class-transformer`.
- Use safe Prisma selections so password hashes and other sensitive fields are not returned. Preserve transactional protection for state transitions and last-active-administrator invariants.
- Create a new migration for every schema change. Never edit an applied migration to conceal a later change. Review generated SQL and verify Prisma artifacts.
- Obtain explicit approval immediately before destructive database operations or commands that accept data loss.

## Frontend Rules

- Treat the current frontend as starter scaffolding, not an established SGI-Curime visual system. No `DESIGN.md` currently exists. If one is approved later, make it the visual authority for the "Biodiversidad Digital" system.
- Follow approved design tokens, colors, typography, spacing, and responsive behavior when they exist; do not infer a product design system from the Vite starter styles.
- Keep API access outside presentational components. Do not duplicate backend business rules; client validation provides feedback and never replaces server validation.
- Represent loading, empty, success, validation, authorization, and error states as applicable.
- Use semantic HTML, keyboard-accessible interactions, visible focus behavior, meaningful labels, and appropriate accessibility attributes.
- Preserve the current TypeScript module conventions and relative imports unless an approved change introduces a different structure.

## Dependencies and Commands

Both applications currently use npm, confirmed by their `package-lock.json` files. A future migration to pnpm is preferred, but perform it only as a separate approved change that updates both applications and their lockfiles coherently. Until then, do not mix package managers or regenerate unrelated lockfiles. Treat `npx` as a package-binary runner, not as a package manager. Read the relevant `package.json`, prefer its scripts, and request approval before adding a production dependency unless an approved design already requires it.

From the repository root, use these verified commands:

| Purpose | Command | Notes |
| --- | --- | --- |
| Backend install | `npm --prefix backend ci` | Uses the committed npm lockfile. |
| Backend development | `npm --prefix backend run start:dev` | Starts Nest in watch mode. |
| Backend build/type check | `npm --prefix backend run build` | Runs `nest build`. |
| Backend format | `npm --prefix backend run format` | Writes to `src/**/*.ts` and `test/**/*.ts`. |
| Backend lint | `npm --prefix backend run lint` | Runs ESLint with `--fix`; it writes files. |
| Backend unit tests | `npm --prefix backend test` | Runs Jest specs under `backend/src`. |
| Backend E2E tests | `npm --prefix backend run test:e2e` | Some suites mock persistence; the app suite may require database configuration. |
| Backend coverage | `npm --prefix backend run test:cov` | Runs Jest coverage. |
| Backend seed | `npm --prefix backend run db:seed` | Mutates the configured database and requires the documented environment values. |
| Frontend install | `npm --prefix frontend ci` | Uses the committed npm lockfile. |
| Frontend development | `npm --prefix frontend run dev` | Starts Vite. |
| Frontend build/type check | `npm --prefix frontend run build` | Runs `tsc -b && vite build`. |
| Frontend lint | `npm --prefix frontend run lint` | Runs Oxlint. |
| Frontend preview | `npm --prefix frontend run preview` | Previews a completed build. |
| OpenSpec validation | `openspec validate --all --strict --no-interactive` | Applicable after OpenSpec artifacts exist. |

There is no repository script for frontend tests, frontend formatting, standalone type checking, Prisma validation, Prisma generation, or migrations. Do not invent one. If a Prisma operation is required by an approved change, inspect the installed Prisma version and `backend/prisma.config.ts`, state the exact CLI command and its effects, and obtain approval when it may alter data. Prefer focused checks during implementation and run every applicable complete check before finishing. Never claim a command passed unless it ran successfully.

## Testing and Verification

- Add or update tests for every behavior change at the most useful level.
- Cover the successful path, relevant validation failures, authorization boundaries, and the corrected regression.
- Keep tests deterministic. Mock only at deliberate boundaries; state when an E2E test does not exercise PostgreSQL.
- Verify migrations and generated Prisma artifacts when persistence changes.
- Compare implementation and tests with approved OpenSpec requirements and scenarios.
- Run focused checks while working, then the applicable lint, build, unit, E2E, Prisma, and OpenSpec validation before completion. Because backend lint and format write files, inspect their diff afterward.
- Do not claim frontend test coverage while no frontend test framework or script exists; record that gap when frontend behavior changes.

## Shared Skills

Store project-specific, cross-agent skills at `.agents/skills/<skill-name>/SKILL.md`. Do not duplicate a skill under provider-specific directories. The root shared-skills directory does not currently exist; create skills only when explicitly requested.

For each skill:

- Use a unique lowercase hyphenated name and include `SKILL.md`.
- State precisely when it activates and keep it focused on one workflow.
- Load detail progressively from `references/`.
- Put repeatable deterministic operations in `scripts/`.

Potential skills, not current requirements, are `sgi-change-workflow` for domain analysis through OpenSpec implementation and verification, and `diagram-design` for deriving architecture, UML, data, or process diagrams from approved documentation.

## Security and Data Protection

- Never commit secrets, credentials, tokens, keys, or populated `.env` files. Use `backend/.env.example` only as a placeholder contract.
- Never log passwords, password hashes, JWTs, raw activation tokens, database credentials, or sensitive personal data. Never expose internal traces in public API responses.
- Apply least privilege. Protect administrative actions and personal identification, contact, address, affiliation, and account data.
- Treat finance, treasury, donations, reservations, inventory, assemblies, affiliations, and audit information according to their sensitivity as those modules are implemented.
- Do not weaken validation, authorization, auditability, transaction safety, or security controls to make tests pass.
- Treat exact role names as security-significant under the current implementation. Require approved specifications before evolving them into granular permissions.

## Definition of Done

Complete work only when:

- It satisfies the approved scope and acceptance criteria.
- It follows approved ADRs and architectural boundaries.
- Applicable tests and checks pass, and unverified limitations are stated.
- Security, privacy, and authorization effects have been reviewed.
- API contracts, migrations, environment requirements, and operational changes are documented where applicable.
- When OpenSpec applies, its artifacts and tasks reflect the actual result.
- The final diff contains no unrelated work, secrets, residual debugging, generated noise, or accidental formatter changes.
