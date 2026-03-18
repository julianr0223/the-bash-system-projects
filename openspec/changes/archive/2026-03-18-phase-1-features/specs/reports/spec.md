## ADDED Requirements

### Requirement: Weekly summary report
The system SHALL display a weekly summary showing the overall completion rate for the current week and a comparison with the previous week.

#### Scenario: View weekly summary with improvement
- **WHEN** the user views the reports page and this week's completion rate is 85% and last week was 72%
- **THEN** the system displays "Esta semana: 85%" with an indicator showing improvement over last week

#### Scenario: View weekly summary with decline
- **WHEN** the user views the reports page and this week's completion rate is 60% and last week was 75%
- **THEN** the system displays "Esta semana: 60%" with an indicator showing decline from last week

### Requirement: 30-day completion trend
The system SHALL display a simple line or bar visualization showing daily completion percentage for the last 30 days.

#### Scenario: View 30-day trend
- **WHEN** the user views the reports page
- **THEN** the system displays a visual trend of daily completion rates over the last 30 days, showing only routines that applied on each day

### Requirement: Per-routine progress with goal
The system SHALL display each routine's weekly progress as a bar, comparing completions against an optional goal.

#### Scenario: Routine with goal met
- **WHEN** routine "Meditar" has a goal of 5 per week and was completed 5 times this week
- **THEN** the system displays a full progress bar with "5/5" and a goal-met indicator

#### Scenario: Routine with goal not met
- **WHEN** routine "Ejercicio" has a goal of 4 per week and was completed 2 times this week
- **THEN** the system displays a partial progress bar with "2/4"

#### Scenario: Routine without goal
- **WHEN** routine "Leer" has no goal set
- **THEN** the system displays the completion count for the week (e.g., "3 de 7 dias") without a goal indicator

### Requirement: Reports only count applicable days
The system SHALL calculate all report metrics based only on days where the routine's frequency applies.

#### Scenario: Weekdays routine on weekly report
- **WHEN** a weekdays routine was completed 4 out of 5 weekdays this week
- **THEN** the report shows 80% (4/5) not 57% (4/7)
