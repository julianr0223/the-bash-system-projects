## Why

La base de datos SQLite (`data.db`) se pierde cada vez que se hace un nuevo deploy del contenedor Docker. Aunque `docker-compose.yml` define un named volume `app-data` montado en `/app/data`, el problema es que la lógica de inicialización en `lib/db.ts` re-crea el esquema y re-siembra datos cuando detecta 0 usuarios, lo que indica que el archivo de la DB no sobrevive al ciclo de vida del contenedor. Esto hace que la aplicación sea inutilizable en producción porque todos los datos de rutinas y completions se pierden.

## What Changes

- Revisar y corregir la configuración de volúmenes Docker para garantizar que `/app/data` persista entre deploys
- Asegurar que el Dockerfile no sobrescriba el directorio de datos durante el build
- Verificar permisos del directorio `/app/data` y del usuario `nextjs` (UID 1001) sobre el volumen montado
- Separar la lógica de inicialización/seed de la lógica de conexión a la DB para evitar re-seeds accidentales
- Agregar protección contra re-seed cuando la DB ya tiene datos pero el archivo WAL/SHM se perdió
- Documentar el procedimiento correcto de deploy para mantener la persistencia

## Capabilities

### New Capabilities
- `db-persistence`: Garantizar la persistencia de datos SQLite entre deploys Docker, incluyendo manejo correcto de volúmenes, permisos y ciclo de vida del contenedor

### Modified Capabilities

## Impact

- **Código afectado**: `lib/db.ts` (inicialización y seed), `Dockerfile` (permisos y directorio de datos), `docker-compose.yml` (configuración de volúmenes)
- **Archivos de datos**: `data.db`, `data.db-wal`, `data.db-shm` en `/app/data`
- **Deploys existentes**: Los usuarios que ya perdieron datos no podrán recuperarlos, pero futuros deploys mantendrán la persistencia
- **Sin cambios en APIs**: Las rutas de la API no cambian, solo la infraestructura subyacente
