## Context

Daily Routine Tracker es una app Next.js con CSS Modules, sin Tailwind ni librerías UI. Usa una paleta indigo genérica, cards planas, y una nav horizontal que colapsa mal en mobile. El redesign busca una identidad visual "Grove" — cálida, natural, motivacional.

## Goals / Non-Goals

**Goals:**
- Crear paleta "Grove" con teal/amber/sage que transmita wellness
- Implementar design tokens consistentes (spacing, typography, shadows)
- Navegación dual: frosted glass top bar (desktop) + bottom tabs (mobile)
- Cards con profundidad (shadows) en lugar de borders planos
- SVG progress ring en Dashboard
- Micro-animaciones CSS para feedback visual
- Heatmap con colores teal responsive a dark mode
- Mantener soporte light/dark mode completo

**Non-Goals:**
- Migrar a Tailwind o agregar librerías UI
- Cambiar estructura de componentes o rutas
- Modificar API routes o lógica de backend
- Agregar nuevas features funcionales
- Usar librerías de animación JS

## Decisions

### 1. Paleta "Grove" con teal primario y amber para achievements
**Decisión**: Teal (#0d9488) como primary, amber (#d97706) como accent para streaks/badges, sage para fondos/textos.
**Alternativa**: Mantener indigo con variaciones — descartada porque no transmite wellness.
**Rationale**: Teal evoca calma y bienestar, amber evoca logro y energía. Juntos crean una identidad única para una app de rutinas.

### 2. Navegación CSS-only dual (sin JS media query hooks)
**Decisión**: Dos bloques DOM (`.navDesktop` y `.navMobile`), visibilidad controlada por `display: none` en media queries.
**Alternativa**: Hook `useMediaQuery` en JS — descartada por posibles problemas de hydration mismatch en SSR.

### 3. SVG inline para progress ring
**Decisión**: Dos elementos `<circle>` SVG con `stroke-dasharray`/`stroke-dashoffset` para mostrar progreso.
**Alternativa**: Librería como `react-circular-progressbar` — descartada por ser una dependencia innecesaria para algo simple.

### 4. Animaciones CSS-only con keyframes en globals.css
**Decisión**: Definir keyframes reutilizables en `globals.css`, referenciar en `.module.css`.
**Alternativa**: Framer Motion — descartada por ser una dependencia pesada para micro-animaciones simples.

### 5. Category-to-color mapping como constante JS
**Decisión**: Objeto simple en los componentes que lo necesitan: `{ Salud: "#ef4444", Ejercicio: "#f59e0b", ... }`.
**Rationale**: Sin necesidad de un sistema complejo; 6 categorías fijas.

## Risks / Trade-offs

- **[Regresión dark mode]** → Cada nueva CSS variable DEBE tener contraparte dark mode. Verificar componente por componente.
- **[Bottom nav padding]** → El `<main>` necesita `padding-bottom` en mobile para no quedar oculto bajo la bottom bar. Mitigación: media query en providers.tsx.
- **[Breakpoint consistency]** → Actual usa 600px, nuevo propone 768px. Decisión: usar 768px como breakpoint principal para nav, mantener 600px para ajustes menores dentro de componentes.
- **[Performance de animations]** → Solo animar `transform` y `opacity` (propiedades GPU-accelerated). Evitar animar `width`, `height`, `margin`.
