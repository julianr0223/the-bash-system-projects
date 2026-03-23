## Context

La aplicación Daily Routine Tracker usa SQLite (`better-sqlite3`) con la base de datos en `/app/data/data.db`. El `docker-compose.yml` ya define un named volume `app-data:/app/data` que funciona correctamente en despliegues locales con Docker Compose.

Sin embargo, Coolify no usa `docker-compose.yml` — construye la imagen Docker y ejecuta el contenedor de forma independiente. Sin una declaración `VOLUME` en el Dockerfile ni configuración explícita en Coolify, el directorio `/app/data` vive solo en el filesystem efímero del contenedor y se pierde al redesplegar.

## Goals / Non-Goals

**Goals:**
- Garantizar que los datos de SQLite persisten entre reinicios y redeploys en Coolify.
- Declarar el volumen en el Dockerfile para que orquestadores detecten automáticamente el punto de montaje.
- Mejorar el entrypoint con diagnóstico de persistencia (detectar si el volumen está realmente montado vs. usando filesystem efímero).
- Documentar la configuración necesaria en Coolify.

**Non-Goals:**
- Migrar de SQLite a otro motor de base de datos.
- Implementar backups automáticos de la base de datos.
- Modificar la lógica de `lib/db.ts` (ya funciona correctamente en runtime).

## Decisions

### 1. Añadir instrucción `VOLUME /app/data` en el Dockerfile

**Decisión**: Declarar `VOLUME /app/data` en el Dockerfile antes del `USER nextjs`.

**Rationale**: La instrucción `VOLUME` en el Dockerfile sirve como documentación declarativa del punto de montaje y permite que orquestadores como Coolify detecten automáticamente que ese path necesita un volumen persistente. Coolify inspecciona el Dockerfile y puede auto-crear volúmenes para paths declarados con `VOLUME`.

**Alternativa descartada**: Solo documentar la configuración manual en Coolify — esto es frágil y depende de que el usuario recuerde configurarlo cada vez.

### 2. Mejorar entrypoint con detección de volumen montado

**Decisión**: Añadir verificación en `entrypoint.sh` que detecte si `/app/data` es un volumen montado real o filesystem efímero del contenedor.

**Rationale**: Si el contenedor arranca sin volumen montado, la app funciona pero pierde datos al reiniciar. Un warning claro en los logs ayuda a diagnosticar el problema antes de que ocurra pérdida de datos.

**Implementación**: Verificar si `/app/data` aparece como un mount point diferente al filesystem raíz del contenedor usando `mountpoint` o comparando device IDs.

### 3. Documentar configuración de Coolify

**Decisión**: Añadir sección en README.md con instrucciones específicas para Coolify.

**Rationale**: Coolify tiene su propia UI para configurar volúmenes. La documentación debe guiar al usuario paso a paso.

## Risks / Trade-offs

- **[Risk] `VOLUME` en Dockerfile crea anonymous volumes si no se monta explícitamente** → Esto es preferible a no tener volumen, ya que al menos los datos persisten entre reinicios (no entre rebuilds). El warning en entrypoint mitiga la confusión.
- **[Risk] La detección de mount point puede no funcionar en todos los runtimes** → Usar fallback graceful: si no se puede determinar, solo hacer log informativo sin bloquear el arranque.
- **[Risk] Permisos de volumen en Coolify** → El contenedor corre como UID 1001. Documentar que el volumen debe tener permisos correctos. El entrypoint ya valida esto.
