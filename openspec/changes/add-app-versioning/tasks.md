## 1. Configuración de versión

- [x] 1.1 Asegurar que `daily-routine-tracker/package.json` tenga un `version` válido en formato SemVer (`0.1.0` si arrancamos).
- [x] 1.2 Modificar `daily-routine-tracker/next.config.ts` para leer `package.json` y resolver el SHA del commit (`git rev-parse --short HEAD` con try/catch), exponiéndolos como `env.NEXT_PUBLIC_APP_VERSION` y `env.NEXT_PUBLIC_APP_COMMIT` (fallback a `process.env.APP_COMMIT_SHA` y luego a `'dev'`).

## 2. UI

- [x] 2.1 Crear `daily-routine-tracker/components/VersionBadge.tsx` que renderice `v{NEXT_PUBLIC_APP_VERSION} ({NEXT_PUBLIC_APP_COMMIT})` con estilo discreto (texto pequeño, color muted).
- [x] 2.2 Montar `<VersionBadge />` en el footer del layout autenticado (verificar dónde vive el shell común — probablemente `app/layout.tsx` o un layout anidado de las páginas autenticadas).

## 3. Docker

- [x] 3.1 Agregar `ARG APP_COMMIT_SHA` al `Dockerfile` y propagarlo como `ENV APP_COMMIT_SHA=$APP_COMMIT_SHA` antes del paso de `npm run build`.
- [x] 3.2 Documentar en el README (o en el script de deploy) el uso de `--build-arg APP_COMMIT_SHA=$(git rev-parse --short HEAD)`.

## 4. Verificación

- [x] 4.1 `npm run dev` muestra el badge con la versión de `package.json` y un SHA (o `dev`).
- [x] 4.2 `npm run build` compila sin errores y la versión queda inlineada en el bundle del cliente.
- [x] 4.3 Build de Docker con `--build-arg APP_COMMIT_SHA=test123` muestra `test123` en la UI.
