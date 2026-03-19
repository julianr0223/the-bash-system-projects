## ADDED Requirements

### Requirement: Runtime resolution of database path
El sistema DEBE resolver la ruta del archivo SQLite (`DATA_DIR`) en runtime (al momento de crear la conexión), nunca a nivel de módulo ni en tiempo de compilación.

#### Scenario: DATA_DIR se resuelve al llamar getDb()
- **WHEN** el servidor Node.js arranca y se invoca `getDb()` por primera vez
- **THEN** el sistema lee `process.env.DATA_DIR` en ese momento y construye la ruta `path.resolve(DATA_DIR, "data.db")`

#### Scenario: DATA_DIR no está definido en build-time
- **WHEN** el proceso de `next build` se ejecuta sin `DATA_DIR` definido
- **THEN** la ruta de la base de datos NO se resuelve ni se inlinea durante la compilación

### Requirement: Database startup diagnostics
El sistema DEBE logear la ruta absoluta del archivo de la base de datos al establecer la primera conexión.

#### Scenario: Log de ruta al primer acceso
- **WHEN** `getDb()` se ejecuta por primera vez en el ciclo de vida del proceso
- **THEN** el sistema imprime en stdout un mensaje con la ruta completa del archivo de la DB (e.g., `[db] Database path: /app/data/data.db`)

#### Scenario: No logear en accesos subsiguientes
- **WHEN** `getDb()` se ejecuta después de la primera vez
- **THEN** el sistema NO repite el log de ruta

### Requirement: Data directory validation at startup
El sistema DEBE verificar que el directorio de datos existe y es escribible antes de intentar crear o abrir la base de datos.

#### Scenario: Directorio existe y es escribible
- **WHEN** el servidor arranca y `DATA_DIR` apunta a un directorio existente con permisos de escritura
- **THEN** el servidor arranca normalmente y la DB se crea/abre en ese directorio

#### Scenario: Directorio no existe
- **WHEN** el servidor arranca y `DATA_DIR` apunta a un directorio que no existe
- **THEN** el sistema intenta crear el directorio recursivamente y, si falla, termina el proceso con un mensaje de error claro

#### Scenario: Directorio sin permisos de escritura
- **WHEN** el servidor arranca y `DATA_DIR` apunta a un directorio sin permisos de escritura para el usuario actual
- **THEN** el sistema termina el proceso con un mensaje de error que indica el directorio, el usuario actual y los permisos requeridos

### Requirement: Docker entrypoint validates data persistence
El contenedor Docker DEBE ejecutar validaciones de persistencia antes de iniciar el servidor Node.js.

#### Scenario: Entrypoint valida directorio de datos
- **WHEN** el contenedor Docker arranca
- **THEN** el entrypoint verifica que `/app/data` existe y es escribible, creando un archivo de prueba temporal y eliminándolo

#### Scenario: Entrypoint detecta problema de permisos
- **WHEN** el contenedor Docker arranca y `/app/data` no es escribible
- **THEN** el entrypoint imprime un mensaje de error con instrucciones de corrección y termina con código de salida 1

### Requirement: Database file persists across container recreations
Los datos de la base de datos DEBEN persistir cuando el contenedor se recrea mediante `docker-compose up --build` o `docker-compose down && docker-compose up`.

#### Scenario: Rebuild del contenedor mantiene datos
- **WHEN** se ejecuta `docker-compose up --build` después de tener datos en la DB
- **THEN** todos los datos previos (usuarios, rutinas, completions) están disponibles en el nuevo contenedor

#### Scenario: Down y up mantiene datos
- **WHEN** se ejecuta `docker-compose down` seguido de `docker-compose up`
- **THEN** todos los datos previos están disponibles

#### Scenario: Down con -v elimina datos (documentado)
- **WHEN** se ejecuta `docker-compose down -v`
- **THEN** el volumen se elimina y los datos se pierden (comportamiento esperado y documentado)
