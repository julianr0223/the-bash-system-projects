## ADDED Requirements

### Requirement: Grove color palette with light and dark mode
El sistema DEBE definir la paleta "Grove" como CSS variables en `:root` con contrapartes en `@media (prefers-color-scheme: dark)`. Primary teal, accent amber, success green, danger red, sage-tinted neutrals.

#### Scenario: Light mode colors applied
- **WHEN** el usuario accede a la app sin preferencia de dark mode
- **THEN** se aplican los colores light: primary `#0d9488`, accent `#d97706`, bg `#f7faf7`, surface `#ffffff`, text `#1a2e1a`

#### Scenario: Dark mode colors applied
- **WHEN** el usuario tiene `prefers-color-scheme: dark` activo
- **THEN** se aplican los colores dark: primary `#2dd4bf`, accent `#fbbf24`, bg `#0c1a0c`, surface `#162016`, text `#e8f0e8`

### Requirement: Design tokens for spacing, typography, shadows, radius, and transitions
El sistema DEBE definir tokens reutilizables como CSS variables para spacing (escala 4px), typography (escala 0.75rem-2.5rem), shadows (sm/md/lg), border-radius (sm/md/lg/xl/full), y transitions (fast/base/slow/spring).

#### Scenario: Cards use shadow tokens instead of flat borders
- **WHEN** se renderiza cualquier card (dashboard, routine, report)
- **THEN** el card usa `box-shadow: var(--shadow-sm)` en estado normal y `var(--shadow-md)` en hover, sin `border` explícito

#### Scenario: Typography follows the scale
- **WHEN** se renderiza texto en cualquier componente
- **THEN** los tamaños de fuente corresponden a los tokens definidos (--text-xs a --text-4xl)

### Requirement: Heatmap color scale uses CSS variables
El sistema DEBE definir variables `--heatmap-0` a `--heatmap-4` en la escala teal, con soporte automático para dark mode.

#### Scenario: Heatmap adapts to dark mode
- **WHEN** el usuario cambia a dark mode
- **THEN** los colores del heatmap cambian automáticamente a la escala teal dark sin intervención JS

### Requirement: Category-to-color mapping
El sistema DEBE asignar un color distintivo a cada categoría de rutina: General (neutral), Salud (rojo), Ejercicio (amber), Productividad (azul), Aprendizaje (purple), Bienestar (teal).

#### Scenario: Category dot shows correct color
- **WHEN** se renderiza una rutina con categoría "Ejercicio"
- **THEN** se muestra un dot de color amber (`#f59e0b`) junto al nombre de la categoría
