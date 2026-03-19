## Context

Currently the app has two views for today's routines: Agenda (time blocks + current time indicator) and Check-in (completion toggle + progress). They show the same data in almost the same layout. We merge them into one "Hoy" view.

## Goals / Non-Goals

**Goals:**
- Single "Hoy" view with all functionality from both views
- Clean removal of dead code (old components, routes, pages)
- Navigation simplified (2 links → 1)

**Non-Goals:**
- Redesigning the visual layout (keep existing styles, just combine)
- Adding new features beyond what both views already have

## Decisions

**Component name:** `DailyView` at `components/DailyView/DailyView.tsx`. Takes the best from both existing components.

**Route:** `/hoy` — short, clear, Spanish consistent with the app.

**Layout structure:**
```
┌─────────────────────────────────────────┐
│  Hoy                              4/9   │  ← title + progress counter
├─────────────────────────────────────────┤
│  ○  06:00-06:10   Kefir        General  │  ← toggle + time + name + category
│  ○  06:00-06:30   Ejercicios   General  │
│  ──── 11:08 ─────────────────────────── │  ← current time indicator
│  ○  13:00-15:00   Gym          General  │
│  ...                                    │
├─────────────────────────────────────────┤
│  Sin hora asignada                      │  ← unscheduled section
│  ○  Rutina sin hora            General  │
├─────────────────────────────────────────┤
│  🎉 Todas las rutinas completadas!      │  ← when all done
└─────────────────────────────────────────┘
```

**CSS:** Start from DailyAgenda's CSS module (has time gutter styling), add the toggle circle from DailyCheckin's CSS.

**Migration approach:** Create new component first, then remove old ones and update routes/navigation in one pass.

## Risks / Trade-offs

- Removing two components at once — straightforward since the new one replaces both completely.
- Any code that references `/agenda` or `/checkin` directly (bookmarks, etc.) will break — acceptable for a personal app.
