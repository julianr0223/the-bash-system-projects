## Why

Actualmente no hay forma de saber qué versión del código está corriendo en una instancia desplegada. Cuando algo falla en producción o queremos confirmar que un fix llegó al servidor, no podemos verificar visualmente qué build está activo.

## What Changes

- Adoptar SemVer (`MAJOR.MINOR.PATCH`) en `package.json` como fuente única de verdad de la versión.
- Exponer la versión a la app a través de una variable de entorno pública resuelta en build time (`NEXT_PUBLIC_APP_VERSION`).
- Mostrar la versión en la UI en una ubicación discreta pero visible (footer o sidebar) en todas las páginas autenticadas.
- Incluir además el SHA corto del commit (`NEXT_PUBLIC_APP_COMMIT`) cuando esté disponible, para distinguir builds dentro de la misma versión.

## Capabilities

### New Capabilities
- `app-versioning`: Definir, exponer y mostrar la versión semántica de la app y el commit SHA del build desplegado.

### Modified Capabilities
*(ninguna)*

## Impact

- **`package.json`**: pasa a ser fuente de verdad de la versión.
- **`next.config.ts`**: lee `package.json` y el SHA del git para inyectar `NEXT_PUBLIC_APP_VERSION` y `NEXT_PUBLIC_APP_COMMIT` en build time.
- **UI**: nuevo componente `<VersionBadge />` montado en el layout autenticado.
- **Docker/CI**: el `Dockerfile` debe pasar el commit SHA como build arg para que quede disponible aun cuando `.git` no esté en el contexto del runtime.
