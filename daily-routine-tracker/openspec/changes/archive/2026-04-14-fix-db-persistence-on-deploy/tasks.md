## 1. Fix runtime resolution de DATA_DIR

- [x] 1.1 Refactorizar `lib/db.ts` para que `DATA_DIR` y `DB_PATH` se resuelvan dentro de `getDb()` (lazy) en lugar de a nivel de módulo
- [x] 1.2 Agregar log de diagnóstico al crear la conexión por primera vez: `[db] Database path: <ruta absoluta>`

## 2. Validación del directorio de datos

- [x] 2.1 En `lib/db.ts`, antes de abrir la DB, verificar que el directorio de `DATA_DIR` existe; si no, crearlo con `fs.mkdirSync(dir, { recursive: true })`
- [x] 2.2 Verificar que el directorio es escribible; si no lo es, lanzar un error claro con el directorio, usuario actual y permisos requeridos

## 3. Docker entrypoint

- [x] 3.1 Crear script `entrypoint.sh` que valide que `/app/data` existe y es escribible (touch + rm de archivo temporal)
- [x] 3.2 Actualizar `Dockerfile` para copiar `entrypoint.sh` y usarlo como `ENTRYPOINT` antes del `CMD ["node", "server.js"]`

## 4. Verificación y documentación

- [x] 4.1 Probar localmente con `docker-compose up --build`, crear datos, luego `docker-compose down && docker-compose up` y verificar que los datos persisten
- [x] 4.2 Agregar sección en README sobre deploy y persistencia de datos, incluyendo advertencia sobre `docker-compose down -v`
