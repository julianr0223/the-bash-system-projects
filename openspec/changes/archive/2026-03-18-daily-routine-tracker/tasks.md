## 1. Project Setup

- [x] 1.1 Scaffold React + TypeScript project with Vite
- [x] 1.2 Configure CSS Modules support
- [x] 1.3 Set up project folder structure (components, hooks, types, utils, storage)

## 2. Data Layer

- [x] 2.1 Define TypeScript types for Routine and CompletionRecord
- [x] 2.2 Implement localStorage service (save, load, clear) with JSON serialization
- [x] 2.3 Create routines CRUD functions (create, read, update, delete, toggleActive)
- [x] 2.4 Create completion records functions (add, remove, getByDate, getByRoutine)

## 3. Routine Management

- [x] 3.1 Build CreateRoutineForm component (name, description, category, frequency)
- [x] 3.2 Build RoutineList component with category grouping
- [x] 3.3 Build EditRoutineForm component
- [x] 3.4 Add delete routine with confirmation dialog
- [x] 3.5 Add deactivate/reactivate toggle for routines
- [x] 3.6 Implement empty state when no routines exist

## 4. Daily Check-in

- [x] 4.1 Build DailyCheckin view showing active routines with completion status
- [x] 4.2 Implement check-in button to mark routine as completed for today
- [x] 4.3 Implement undo check-in functionality
- [x] 4.4 Add visual indicator for completed vs pending routines
- [x] 4.5 Add congratulatory message when all routines are completed
- [x] 4.6 Implement automatic daily reset based on local midnight

## 5. Progress Tracking

- [x] 5.1 Implement streak calculation logic (current streak per routine)
- [x] 5.2 Implement best streak tracking per routine
- [x] 5.3 Build routine history view (calendar/list of completion dates)
- [x] 5.4 Build global statistics component (daily completion rate, weekly summary)

## 6. Dashboard

- [x] 6.1 Build main Dashboard layout with today's progress indicator
- [x] 6.2 Build activity calendar heatmap component (GitHub-style)
- [x] 6.3 Add tooltip on heatmap day hover showing completion details
- [x] 6.4 Implement quick check-in from dashboard (click to complete)
- [x] 6.5 Build top streaks display (top 3 active streaks)

## 7. Navigation & Polish

- [x] 7.1 Set up routing (Dashboard, Routines, History views)
- [x] 7.2 Build navigation bar / sidebar
- [x] 7.3 Add responsive styles for mobile and desktop
- [x] 7.4 Test full workflow end-to-end (create routine → check-in → view progress)
