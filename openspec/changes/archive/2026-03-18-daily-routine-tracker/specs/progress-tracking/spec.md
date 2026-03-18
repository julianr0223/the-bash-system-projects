## ADDED Requirements

### Requirement: Track completion streaks per routine
The system SHALL calculate and display the current streak (consecutive days completed) for each routine.

#### Scenario: Active streak display
- **WHEN** the user has completed routine "Meditar" for 5 consecutive days including today
- **THEN** the system displays "5 days streak" for that routine

#### Scenario: Broken streak
- **WHEN** the user missed routine "Meditar" yesterday but completed it today
- **THEN** the current streak displays as 1 day

#### Scenario: No completions
- **WHEN** the user has never completed a routine
- **THEN** the streak displays as 0

### Requirement: View completion history per routine
The system SHALL allow users to view the completion history of a specific routine.

#### Scenario: View routine history
- **WHEN** the user selects a routine to view its history
- **THEN** the system displays a calendar or list view showing which days the routine was completed

### Requirement: Global completion statistics
The system SHALL display aggregate statistics across all routines.

#### Scenario: View daily completion rate
- **WHEN** the user views the statistics section
- **THEN** the system displays today's completion rate (e.g., "4 of 6 routines completed — 67%")

#### Scenario: View weekly summary
- **WHEN** the user views the statistics section
- **THEN** the system displays the average daily completion rate for the current week

### Requirement: Best streak tracking
The system SHALL track and display the longest streak ever achieved for each routine.

#### Scenario: New best streak
- **WHEN** the user's current streak for a routine exceeds the previous best streak
- **THEN** the system updates the best streak value and optionally highlights the achievement

#### Scenario: View best streak
- **WHEN** the user views a routine's details
- **THEN** the system displays both the current streak and the all-time best streak
