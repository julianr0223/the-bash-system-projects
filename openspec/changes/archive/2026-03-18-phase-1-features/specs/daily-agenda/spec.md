## MODIFIED Requirements

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
