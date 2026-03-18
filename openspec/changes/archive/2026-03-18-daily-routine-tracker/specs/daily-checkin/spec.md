## ADDED Requirements

### Requirement: User can check in a routine for today
The system SHALL allow users to mark a routine as completed for the current day.

#### Scenario: Mark routine as completed
- **WHEN** the user clicks the check-in button for routine "Meditar" on the current day
- **THEN** the routine is marked as completed with a visual indicator and the completion timestamp is recorded

#### Scenario: Already completed routine
- **WHEN** the user views a routine that was already marked as completed today
- **THEN** the routine displays a completed state with the check-in button disabled or showing an undo option

### Requirement: User can undo a check-in
The system SHALL allow users to unmark a routine's completion for the current day.

#### Scenario: Undo today's check-in
- **WHEN** the user clicks undo on a completed routine for today
- **THEN** the completion record for today is removed and the routine returns to its uncompleted state

### Requirement: Daily check-in view shows today's routines
The system SHALL display all active routines for the current day with their completion status.

#### Scenario: View today's routines
- **WHEN** the user opens the application
- **THEN** the system displays all active daily routines with a clear indication of which ones have been completed today and which are pending

#### Scenario: All routines completed
- **WHEN** the user has completed all routines for the day
- **THEN** the system displays a congratulatory message or visual indicator of full completion

### Requirement: Automatic daily reset
The system SHALL automatically reset the check-in view for a new day based on local midnight.

#### Scenario: New day begins
- **WHEN** the date changes to a new day (past local midnight)
- **THEN** all routines appear as uncompleted for the new day, and yesterday's completions are preserved in history
