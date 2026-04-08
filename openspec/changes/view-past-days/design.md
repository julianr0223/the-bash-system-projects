## Context

`DailyView` actualmente está hardcoded a "hoy": llama `getTodayString()` y `getCurrentTime()`, usa `isCompletedToday(routineId)` y un `onToggle`. Para soportar días pasados, necesita parametrizar fecha y desacoplar el toggling.

`useCompletions` ya carga todos los completions del usuario, así que filtrar por fecha es trivial en cliente. `appliesToDay(routine.frequency, dateStr)` ya soporta fechas arbitrarias.

## Goals / Non-Goals

**Goals:**
- Vista read-only navegable de cualquier día pasado.
- Cero llamadas API nuevas.
- Reuso máximo de `DailyView`.

**Non-Goals:**
- Editar completions de días pasados (explícito: solo lectura).
- Calendario visual / picker de fechas (un botón ← → es suficiente para esta iteración).
- Vista de días futuros.
- Estadísticas agregadas (eso vive en `/reports` / `/stats`).

## Decisions

### 1. Parametrizar `DailyView` en lugar de duplicar

Refactor: `DailyView` recibe `date: string` y `readOnly?: boolean` como props opcionales. Default `date = getTodayString()` y `readOnly = false` para preservar el comportamiento actual de `/hoy`.

Cambios internos:
- `isCompletedToday(id)` → `isCompletedOn(id, date)` (nueva función en hook o helper que filtra por fecha).
- En `readOnly`: el `RoutineBlock` se renderiza como `<div>` (no `<button>`), sin `onToggle`, sin clase `blockPast` (no aplica el concepto "pasado" dentro de un día ya cerrado), y sin `TimeMarker`.
- Header muestra la fecha en formato legible (`Lunes 6 abr 2026`) cuando no es hoy.

Alternativa descartada: componente separado `PastDayView`. Duplicaría CSS y lógica de filtrado/sort.

### 2. Ruta dinámica `/dia/[date]`

Patrón Next.js App Router. La página:
1. Valida `params.date` con regex `^\d{4}-\d{2}-\d{2}$` y que sea fecha real.
2. Si es futura → `redirect('/hoy')`.
3. Si es hoy → `redirect('/hoy')` (canonicalización: solo una URL para hoy).
4. Si es válida y pasada → renderiza `<DailyView date={params.date} readOnly />`.

### 3. Navegación entre días

Dos botones en el header de la vista past-day:
- `← Día anterior` → `/dia/{date - 1}`
- `Día siguiente →` → `/dia/{date + 1}`, deshabilitado si `date + 1 >= today`.

Helpers `addDays(dateStr, n)` ya existe o se agrega en `utils/date.ts`.

### 4. Punto de entrada desde `/hoy`

Un link discreto en el header de `/hoy`: "Ver días anteriores →" que apunta a `/dia/{yesterday}`. No agregamos entrada al menú principal — es una funcionalidad secundaria de introspección.

### 5. Filtrado de completions por fecha

`useCompletions` expone `getCompletionsByDate(date)` (ya existe). Para `isCompletedOn(routineId, date)` agregamos un helper o lo derivamos inline desde `completions.some(c => c.routineId === id && c.date === date)`.

## Risks / Trade-offs

- **[Rutinas eliminadas]** → Si una rutina fue borrada, no aparece en la vista past-day aunque tuviera completions ese día. Aceptable: el día se ve "como quedó" relativo al estado actual de rutinas. Si se quiere histórico fiel, requeriría snapshot por día (fuera de scope).
- **[Cambio de frecuencia retroactivo]** → Si una rutina cambió de `daily` a `weekdays`, la vista past-day usa la frecuencia ACTUAL para determinar si aplicaba. Aceptable por la misma razón. Documentado como limitación conocida.
- **[Refactor de DailyView puede romper /hoy]** → Mitigado preservando defaults: sin props nuevas, comportamiento idéntico.
