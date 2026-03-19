# Daily View (Unified)

## Requirements

### REQ-1: Display Today's Routines
- Show only routines that apply to the current day (via `appliesToDay`)
- Order by startTime ascending; unscheduled routines at the bottom in a separate section

### REQ-2: Time Display
- Show time gutter with startTime-endTime for scheduled routines
- Show only startTime if no endTime is set

### REQ-3: Current Time Indicator
- Show a horizontal line at the current time position in the list
- Update position in real-time (every minute)

### REQ-4: Completion Toggle
- Each routine has a clickable circle to mark as completed/uncompleted for today
- Completed routines show a filled/checked circle and visual distinction (strikethrough or opacity)

### REQ-5: Progress Counter
- Show "N/M" in the header (completed / total applicable today)

### REQ-6: All Complete Message
- Show congratulatory message when all routines for today are completed

### REQ-7: Unscheduled Section
- Routines without startTime appear under "Sin hora asignada" heading

### REQ-8: Empty State
- Show a message when no routines apply to today
