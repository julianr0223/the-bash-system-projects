## MODIFIED Requirements

### Requirement: Daily check-in view shows today's routines
The system SHALL display all active routines for the current day with their completion status, ordered by start time for scheduled routines followed by unscheduled routines.

#### Scenario: View today's routines with time order
- **WHEN** the user opens the check-in view and has routines with times ("Ejercicio" at 7:00, "Meditar" at 8:00) and without times ("Leer")
- **THEN** the system displays "Ejercicio" first, then "Meditar", then "Leer" at the bottom, each showing their time range if assigned

#### Scenario: View today's routines without schedules
- **WHEN** the user has only routines without time schedules
- **THEN** the system displays routines in their original order (by creation date) with no time labels

#### Scenario: All routines completed
- **WHEN** the user has completed all routines for the day
- **THEN** the system displays a congratulatory message or visual indicator of full completion
