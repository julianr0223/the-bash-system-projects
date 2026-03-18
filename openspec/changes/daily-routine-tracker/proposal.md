## Why

No existe una herramienta simple y enfocada para dar seguimiento a rutinas diarias. Las apps de TODO tradicionales están diseñadas para tareas únicas, no para hábitos recurrentes. Los usuarios necesitan una forma de definir rutinas, marcarlas como completadas cada día, y visualizar su consistencia a lo largo del tiempo.

## What Changes

- Nueva aplicación web para tracking de rutinas diarias
- Gestión de rutinas: crear, editar, eliminar y organizar rutinas recurrentes
- Check-in diario: marcar rutinas como completadas cada día
- Historial y racha: visualizar el cumplimiento de rutinas a lo largo del tiempo
- Vista de calendario/dashboard para ver el progreso general

## Capabilities

### New Capabilities
- `routine-management`: CRUD de rutinas diarias — crear, editar, eliminar y listar rutinas con nombre, descripción, frecuencia y categoría
- `daily-checkin`: Sistema de check-in diario para marcar rutinas como completadas, con reset automático cada día
- `progress-tracking`: Historial de cumplimiento, rachas (streaks), y estadísticas de consistencia por rutina y global
- `dashboard`: Vista principal con el estado del día actual, resumen de progreso y calendario de actividad

### Modified Capabilities
<!-- No existing capabilities to modify — this is a new application -->

## Impact

- **Frontend**: Nueva aplicación web (SPA) con componentes de UI para gestión de rutinas, check-in y visualización de progreso
- **Backend/Storage**: Persistencia de datos de rutinas y registros de completado (puede ser local storage inicialmente, con opción de backend futuro)
- **Dependencias**: Framework frontend (por definir en design), librería de calendario/visualización
