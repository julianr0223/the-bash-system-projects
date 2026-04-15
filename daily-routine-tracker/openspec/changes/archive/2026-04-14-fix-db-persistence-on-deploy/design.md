## Context

La aplicación Daily Routine Tracker usa SQLite3 (`better-sqlite3`) con el archivo `data.db` almacenado en `DATA_DIR` (por defecto `/app/data` en Docker). El `docker-compose.yml` define un named volume `app-data` montado en `/app/data`. A pesar de esto, los datos se pierden entre deploys.

Tras analizar el código, se identifican **tres causas probables**:

1. **Resolución de `DATA_DIR` en build-time vs runtime**: En `lib/db.ts`, la constante `DATA_DIR` se define a nivel de módulo como `process.env.DATA_DIR || process.cwd()`. En el Dockerfile multi-stage, `ENV DATA_DIR=/app/data` solo se define en el stage `runner`, **no en el stage `builder`**. Si Next.js evalúa o inlinea esta variable durante `next build`, el valor sería `undefined` → fallback a `process.cwd()` = `/app`. Esto haría que la DB se cree en `/app/data.db` en lugar de `/app/data/data.db`, quedando **fuera del volumen**.

2. **Permisos del volumen Docker**: El Dockerfile crea `/app/data` con `chown nextjs:nodejs`, pero cuando Docker monta un named volume vacío por primera vez, los permisos del directorio del contenedor se copian al volumen. En deploys subsiguientes con un volumen existente, los permisos del volumen prevalecen. Si hay un mismatch de UID/GID, la app no puede escribir.

3. **Proceso de deploy**: Si se usa `docker-compose down -v` (flag `-v` elimina volúmenes) antes de `docker-compose up --build`, los datos se borran intencionalmente.

## Goals / Non-Goals

**Goals:**
- Garantizar que `DATA_DIR` se resuelva correctamente en runtime, nunca en build-time
- Asegurar permisos correctos del directorio de datos para el usuario `nextjs`
- Agregar un health check o log de diagnóstico que confirme la ubicación real de la DB
- Documentar el procedimiento correcto de deploy

**Non-Goals:**
- Migrar a otra base de datos (PostgreSQL, MySQL, etc.)
- Implementar backups automáticos de la DB
- Cambiar la estrategia de autenticación o seeding

## Decisions

### 1. Mover la resolución de `DATA_DIR` a runtime lazy

**Decisión**: Cambiar `lib/db.ts` para que `DATA_DIR` se resuelva dentro de la función `getDb()` en lugar de a nivel de módulo.

**Alternativa considerada**: Definir `DATA_DIR` también en el build stage del Dockerfile. Descartada porque no resuelve el problema de raíz (Next.js podría seguir inlineando la variable) y agrega una dependencia implícita entre stages.

**Rationale**: Garantiza que `process.env.DATA_DIR` se lea cuando se ejecuta el servidor, no cuando se compila.

### 2. Agregar log de diagnóstico al inicializar la DB

**Decisión**: Logear la ruta absoluta del archivo de la DB al crear la conexión por primera vez.

**Rationale**: Permite diagnosticar rápidamente si la DB se está creando en la ubicación correcta, sin necesidad de hacer `docker exec` para inspeccionar el contenedor.

### 3. Agregar script de entrypoint para validar permisos

**Decisión**: Crear un script `entrypoint.sh` que verifique que `/app/data` existe y es escribible por el usuario actual antes de iniciar el servidor.

**Alternativa considerada**: Manejar los permisos solo en el Dockerfile. Descartada porque no cubre el caso de volúmenes pre-existentes con permisos incorrectos.

### 4. Documentar el procedimiento de deploy

**Decisión**: Agregar una sección en el README sobre cómo hacer deploys sin perder datos, advirtiendo sobre `docker-compose down -v`.

## Risks / Trade-offs

- **[Datos ya perdidos]** → No se pueden recuperar datos de deploys anteriores. Solo se puede prevenir pérdidas futuras.
- **[Entrypoint script]** → Agrega complejidad al startup. Mitigación: el script es minimal y falla con mensajes claros.
- **[Log de ruta de DB]** → Podría exponer rutas internas en logs. Mitigación: solo se logea una vez al startup, nivel `info`.
- **[WAL files huérfanos]** → Si el contenedor se mata con SIGKILL, los archivos WAL podrían quedar en estado inconsistente. Mitigación: SQLite maneja recovery automático de WAL al reabrir la DB.
