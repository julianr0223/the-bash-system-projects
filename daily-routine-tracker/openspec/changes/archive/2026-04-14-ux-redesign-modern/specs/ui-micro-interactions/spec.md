## ADDED Requirements

### Requirement: SVG progress ring in Dashboard
El Dashboard DEBE mostrar un anillo SVG de progreso circular que refleje el porcentaje de rutinas completadas hoy, reemplazando el contador numérico básico.

#### Scenario: Progress ring shows completion
- **WHEN** el usuario ha completado 3 de 5 rutinas
- **THEN** el anillo SVG muestra 60% de fill con color `--color-primary`

#### Scenario: All routines complete celebration
- **WHEN** todas las rutinas del día están completadas
- **THEN** el anillo muestra 100% con color `--color-success` y el card tiene un gradient de celebración

### Requirement: Check-in chip animation
Los chips de check-in en el Dashboard DEBEN tener una animación bouncy al completar una rutina.

#### Scenario: Chip bounce on completion
- **WHEN** el usuario marca una rutina como completada en el chip de check-in
- **THEN** el chip anima con scale bounce usando `--transition-spring` y muestra un checkmark

### Requirement: Card hover elevation
Las cards DEBEN tener elevación visual al hacer hover, usando transiciones de `transform` y `box-shadow`.

#### Scenario: Card elevates on hover
- **WHEN** el usuario pasa el cursor sobre una card
- **THEN** la card se eleva con `translateY(-1px)` y `box-shadow: var(--shadow-md)` con transición suave

### Requirement: Progress bar gradient
Las barras de progreso DEBEN mostrar un gradient de `--color-primary` a `--color-success` que refuerce visualmente el avance.

#### Scenario: DailyView progress bar gradient
- **WHEN** se renderiza la barra de progreso en DailyView
- **THEN** el fill muestra gradient `linear-gradient(90deg, var(--color-primary), var(--color-success))`

### Requirement: CSS-only keyframe animations
Todas las animaciones DEBEN ser CSS-only usando keyframes definidos en `globals.css`. Solo se DEBEN animar propiedades GPU-accelerated (`transform`, `opacity`).

#### Scenario: No JS animation libraries
- **WHEN** se revisa `package.json`
- **THEN** no hay dependencias de animación JS (framer-motion, react-spring, etc.)
