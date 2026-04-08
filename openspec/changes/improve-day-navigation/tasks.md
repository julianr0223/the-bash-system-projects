## 1. Componente DayNavigator

- [x] 1.1 Crear `daily-routine-tracker/components/DailyView/DayNavigator.tsx` que reciba `targetDate: string`, `today: string` y renderice: flecha ← (a `/dia/{prev}`), date picker nativo envuelto en un label estilizado con la fecha legible visible, flecha → (a `/dia/{next}` o `/hoy`), y botón "Hoy" cuando `targetDate !== today`.
- [x] 1.2 Crear `DayNavigator.module.css` con estilos para el wrapper, el label clicable, las flechas y el botón Hoy. El input nativo debe estar oculto visualmente pero seguir siendo clicable (`opacity: 0; position: absolute; inset: 0`).
- [x] 1.3 En el `onChange` del input: si el valor seleccionado es hoy → `router.push('/hoy')`, sino → `router.push('/dia/${value}')`. Usar `useRouter` de `next/navigation`.
- [x] 1.4 Aplicar `max={today}` al input para bloquear fechas futuras a nivel UI.

## 2. Integración en DailyView

- [x] 2.1 Reemplazar el bloque de header de `DailyView.tsx` (los Link manuales de "← Día anterior", "Día siguiente →", "Ver días anteriores") por `<DayNavigator targetDate={targetDate} today={today} />`.
- [x] 2.2 Mantener el `<h2>` con el título y el contador `completedCount/totalCount` arriba del navigator.
- [x] 2.3 Verificar que `DayNavigator` se renderice tanto en `/hoy` (sin botón Hoy, solo picker) como en `/dia/[date]` (con botón Hoy y flechas).

## 3. Verificación

- [x] 3.1 `npm run build` compila sin errores.
- [ ] 3.2 Probar manualmente: en `/hoy`, abrir el picker y saltar a una fecha pasada; en `/dia/[date]`, usar flechas, abrir el picker, click en "Hoy"; verificar que el picker no permite fechas futuras y que seleccionar hoy en el picker lleva a `/hoy`.
