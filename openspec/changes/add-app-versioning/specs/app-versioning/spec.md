## ADDED Requirements

### Requirement: Versión semántica como fuente única

El sistema SHALL usar el campo `version` de `package.json` como única fuente de verdad para la versión de la app, siguiendo el formato SemVer `MAJOR.MINOR.PATCH`.

#### Scenario: Versión leída desde package.json

- **WHEN** el build de Next.js se ejecuta
- **THEN** `next.config.ts` lee `package.json#version` y lo expone como `NEXT_PUBLIC_APP_VERSION`

### Requirement: SHA del commit disponible en el bundle

El sistema SHALL exponer el SHA corto del commit del build actual como `NEXT_PUBLIC_APP_COMMIT`, con fallback a `'dev'` cuando no esté disponible.

#### Scenario: Build con git disponible

- **WHEN** el build se ejecuta en un entorno con `.git` accesible
- **THEN** `NEXT_PUBLIC_APP_COMMIT` contiene el SHA corto resultado de `git rev-parse --short HEAD`

#### Scenario: Build con build arg APP_COMMIT_SHA

- **WHEN** el build se ejecuta dentro de Docker con `--build-arg APP_COMMIT_SHA=abc1234`
- **THEN** `NEXT_PUBLIC_APP_COMMIT` contiene `abc1234`

#### Scenario: Build sin git ni build arg

- **WHEN** el build se ejecuta en un entorno sin git ni `APP_COMMIT_SHA`
- **THEN** `NEXT_PUBLIC_APP_COMMIT` contiene `'dev'` y el build no falla

### Requirement: Versión visible en la UI

El sistema SHALL mostrar la versión y SHA del commit en todas las páginas autenticadas en una ubicación discreta y consistente.

#### Scenario: Usuario autenticado ve la versión

- **WHEN** un usuario autenticado carga cualquier página de la app
- **THEN** ve un badge `v<version> (<commit>)` (por ejemplo `v1.2.3 (abc1234)`) en el footer del layout

#### Scenario: Estilo discreto

- **WHEN** se renderiza el `<VersionBadge />`
- **THEN** usa texto pequeño y color muted para no competir con el contenido principal
