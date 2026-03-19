## ADDED Requirements

### Requirement: REST API for routines
The system SHALL provide CRUD API endpoints for routines at `/api/routines`.

#### Scenario: List all routines
- **WHEN** an authenticated user sends GET to `/api/routines`
- **THEN** the system returns a JSON array of all routines belonging to the user

#### Scenario: Create a routine
- **WHEN** an authenticated user sends POST to `/api/routines` with valid routine data
- **THEN** the system creates the routine in SQLite, associates it with the user, and returns the created routine

#### Scenario: Update a routine
- **WHEN** an authenticated user sends PUT to `/api/routines/:id` with updated fields
- **THEN** the system updates the routine and returns the updated record

#### Scenario: Delete a routine
- **WHEN** an authenticated user sends DELETE to `/api/routines/:id`
- **THEN** the system deletes the routine and all associated completions (CASCADE)

#### Scenario: Reject unauthenticated request
- **WHEN** a request to `/api/routines` has no valid JWT token
- **THEN** the system returns 401 Unauthorized

### Requirement: REST API for completions
The system SHALL provide API endpoints for managing completion records at `/api/completions`.

#### Scenario: Get completions by date
- **WHEN** an authenticated user sends GET to `/api/completions?date=2026-03-18`
- **THEN** the system returns all completion records for that date belonging to the user's routines

#### Scenario: Add a completion
- **WHEN** an authenticated user sends POST to `/api/completions` with routineId and date
- **THEN** the system creates a completion record if one does not already exist for that routine+date

#### Scenario: Remove a completion
- **WHEN** an authenticated user sends DELETE to `/api/completions/:routineId/:date`
- **THEN** the system removes the completion record for that routine and date

#### Scenario: Duplicate completion rejected
- **WHEN** a POST to `/api/completions` is sent for a routine+date that already has a record
- **THEN** the system returns the existing record without creating a duplicate

### Requirement: SQLite database with schema
The system SHALL initialize a SQLite database with tables for users, routines, and completions, using the schema defined in design.md.

#### Scenario: Database initialization
- **WHEN** the server starts and no database file exists
- **THEN** the system creates the SQLite database file and runs the schema creation

#### Scenario: WAL mode enabled
- **WHEN** the database is initialized
- **THEN** WAL mode is enabled for better read concurrency

### Requirement: Backend serves frontend static files in production
The system SHALL serve the built frontend static files from the backend server in production mode.

#### Scenario: Serve SPA in production
- **WHEN** a request is made to a non-API path in production
- **THEN** the system serves the frontend's index.html for client-side routing
