## Why

La app tiene un diseño funcional pero genérico: paleta indigo por defecto, cards planas con borders sin profundidad, sin micro-animaciones, y navegación rota en mobile (7 links que hacen wrap). Necesita una identidad visual propia que transmita wellness, consistencia y motivación — acorde a una app de seguimiento de rutinas/hábitos diarios.

## What Changes

- Nueva paleta de colores "Grove": teal primario, amber para logros/streaks, tonos sage/forest para fondos y textos
- Sistema de design tokens: spacing, typography, shadows, radius, transitions
- Navegación dual: top bar con frosted glass en desktop, bottom tab bar en mobile
- Cards con shadows en lugar de borders planos
- SVG progress ring en Dashboard reemplazando el contador básico
- Micro-animaciones CSS: chips de check-in con bounce, heatmap responsive a dark mode
- Heatmap con escala teal (reemplazando colores hardcodeados de GitHub)
- Auth screens con branding y gradient
- Category-to-color mapping para dots visuales

## Capabilities

### New Capabilities
- `visual-design-system`: Sistema de design tokens (colores, spacing, typography, shadows, radius, transitions) y paleta "Grove" con soporte light/dark mode
- `responsive-navigation`: Navegación dual desktop/mobile con bottom tab bar y menú overflow
- `ui-micro-interactions`: Animaciones CSS para check-in chips, progress rings, hover elevations, y celebraciones

### Modified Capabilities

## Impact

- **Código afectado**: `app/globals.css`, `app/providers.tsx`, todos los componentes en `components/` y sus `.module.css`
- **Sin cambios en API/backend**: Solo cambios visuales en frontend
- **Sin nuevas dependencias**: SVG inline, CSS puro para animaciones
- **Breaking visual**: El diseño cambia completamente, pero la funcionalidad permanece idéntica
