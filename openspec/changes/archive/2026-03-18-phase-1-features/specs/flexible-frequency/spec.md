## ADDED Requirements

### Requirement: Routine frequency types
The system SHALL support three frequency types for routines: daily (every day), weekdays (Monday through Friday), and custom (user-selected days of the week).

#### Scenario: Daily frequency
- **WHEN** a routine has frequency "daily"
- **THEN** the routine applies every day of the week

#### Scenario: Weekdays frequency
- **WHEN** a routine has frequency "weekdays"
- **THEN** the routine applies Monday through Friday and does not apply on Saturday or Sunday

#### Scenario: Custom frequency
- **WHEN** a routine has frequency custom with days [1, 3, 5] (Monday, Wednesday, Friday)
- **THEN** the routine applies only on Monday, Wednesday, and Friday

### Requirement: Determine if routine applies to a given day
The system SHALL provide a centralized function to determine whether a routine applies to a specific date based on its frequency.

#### Scenario: Daily routine on any day
- **WHEN** checking if a daily routine applies on a Wednesday
- **THEN** the function returns true

#### Scenario: Weekdays routine on Saturday
- **WHEN** checking if a weekdays routine applies on a Saturday
- **THEN** the function returns false

#### Scenario: Custom routine on non-selected day
- **WHEN** checking if a routine with custom days [1, 3, 5] applies on a Tuesday (day 2)
- **THEN** the function returns false

#### Scenario: Custom routine on selected day
- **WHEN** checking if a routine with custom days [1, 3, 5] applies on a Wednesday (day 3)
- **THEN** the function returns true
