## 1. Script de release

- [x] 1.1 Agregar script `release` en `daily-routine-tracker/package.json`: `"release": "npm version patch && git push --follow-tags"`.

## 2. Documentación

- [x] 2.1 Agregar sección "Releasing a new version" en `daily-routine-tracker/README.md` con: convención SemVer aplicada (qué cuenta como patch/minor/major en esta app), comando `npm run release` y flujo paso a paso, nota sobre deploy automático desde `develop` via Coolify.

## 3. Verificación

- [x] 3.1 Confirmar que `npm run release --dry-run` no rompe (o documentar el comando alternativo de prueba).
