## Why

El change `add-app-versioning` dejó `package.json#version` como fuente de verdad y la mostró en la UI, pero no definió cómo ni cuándo se debe bumpear. Sin un workflow explícito, la versión nunca cambia o cambia inconsistentemente, quitándole valor al badge desplegado.

## What Changes

- Documentar en el README el workflow de bump basado en `npm version` (manual, semi-asistido).
- Agregar un script `release` en `package.json` que envuelva `npm version` + `git push --follow-tags`, parametrizable por tipo de bump.
- Documentar la convención SemVer (`patch` / `minor` / `major`) aplicada a esta app.
- Aclarar que el flujo opera sobre `develop` (la branch de deploy de Coolify) y que el push del bump dispara el deploy automáticamente.

## Capabilities

### New Capabilities
*(ninguna — extiende `app-versioning` existente)*

### Modified Capabilities
- `app-versioning`: agregar requirements para el workflow de bump (cómo se incrementa la versión y qué herramienta se usa).

## Impact

- **`package.json`**: nuevo script `release`.
- **`README.md`**: nueva sección "Releasing a new version".
- **Sin cambios de código** en la app ni en el Dockerfile.
