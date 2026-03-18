## MODIFIED Requirements

### Requirement: User can create a routine
The system SHALL allow users to create a new routine by providing a name, optional description, category, frequency (daily, weekdays, or custom days), optional start time and end time, and optional weekly goal.

#### Scenario: Create routine with all fields
- **WHEN** the user submits the create routine form with name "Meditar", description "10 minutos de meditación", category "Salud", frequency "daily", start time "08:00", end time "08:30", and goal 6
- **THEN** the system creates the routine with the time schedule and goal, and it appears in the routine list

#### Scenario: Create routine with only required fields
- **WHEN** the user submits the create routine form with only the name "Leer"
- **THEN** the system creates the routine with default category "General", frequency "daily", no time schedule, and no goal

#### Scenario: Reject routine without name
- **WHEN** the user attempts to create a routine without providing a name
- **THEN** the system displays a validation error and does not create the routine

#### Scenario: Reject routine with invalid time range
- **WHEN** the user sets end time earlier than start time (e.g., start "09:00", end "08:00")
- **THEN** the system displays a validation error indicating the end time must be after the start time

#### Scenario: Create routine with only start time
- **WHEN** the user sets a start time but leaves end time empty
- **THEN** the system creates the routine with the start time and no end time

#### Scenario: Create routine with weekdays frequency
- **WHEN** the user selects frequency "weekdays"
- **THEN** the system creates the routine that applies Monday through Friday

#### Scenario: Create routine with custom days frequency
- **WHEN** the user selects frequency "custom" and picks Monday, Wednesday, Friday
- **THEN** the system creates the routine with frequency { days: [1, 3, 5] }

#### Scenario: Reject goal exceeding applicable days
- **WHEN** the user sets a custom frequency with 3 days per week and a goal of 5
- **THEN** the system displays a validation error indicating the goal cannot exceed available days

### Requirement: User can edit a routine
The system SHALL allow users to modify the name, description, category, frequency, start time, end time, and goal of an existing routine.

#### Scenario: Edit routine name
- **WHEN** the user changes the name of routine "Meditar" to "Meditación matutina"
- **THEN** the routine list displays the updated name and all existing completion records remain associated

#### Scenario: Edit routine category
- **WHEN** the user changes the category of a routine from "General" to "Ejercicio"
- **THEN** the routine appears under the new category

#### Scenario: Add time schedule to existing routine
- **WHEN** the user edits a routine that has no time schedule and sets start time "07:00" and end time "07:45"
- **THEN** the routine now appears with the time range in the list and in the agenda view

#### Scenario: Remove time schedule from routine
- **WHEN** the user clears the start time and end time from a scheduled routine
- **THEN** the routine no longer shows a time range and appears in the "Sin hora asignada" section of the agenda

#### Scenario: Change frequency from daily to weekdays
- **WHEN** the user changes a routine's frequency from "daily" to "weekdays"
- **THEN** the routine no longer appears on Saturday and Sunday in the check-in and agenda views
