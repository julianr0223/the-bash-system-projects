## ADDED Requirements

### Requirement: Migrate localStorage data to backend
The system SHALL provide a migration tool that imports existing routine and completion data from localStorage into the SQLite database via the API.

#### Scenario: Successful migration
- **WHEN** the authenticated user clicks "Migrar datos" and localStorage contains routines and completions
- **THEN** the system sends all data to the backend API, which inserts it into SQLite, and shows a success message with counts

#### Scenario: Empty localStorage
- **WHEN** the user clicks migrate but localStorage has no routine data
- **THEN** the system displays a message "No hay datos para migrar"

#### Scenario: Migration with existing data in backend
- **WHEN** the user runs migration and the backend already has some routines
- **THEN** the system imports only new records (skips duplicates by ID) and reports what was imported

### Requirement: Migration prompt on first login
The system SHALL detect if localStorage contains routine data after the user's first login and offer to migrate.

#### Scenario: Prompt migration after first login
- **WHEN** the user logs in for the first time and localStorage contains routine data
- **THEN** the system displays a banner: "Se detectaron datos locales. ¿Deseas migrarlos?"

#### Scenario: No prompt when no local data
- **WHEN** the user logs in and localStorage has no routine data
- **THEN** no migration prompt is shown
