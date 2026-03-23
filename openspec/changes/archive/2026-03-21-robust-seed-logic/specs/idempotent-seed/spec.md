## ADDED Requirements

### Requirement: Seed de rutinas independiente del seed de usuario
El sistema SHALL insertar las rutinas por defecto cuando el usuario admin (`admin@rutinas.local`) existe pero tiene 0 rutinas en la tabla `routines`.

#### Scenario: DB con usuario admin pero sin rutinas
- **WHEN** la base de datos contiene el usuario `admin@rutinas.local` con 0 rutinas
- **THEN** el sistema MUST insertar las 9 rutinas por defecto asociadas a ese usuario

#### Scenario: DB completamente vacía (0 usuarios)
- **WHEN** la base de datos tiene 0 usuarios
- **THEN** el sistema MUST crear el usuario admin e insertar las 9 rutinas por defecto (comportamiento actual preservado)

#### Scenario: Usuario admin con rutinas existentes
- **WHEN** el usuario admin ya tiene 1 o más rutinas
- **THEN** el sistema MUST NOT insertar rutinas adicionales

### Requirement: Seed idempotente
Ejecutar `initDb()` múltiples veces MUST NOT duplicar usuarios ni rutinas.

#### Scenario: Múltiples ejecuciones de initDb
- **WHEN** `initDb()` se ejecuta 3 veces consecutivas con el usuario admin y rutinas ya existentes
- **THEN** la cantidad de usuarios y rutinas MUST permanecer igual después de cada ejecución
