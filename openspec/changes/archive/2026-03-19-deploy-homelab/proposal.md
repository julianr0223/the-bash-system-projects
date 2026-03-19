## Why

La app funciona en desarrollo pero no tiene configuración para producción. Se necesita dockerizar para deployear en un server casero (homelab) con Docker Compose, asegurando que los datos de SQLite persistan y el servicio sea fácil de mantener.

## What Changes

- Agregar `Dockerfile` optimizado para Next.js standalone output
- Agregar `docker-compose.yml` con volumen persistente para SQLite
- Agregar `.dockerignore` para builds eficientes
- Agregar `.env.example` con variables de configuración (JWT_SECRET, puerto)
- Configurar `next.config.ts` para producción (output standalone ya está)
- Documentación mínima de deploy en el README

## Capabilities

### New Capabilities

- `docker-deploy`: Configuración Docker/Docker Compose para deploy en homelab con persistencia de datos SQLite

### Modified Capabilities

None — no hay cambios funcionales, solo infraestructura de deploy.

## Impact

- Archivos nuevos en la raíz del proyecto: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example`
- `lib/db.ts` puede necesitar ajuste para leer JWT_SECRET de env vars
- `lib/auth.ts` ya lee `process.env.JWT_SECRET` con fallback
