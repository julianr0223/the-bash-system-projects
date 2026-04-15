## Why

La página `/routines` muestra las rutinas en orden de creación, lo cual dificulta leer el día: una rutina de las 05:45 puede aparecer al final de la lista y una de las 18:00 al principio. Además, una lista plana no transmite la densidad y los huecos del día — un formato tipo agenda/calendario hace mucho más evidente cuándo hay solape, tiempo muerto, o sobrecarga en ciertos bloques horarios.

## What Changes

- Ordenar la lista de rutinas por `startTime` ascendente dentro de cada categoría; las rutinas sin `startTime` quedan al final del grupo en orden alfabético.
- Agregar un toggle de vista en `/routines` con dos opciones: **Lista** (default, comportamiento actual pero ordenado) y **Calendario** (nueva vista tipo agenda diaria).
- Nueva vista calendario: grilla vertical de 24h con bloques posicionados según `startTime`/`endTime`, color por categoría, todas las rutinas en una sola columna.
- Sección aparte "Sin horario" debajo del calendario para rutinas sin `startTime`.
- Click sobre un bloque del calendario abre el mismo editor (`RoutineForm`) que la lista.
- Persistir la vista seleccionada en `localStorage` para que el usuario no tenga que re-elegirla cada visita.

## Capabilities

### New Capabilities
- `routines-calendar-view`: Vista tipo agenda diaria con bloques horarios por rutina, color por categoría, y manejo de rutinas sin horario.

### Modified Capabilities

## Impact

- **Código afectado**: `components/RoutineList/RoutineList.tsx` (orden + toggle), nuevo `components/RoutineCalendar/`, `app/routines/page.tsx` (hosting del toggle).
- **Sin cambios en API/backend**: El orden se calcula en cliente; el modelo `Routine` ya expone `startTime`/`endTime`.
- **Sin nuevas dependencias**: Grilla con CSS grid/flex puro, sin librerías de calendario.
- **Sin breaking changes**: Lista sigue siendo la vista default; calendario es opt-in.
