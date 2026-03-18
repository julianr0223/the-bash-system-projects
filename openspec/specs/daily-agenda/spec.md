## Requirements

### Requirement: Daily agenda view shows routines as time blocks
The system SHALL display a daily agenda view that shows only routines whose frequency applies to the current day, with assigned times as chronologically ordered time blocks.

#### Scenario: View agenda filtered by frequency
- **WHEN** the user opens the agenda on a Sunday and has a "weekdays" routine with time 09:00-10:00 and a "daily" routine with time 08:00-08:30
- **THEN** only the daily routine appears in the agenda; the weekdays routine is hidden

#### Scenario: View agenda with scheduled routines
- **WHEN** the user opens the agenda view and has applicable routines with start/end times
- **THEN** the system displays routines ordered by start time, showing each as a block with the time range and routine name

#### Scenario: View agenda with mix of scheduled and unscheduled routines
- **WHEN** the user has some applicable routines with times and some without
- **THEN** the scheduled routines appear first ordered by start time, followed by a "Sin hora asignada" section with the unscheduled routines

#### Scenario: Empty agenda
- **WHEN** no applicable routines have assigned times for the current day
- **THEN** the system displays a message suggesting to add time schedules to existing routines

### Requirement: Agenda shows completion status
The system SHALL display the completion status of each routine in the agenda view.

#### Scenario: View mixed completion in agenda
- **WHEN** the user has completed some routines and not others
- **THEN** completed routines show a visual indicator (checkmark, strikethrough, or muted style) and pending routines are prominently displayed

### Requirement: Check-in from agenda view
The system SHALL allow users to mark routines as completed directly from the agenda view.

#### Scenario: Complete a routine from agenda
- **WHEN** the user clicks on a pending routine in the agenda view
- **THEN** the routine is marked as completed and the visual state updates immediately

#### Scenario: Undo completion from agenda
- **WHEN** the user clicks on a completed routine in the agenda view
- **THEN** the completion is undone and the routine returns to pending state

### Requirement: Agenda displays time indicators
The system SHALL display time references to help the user orient within their day.

#### Scenario: Current time indicator
- **WHEN** the user views the agenda during the day
- **THEN** a visual marker indicates the current time position relative to the scheduled routines
