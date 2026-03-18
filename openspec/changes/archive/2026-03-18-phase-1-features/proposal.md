## Why

La app actualmente solo soporta rutinas diarias, no tiene forma de medir progreso hacia metas, y carece de mecanismos de motivación. Para ser realmente útil en el día a día, necesita: rutinas con frecuencias flexibles (no solo diarias), reportes simples para ver si se cumplen las metas, y badges que motiven la consistencia.

## What Changes

- **BREAKING**: El campo `frequency` de `Routine` cambia de `'daily'` a un tipo que soporta `'daily' | 'weekdays' | { days: number[] }`
- Nueva lógica para determinar si una rutina "aplica hoy" según su frecuencia
- Cálculo de rachas adaptado a frecuencias no-diarias (días que aplicaba y se completó)
- Nuevo sistema de reportes: resumen semanal, tendencia de 30 días, progreso por rutina con meta opcional
- Nuevo sistema de badges/logros basado en reglas sobre datos existentes
- La agenda y el check-in solo muestran rutinas que aplican al día actual
- Las estadísticas se adaptan para considerar solo días aplicables

## Capabilities

### New Capabilities
- `flexible-frequency`: Sistema de frecuencias para rutinas — daily, weekdays (L-V), o custom con días específicos de la semana. Incluye lógica para determinar si una rutina aplica en un día dado.
- `reports`: Reportes de progreso — resumen semanal con comparativa, tendencia de cumplimiento a 30 días, barra de progreso por rutina con meta opcional configurable.
- `badges`: Sistema de logros/badges — reglas predefinidas que se evalúan sobre datos de completado (ej. "7 días seguidos", "semana perfecta", "primer mes").

### Modified Capabilities
- `routine-management`: El campo frequency se extiende para soportar weekdays y custom days. El formulario de creación/edición incluye selector de frecuencia.
- `daily-checkin`: Solo muestra rutinas que aplican al día actual según su frecuencia.
- `daily-agenda`: Solo muestra rutinas que aplican al día actual según su frecuencia.
- `progress-tracking`: Las rachas se calculan considerando solo días donde la rutina aplicaba. Las estadísticas se basan en días aplicables, no días totales.

## Impact

- **Types**: `Routine.frequency` cambia de `'daily'` a tipo union más amplio
- **Utils**: Nueva función `appliesToday(routine, date)`, adaptación de streak calculation
- **Components**: RoutineForm (selector frecuencia), DailyCheckin/DailyAgenda (filtro por día), Stats (adaptación), nueva vista Reports, nuevo componente Badges
- **Storage**: Migración de rutinas existentes (`'daily'` sigue funcionando como antes)
