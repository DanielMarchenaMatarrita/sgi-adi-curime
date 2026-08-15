## Context

See `proposal.md` for motivation. The frontend is an isolated React 19/Vite 8 starter with strict TypeScript, Oxlint, relative imports, and no test framework. The NestJS API has unversioned REST endpoints, standard Nest error bodies, bearer-only JWT authentication, exact role-name authorization, and no CORS configuration. `/auth/login` returns an access token plus a safe user summary, while `/auth/me` revalidates current user state and role from PostgreSQL.

The approved visual reference is under `stitch_dise_o_ux_ui_sgi_curime/stitch_dise_o_ux_ui_sgi_curime`. Its `sgi_curime_integral_system/DESIGN.md`, screen images, and generated HTML define visual intent and responsive composition. They do not define backend contracts, authorization rules, or production implementation choices. In particular, hardcoded people, counts, dates, activities, roles, and remote assets are illustrative only.

The backend has no refresh, logout, role-catalog, or activation-delivery endpoint. This foundation therefore must not imply those capabilities or hardcode database role IDs. The prototype's design document is approved for this work. Runtime dependencies on Tailwind CDN, Google Fonts, Material Symbols, and generated remote images are not approved; production resources must be bundled locally and images must be project-owned or separately approved.

## Goals / Non-Goals

**Goals:**

- Establish small boundaries that future vertical slices can reuse for routing, API access, session state, status UI, and tests.
- Make local browser integration explicit and deny unlisted cross-origin callers.
- Use the server-revalidated `/auth/me` identity as the source of authorization truth.
- Keep feature code independent of raw Fetch behavior and browser storage details.
- Preserve the repository's existing relative-import and independent-application conventions.
- Reproduce the prototype's public portal, login, and administrative-shell visual hierarchy across desktop and mobile using accessible production React and CSS.

**Non-Goals:**

- Implement complete user-request, activation, user-administration, dashboard, or role-management screens.
- Add a role-catalog endpoint or hardcode seeded role IDs.
- Add refresh tokens, HTTP-only cookie authentication, server-side logout, or change current JWT contracts.
- Introduce a state-management, server-cache, form, CSS framework, component library, path alias, or generated API client.
- Implement complete affiliate, user-management, or dashboard data workflows in this foundation change; these follow as separate changes in that order.
- Add username login or password recovery; the current API supports email and password only.
- Add API versioning, response envelopes, stable error codes, or other unrelated backend contract changes.

## Decisions

### Use React Router with a route configuration

Add `react-router` as the only new production dependency and define routes under `src/app`. A router provider will compose public, guest-only, authenticated, and administrator boundaries around route-level pages. This gives activation links and preserved post-login destinations stable URLs without coupling route decisions to individual presentational components.

Alternatives considered:

- A hand-written history listener avoids a dependency but recreates matching, nested layouts, redirects, and testing utilities.
- File-based routing would require a larger framework or plugin decision that is not justified for the current Vite application.

### Organize by application, feature, page, and shared boundary

Use a minimal structure:

```text
src/
  app/          composition, router, providers
  features/     session/login behavior
  pages/        route-level composition
  shared/api/   transport, contracts, errors
  shared/config environment access
  shared/ui/    cross-cutting status surfaces
```

Keep logic close to the feature that owns it and avoid empty placeholder directories. Continue relative imports because no approved change introduces aliases.

Alternative considered: atomic-design or deep Clean Architecture layers would add indirection before enough frontend behavior exists to justify them.

### Use a small Fetch wrapper instead of an HTTP or server-state library

The client will resolve paths against a validated API origin, serialize JSON, parse success and standard Nest error shapes, and represent HTTP, network, and cancellation outcomes distinctly. It accepts a token per authenticated request and an unauthorized callback rather than reading session state directly. This prevents a dependency cycle between API and session modules and keeps public calls token-free.

Alternatives considered:

- Axios duplicates browser functionality for the current needs.
- A query/cache library is premature before read-heavy product screens and cache requirements exist.
- Shared backend-generated types are unavailable because there is no OpenAPI contract; frontend contract types will model only consumed safe fields.

### Keep session state in a React provider and the token in sessionStorage

The session provider owns the states `restoring`, `anonymous`, `authenticated`, and `restore-error`. It reads only the token from `sessionStorage`, validates it with `/auth/me`, and stores the returned safe user in memory. Login persists the token after a structurally valid success response. Logout and authenticated 401 responses clear both locations.

The app will not decode the JWT for role or expiry decisions because the server reloads current status and role for every protected request. A restore network failure retains the token but does not grant access; retry reattempts `/auth/me`, while an explicit logout clears it.

Alternatives considered:

- `localStorage` persists longer than necessary and increases exposure after a shared-device browser restart.
- Memory-only tokens avoid persistence but make every reload require login and do not satisfy the selected integrated foundation.
- HTTP-only cookies are preferable against token theft but require a separate backend authentication-contract change.

### Add an exact environment-based CORS allowlist

The backend will parse `CORS_ORIGINS` as comma-separated URL origins, reject missing/empty/invalid entries at startup, and pass an allowlist callback to Nest CORS. It will permit current methods and `Authorization`/`Content-Type`, with credentials disabled because authentication is not cookie-based. Frontend `VITE_API_URL` will be validated as HTTP(S), normalized once, and represented in `frontend/.env.example` without secrets.

Alternatives considered:

- A Vite-only proxy fixes local development but does not define deployed browser access.
- `origin: true` or `*` is incompatible with least privilege.
- Hardcoded localhost values do not support deployment and silently broaden assumptions.

### Add Vitest and React Testing Library as development tooling

Use Vitest with `jsdom`, React Testing Library, `jest-dom`, and `user-event`. Add one non-watch script for complete verification and one watch script for development. Shared setup will clean rendered DOM, mocks, and session storage. Tests will mock Fetch or the API boundary and will explicitly not claim PostgreSQL integration coverage.

Alternative considered: browser end-to-end tooling is valuable later, but it adds runtime and deployment setup beyond a foundation whose relevant behavior can be verified at component/integration level.

### Translate the approved prototype into local production assets and plain CSS

Use the approved `DESIGN.md` values as CSS custom properties for color, typography, spacing, radius, elevation, and focus. Bundle Inter through `@fontsource/inter`, implement the small icon set as reusable local SVG components, and use only project-owned or separately approved local imagery. Preserve the prototype's 280 px desktop sidebar, 1200 px content width, compact data surfaces, public hero composition, and mobile navigation behavior without copying Tailwind CDN markup into React.

The generated HTML is an implementation sketch, not a mandate to add Tailwind. Plain CSS is the smallest choice consistent with the current frontend and avoids a framework dependency. Remote font, icon, and image URLs were rejected because they introduce availability, privacy, and licensing risks.

### Deliver all prototype screens through focused changes

Keep this change limited to the shared visual/integration foundation, static public landing, email login, administrative shell, and route/status surfaces. Follow it with separate changes for: (1) affiliate requests, approval, list, detail, create/edit, status, and export; (2) user management using the current roles and request-to-activation flow; and (3) a dashboard composed only from implemented affiliate, user, and request data. Cards for assemblies, reservations, generic tasks, activity, and notifications remain absent until those domains have approved contracts.

Alternatives considered:

- One cross-module implementation would violate the focused-change workflow and make migrations, authorization, and review harder to isolate.
- Demonstration dashboard data would misrepresent system state.

## Risks / Trade-offs

- [A JavaScript-readable bearer token remains vulnerable to XSS] -> Persist only the token in tab-scoped storage, avoid unsafe HTML injection, apply least privilege, and document that HTTP-only cookie authentication requires a future backend contract change.
- [A transient `/auth/me` failure can block protected navigation] -> Use an explicit recoverable restore-error state with retry and logout actions; never grant access from token presence alone.
- [Exact role-name checks are brittle] -> Centralize the current `Administrador` constant and always use `/auth/me`; defer granular permissions to an approved authorization change.
- [Frontend contract types can drift from Nest responses] -> Model only consumed fields, test contract-shaped fixtures, and keep transport parsing defensive; generated contracts require a future OpenAPI change.
- [Required CORS configuration changes backend startup requirements] -> Add the variable to `.env.example`, document local values, test allow/deny behavior, and deploy backend configuration before or with the frontend.
- [No role catalog prevents complete approval and role-management screens] -> Keep those screens out of scope and do not hardcode role IDs.
- [No frontend browser E2E suite] -> Cover foundation behavior in DOM integration tests and record that live browser/API/PostgreSQL integration remains unverified.
- [Prototype imagery is not a durable licensed asset source] -> Keep remote images out of the bundle and require project-owned or separately approved local assets before publication.
- [Visual fidelity can conflict with accessibility at narrow widths] -> Preserve hierarchy and tokens while allowing responsive reflow, visible labels, and accessible controls to take precedence over pixel-identical placement.

## Migration Plan

1. Add and document frontend and backend environment contracts before enabling browser calls.
2. Add CORS parsing and focused backend tests while preserving all existing REST behavior.
3. Install the approved production and development dependencies and update only the frontend lockfile.
4. Add test configuration, local visual tokens/assets, the shared API/config boundaries, session provider, router, public landing, login, administrative shell, route surfaces, and CSS in dependency order.
5. Remove unused starter assets after no imports remain and update frontend documentation.
6. Run frontend tests, lint, and build plus backend focused tests, complete unit/E2E suites, lint, and build; inspect formatter/linter-written diffs.
7. Roll back by reverting this change and removing `CORS_ORIGINS` from deployment configuration. No database migration or persisted business data conversion is required.
