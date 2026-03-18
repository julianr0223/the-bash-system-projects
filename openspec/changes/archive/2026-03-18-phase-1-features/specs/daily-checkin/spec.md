## MODIFIED Requirements

### Requirement: Daily check-in view shows today's routines
The system SHALL display only active routines whose frequency applies to the current day, with their completion status, ordered by start time for scheduled routines followed by unscheduled routines.

#### Scenario: View today's routines filtered by frequency
- **WHEN** the user opens the check-in view on a Saturday and has a "weekdays" routine and a "daily" routine
- **THEN** only the daily routine is displayed; the weekdays routine is hidden

#### Scenario: View today's routines with time order
- **WHEN** the user opens the check-in view and has applicable routines with times ("Ejercicio" at 7:00, "Meditar" at 8:00) and without times ("Leer")
- **THEN** the system displays "Ejercicio" first, then "Meditar", then "Leer" at the bottom, each showing their time range if assigned

#### Scenario: All applicable routines completed
- **WHEN** the user has completed all routines that apply to today
- **THEN** the system displays a congratulatory message or visual indicator of full completion

#### Scenario: Show frequency indicator
- **WHEN** a routine has frequency "weekdays" or custom days
- **THEN** the check-in item displays a small frequency label (e.g., "L-V" or "L, M, V")
