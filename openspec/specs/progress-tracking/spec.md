## Requirements

### Requirement: Track completion streaks per routine
The system SHALL calculate and display the current streak as consecutive applicable days where the routine was completed.

#### Scenario: Streak with daily frequency
- **WHEN** the user has completed a daily routine for 5 consecutive days including today
- **THEN** the system displays "5 days streak"

#### Scenario: Streak with weekdays frequency
- **WHEN** the user has completed a weekdays routine every weekday for 2 weeks (10 weekdays), the weekend days are skipped
- **THEN** the system displays "10 days streak" (counting only applicable days)

#### Scenario: Streak with custom frequency
- **WHEN** a routine applies on Mon, Wed, Fri and the user completed it on all three last week and Mon this week
- **THEN** the current streak is 4 (4 consecutive applicable days completed)

#### Scenario: Broken streak on applicable day
- **WHEN** the user missed a routine on an applicable day
- **THEN** the streak resets from that missed day

#### Scenario: Non-applicable day does not break streak
- **WHEN** a weekdays routine was completed Friday and it is now Saturday
- **THEN** the streak is not broken; it continues when Monday arrives

### Requirement: View completion history per routine
The system SHALL allow users to view the completion history of a specific routine.

#### Scenario: View routine history
- **WHEN** the user selects a routine to view its history
- **THEN** the system displays a calendar or list view showing which days the routine was completed

### Requirement: Global completion statistics
The system SHALL display aggregate statistics across all routines, counting only applicable days per routine.

#### Scenario: View daily completion rate with mixed frequencies
- **WHEN** the user has 3 daily routines and 2 weekdays routines, and today is Saturday
- **THEN** the completion rate is based on the 3 daily routines only (the 2 weekdays routines don't count today)

#### Scenario: View weekly summary
- **WHEN** the user views the statistics section
- **THEN** the system displays the average daily completion rate for the current week, considering each routine's applicable days

### Requirement: Best streak tracking
The system SHALL track and display the longest streak ever achieved for each routine.

#### Scenario: New best streak
- **WHEN** the user's current streak for a routine exceeds the previous best streak
- **THEN** the system updates the best streak value and optionally highlights the achievement

#### Scenario: View best streak
- **WHEN** the user views a routine's details
- **THEN** the system displays both the current streak and the all-time best streak
