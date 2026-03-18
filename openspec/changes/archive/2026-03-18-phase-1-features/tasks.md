## 1. Frequency Data Model

- [x] 1.1 Update Routine type: change `frequency` from `'daily'` to `'daily' | 'weekdays' | { days: number[] }`, add `goal?: number`
- [x] 1.2 Create `appliesToDay(frequency, date): boolean` utility function
- [x] 1.3 Create `getApplicableDaysPerWeek(frequency): number` helper
- [x] 1.4 Create `formatFrequency(frequency): string` for display labels (e.g., "L-V", "L, M, V")
- [x] 1.5 Update `createRoutine` and `updateRoutine` to handle new frequency type and goal

## 2. Frequency-Aware Streaks

- [x] 2.1 Update `calculateCurrentStreak` to skip non-applicable days
- [x] 2.2 Update `calculateBestStreak` to skip non-applicable days

## 3. Routine Form Update

- [x] 3.1 Add frequency selector to RoutineForm (daily / weekdays / custom)
- [x] 3.2 Add custom days picker (checkboxes for L, M, X, J, V, S, D) shown when "custom" is selected
- [x] 3.3 Add goal input (optional number field) with validation against applicable days per week
- [x] 3.4 Update RoutineForm onSubmit to include frequency and goal

## 4. Filter Views by Frequency

- [x] 4.1 Update DailyCheckin to filter routines by `appliesToDay` for current date
- [x] 4.2 Update DailyAgenda to filter routines by `appliesToDay` for current date
- [x] 4.3 Add frequency label display in DailyCheckin items
- [x] 4.4 Update Dashboard to only count applicable routines for today's progress

## 5. Reports

- [x] 5.1 Create Reports component with weekly summary (this week vs last week)
- [x] 5.2 Add 30-day trend visualization (simple bar chart with CSS)
- [x] 5.3 Add per-routine weekly progress bars with goal comparison
- [x] 5.4 Ensure all report calculations use `appliesToDay` for accuracy
- [x] 5.5 Style Reports page with CSS Modules

## 6. Badges

- [x] 6.1 Define badge rules array with id, name, description, and condition function
- [x] 6.2 Create badge evaluation logic using completions and routines data
- [x] 6.3 Build Badges component showing unlocked (highlighted) and locked (grayed) badges
- [x] 6.4 Style Badges page with CSS Modules

## 7. Navigation & Routing

- [x] 7.1 Add `/reports` route pointing to Reports component
- [x] 7.2 Add `/badges` route pointing to Badges component
- [x] 7.3 Add "Reportes" and "Logros" links to Navigation
- [x] 7.4 Pass required props to new routes in App.tsx

## 8. Stats Update

- [x] 8.1 Update Stats component to use `appliesToDay` for daily/weekly calculations

## 9. Verification

- [x] 9.1 Build project and verify no TypeScript errors
- [x] 9.2 Test: create routine with weekdays frequency, verify it hides on weekend in checkin/agenda
- [x] 9.3 Test: verify badges evaluate correctly
