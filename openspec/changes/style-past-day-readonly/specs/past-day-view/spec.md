## ADDED Requirements

### Requirement: Diferenciación visual del modo read-only

El sistema SHALL aplicar un tratamiento visual distinto a la vista de un día pasado de modo que el usuario pueda identificar sin ambigüedad que está en modo histórico de solo lectura.

#### Scenario: Usuario abre un día pasado

- **WHEN** el usuario navega a `/dia/2026-04-05`
- **THEN** ve los bloques de rutinas con fondo más apagado, sin sombras pronunciadas, sin efecto hover de elevación, y con cursor por defecto (no pointer)

#### Scenario: Badge "Solo lectura" en el header

- **WHEN** el usuario está en una vista past-day
- **THEN** ve junto al título un badge discreto con el texto "Solo lectura"

#### Scenario: Completions siguen siendo legibles

- **WHEN** el usuario ve un día pasado con algunas rutinas completadas
- **THEN** las rutinas completadas se distinguen claramente (estilo "done" preservado) de las no completadas

#### Scenario: La vista /hoy no se afecta

- **WHEN** el usuario está en `/hoy`
- **THEN** los estilos son idénticos a antes del cambio (sombras, hover, cursor pointer, sin badge "Solo lectura")
