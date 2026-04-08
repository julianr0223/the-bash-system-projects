## Why

La vista past-day actual (`view-past-days`) deja navegar entre días con flechas ← →, pero saltar a una fecha lejana requiere muchos clicks y no hay una forma rápida de volver al día actual desde un día arbitrario. La navegación se siente "muy básica" para introspección real del histórico.

## What Changes

- Reemplazar el header de navegación de la vista past-day por un control compacto: flechas ← →, fecha clicable que abre un date picker nativo (`<input type="date">`), y un botón **Hoy** siempre visible.
- Limitar el `max` del date picker a hoy (no permitir saltar a fechas futuras).
- Si el usuario selecciona "hoy" en el picker, navegar a `/hoy` (canonicalización).
- Aplicar el mismo control en `/hoy` (sin botón Hoy redundante, solo el picker para saltar atrás).

## Capabilities

### New Capabilities
*(ninguna)*

### Modified Capabilities
- `past-day-view`: la navegación entre días ahora incluye date picker y botón "Hoy".

## Impact

- **Frontend**: refactor del header de navegación dentro de `DailyView` (o un sub-componente nuevo `DayNavigator`).
- **Sin cambios** en API, DB, ni en el resto del componente.
