## Purpose

Defines a single browser-to-API boundary so frontend features use consistent configuration, authentication, parsing, and failure semantics.

## Requirements

### Requirement: Explicit API origin contract
The frontend SHALL obtain the API origin from `VITE_API_URL`, reject a missing or invalid HTTP(S) value with a configuration error, and document the variable in an unpopulated environment example.

#### Scenario: Valid API origin is configured
- **WHEN** `VITE_API_URL` contains an absolute HTTP(S) URL with a trailing slash
- **THEN** API requests use that origin without producing duplicate path separators

#### Scenario: API origin is missing
- **WHEN** the application starts without `VITE_API_URL`
- **THEN** it fails with a configuration error that names the missing variable and does not expose secrets

### Requirement: Centralized JSON request behavior
Frontend features SHALL send API requests through one client that resolves relative API paths, sets JSON headers when a JSON body exists, parses JSON responses, and supports successful responses without a body.

#### Scenario: JSON request succeeds
- **WHEN** a feature sends a JSON body and the API returns successful JSON
- **THEN** the client serializes the body once and returns the parsed response to the feature

#### Scenario: Successful response has no body
- **WHEN** the API returns a successful response with no response body
- **THEN** the client completes without attempting invalid JSON parsing

### Requirement: Bearer token attachment
The API client SHALL attach the active access token as an Authorization bearer header only when an authenticated request supplies a token.

#### Scenario: Authenticated request is sent
- **WHEN** a feature sends a request with the validated session token
- **THEN** the request includes `Authorization: Bearer <token>`

#### Scenario: Public request is sent
- **WHEN** a feature sends a public request without a token
- **THEN** the request contains no Authorization header

### Requirement: Normalized API failures
The API client SHALL represent non-success responses with the HTTP status and safe API validation messages, while malformed, empty, or non-JSON error bodies receive a generic Spanish message.

#### Scenario: Validation response contains multiple messages
- **WHEN** the API returns a non-success JSON response whose `message` is an array of strings
- **THEN** the client preserves the status and exposes all safe validation messages without exposing a stack trace

#### Scenario: Error response is not valid JSON
- **WHEN** the API returns a non-success response that cannot be parsed as the expected error shape
- **THEN** the client exposes the status and a generic Spanish error message

#### Scenario: Network request fails
- **WHEN** the browser cannot complete a request and it was not intentionally aborted
- **THEN** the client reports a distinguishable network failure with a Spanish user-safe message

### Requirement: Restricted browser origin policy
The backend SHALL accept cross-origin browser requests only from exact origins listed in the comma-separated `CORS_ORIGINS` environment variable and SHALL allow the methods and Authorization/Content-Type headers used by the current REST API.

#### Scenario: Configured frontend origin sends a preflight
- **WHEN** an origin listed in `CORS_ORIGINS` sends a valid preflight for a bearer-authenticated API request
- **THEN** the backend returns CORS headers permitting that origin, method, and required headers

#### Scenario: Unlisted origin sends a request
- **WHEN** a browser request originates from an origin not listed in `CORS_ORIGINS`
- **THEN** the backend does not return an access-control allow-origin header for that origin

#### Scenario: CORS allowlist is absent
- **WHEN** the backend starts without a non-empty `CORS_ORIGINS` value
- **THEN** startup fails with a configuration error that names the missing variable and does not disclose credentials
