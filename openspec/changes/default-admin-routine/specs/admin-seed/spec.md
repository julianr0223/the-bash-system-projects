## ADDED Requirements

### Requirement: Default admin user is created on database initialization
The system SHALL create a default admin user (`admin@rutinas.local` / `admin123`) when the database is initialized for the first time (no existing users). The admin user MUST have `must_change_password` set to true.

#### Scenario: Fresh database initialization
- **WHEN** the application starts with an empty database
- **THEN** the system creates an admin user with email `admin@rutinas.local`, bcrypt-hashed password `admin123`, and `must_change_password = 1`

#### Scenario: Existing database with users
- **WHEN** the application starts with a database that already has users
- **THEN** the system SHALL NOT create any additional users

### Requirement: Default routine template is seeded for admin user
The system SHALL create 9 daily routines with specific time schedules for the admin user during database initialization.

#### Scenario: Routines are created with the seed
- **WHEN** the admin user is created during database initialization
- **THEN** the system creates the following routines with frequency `daily`:
  - Kefir (06:00 - 06:10)
  - Ejercicios estiramiento (06:00 - 06:30)
  - Estudiar ingles (06:30 - 07:30)
  - Sesion trabajo 1 (08:00 - 12:00)
  - Gym (13:00 - 15:00)
  - Sesion trabajo 2 (15:00 - 17:00)
  - Tomar medicamento colesterol (19:00, no end time)
  - Sesion estudio/aprendizaje (19:30 - 20:30)
  - Planificar dia siguiente (21:00, no end time)

### Requirement: Database migration for existing databases
The system SHALL add the `must_change_password` column to existing user tables without data loss.

#### Scenario: Existing database without must_change_password column
- **WHEN** the application starts with a database that lacks the `must_change_password` column
- **THEN** the system adds the column with default value `0` (no password change required)
