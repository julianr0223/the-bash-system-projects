## MODIFIED Requirements

### Requirement: Navegación entre días pasados

El sistema SHALL permitir navegar entre días con flechas, un date picker para saltar a cualquier fecha pasada, y un botón "Hoy" para volver al día actual desde cualquier día anterior.

#### Scenario: Día anterior

- **WHEN** el usuario hace click en "← Día anterior" en `/dia/2026-04-05`
- **THEN** navega a `/dia/2026-04-04`

#### Scenario: Día siguiente cuando es ayer

- **WHEN** el usuario está en `/dia/{yesterday}` y hace click en "Día siguiente →"
- **THEN** es llevado a `/hoy`

#### Scenario: Día siguiente nunca pasa de hoy

- **WHEN** el usuario está en cualquier día pasado
- **THEN** el botón "Día siguiente →" nunca lleva a una fecha posterior a hoy

#### Scenario: Salto a fecha arbitraria via date picker

- **WHEN** el usuario abre el date picker en la vista past-day y selecciona `2026-01-15`
- **THEN** navega a `/dia/2026-01-15`

#### Scenario: Date picker no permite fechas futuras

- **WHEN** el usuario abre el date picker
- **THEN** las fechas posteriores a hoy están deshabilitadas a nivel del control nativo (`max={today}`)

#### Scenario: Selección de hoy en el date picker

- **WHEN** el usuario abre el date picker en `/dia/2026-04-05` y selecciona el día de hoy
- **THEN** es navegado a `/hoy` (URL canónica), no a `/dia/{today}`

#### Scenario: Botón "Hoy" desde día pasado

- **WHEN** el usuario hace click en el botón "Hoy" en `/dia/2026-04-05`
- **THEN** navega a `/hoy`

#### Scenario: Botón "Hoy" no aparece en /hoy

- **WHEN** el usuario está en `/hoy`
- **THEN** el botón "Hoy" no se renderiza (no es necesario)

### Requirement: Punto de entrada desde la vista de hoy

El sistema SHALL exponer en `/hoy` el mismo date picker para saltar a cualquier día pasado.

#### Scenario: Date picker disponible en /hoy

- **WHEN** el usuario está en `/hoy`
- **THEN** ve el date picker con la fecha actual seleccionada, y puede escoger cualquier fecha pasada para navegar a `/dia/{fecha}`
