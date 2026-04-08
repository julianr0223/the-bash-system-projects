## 1. Refactor DailyView

- [x] 1.1 Agregar props opcionales `date?: string` (default `getTodayString()`) y `readOnly?: boolean` (default `false`) a `components/DailyView/DailyView.tsx`.
- [x] 1.2 Reemplazar `isCompletedToday(id)` por una función genérica `isCompleted(id, date)` (puede venir como prop o derivarse de un nuevo helper en `useCompletions`).
- [x] 1.3 En modo `readOnly`: renderizar `RoutineBlock` como `<div>` (no `<button>`), no llamar `onToggle`, no mostrar `TimeMarker`, no aplicar la clase `blockPast`.
- [x] 1.4 Cuando `date !== today`, mostrar la fecha legible (ej. "Lunes 6 abr 2026") en el header en lugar de "Hoy".
- [x] 1.5 Verificar que `/hoy` sigue funcionando idéntico (sin pasar las props nuevas).

## 2. Helpers de fecha

- [x] 2.1 Asegurar que `utils/date.ts` tenga `addDays(dateStr: string, n: number): string` y `isValidDateString(s: string): boolean`. Agregarlos si no existen.
- [x] 2.2 Agregar helper `formatDateReadable(dateStr: string): string` para el header.

## 3. Ruta /dia/[date]

- [x] 3.1 Crear `app/dia/[date]/page.tsx` que valide el param, redirija a `/hoy` si la fecha es hoy o futura, devuelva 404 si es inválida, y renderice `<DailyView date={params.date} readOnly />` para fechas pasadas válidas.
- [x] 3.2 Agregar botones de navegación "← Día anterior" / "Día siguiente →" en la vista past-day, deshabilitando el siguiente cuando llegaría a hoy/futuro.

## 4. Punto de entrada desde /hoy

- [x] 4.1 Agregar un link "Ver días anteriores →" en el header de `DailyView` (solo cuando NO esté en modo readOnly) que apunte a `/dia/{yesterday}`.

## 5. Verificación

- [x] 5.1 `npm run build` compila sin errores.
- [ ] 5.2 Probar manualmente: navegar a un día pasado con completions, verificar que se ven correctamente y no se pueden modificar; navegar entre días; verificar redirect de fecha futura y de hoy.
