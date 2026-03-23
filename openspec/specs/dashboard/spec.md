## ADDED Requirements

### Requirement: Dashboard shows today's status
The system SHALL display a dashboard as the main view showing the current day's routine status at a glance.

#### Scenario: View dashboard with mixed status
- **WHEN** the user has 6 routines, 3 completed and 3 pending
- **THEN** the dashboard displays a progress indicator (e.g., "3/6") and lists pending routines prominently

#### Scenario: View dashboard with all complete
- **WHEN** the user has completed all routines for the day
- **THEN** the dashboard displays a full completion indicator

### Requirement: Activity calendar heatmap
The system SHALL display a calendar heatmap (similar to GitHub contributions) showing daily completion levels over time.

#### Scenario: View heatmap with varied activity
- **WHEN** the user has varying completion levels across days (some days 100%, some 50%, some 0%)
- **THEN** the heatmap displays cells with color intensity proportional to the completion percentage for each day

#### Scenario: Hover on calendar day
- **WHEN** the user hovers over a day cell in the heatmap
- **THEN** a tooltip displays the date and completion details (e.g., "March 15 — 4/6 routines completed")

### Requirement: Quick check-in from dashboard
The system SHALL allow users to navigate to the daily view (`/hoy`) from the dashboard for quick check-in.

#### Scenario: Quick check-in link
- **WHEN** the user clicks the quick check-in link on the dashboard
- **THEN** the user is navigated to `/hoy` where they can mark routines as completed

### Requirement: Dashboard displays top streaks
The system SHALL show the top active streaks on the dashboard to motivate the user.

#### Scenario: Display active streaks
- **WHEN** the user has routines with active streaks
- **THEN** the dashboard displays the top 3 longest active streaks with routine name and streak count
