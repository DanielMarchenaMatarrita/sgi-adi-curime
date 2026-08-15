## 1. Environment And Dependencies

- [x] 1.1 Obtain explicit approval for `react-router`, `@fontsource/inter`, Vitest, React Testing Library, `jest-dom`, `user-event`, and `jsdom`, then install them with npm in `frontend` and review the package and lockfile diff.
- [x] 1.2 Add `frontend/.env.example`, typed Vite environment declarations, and fail-fast HTTP(S) validation for `VITE_API_URL` without committing populated environment files.
- [x] 1.3 Add `CORS_ORIGINS` to `backend/.env.example` and implement strict parsing of non-empty, exact HTTP(S) origins during backend startup.
- [x] 1.4 Enable Nest CORS with the parsed allowlist, current API methods and headers, and credentials disabled.
- [x] 1.5 Add focused backend tests for configured-origin preflight access, rejection of unlisted origins, and missing or invalid CORS configuration.

## 2. Frontend Test Foundation

- [x] 2.1 Configure Vitest with jsdom, shared DOM assertions, automatic cleanup, mock restoration, and session-storage cleanup.
- [x] 2.2 Add and document one non-watch frontend test script and one local watch script.
- [x] 2.3 Add shared render and contract-fixture helpers only where they remove duplication across foundation tests.

## 3. API Boundary

- [x] 3.1 Define the safe current-user, login response, and standard API error contracts consumed by the foundation.
- [x] 3.2 Implement the centralized Fetch client with URL resolution, conditional JSON and bearer headers, success parsing, no-content handling, abort propagation, and normalized HTTP/network failures.
- [x] 3.3 Add API client tests for public and authenticated headers, JSON and no-content successes, validation arrays, malformed errors, network failures, and aborts.

## 4. Session Foundation

- [x] 4.1 Implement tab-scoped token storage that persists only the access token and is isolated from React state.
- [x] 4.2 Implement the session provider states and `/auth/me` restoration flow, including retry, unauthorized clearing, and transient restore failures.
- [x] 4.3 Implement login submission against `/auth/login` with duplicate-submit prevention, generic rejected-credential feedback, password clearing, and destination restoration.
- [x] 4.4 Implement local logout and centralized active-session invalidation for authenticated HTTP 401 responses.
- [x] 4.5 Add session tests for successful and failed login, storage rules, valid and unauthorized restoration, transient restoration retry, logout, and active-session invalidation.

## 5. Visual System, Shell And Routing

- [x] 5.1 Convert the approved `DESIGN.md` typography, color, spacing, shape, elevation, breakpoint, and focus values into documented CSS custom properties and bundle Inter locally.
- [x] 5.2 Implement a reusable local SVG icon set for the controls in this foundation and verify the application has no Tailwind CDN, Google Fonts, Material Symbols, or prototype image-host runtime requests.
- [x] 5.3 Replace Vite metadata, assets, demonstration components, and starter styles with Spanish SGI-Curime metadata and the approved public portal landing using only project-owned or approved local imagery.
- [x] 5.4 Implement the prototype-aligned, email-only login surface with semantic form controls, integrated validation states, pending feedback, and no unsupported password-recovery action.
- [x] 5.5 Implement semantic, responsive guest and authenticated shells with the desktop 280 px sidebar, bounded content canvas, mobile navigation, visible focus behavior, and role-appropriate links.
- [x] 5.6 Configure public account-request and activation route surfaces, guest-only login, authenticated home, administrator area, forbidden, and not-found routes without displaying prototype sample data as application state.
- [x] 5.7 Implement restoration, guest-only, authenticated, and exact-`Administrador` route boundaries with preserved safe internal destinations.
- [x] 5.8 Implement reusable loading, empty, recoverable error, forbidden, and not-found state surfaces in the approved visual language with accessible actions.
- [x] 5.9 Add routing and component tests for restoration gating, redirects, administrator denial, public access, unknown URLs, retry actions, mobile navigation, keyboard operation, and accessible names.

## 6. Documentation And Verification

- [x] 6.1 Replace the template frontend README with project setup, environment, scripts, source boundaries, session limitations, and verification guidance.
- [x] 6.2 Run `npm --prefix frontend test`, `npm --prefix frontend run lint`, and `npm --prefix frontend run build` successfully.
- [x] 6.3 Run focused backend tests, `npm --prefix backend test`, `npm --prefix backend run test:e2e`, `npm --prefix backend run lint`, and `npm --prefix backend run build`, recording any database-dependent limitation and inspecting lint-written diffs.
- [x] 6.4 Run `openspec validate --all --strict --no-interactive`, compare implementation and tests with every scenario, and inspect the final Git diff for secrets, generated noise, or unrelated changes.
