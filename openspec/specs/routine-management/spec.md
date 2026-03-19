## MODIFIED Requirements

### Requirement: Routines can be created
The system SHALL allow routines to be created both by user action through the UI and by automated database seeding during initialization. All routines (user-created and seeded) MUST follow the same data model and appear identically in the UI.

#### Scenario: User creates a routine via UI
- **WHEN** the user fills out the routine form and submits
- **THEN** the system creates a new routine via the API

#### Scenario: Seeded routines appear in routine list
- **WHEN** the user navigates to the routines page after first login
- **THEN** the 9 precargadas routines are displayed in the routine list with their categories and schedules

#### Scenario: Seeded routines can be edited and deleted
- **WHEN** the user edits or deletes a seeded routine
- **THEN** the system processes the change identically to a user-created routine
