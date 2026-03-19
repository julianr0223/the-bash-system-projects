## ADDED Requirements

### Requirement: User can enable browser notifications
The system SHALL allow the user to enable browser notification reminders from a settings page.

#### Scenario: Enable notifications
- **WHEN** the user clicks "Activar recordatorios" and grants browser notification permission
- **THEN** the system registers a service worker and stores the reminder preference

#### Scenario: Browser denies permission
- **WHEN** the user clicks enable but the browser denies notification permission
- **THEN** the system displays a message explaining how to enable notifications in browser settings

### Requirement: Configure reminder time
The system SHALL allow the user to set a daily reminder time (e.g., 09:00) at which a notification is shown if there are pending routines.

#### Scenario: Set reminder time
- **WHEN** the user sets the reminder time to "09:00"
- **THEN** the system stores this preference and schedules notifications at that time daily

#### Scenario: Change reminder time
- **WHEN** the user changes the reminder time from "09:00" to "20:00"
- **THEN** the system updates the schedule to the new time

### Requirement: Show notification for pending routines
The system SHALL display a browser notification at the configured time if there are uncompleted applicable routines for the day.

#### Scenario: Notification with pending routines
- **WHEN** the reminder time arrives and the user has 3 pending routines
- **THEN** a browser notification is shown with text like "Tienes 3 rutinas pendientes hoy"

#### Scenario: No notification when all complete
- **WHEN** the reminder time arrives and all applicable routines are completed
- **THEN** no notification is shown

### Requirement: Disable reminders
The system SHALL allow the user to disable reminders.

#### Scenario: Disable notifications
- **WHEN** the user clicks "Desactivar recordatorios"
- **THEN** the system stops showing notifications and clears the scheduled reminder
