## Context

`add-app-versioning` ya muestra la versión en la UI, pero la versión es estática hasta que alguien la edite. Necesitamos un mecanismo simple, no automatizado en exceso, para incrementar `package.json#version` de forma consistente. La app se despliega vía Coolify desde la branch `develop` (cualquier push dispara deploy).

## Goals / Non-Goals

**Goals:**
- Workflow de bump claro, ejecutable con un solo comando.
- Tag git asociado a cada versión para rollback/auditoría.
- Compatible con `develop` como deploy branch.

**Non-Goals:**
- Automatizar bumps a partir de commits convencionales (`semantic-release`, `release-please`).
- Generar changelog automáticamente.
- Hooks de CI que bloqueen merges sin bump.

## Decisions

### 1. Usar `npm version` en lugar de herramientas más complejas

`npm version <patch|minor|major>` viene built-in, edita `package.json`, crea un commit `vX.Y.Z` y un tag git en una sola operación. Cero dependencias nuevas. Alternativa descartada: `release-please` / `semantic-release` — overkill para una app de uso personal y agregan complejidad de CI.

### 2. Script `npm run release` como atajo

```json
"release": "npm version patch && git push --follow-tags"
```

Por defecto bumpea `patch`. Para `minor` o `major`, el dev usa `npm version minor && git push --follow-tags` directamente. Mantenemos el script simple en vez de parametrizar para no disfrazar lo que hace.

### 3. Bump sobre `develop` directamente

No introducimos un branch model nuevo (main/release branches). El dev:
1. Commitea las features pendientes en `develop`.
2. Corre `npm run release`.
3. El commit `0.X.Y` + tag se pushean a `develop`.
4. Coolify detecta el push y deploya. La nueva versión queda visible en el badge.

El tag vive en `develop` — válido para este setup solo-dev.

### 4. Documentar SemVer aplicado a esta app

Como guía concreta para no caer en parálisis:
- **PATCH**: bug fixes, ajustes de UI, refactors internos, cambios en seeds/migraciones que no rompen datos existentes.
- **MINOR**: nueva funcionalidad visible al usuario (nueva página, nuevo tipo de rutina, nueva métrica).
- **MAJOR**: cambios que requieren migración manual de datos o que cambian la forma de usar la app.

## Risks / Trade-offs

- **[Olvidar bumpear antes de un deploy importante]** → El SHA en el badge sigue mostrando el commit exacto, así que aun sin bumpear se puede identificar el build. El bump es un nice-to-have, no un bloqueante.
- **[`npm version` requiere working tree limpio]** → Aceptable: fuerza commitear antes de releasear, lo cual es buena disciplina. Si bloquea, el mensaje de error es claro.
- **[Tags acumulándose en develop]** → No es problema real; los tags son metadata barata.
