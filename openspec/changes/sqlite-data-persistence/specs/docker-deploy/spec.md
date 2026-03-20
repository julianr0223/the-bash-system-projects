## MODIFIED Requirements

### Requirement: Application can be deployed via Docker Compose
The system SHALL provide a Docker Compose configuration that builds and runs the application with a single command. The Dockerfile SHALL include a `VOLUME /app/data` declaration to support orchestrators that do not use docker-compose.yml.

#### Scenario: First deploy on homelab
- **WHEN** the user runs `docker compose up -d` on a fresh server
- **THEN** the application builds, starts, seeds the admin user and routines, and is accessible on the configured port

#### Scenario: Data persists across container restarts
- **WHEN** the container is stopped and restarted
- **THEN** all user data (routines, completions, password changes) is preserved via the Docker volume

#### Scenario: Deploy via orchestrator without docker-compose
- **WHEN** an orchestrator (e.g., Coolify) builds and runs the image without using docker-compose.yml
- **THEN** the `VOLUME /app/data` declaration ensures data persistence is supported by the orchestrator's volume management
