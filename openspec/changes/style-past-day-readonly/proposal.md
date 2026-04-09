## Why

La vista de días anteriores (`/dia/[date]`) usa los mismos estilos que `/hoy`: cards con sombra, hover con elevación, cursor pointer. Visualmente no hay forma de distinguir un día pasado (read-only, histórico) del día actual (editable, vivo). El usuario puede intentar interactuar esperando poder marcar completions y no entender por qué no pasa nada.

## What Changes

- Aplicar un tratamiento visual diferenciador al modo `readOnly` de `DailyView`:
  - Bloques con fondo más apagado / menos contraste.
  - Sin hover elevado ni sombra activa.
  - Indicador visual "solo lectura" en el header (ej. un badge o icono de candado junto al título).
  - Checkboxes de rutinas no completadas con apariencia "vacía" más sutil (sin borde destacado).
- Preservar legibilidad y claridad de qué se completó y qué no.
- No afectar en nada el estilo de `/hoy`.

## Capabilities

### New Capabilities
*(ninguna)*

### Modified Capabilities
- `past-day-view`: la vista read-only tiene un tratamiento visual distinto que comunica claramente su naturaleza histórica e inmutable.

## Impact

- **Frontend**: cambios en `DailyView.module.css` (nuevas clases `readOnly*`) y en `DailyView.tsx` (aplicar las clases condicionalmente).
- **Sin cambios** en API, DB, lógica ni estructura de componentes.
