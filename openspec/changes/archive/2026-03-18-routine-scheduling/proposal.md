## Why

Actualmente las rutinas no tienen horario asociado — solo se marcan como "hechas" o "pendientes". Los usuarios necesitan planificar su día con horarios específicos (ej. "Meditar 8:00-8:30", "Ejercicio 7:00-7:45") y ver una agenda diaria organizada cronológicamente, como un calendario de día.

## What Changes

- **BREAKING**: Se agregan campos `startTime` y `endTime` (opcionales) al modelo `Routine`
- Nueva vista de agenda diaria que muestra rutinas organizadas por horario
- El formulario de creación/edición de rutinas incluye selectores de hora inicio/fin
- Las rutinas sin horario se muestran al final de la agenda como "Sin hora asignada"
- La vista de check-in diario respeta el orden cronológico por horario

## Capabilities

### New Capabilities
- `daily-agenda`: Vista de agenda diaria que muestra las rutinas organizadas por bloques de tiempo, con hora de inicio y fin, similar a un calendario de día

### Modified Capabilities
- `routine-management`: Se agregan campos opcionales `startTime` y `endTime` al modelo de rutina y al formulario de creación/edición
- `daily-checkin`: Las rutinas se ordenan por hora de inicio (las que tienen horario primero, luego las sin horario)

## Impact

- **Types**: Se extiende la interfaz `Routine` con `startTime?: string` y `endTime?: string`
- **Storage**: Migración de datos existentes (rutinas sin horario siguen funcionando)
- **Components**: RoutineForm, RoutineList, DailyCheckin se modifican; nueva vista DailyAgenda
- **Routing**: Se agrega nueva ruta `/agenda`
- **Navigation**: Se agrega enlace "Agenda" al nav
