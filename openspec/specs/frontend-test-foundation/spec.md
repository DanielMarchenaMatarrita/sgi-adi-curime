## Purpose

Defines repeatable automated frontend verification so shared routing, HTTP, session, and accessibility behavior can evolve without silent regressions.

## Requirements

### Requirement: Deterministic frontend test command
The frontend SHALL provide a documented non-watch test command that exits successfully only when all frontend tests pass and a separate watch command for local development.

#### Scenario: Continuous verification runs tests
- **WHEN** the non-watch frontend test command is executed in a clean installation
- **THEN** it runs the complete frontend test suite once and exits with a process status reflecting the result

### Requirement: Browser-oriented component environment
Frontend tests SHALL run in a browser-like DOM environment with shared DOM assertions and automatic cleanup between tests.

#### Scenario: Two component tests run sequentially
- **WHEN** separate component tests render application content
- **THEN** DOM and browser-storage state from one test do not leak into the next test

### Requirement: Foundation behavior coverage
Automated frontend tests SHALL cover successful and failed login, persisted-session restoration, unauthorized invalidation, guest and administrator route boundaries, API success and failure normalization, not-found navigation, and keyboard-accessible shared actions.

#### Scenario: Foundation implementation is changed
- **WHEN** the complete frontend test command runs after a foundation change
- **THEN** the listed session, route, API, fallback, and interaction behaviors are exercised without requiring a live backend or PostgreSQL database

### Requirement: Deliberate API boundary mocking
Frontend tests SHALL replace network access only at the centralized API boundary or browser Fetch boundary and SHALL use contract-shaped fixtures that exclude passwords, hashes, and real tokens.

#### Scenario: Authenticated fixture is needed
- **WHEN** a test represents a successful authenticated session
- **THEN** it uses a clearly fake token and the current safe user summary shape without sensitive fields
