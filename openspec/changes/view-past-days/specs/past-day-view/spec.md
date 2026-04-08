## ADDED Requirements

### Requirement: Vista read-only de un día pasado

El sistema SHALL permitir al usuario ver el estado de completitud de las rutinas para cualquier día pasado, sin posibilidad de modificarlo.

#### Scenario: Usuario navega a un día pasado válido

- **WHEN** el usuario abre `/dia/2026-04-05` y esa fecha es anterior a hoy
- **THEN** ve las rutinas que aplicaban a esa fecha según su frecuencia, marcadas como completadas o no según los registros existentes, sin botones de toggle

#### Scenario: Usuario intenta abrir una fecha futura

- **WHEN** el usuario abre `/dia/2099-01-01`
- **THEN** es redirigido a `/hoy`

#### Scenario: Usuario abre la fecha de hoy

- **WHEN** el usuario abre `/dia/{today}`
- **THEN** es redirigido a `/hoy` (canonicalización)

#### Scenario: Fecha inválida

- **WHEN** el usuario abre `/dia/no-es-fecha` o `/dia/2026-13-45`
- **THEN** la página muestra 404

### Requirement: Navegación entre días pasados

El sistema SHALL permitir navegar al día anterior y al siguiente desde la vista de un día pasado.

#### Scenario: Día anterior

- **WHEN** el usuario hace click en "← Día anterior" en `/dia/2026-04-05`
- **THEN** navega a `/dia/2026-04-04`

#### Scenario: Día siguiente cuando es ayer

- **WHEN** el usuario está en `/dia/{yesterday}` y hace click en "Día siguiente →"
- **THEN** es llevado a `/hoy`

#### Scenario: Día siguiente cuando ya es hoy

- **WHEN** el usuario está en `/dia/{yesterday}` y considera avanzar más
- **THEN** el botón "Día siguiente →" está deshabilitado o lleva a `/hoy`, nunca a fechas futuras

### Requirement: Punto de entrada desde la vista de hoy

El sistema SHALL exponer un acceso visible en `/hoy` para navegar a días anteriores.

#### Scenario: Link en header de Hoy

- **WHEN** el usuario está en `/hoy`
- **THEN** ve un link "Ver días anteriores" que lo lleva a `/dia/{yesterday}`

## MODIFIED Requirements

### Requirement: DailyView soporta fecha y modo read-only

El componente `DailyView` SHALL aceptar una fecha arbitraria y un modo `readOnly` opcional, manteniendo retrocompatibilidad con su uso actual en `/hoy`.

#### Scenario: Uso actual en /hoy sin props nuevas

- **WHEN** `<DailyView routines={...} isCompletedToday={...} onToggle={...} />` se renderiza sin pasar `date` ni `readOnly`
- **THEN** se comporta exactamente como antes: muestra el día actual, marcador de hora, y permite togglear

#### Scenario: Uso en modo read-only

- **WHEN** `<DailyView routines={...} date="2026-04-05" readOnly />` se renderiza
- **THEN** muestra las rutinas que aplicaban a esa fecha, sin botones de toggle, sin TimeMarker, y con la fecha legible en el header
