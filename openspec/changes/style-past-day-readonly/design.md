## Context

`DailyView` ya acepta un prop `readOnly`. Actualmente solo lo usa para renderizar los bloques como `<div>` en vez de `<button>` y omitir el `TimeMarker`. El estilo visual es idéntico a `/hoy`, lo cual confunde al usuario.

## Goals / Non-Goals

**Goals:**
- El usuario distingue de un vistazo que está viendo un día pasado.
- El contenido sigue siendo perfectamente legible.
- Completions del pasado se distinguen claramente de tareas no completadas.

**Non-Goals:**
- Rediseñar la vista desde cero.
- Cambiar el layout o la estructura de información.
- Introducir iconografía nueva que requiera fuentes o librerías.

## Decisions

### 1. Modificador `readOnly` en CSS

Agregar un className raíz `containerReadOnly` al `<div className={styles.container}>` cuando `readOnly`. Todas las reglas nuevas se cuelgan de ese selector:

```css
.containerReadOnly .block { ... }
.containerReadOnly .checkbox { ... }
```

Ventaja: cero cambios en los classNames de los hijos, toda la diferenciación vive colocalizada al final del archivo CSS.

### 2. Tratamiento visual

- **Contenedor**: sutilmente desaturado — `filter: grayscale(0.15)` o reducción de saturación via opacity del background. Opto por un background de contenedor `var(--color-bg-subtle)` y borde punteado suave arriba/abajo para delimitar visualmente que es "otra cosa".
- **Bloques**: fondo ligeramente distinto (`var(--color-bg-subtle)` en vez de `var(--color-surface)`), **sin** `box-shadow`, **sin** transform en hover (no hay hover real).
- **Checkbox vacía**: borde más tenue, sin el énfasis actual.
- **Checkbox completada**: se mantiene con el color verde — es la info importante del histórico, no la queremos apagar.
- **Bloques completados**: se mantiene el `blockDone` actual (texto tachado) porque comunica "esto sí se hizo".
- **Cursor**: `default` en los bloques (no `pointer`), ya lo aplicamos inline, lo movemos al CSS.

### 3. Indicador "solo lectura" en el header

Agregar un badge pequeño junto al título cuando `readOnly`:

```tsx
{readOnly && <span className={styles.readOnlyBadge}>Solo lectura</span>}
```

Estilo: pill pequeña, fondo `var(--color-bg-subtle)`, texto `var(--color-text-tertiary)`, font-size `var(--text-xs)`. Ubicada al lado del `<h2>` con la fecha.

Alternativa descartada: icono de candado unicode `🔒`. Menos predecible cross-platform y puede chocar con el emoji del picker.

### 4. Respetar el layout en mobile

El badge se envuelve junto al título en pantallas angostas. Usar `flex-wrap` en el `.header` (ya lo tiene `align-items: baseline`, solo agregar `flex-wrap: wrap; gap: var(--space-2)`).

## Risks / Trade-offs

- **[Un badge de "Solo lectura" podría ser redundante con la fecha legible y el botón "Hoy"]** → Aceptable: la redundancia es por diseño — el usuario reforzado entiende más rápido. Además, el badge es discreto.
- **[Desaturar puede reducir accesibilidad]** → Mitigado: no bajamos contraste del texto principal, solo el del fondo y los bordes. Los estados "completado" mantienen el verde a contraste normal.
