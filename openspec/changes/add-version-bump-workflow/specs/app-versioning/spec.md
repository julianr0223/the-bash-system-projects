## ADDED Requirements

### Requirement: Workflow de bump de versión

El sistema SHALL proveer un comando único para incrementar la versión, crear un commit y un tag git, y empujarlos al remoto.

#### Scenario: Bump de patch via npm script

- **WHEN** el desarrollador ejecuta `npm run release` con el working tree limpio
- **THEN** `package.json#version` se incrementa en PATCH, se crea un commit `vX.Y.Z` y un tag git `vX.Y.Z`, y ambos se pushean al remoto con `git push --follow-tags`

#### Scenario: Bump de minor o major

- **WHEN** el desarrollador ejecuta `npm version minor` o `npm version major` seguido de `git push --follow-tags`
- **THEN** se aplica el bump correspondiente y se generan commit y tag equivalentes

#### Scenario: Working tree sucio

- **WHEN** el desarrollador ejecuta `npm run release` con cambios sin commitear
- **THEN** `npm version` aborta con un error explicativo y no modifica `package.json`

### Requirement: Convención SemVer documentada

El proyecto SHALL documentar en el README qué tipo de cambio corresponde a cada incremento (PATCH, MINOR, MAJOR) en el contexto específico de esta app.

#### Scenario: README contiene la guía

- **WHEN** un desarrollador lee el README
- **THEN** encuentra una sección "Releasing a new version" con la convención SemVer aplicada y el workflow paso a paso

### Requirement: Compatibilidad con deploy desde develop

El workflow de release SHALL ser compatible con `develop` como branch de despliegue continuo (Coolify), sin requerir branches de release adicionales.

#### Scenario: Release desde develop

- **WHEN** el desarrollador corre `npm run release` estando en `develop`
- **THEN** el commit de bump y el tag quedan en `develop`, el push dispara el deploy de Coolify, y el badge de la UI muestra la nueva versión tras el deploy
