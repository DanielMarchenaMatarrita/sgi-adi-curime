## Why

The React application is still the Vite starter and cannot communicate with the NestJS API from a browser because it has no routing, API boundary, session handling, environment contract, or cross-origin policy. An approved Stitch prototype now provides the visual direction for the public portal, login, administrative shell, dashboard, user management, and affiliate management. This first focused change establishes the integrated and visual foundation those screens need without presenting prototype sample data as real application behavior.

## What Changes

- Replace the Vite demonstration with a Spanish-language application shell and route boundaries for public, guest-only, authenticated, administrator-only, forbidden, and not-found states.
- Add a centralized, typed HTTP client over the browser Fetch API, including API-origin configuration, JSON parsing, normalized transport errors, bearer-token attachment, and unauthorized-session handling.
- Add browser session management using the existing `/auth/login` and `/auth/me` contracts, with tab-scoped token persistence and local logout.
- Implement the approved SGI-Curime visual language from the attached `DESIGN.md`: Inter typography, institutional blue surfaces, red and yellow accents, 4 px spacing rhythm, tonal containers, compact shapes, and high-visibility focus states.
- Implement the static public portal landing, integrated email-only administrative login, responsive administrative shell, and reusable status surfaces represented by the prototype.
- Use local bundled fonts and icons and project-approved local imagery; the application will not depend on Tailwind CDN, Google Fonts, Material Symbols, or prototype image URLs at runtime.
- Add an explicit frontend environment contract and enable a restricted backend CORS policy for approved browser origins.
- Add frontend unit/component test tooling and tests for routing, session restoration, authorization boundaries, HTTP behavior, and accessibility-critical interactions.
- Replace the template frontend README with project-specific setup, environment, command, and architecture guidance.
- Add the production dependencies `react-router` and `@fontsource/inter` and development dependencies for Vitest, React Testing Library, DOM assertions, and a browser-like test environment. Dependency installation requires explicit approval before implementation.
- Establish the delivery sequence for the remaining prototype screens as separate focused changes: affiliate request/review and management, current-role user management and activation, then a dashboard composed only from implemented data sources.

## Capabilities

### New Capabilities

- `frontend-application-shell`: Defines the application entry point, route categories, authorization boundaries, fallback states, responsive shell, and baseline accessibility behavior.
- `frontend-api-integration`: Defines environment-driven API access, request/response handling, normalized failures, bearer-token behavior, and browser-origin compatibility.
- `frontend-session-management`: Defines login, session restoration, local logout, tab-scoped persistence, stale-session handling, and role-based access decisions.
- `frontend-test-foundation`: Defines deterministic frontend test execution and the minimum behavioral coverage required for the shared foundation.

### Modified Capabilities

None. This repository has no existing OpenSpec capability specifications.

## Impact

- Frontend code under `frontend/src`, `frontend/index.html`, Vite configuration, environment examples, package metadata, lockfile, and frontend documentation.
- Approved visual reference under `stitch_dise_o_ux_ui_sgi_curime/stitch_dise_o_ux_ui_sgi_curime`; generated HTML is a visual reference rather than production code or an API/business-rule contract.
- Backend bootstrap configuration and environment example for a restricted `CORS_ORIGINS` contract; existing REST paths and response bodies remain unchanged.
- New production dependencies: `react-router` and `@fontsource/inter`.
- New development dependencies: Vitest, React Testing Library, `jest-dom`, `user-event`, and `jsdom`.
- Security: bearer tokens remain exposed to JavaScript because the current backend supports only Authorization headers. Tab-scoped `sessionStorage` limits persistence but does not eliminate XSS risk; no refresh token or server-side logout is introduced.
- Operations: local development must configure the API origin and allowed frontend origin. Deployment still requires an environment-specific API URL and CORS allowlist.
