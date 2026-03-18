## ADDED Requirements

### Requirement: User can create a routine
The system SHALL allow users to create a new routine by providing a name, optional description, category, and frequency.

#### Scenario: Create routine with all fields
- **WHEN** the user submits the create routine form with name "Meditar", description "10 minutos de meditación", category "Salud", and frequency "daily"
- **THEN** the system creates the routine and it appears in the routine list

#### Scenario: Create routine with only required fields
- **WHEN** the user submits the create routine form with only the name "Leer"
- **THEN** the system creates the routine with default category "General" and frequency "daily"

#### Scenario: Reject routine without name
- **WHEN** the user attempts to create a routine without providing a name
- **THEN** the system displays a validation error and does not create the routine

### Requirement: User can edit a routine
The system SHALL allow users to modify the name, description, category, and frequency of an existing routine.

#### Scenario: Edit routine name
- **WHEN** the user changes the name of routine "Meditar" to "Meditación matutina"
- **THEN** the routine list displays the updated name and all existing completion records remain associated

#### Scenario: Edit routine category
- **WHEN** the user changes the category of a routine from "General" to "Ejercicio"
- **THEN** the routine appears under the new category

### Requirement: User can delete a routine
The system SHALL allow users to delete a routine, requiring confirmation before deletion.

#### Scenario: Delete routine with confirmation
- **WHEN** the user clicks delete on a routine and confirms the action
- **THEN** the routine is removed from the list and its completion records are deleted

#### Scenario: Cancel routine deletion
- **WHEN** the user clicks delete on a routine but cancels the confirmation
- **THEN** the routine and its records remain unchanged

### Requirement: User can list routines
The system SHALL display all active routines in an organized list, grouped by category.

#### Scenario: View routines grouped by category
- **WHEN** the user has routines in categories "Salud" and "Productividad"
- **THEN** the routine list displays routines grouped under their respective category headers

#### Scenario: Empty state
- **WHEN** the user has no routines created
- **THEN** the system displays a message encouraging the user to create their first routine

### Requirement: User can deactivate a routine
The system SHALL allow users to deactivate a routine without deleting it, preserving its history.

#### Scenario: Deactivate a routine
- **WHEN** the user deactivates a routine
- **THEN** the routine no longer appears in the daily check-in view but its completion history is preserved

#### Scenario: Reactivate a routine
- **WHEN** the user reactivates a previously deactivated routine
- **THEN** the routine appears again in the daily check-in view
