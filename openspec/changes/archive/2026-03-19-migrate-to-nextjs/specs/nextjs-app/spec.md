## ADDED Requirements

### Requirement: Single process development and production
The system SHALL run as a single Next.js process that serves both the frontend UI and the API endpoints.

#### Scenario: Development mode
- **WHEN** the developer runs `npm run dev`
- **THEN** a single process starts serving the frontend and API on one port

#### Scenario: Production build
- **WHEN** the developer runs `npm run build && npm start`
- **THEN** a single Node.js process serves the compiled frontend and API

### Requirement: API route parity with Express backend
The system SHALL expose the same API endpoints with the same request/response contracts as the previous Express backend.

#### Scenario: All existing endpoints available
- **WHEN** the app is running
- **THEN** all endpoints are available: `/api/auth/setup`, `/api/auth/login`, `/api/auth/me`, `/api/auth/status`, `/api/routines` (CRUD), `/api/completions` (CRUD), `/api/migrate`

#### Scenario: Same response format
- **WHEN** the frontend calls any API endpoint
- **THEN** the response JSON structure is identical to the previous Express implementation

### Requirement: Frontend feature parity
The system SHALL render all existing pages and components with identical functionality.

#### Scenario: All routes accessible
- **WHEN** the user navigates through the app
- **THEN** all pages are available: Dashboard, Agenda, Check-in, Rutinas, Reportes, Logros, Estadisticas, Ajustes

#### Scenario: Auth flow unchanged
- **WHEN** the user accesses the app for the first time
- **THEN** the setup/login flow works identically to the previous implementation

### Requirement: Next.js App Router structure
The system SHALL use Next.js App Router with a root layout that handles auth state and navigation.

#### Scenario: Root layout provides auth context
- **WHEN** any page is loaded
- **THEN** the root layout checks auth state and shows login/setup if needed, or the main app with navigation if authenticated
