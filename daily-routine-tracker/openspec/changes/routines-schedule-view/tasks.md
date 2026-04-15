## 1. Ordenar lista por horario

- [x] 1.1 Añadir util `sortRoutinesBySchedule(routines: Routine[]): Routine[]` en `utils/` con la lógica del design (`startTime` asc, sin horario al final, desempate por `name`)
- [x] 1.2 Integrar el sort dentro de `RoutineList.tsx` aplicándolo a cada grupo de categoría después del `reduce`
- [x] 1.3 Verificar manualmente en `/routines` que las rutinas del screenshot aparecen en orden: 05:45, 06:00, 06:30, 08:00, 13:00, 15:00, 18:00, 19:00, 19:30, 21:00, 21:30

## 2. Toggle de vista Lista/Calendario

- [x] 2.1 Agregar state `viewMode: 'list' | 'calendar'` en `app/routines/page.tsx` con default `'list'`
- [x] 2.2 Sincronizar desde `localStorage.getItem('routinesViewMode')` en un `useEffect` para evitar hydration mismatch
- [x] 2.3 Persistir en `localStorage` cuando el usuario cambia de vista
- [x] 2.4 Renderizar el control toggle (segmented button) en la cabecera de `/routines`, al lado o cerca del botón "+ Nueva rutina"
- [x] 2.5 Renderizar condicionalmente `<RoutineList>` o `<RoutineCalendar>` según `viewMode`

## 3. Componente RoutineCalendar — grilla horaria

- [x] 3.1 Crear `components/RoutineCalendar/RoutineCalendar.tsx` y `.module.css`
- [x] 3.2 Props idénticas a `RoutineList` (`routines`, `onUpdate`, `onDelete`, `onToggleActive`, `onCreate`)
- [x] 3.3 Calcular rango visible: default 05:00-23:00, expandir si alguna rutina cae fuera
- [x] 3.4 Renderizar columna de labels horarias (cada hora en punto) a la izquierda de la grilla
- [x] 3.5 Renderizar grilla con `display: grid; grid-template-rows: repeat(N, 1fr)` donde N = minutos visibles / 15 *(implementado con positioning absoluto en vez de CSS grid — ver design.md)*
- [x] 3.6 Filtrar rutinas con `startTime` definido y `isActive` para la grilla; separar las de "Sin horario"

## 4. Posicionamiento de bloques y solape

- [x] 4.1 Implementar util `routineToGridRow(r: Routine, windowStart: string): { rowStart, rowEnd }` que convierte `HH:mm` a fila de grilla (15 min por fila) *(reemplazado por top/height px-based inline)*
- [x] 4.2 Bloques sin `endTime` ocupan 1 fila (15 min) mínimo
- [x] 4.3 Implementar algoritmo de lane assignment: ordenar por `startTime`, asignar a cada rutina la primera lane libre
- [x] 4.4 Aplicar `left`/`width` según lane, con N columnas = max lanes del grupo de solape
- [x] 4.5 Bloques con `min-height` CSS para legibilidad aunque la duración sea corta

## 5. Color por categoría y styling

- [x] 5.1 Auditar el repo para encontrar el mapping categoría→color actual (vars `--color-cat-*` ya existen en `globals.css`)
- [x] 5.2 Extraer util compartido `utils/categoryColor.ts` que mapea categoría → var CSS
- [x] 5.3 Aplicar `background-color` (con opacity/tono suave) y `border-left` en color sólido de categoría a cada bloque del calendario
- [x] 5.4 Nombre de rutina + rango horario visible dentro del bloque (truncar con ellipsis si el bloque es corto)

## 6. Sección "Sin horario"

- [x] 6.1 Debajo de la grilla, renderizar sección con heading "Sin horario" solo si hay rutinas sin `startTime`
- [x] 6.2 Mostrar las rutinas como chips/tarjetas compactas ordenadas alfabéticamente
- [x] 6.3 Click en chip abre el `RoutineForm` igual que los bloques

## 7. Edición desde el calendario

- [x] 7.1 State `editingId: string | null` dentro de `RoutineCalendar`
- [x] 7.2 Click en bloque set-ea `editingId`
- [x] 7.3 Cuando `editingId` no es null, renderizar `<RoutineForm initial={routine} onSubmit={...} onCancel={...} />` arriba del calendario
- [x] 7.4 Al submit, llamar `onUpdate` y limpiar `editingId`; verificar que el bloque se re-posiciona si cambió el `startTime`

## 8. Verificación E2E

- [x] 8.1 `npm run build` sin errores *(no hay script lint; TS check pasa como parte de build)*
- [x] 8.2 Correr `npm run dev` y verificar en browser: vista Lista ordenada correctamente (todas las categorías)
- [x] 8.3 Verificar toggle a Calendario: todos los bloques aparecen en sus horas, colores por categoría consistentes
- [x] 8.4 Verificar solape: caso "Sesion trabajo 2 15:00-17:00" y "Gym 13:00-15:00" no se tapan
- [x] 8.5 Verificar persistencia: cambiar a Calendario, recargar, sigue en Calendario
- [x] 8.6 Verificar edición desde bloque: click → form → cambiar hora → re-posiciona
- [x] 8.7 Verificar responsive en mobile (calendario sigue usable o degrada limpiamente)
