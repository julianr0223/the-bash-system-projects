## ADDED Requirements

### Requirement: Dockerfile declares persistent volume for data directory
El Dockerfile SHALL declarar `VOLUME /app/data` para que orquestadores como Coolify detecten automáticamente el punto de montaje persistente.

#### Scenario: Coolify detecta el volumen declarado
- **WHEN** Coolify construye la imagen desde el Dockerfile
- **THEN** Coolify identifica `/app/data` como un path que requiere volumen persistente

#### Scenario: Datos persisten entre redeploys en Coolify
- **WHEN** el usuario redespliega la aplicación en Coolify
- **THEN** la base de datos SQLite en `/app/data/data.db` conserva todos los datos previos

### Requirement: Entrypoint detecta si el volumen está correctamente montado
El entrypoint SHALL verificar si `/app/data` es un volumen montado real y emitir un warning si está usando filesystem efímero del contenedor.

#### Scenario: Volumen montado correctamente
- **WHEN** el contenedor arranca con un volumen persistente montado en `/app/data`
- **THEN** el entrypoint muestra `[entrypoint] Volume mount detected at /app/data`

#### Scenario: Sin volumen montado (filesystem efímero)
- **WHEN** el contenedor arranca sin volumen montado en `/app/data`
- **THEN** el entrypoint muestra `[entrypoint] WARNING: /app/data is NOT a mounted volume. Data will be lost on container restart.`
- **AND** el contenedor arranca normalmente (no bloquea el inicio)

### Requirement: Entrypoint muestra información de persistencia existente
El entrypoint SHALL informar si encuentra una base de datos existente al arrancar, para confirmar que la persistencia funciona.

#### Scenario: Base de datos existente encontrada
- **WHEN** el contenedor arranca y existe `/app/data/data.db`
- **THEN** el entrypoint muestra `[entrypoint] Existing database found at /app/data/data.db`

#### Scenario: Primera ejecución sin base de datos previa
- **WHEN** el contenedor arranca y no existe `/app/data/data.db`
- **THEN** el entrypoint muestra `[entrypoint] No existing database found. A new one will be created.`
