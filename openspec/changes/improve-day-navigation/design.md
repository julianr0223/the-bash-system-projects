## Context

`DailyView` ya tiene un sub-componente interno `Header` (introducido en `view-past-days`) con flechas ← →. Este change reemplaza ese bloque por un control más rico, sin tocar el resto de `DailyView`.

## Goals / Non-Goals

**Goals:**
- Saltar a cualquier día pasado en un click.
- Volver a hoy en un click desde cualquier día.
- Cero dependencias nuevas — usar el `<input type="date">` nativo.

**Non-Goals:**
- Calendar picker custom (Opción C descartada).
- Tira visual de últimos 7 días (Opción B, posible follow-up).
- Indicadores visuales de qué días tienen completions dentro del picker.

## Decisions

### 1. Componente dedicado `DayNavigator`

Extraer el bloque de navegación a `components/DailyView/DayNavigator.tsx` para no inflar `DailyView` y poder testear/iterar el control aparte. Recibe `targetDate`, `today`, `readOnly` y nada más; emite navegación via `<Link>` (Next router) — no maneja estado.

### 2. `<input type="date">` nativo

```tsx
<input
  type="date"
  value={targetDate}
  max={today}
  onChange={(e) => router.push(e.target.value === today ? '/hoy' : `/dia/${e.target.value}`)}
/>
```

- `max={today}` impide selección de fechas futuras a nivel UI nativo.
- Si el usuario escoge hoy, ruteamos a `/hoy` para mantener la URL canónica.
- Para saltar de `/hoy` a un día pasado: el mismo input pero `value={today}`.

Alternativa descartada: librería de date picker (react-day-picker, etc.) — agrega bundle y complejidad sin valor para esta iteración.

### 3. Layout del header

```
[← día anterior]   [📅 lunes, 6 abr 2026]   [día siguiente →]
                          [Hoy]
```

O en una sola línea en desktop:
```
[←]   [📅 lunes, 6 abr 2026]   [→]   [Hoy]
```

El input nativo ocupa el lugar de la fecha legible — pero tiene chrome del browser. Para no perder estética, lo envolvemos en un wrapper visual (label estilizado) y dejamos el input `position: absolute` ocupando el área clicable. Patrón estándar.

### 4. Botón "Hoy"

- Siempre visible cuando `!isToday`.
- Cuando `isToday`, no se renderiza (no necesario en `/hoy`).
- Estilo: pill discreta, color `var(--color-primary)`.

### 5. Comportamiento del "día siguiente →"

- Si `nextDate < today`: link a `/dia/{nextDate}`.
- Si `nextDate === today`: link a `/hoy`.
- Nunca pasa de hoy.

(Comportamiento ya implementado en `view-past-days`, se preserva.)

## Risks / Trade-offs

- **[Estética del input nativo varía por navegador]** → Mitigado envolviéndolo en un label estilizado con el input invisible encima. La parte visible es nuestra; el picker que se abre es nativo.
- **[Mobile keyboard/picker accesible]** → `<input type="date">` en iOS/Android abre el picker nativo del SO, óptimo para móvil.
- **[Accesibilidad]** → El input es semánticamente correcto y accesible por defecto. El label envolvente preserva el click target.
