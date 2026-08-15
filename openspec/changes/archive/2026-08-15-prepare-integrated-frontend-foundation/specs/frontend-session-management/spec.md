## Purpose

Defines the client-side lifecycle for authenticating, restoring, authorizing, and ending sessions against the current JWT bearer API.

## ADDED Requirements

### Requirement: Login against the current API
The frontend SHALL provide a labelled email and password login form that submits to `POST /auth/login`, prevents duplicate submission while pending, and establishes a session only from a successful response containing an access token and user summary.

#### Scenario: Login succeeds
- **WHEN** a guest submits valid credentials and the API returns the current login response
- **THEN** the frontend stores the access token for the current browser tab, stores the returned user in session state, and navigates to the preserved internal destination or authenticated home

#### Scenario: Login is rejected
- **WHEN** the API rejects submitted credentials
- **THEN** the frontend remains on login, clears the password field, restores submission availability, and displays a generic Spanish authentication error

#### Scenario: Login is already pending
- **WHEN** the user attempts to submit again while a login request is pending
- **THEN** the frontend does not send a second login request

### Requirement: Tab-scoped token persistence
The frontend SHALL persist only the access token in browser `sessionStorage` and SHALL NOT persist passwords or the user profile.

#### Scenario: Browser tab reloads
- **WHEN** the page reloads in a tab containing a persisted access token
- **THEN** the frontend retrieves the token and validates it before establishing an authenticated session

#### Scenario: New tab starts without copied session storage
- **WHEN** the application opens in a browser context without the token entry
- **THEN** the frontend starts unauthenticated

### Requirement: Server-validated session restoration
The frontend SHALL restore a persisted session by calling `GET /auth/me` and SHALL use the returned current user and role for authorization decisions.

#### Scenario: Persisted token remains valid
- **WHEN** `/auth/me` accepts the persisted token
- **THEN** the frontend establishes the session from the returned user summary

#### Scenario: Persisted token is unauthorized
- **WHEN** `/auth/me` returns HTTP 401
- **THEN** the frontend removes the token, clears session state, and presents the relevant guest route without an internal error trace

#### Scenario: Session validation fails transiently
- **WHEN** `/auth/me` fails because of a network or server error other than 401
- **THEN** the frontend does not treat the token as validated and displays a recoverable session-loading error

### Requirement: Unauthorized active-session handling
The frontend SHALL invalidate the local session when an authenticated API request returns HTTP 401.

#### Scenario: Active token becomes invalid
- **WHEN** an authenticated API request returns 401 after a session was established
- **THEN** the frontend removes the persisted token, clears the current user, and redirects protected navigation to login

### Requirement: Local logout
The frontend SHALL provide a logout action that removes the persisted token and current user without claiming server-side token revocation.

#### Scenario: User logs out
- **WHEN** an authenticated user activates logout
- **THEN** the frontend clears local session data and navigates to login

### Requirement: Exact current administrator role
The frontend SHALL treat a validated user as an administrator only when `/auth/me` reports the exact role name `Administrador`.

#### Scenario: Administrator session is evaluated
- **WHEN** the validated user role equals `Administrador`
- **THEN** administrator-only navigation and routes are available

#### Scenario: Other role is evaluated
- **WHEN** the validated user role has any other value
- **THEN** administrator-only navigation and content remain unavailable
