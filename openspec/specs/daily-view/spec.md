### Requirement: Display Today's Routines
The system SHALL show only routines that apply to the current day (via `appliesToDay`), ordered by startTime ascending, with unscheduled routines at the bottom in a separate section.

#### Scenario: View today's routines on a weekday
- **WHEN** the user opens `/hoy` on a weekday
- **THEN** all applicable routines are shown ordered by start time

### Requirement: Time Display
The system SHALL show a time gutter with startTime-endTime for scheduled routines.

#### Scenario: Routine with start and end time
- **WHEN** a routine has both startTime and endTime
- **THEN** the time is displayed as "HH:MM - HH:MM"

#### Scenario: Routine with only start time
- **WHEN** a routine has startTime but no endTime
- **THEN** only the startTime is displayed

### Requirement: Current Time Indicator
The system SHALL show a horizontal line at the current time position in the list, updated in real-time every minute.

#### Scenario: Time indicator position
- **WHEN** the current time is between two routine start times
- **THEN** the indicator line appears between those routines

### Requirement: Completion Toggle
Each routine SHALL have a clickable circle to mark as completed/uncompleted for today.

#### Scenario: Mark routine as completed
- **WHEN** the user clicks the completion circle on a pending routine
- **THEN** the routine shows a filled/checked circle and visual distinction (strikethrough or opacity)

### Requirement: Progress Counter
The system SHALL show "N/M" in the header (completed / total applicable today).

#### Scenario: Partial completion
- **WHEN** 3 of 6 routines are completed
- **THEN** the header shows "3/6"

### Requirement: All Complete Message
The system SHALL show a congratulatory message when all routines for today are completed.

#### Scenario: All routines done
- **WHEN** all applicable routines are marked as completed
- **THEN** a congratulatory message is displayed

### Requirement: Unscheduled Section
Routines without startTime SHALL appear under "Sin hora asignada" heading.

#### Scenario: Unscheduled routines
- **WHEN** routines exist without a startTime
- **THEN** they appear in a separate section below scheduled routines

### Requirement: Empty State
The system SHALL show a message when no routines apply to today.

#### Scenario: No applicable routines
- **WHEN** no routines apply to the current day
- **THEN** a friendly message is displayed indicating no routines for today
