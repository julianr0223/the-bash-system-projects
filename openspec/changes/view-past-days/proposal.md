## Why

La vista `/hoy` solo muestra el día actual y permite togglear completions. No hay forma de revisar cómo quedó un día pasado: cuántas rutinas se completaron, cuáles sí y cuáles no. Esto limita la introspección sobre el progreso y la capacidad de revisar rachas o entender huecos.

## What Changes

- Nueva ruta `/dia/[date]` (formato `YYYY-MM-DD`) que renderiza la vista de un día específico en **modo lectura**.
- Reutilizar `<DailyView />` (o un wrapper de él) en modo `readOnly`: sin `onToggle`, sin `TimeMarker`, sin estilo de "isPast", mostrando exactamente las rutinas que aplicaban a esa fecha y cuáles se completaron.
- Navegación entre días: botones "← día anterior" y "día siguiente →" (deshabilitado para fechas futuras).
- Acceso desde la vista `/hoy`: un link/botón "Ver días anteriores" que lleva al día de ayer por defecto.
- Validación: fechas futuras redirigen a `/hoy`; fechas inválidas muestran 404.

## Capabilities

### New Capabilities
- `past-day-view`: Vista read-only de un día pasado mostrando rutinas que aplicaban y su estado de completitud.

### Modified Capabilities
- `daily-view`: el componente acepta un modo read-only y una fecha arbitraria, no solo "hoy".

## Impact

- **Frontend**: nueva ruta `app/dia/[date]/page.tsx`, refactor leve de `DailyView` para parametrizar fecha y modo.
- **API**: ningún endpoint nuevo — `GET /api/completions` ya retorna todos los completions del usuario y se puede filtrar en cliente.
- **Navegación**: link nuevo en `/hoy` o en el menú.
- **Sin cambios en DB**.
