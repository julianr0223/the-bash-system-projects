## ADDED Requirements

### Requirement: Application can be deployed via Docker Compose
The system SHALL provide a Docker Compose configuration that builds and runs the application with a single command.

#### Scenario: First deploy on homelab
- **WHEN** the user runs `docker compose up -d` on a fresh server
- **THEN** the application builds, starts, seeds the admin user and routines, and is accessible on the configured port

#### Scenario: Data persists across container restarts
- **WHEN** the container is stopped and restarted
- **THEN** all user data (routines, completions, password changes) is preserved via the Docker volume

### Requirement: Production configuration via environment variables
The system SHALL read JWT_SECRET and PORT from environment variables with sensible defaults for development.

#### Scenario: Custom JWT_SECRET in production
- **WHEN** `JWT_SECRET` env var is set in docker-compose.yml
- **THEN** the auth system uses that secret for signing/verifying JWT tokens

#### Scenario: Custom port configuration
- **WHEN** `PORT` env var is set
- **THEN** the application listens on that port inside the container

### Requirement: Optimized Docker image
The system SHALL use a multi-stage Dockerfile that produces a minimal production image using Next.js standalone output.

#### Scenario: Image size is reasonable
- **WHEN** the Docker image is built
- **THEN** the final image size is under 300MB
