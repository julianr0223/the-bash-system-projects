## 1. Estilos read-only

- [x] 1.1 Agregar clase `containerReadOnly` en `components/DailyView/DailyView.module.css` y aplicarla al `<div className={styles.container}>` cuando `readOnly`.
- [x] 1.2 Agregar reglas descendientes: `.containerReadOnly .block` con fondo `var(--color-bg-subtle)`, sin `box-shadow`, sin transform hover; `.containerReadOnly .checkbox` con borde más tenue; `.containerReadOnly .block` con `cursor: default`.
- [x] 1.3 Asegurar que `.containerReadOnly .blockDone` y `.containerReadOnly .checkboxDone` preservan el color verde de completado (no apagarlos).

## 2. Badge "Solo lectura"

- [x] 2.1 Agregar estilo `.readOnlyBadge` en `DailyView.module.css` (pill pequeña, font-size xs, colores muted).
- [x] 2.2 Renderizar `<span className={styles.readOnlyBadge}>Solo lectura</span>` junto al `<h2>` en el `Header` de `DailyView.tsx` solo cuando `readOnly`.
- [x] 2.3 Agregar `flex-wrap: wrap; gap: var(--space-2)` al `.header` para que el badge envuelva bien en mobile.

## 3. Limpieza

- [x] 3.1 Quitar el `style={{ cursor: 'default' }}` inline del `RoutineBlock` en modo readOnly (ahora viene del CSS).

## 4. Verificación

- [x] 4.1 `npm run build` compila sin errores.
- [ ] 4.2 Probar manualmente: navegar a `/dia/{ayer}` y verificar el tratamiento visual distinto + badge. Volver a `/hoy` y confirmar que todo se ve exactamente como antes.
