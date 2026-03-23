## Why

El seed de rutinas por defecto solo se ejecuta cuando hay 0 usuarios en la base de datos. Si la DB se crea vacía o el usuario admin se crea sin rutinas (por ejemplo, por un volumen persistido sin datos completos), las rutinas por defecto nunca se insertan. Esto causa que en deploys frescos con volumen persistente el usuario vea la app vacía.

## What Changes

- Modificar la lógica de seed en `lib/db.ts` para que también inserte rutinas por defecto cuando el usuario admin existe pero tiene 0 rutinas.
- Hacer el seed idempotente: si ya existen rutinas, no se duplican.

## Capabilities

### New Capabilities

- `idempotent-seed`: Lógica de seed que verifica tanto la existencia del usuario admin como la cantidad de rutinas, y solo inserta datos faltantes.

### Modified Capabilities

- `admin-seed`: La condición de seed cambia de "0 usuarios" a "usuario admin sin rutinas".

## Impact

- Archivo afectado: `lib/db.ts` (función `initDb`)
- Sin cambios en APIs, dependencias ni esquema de base de datos.
- Sin breaking changes.
