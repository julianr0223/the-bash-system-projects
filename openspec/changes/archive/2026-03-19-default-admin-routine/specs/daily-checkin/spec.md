## MODIFIED Requirements

### Requirement: View today's routines for check-in
The system SHALL display all active routines that apply to the current day, including seeded routines, in the daily check-in view sorted by start time.

#### Scenario: First login with seeded routines
- **WHEN** the admin user completes password change and navigates to check-in
- **THEN** all 9 seeded daily routines appear ready for check-in, sorted by their start times

#### Scenario: Check-in on seeded routines
- **WHEN** the user marks a seeded routine as complete
- **THEN** the completion is recorded identically to a user-created routine
