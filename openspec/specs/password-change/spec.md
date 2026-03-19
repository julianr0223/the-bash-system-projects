## ADDED Requirements

### Requirement: User can change their password
The system SHALL provide an API endpoint to change the user's password after verifying the current password.

#### Scenario: Successful password change
- **WHEN** an authenticated user sends a POST to `/api/auth/change-password` with valid `currentPassword` and `newPassword` (min 6 chars)
- **THEN** the system updates the password hash, sets `must_change_password = 0`, and returns `{ success: true }`

#### Scenario: Wrong current password
- **WHEN** the user provides an incorrect `currentPassword`
- **THEN** the system returns 401 with error message

#### Scenario: New password too short
- **WHEN** the user provides a `newPassword` shorter than 6 characters
- **THEN** the system returns 400 with error message

### Requirement: Forced password change on first login
The system SHALL force users with `must_change_password = true` to change their password before accessing the application.

#### Scenario: Login with must_change_password flag
- **WHEN** a user logs in and their account has `must_change_password = 1`
- **THEN** the login response includes `mustChangePassword: true` and the client shows the password change form instead of the main app

#### Scenario: After password change completes
- **WHEN** the user successfully changes their password
- **THEN** the client transitions to `authenticated` state and shows the main application

### Requirement: Password change form with confirmation
The system SHALL display a form with current password, new password, and confirmation fields with client-side validation.

#### Scenario: Passwords do not match
- **WHEN** the user enters different values in new password and confirmation fields
- **THEN** the form shows an error and does not submit

#### Scenario: Successful form submission
- **WHEN** the user fills all fields correctly and submits
- **THEN** the form calls the change-password API endpoint
