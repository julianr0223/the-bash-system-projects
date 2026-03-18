## 1. Data Model

- [ ] 1.1 Add `startTime?: string` and `endTime?: string` fields to Routine interface in types/index.ts
- [ ] 1.2 Add time format helper functions (formatTime, parseTime, isValidTimeRange) in utils/date.ts

## 2. Routine Form Update

- [ ] 2.1 Add time picker inputs (start time, end time) to RoutineForm component
- [ ] 2.2 Add validation: endTime must be after startTime when both are set
- [ ] 2.3 Allow clearing time fields to remove schedule from a routine

## 3. Routine List Update

- [ ] 3.1 Display time range (e.g., "08:00 - 08:30") next to routine name in RoutineList

## 4. Daily Check-in Update

- [ ] 4.1 Sort routines in DailyCheckin by startTime (scheduled first, then unscheduled)
- [ ] 4.2 Display time labels next to each scheduled routine in the check-in list

## 5. Daily Agenda View

- [ ] 5.1 Build DailyAgenda component with time-ordered routine blocks
- [ ] 5.2 Add "Sin hora asignada" section for unscheduled routines at the bottom
- [ ] 5.3 Add completion status indicators and toggle (click to complete/undo) in agenda
- [ ] 5.4 Add current time indicator marker in the agenda
- [ ] 5.5 Add empty state when no routines have time schedules
- [ ] 5.6 Style the agenda with CSS Modules (time gutter, blocks, responsive)

## 6. Navigation & Routing

- [ ] 6.1 Add `/agenda` route to App.tsx pointing to DailyAgenda
- [ ] 6.2 Add "Agenda" link to Navigation component
- [ ] 6.3 Pass required props (routines, completions, toggle) to DailyAgenda route

## 7. Verification

- [ ] 7.1 Build project and verify no TypeScript errors
- [ ] 7.2 Test end-to-end: create routine with time, view in agenda, complete from agenda
