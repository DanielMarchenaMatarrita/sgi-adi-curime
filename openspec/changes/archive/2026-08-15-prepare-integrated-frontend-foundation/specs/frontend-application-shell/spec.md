## Purpose

Defines the navigable, accessible application frame and route boundaries that future SGI-Curime frontend capabilities can extend consistently.

## ADDED Requirements

### Requirement: Product application entry point
The frontend SHALL replace all Vite demonstration content with an SGI-Curime application entry point whose document language, title, visible copy, and navigation labels are in Spanish.

#### Scenario: Application starts
- **WHEN** a user opens the frontend
- **THEN** the browser presents SGI-Curime content without Vite or React demonstration controls, links, or branding

### Requirement: Approved visual language
The frontend SHALL apply the approved prototype's Inter typography, institutional blue, red and yellow accents, tonal surfaces, 4 px spacing rhythm, compact radii, low-contrast outlines, and visible two-pixel focus treatment through reusable local CSS tokens.

#### Scenario: SGI-Curime surface is displayed
- **WHEN** a public, guest, authenticated, or status route renders
- **THEN** its typography, color, spacing, shapes, and focus treatment are visually consistent with the approved SGI-Curime prototype rather than the Vite starter

### Requirement: Local visual resources
The frontend SHALL bundle fonts and icons locally and SHALL use only project-owned or separately approved local imagery at runtime.

#### Scenario: Application loads without third-party asset hosts
- **WHEN** Google Fonts, Material Symbols, Tailwind CDN, and prototype image hosts are unavailable
- **THEN** the application retains its typography, controls, icons, layout, and meaningful content without requesting those hosts

### Requirement: Public portal landing
The frontend SHALL provide a Spanish public landing page that follows the prototype's institutional header, introductory hero, community identity, primary login navigation, and responsive footer without presenting unimplemented services or activities as functional.

#### Scenario: Visitor opens the root route
- **WHEN** an unauthenticated visitor opens `/`
- **THEN** the public portal introduces SGI-Curime, provides an accessible login route, and labels unavailable informational areas without deceptive functional actions

### Requirement: Foundation route map
The frontend SHALL provide stable route boundaries for the authenticated home, guest login, public account request, public account activation, administrator area, forbidden state, and unmatched URLs.

#### Scenario: Public route is opened
- **WHEN** a visitor opens the account-request or account-activation route
- **THEN** the corresponding public route surface is displayed without requiring a session

#### Scenario: Unknown route is opened
- **WHEN** a user opens a URL that does not match a configured route
- **THEN** the frontend displays a Spanish not-found state with a keyboard-accessible route back to a valid entry point

### Requirement: Route authorization boundaries
The frontend SHALL distinguish guest-only, authenticated, and administrator-only routes using the validated current session rather than unverified token contents.

#### Scenario: Unauthenticated user opens an authenticated route
- **WHEN** session restoration confirms that no valid session exists
- **THEN** the frontend redirects the user to login and preserves the intended internal destination

#### Scenario: Authenticated user opens a guest-only route
- **WHEN** a user with a validated session opens the login route
- **THEN** the frontend redirects the user to the authenticated home

#### Scenario: Non-administrator opens an administrator route
- **WHEN** a validated user whose current role is not exactly `Administrador` opens an administrator-only route
- **THEN** the frontend displays the forbidden state and does not render administrator content

### Requirement: Session restoration gate
The frontend SHALL defer protected-route authorization decisions until the initial persisted session has been validated or rejected.

#### Scenario: Session restoration is pending
- **WHEN** the frontend is validating a persisted token
- **THEN** it displays a non-destructive loading state instead of briefly rendering guest or protected content

### Requirement: Shared state surfaces
The application shell SHALL provide reusable and semantically identified loading, empty, recoverable error, forbidden, and not-found states suitable for route-level content.

#### Scenario: Recoverable route error occurs
- **WHEN** a route reports a recoverable loading failure
- **THEN** the user receives a Spanish error message and a keyboard-accessible retry action

### Requirement: Baseline responsive accessibility
The application shell SHALL remain operable at mobile and desktop widths using semantic landmarks, visible keyboard focus, labelled controls, logical heading order, and no mandatory pointer-only interaction.

#### Scenario: Keyboard navigation
- **WHEN** a user navigates the shell and status actions using only a keyboard
- **THEN** each interactive control is reachable, visibly focused, and has an accessible name

#### Scenario: Mobile viewport
- **WHEN** the application is displayed at a 320 CSS-pixel viewport width
- **THEN** primary content and navigation remain readable and operable without horizontal page scrolling

### Requirement: Responsive administrative shell
The authenticated administrator surface SHALL reproduce the prototype's desktop sidebar and content hierarchy and SHALL replace the fixed sidebar with a labelled keyboard-operable mobile navigation pattern below the desktop breakpoint.

#### Scenario: Administrator uses desktop navigation
- **WHEN** an administrator views the application at a desktop width
- **THEN** a 280 CSS-pixel institutional sidebar, top utility region, and bounded content canvas provide the approved hierarchy

#### Scenario: Administrator uses mobile navigation
- **WHEN** an administrator views the application below the desktop navigation breakpoint
- **THEN** the sidebar no longer consumes fixed page width and all available foundation routes remain reachable through labelled keyboard-operable controls
