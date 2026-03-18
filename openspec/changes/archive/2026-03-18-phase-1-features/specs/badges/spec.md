## ADDED Requirements

### Requirement: Predefined badge system
The system SHALL evaluate a set of predefined badges based on the user's completion data and display which ones have been unlocked.

#### Scenario: View unlocked badges
- **WHEN** the user views the badges section and has completed a routine for 7 consecutive applicable days
- **THEN** the badge "Racha de 7 dias" is displayed as unlocked

#### Scenario: View locked badges
- **WHEN** the user views the badges section and has not yet achieved a 30-day streak
- **THEN** the badge "Racha de 30 dias" is displayed as locked with a description of how to unlock it

### Requirement: Badge definitions
The system SHALL include at minimum the following badges: "Primera rutina completada" (complete any routine once), "Racha de 7 dias" (7 consecutive applicable days on any routine), "Semana perfecta" (100% completion on all applicable routines in a week), "Racha de 30 dias" (30 consecutive applicable days on any routine), "Primer mes" (at least one completion in 30 different days).

#### Scenario: First completion badge
- **WHEN** the user completes any routine for the first time
- **THEN** the "Primera rutina completada" badge is unlocked

#### Scenario: Perfect week badge
- **WHEN** the user completes all applicable routines every applicable day in a calendar week (Monday to Sunday)
- **THEN** the "Semana perfecta" badge is unlocked

### Requirement: Badges computed from existing data
The system SHALL compute badge status from completion records and routine data at render time without storing badge state separately.

#### Scenario: Badge recalculation after undo
- **WHEN** the user had a 7-day streak and undoes today's completion breaking the streak
- **THEN** the "Racha de 7 dias" badge remains unlocked if it was achieved at any point in history (based on best streak)

### Requirement: Badge display in UI
The system SHALL display badges in a dedicated section accessible from the navigation, showing unlocked badges prominently and locked badges with progress hints.

#### Scenario: Navigate to badges
- **WHEN** the user clicks "Logros" in the navigation
- **THEN** the system displays all badges with unlocked ones highlighted and locked ones grayed out with unlock criteria
