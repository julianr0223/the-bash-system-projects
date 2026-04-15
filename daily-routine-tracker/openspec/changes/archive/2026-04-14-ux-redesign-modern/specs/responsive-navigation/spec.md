## ADDED Requirements

### Requirement: Desktop top navigation bar with frosted glass
En viewports >= 768px, el sistema DEBE mostrar una barra de navegación superior con efecto frosted glass (`backdrop-filter: blur`), marca "Rutinas" a la izquierda, links primarios al centro, y botón de logout a la derecha.

#### Scenario: Desktop nav displays correctly
- **WHEN** el viewport es >= 768px
- **THEN** se muestra la nav superior con links: Dashboard, Hoy, Rutinas, Reportes, Logros, Estadisticas, Ajustes, y botón Salir
- **AND** la nav tiene efecto frosted glass con fondo semi-transparente

#### Scenario: Active link shows underline indicator
- **WHEN** el usuario está en la ruta `/hoy`
- **THEN** el link "Hoy" muestra un underline con `--color-primary`

### Requirement: Mobile bottom tab navigation
En viewports < 768px, el sistema DEBE mostrar una barra de navegación inferior fija con 5 tabs: Dashboard, Hoy, Rutinas, Reportes, y Más.

#### Scenario: Mobile bottom nav displays
- **WHEN** el viewport es < 768px
- **THEN** se oculta la nav superior y se muestra una barra inferior fija con 5 iconos + labels

#### Scenario: More menu shows secondary links
- **WHEN** el usuario toca el tab "Más" en mobile
- **THEN** se despliega un menú con: Logros, Estadisticas, Ajustes, Salir

#### Scenario: Content not hidden behind bottom nav
- **WHEN** el viewport es < 768px
- **THEN** el contenido principal tiene padding-bottom suficiente para no quedar oculto tras la bottom bar

### Requirement: CSS-only responsive switching
La alternancia entre nav desktop y mobile DEBE ser CSS-only usando `display: none` en media queries, sin hooks JS de media query.

#### Scenario: No hydration mismatch
- **WHEN** la página se carga por primera vez (SSR + hydration)
- **THEN** no hay errores de hydration mismatch en la consola
