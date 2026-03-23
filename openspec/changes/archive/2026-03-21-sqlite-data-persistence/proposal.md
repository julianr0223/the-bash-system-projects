## Why

Los datos de SQLite se pierden al detener o redesplegar el contenedor en Coolify. Aunque el `docker-compose.yml` define un named volume (`app-data:/app/data`), Coolify no utiliza docker-compose para despliegues — construye la imagen y ejecuta el contenedor directamente, sin montar el volumen persistente. El directorio `/app/data` existe solo dentro del filesystem efímero del contenedor, por lo que la base de datos se recrea desde cero en cada redeploy.

## What Changes

- Añadir un `VOLUME /app/data` en el Dockerfile para declarar explícitamente el punto de montaje persistente, facilitando que orquestadores como Coolify detecten y persistan ese path.
- Documentar la configuración necesaria en Coolify para montar un volumen persistente en `/app/data`.
- Añadir health check y logging mejorado al entrypoint para verificar que el volumen está correctamente montado y contiene datos previos.

## Capabilities

### New Capabilities
- `coolify-volume-persistence`: Configuración y documentación para persistir datos SQLite en despliegues Coolify mediante volúmenes Docker declarativos y configuración del orquestador.

### Modified Capabilities
- `docker-deploy`: Se modifica el Dockerfile para declarar `VOLUME /app/data` y mejorar la detección de volúmenes en el entrypoint.

## Impact

- **Dockerfile**: Se añade instrucción `VOLUME` y mejoras al entrypoint.
- **Documentación**: Nueva guía de despliegue específica para Coolify.
- **Entrypoint**: Logging adicional para diagnosticar si el volumen está correctamente montado.
- **Sin cambios en código de aplicación**: La lógica de `lib/db.ts` ya resuelve `DATA_DIR` en runtime correctamente.
