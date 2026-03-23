## 1. Create Unified DailyView Component

- [x] 1.1 Create `components/DailyView/DailyView.tsx` combining DailyAgenda layout + DailyCheckin toggle/progress
- [x] 1.2 Create `components/DailyView/DailyView.module.css` merging styles from both components
- [x] 1.3 Include: time gutter, completion toggle circles, progress counter (N/M), current time indicator, unscheduled section, all-complete message, empty state

## 2. Add Route and Navigation

- [x] 2.1 Create `app/hoy/page.tsx` with DailyView component
- [x] 2.2 Update Navigation: remove "Agenda" and "Check-in" links, add single "Hoy" link pointing to `/hoy`

## 3. Update Dashboard References

- [x] 3.1 Update Dashboard quick check-in link from `/checkin` to `/hoy` (N/A — Dashboard uses inline toggle, no link)

## 4. Remove Old Components

- [x] 4.1 Delete `components/DailyAgenda/` directory
- [x] 4.2 Delete `components/DailyCheckin/` directory
- [x] 4.3 Delete `app/agenda/` directory
- [x] 4.4 Delete `app/checkin/` directory

## 5. Verification

- [x] 5.1 Build project and verify no TypeScript errors or broken imports
- [x] 5.2 Verify `/hoy` shows routines with time, toggle, progress counter, and current time indicator
