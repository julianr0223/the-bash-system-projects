## ADDED Requirements

### Requirement: Initial setup creates first user
The system SHALL allow creating the first user account via a setup endpoint, only when no users exist in the database.

#### Scenario: Setup first account
- **WHEN** no users exist and a POST is sent to `/api/auth/setup` with email and password
- **THEN** the system creates the user with a bcrypt-hashed password and returns a JWT token

#### Scenario: Setup rejected when user exists
- **WHEN** a user already exists and a POST is sent to `/api/auth/setup`
- **THEN** the system returns 403 Forbidden with message "Setup already completed"

### Requirement: User can login with email and password
The system SHALL authenticate users via email and password, returning a JWT token on success.

#### Scenario: Successful login
- **WHEN** a POST is sent to `/api/auth/login` with valid email and password
- **THEN** the system returns a JWT token (24h expiry) and user info

#### Scenario: Failed login with wrong password
- **WHEN** a POST is sent to `/api/auth/login` with valid email but wrong password
- **THEN** the system returns 401 Unauthorized

#### Scenario: Failed login with unknown email
- **WHEN** a POST is sent to `/api/auth/login` with an email that does not exist
- **THEN** the system returns 401 Unauthorized without revealing whether the email exists

### Requirement: JWT-protected API routes
The system SHALL require a valid JWT Bearer token for all `/api/*` endpoints except auth endpoints.

#### Scenario: Valid token accepted
- **WHEN** a request includes a valid, non-expired JWT in the Authorization header
- **THEN** the request proceeds and the user ID is available to route handlers

#### Scenario: Expired token rejected
- **WHEN** a request includes an expired JWT
- **THEN** the system returns 401 Unauthorized

#### Scenario: Missing token rejected
- **WHEN** a request to a protected endpoint has no Authorization header
- **THEN** the system returns 401 Unauthorized

### Requirement: Verify current session
The system SHALL provide an endpoint to verify the current JWT token and return user info.

#### Scenario: Verify valid session
- **WHEN** an authenticated user sends GET to `/api/auth/me`
- **THEN** the system returns the user's email and ID

### Requirement: Frontend auth flow
The system SHALL display a setup page when no user exists, a login page when not authenticated, and the main app when authenticated.

#### Scenario: First visit shows setup
- **WHEN** a user visits the app and GET `/api/auth/me` returns that no users exist
- **THEN** the frontend displays the setup/register form

#### Scenario: Unauthenticated visit shows login
- **WHEN** a user visits the app without a valid token and users exist
- **THEN** the frontend displays the login form

#### Scenario: Authenticated visit shows app
- **WHEN** a user visits the app with a valid JWT
- **THEN** the frontend displays the main dashboard
