## Context

`components/RoutineList/RoutineList.tsx` itera el array `routines` tal como llega del prop (orden de inserción en DB = orden de creación). Cada `Routine` ya expone `startTime?: string` / `endTime?: string` en formato `HH:mm` (ver `types/index.ts`). El grid CSS actual agrupa por `category` pero no ordena dentro del grupo.

`app/routines/page.tsx` es el host: no hay state de vista — renderiza `<RoutineList>` directamente. La categoría-color ya existe parcialmente en el design system Grove (`ux-redesign-modern`), que expone clases/colores por categoría que podemos reutilizar.

No hay librerías de calendario en `package.json` y la constraint es no agregar dependencias pesadas por un solo componente.

## Goals / Non-Goals

**Goals:**
- Ordenar la lista dentro de cada categoría por `startTime` ascendente (fallback a `name`).
- Agregar toggle Lista/Calendario en `/routines` con persistencia en `localStorage`.
- Nueva vista Calendario: grilla 24h en una columna, bloques posicionados por hora, color por categoría, solape lado-a-lado, sección "Sin horario" al pie.
- Click en bloque → abre el mismo `RoutineForm` que la lista.

**Non-Goals:**
- Drag & resize de bloques en el calendario (existe editor interactivo en `/hoy`; no se duplica acá). Solo click-to-edit.
- Vista semanal o multi-día. Este change es solo vista diaria.
- Cambiar el modelo de datos (`Routine` ya tiene `startTime`/`endTime`).
- Integrar con la vista `/hoy` o cambiar el orden allí.
- Agregar librerías tipo FullCalendar, react-big-calendar.

## Decisions

### Ordenamiento en cliente (no en backend)
**Decisión**: Ordenar con `Array.prototype.sort` dentro del componente, después del `reduce` por categoría.

**Alternativa**: Agregar `ORDER BY start_time` en el storage layer. Descartado — el orden es una preocupación de presentación y puede variar por vista; mantener el storage agnóstico evita acoplamiento y duplicar lógica cuando agreguemos más vistas.

**Implementación**: Comparador que ponga `startTime` undefined al final y desempate por `name`:
```ts
(a, b) => {
  if (!a.startTime && !b.startTime) return a.name.localeCompare(b.name);
  if (!a.startTime) return 1;
  if (!b.startTime) return -1;
  return a.startTime.localeCompare(b.startTime) || a.name.localeCompare(b.name);
}
```
`HH:mm` es lexicográficamente ordenable, no hace falta parsear.

### Toggle de vista: estado en el page, persistencia en localStorage
**Decisión**: `app/routines/page.tsx` gestiona el state `viewMode: 'list' | 'calendar'`, se inicializa vía `useEffect` leyendo `localStorage.getItem('routinesViewMode')`.

**Por qué en el page y no en `RoutineList`**: El toggle afecta *qué* componente renderizar (Lista vs. Calendario). `RoutineList` sigue siendo solo-lista; el nuevo `RoutineCalendar` es hermano. El page es el único lugar donde ambos conviven.

**Por qué `useEffect` + no SSR**: localStorage no existe en server. Render inicial = Lista (default) para evitar flash/mismatch; luego `useEffect` corrige si el usuario tenía 'calendar' guardado. Alternativa (leer cookie en server) es overkill para una preferencia puramente visual.

### Grilla de calendario: CSS grid con filas de 15 min
**Decisión**: Grilla de 96 filas (24h × 4 slots de 15 min) con `display: grid; grid-template-rows: repeat(96, 1fr)`. Cada bloque usa `grid-row-start` y `grid-row-end` calculados desde `startTime`/`endTime`.

**Por qué 15 min**: granularidad suficiente para horarios comunes (07:30, 18:45). Ir a 5 min triplica la grilla sin ganancia perceptible.

**Ventana visible**: Mostrar solo 05:00-23:00 por default (la banda "útil"); el resto colapsable bajo un "Ver 24h completo". Evita pantalla vacía. Si hay rutinas fuera de 05:00-23:00 (como Gelatina 05:45 está justo al borde), se expande automáticamente para cubrirlas.

**Alternativa descartada**: Posicionamiento absoluto con `top: ${minutesFromMidnight * pxPerMin}`. Funciona pero es más frágil con responsive y solapes; CSS grid maneja colisiones con `grid-column`.

### Solape: columnas auto-asignadas
**Decisión**: Para cada rutina, calcular un `laneIndex` (0, 1, 2...) por "grupo de solape" (rutinas cuyos rangos se tocan). Asignar `grid-column: ${laneIndex + 1}` dentro de un subgrid de N columnas, donde N = máximo de solapes en ese grupo.

**Algoritmo**: Ordenar por `startTime`, recorrer asignando la primera lane libre (la última rutina en esa lane terminó antes del `startTime` actual). O(n log n).

**Trade-off**: Para 2+ solapes el bloque se hace más angosto. Es preferible a tapar bloques.

### Rutinas sin `endTime`: altura mínima fija
**Decisión**: Si `endTime` es `undefined`, tratar como bloque de 15 min (1 fila de grilla). Es un marcador, no una duración real.

**Alternativa**: Pedir `endTime` obligatorio. Descartado — muchas rutinas son instantáneas ("Tomar medicamento colesterol 19:00") y forzar un fin es ruido UX.

### Color por categoría
**Decisión**: Reutilizar el mapping de color-por-categoría ya existente del design system Grove (ver `components/RoutineList/RoutineList.module.css` si expone CSS var de categoría, o crear un util `categoryColor(category: string)` que retorne un hex/var). Un solo source of truth.

**Verificación pendiente antes de implementar**: buscar en el repo cómo se colorea la categoría hoy (dots, badges) y centralizarlo si aún está duplicado.

### Click-to-edit: mismo `RoutineForm` inline
**Decisión**: Estado `editingId` en `RoutineCalendar`, cuando hay editingId el componente renderiza el calendario en modo "editor abierto abajo" (patrón usado en `RoutineList`). Alternativa (modal) sería más limpia visualmente pero agrega un componente nuevo.

## Risks / Trade-offs

- **[Solape denso puede hacer bloques ilegibles]** → Mitigación: max 3 lanes visibles; resto se apila en un "+N más" clickeable. Implementar solo si pasa; por ahora confiar en que el usuario no tiene 4+ rutinas solapadas.
- **[Rutinas con frequency ≠ daily en calendario de día "hoy"]** → La vista es conceptualmente "todas las rutinas", no "rutinas de hoy". No filtrar por día. Una rutina L-V aparece igual que una diaria; si es confuso, marcar con badge de frecuencia como ya se hace en la lista.
- **[LocalStorage vacío en SSR causa hydration mismatch]** → Mitigación: inicializar siempre en `'list'` y sincronizar en `useEffect`. Un flash de lista→calendario es aceptable y raro (solo primer render post-carga).
- **[Bloque corto (< 15 min) visual casi invisible]** → Mitigación: altura mínima en CSS (`min-height: 28px`) aunque matemáticamente ocupe menos.

## Migration Plan

No hay migración. Cambio puramente de UI en cliente. Rollback = revertir commits.
