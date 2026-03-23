## Why

The Agenda and Check-in views are redundant — both show today's routines ordered by time with nearly identical layouts. The only differences are the current time indicator (Agenda only) and the completion toggle + progress counter (Check-in only). Having two separate views for the same information adds navigation clutter and confusion.

## What Changes

- **Merge** Agenda and Check-in into a single "Hoy" (Today) view that combines:
  - Time-ordered routine blocks with time gutter (from Agenda)
  - Current time indicator line (from Agenda)
  - Completion toggle circles (from Check-in)
  - Progress counter "N/M" (from Check-in)
  - Congratulatory message when all complete (from Check-in)
  - "Sin hora asignada" section for unscheduled routines (from Agenda)
- **Remove** the separate `/agenda` and `/checkin` routes
- **Remove** "Agenda" and "Check-in" navigation links, replace with single "Hoy" link
- **Remove** `DailyAgenda` and `DailyCheckin` components
- **Update** Dashboard quick check-in to link to the new unified view

## Capabilities

### New Capabilities
- `daily-view`: Unified daily view combining agenda layout with check-in functionality

### Modified Capabilities
- `daily-agenda`: **REMOVED** — merged into `daily-view`
- `daily-checkin`: **REMOVED** — merged into `daily-view`
- `dashboard`: Quick check-in links to `/hoy` instead of `/checkin`

## Impact

- Remove: `components/DailyAgenda/`, `components/DailyCheckin/`, `app/agenda/`, `app/checkin/`
- Add: `components/DailyView/`, `app/hoy/`
- Modify: Navigation component, Dashboard component
- Navigation: 2 links become 1 ("Hoy")
