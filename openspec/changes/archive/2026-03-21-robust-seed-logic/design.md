## Context

Actualmente `initDb()` en `lib/db.ts` (línea 86) solo ejecuta el seed cuando `COUNT(*) FROM users = 0`. Si la DB se persiste con un usuario admin pero sin rutinas, el seed nunca se vuelve a ejecutar.

## Goals / Non-Goals

**Goals:**
- Que el seed de rutinas se ejecute siempre que el usuario admin exista pero tenga 0 rutinas.
- Que el seed sea idempotente: ejecutarlo múltiples veces no duplica datos.

**Non-Goals:**
- Cambiar las rutinas por defecto.
- Soportar seed para usuarios que no sean el admin.
- Agregar un endpoint de re-seed manual.

## Decisions

### Separar la lógica de seed de usuario y seed de rutinas

La condición actual es monolítica: si hay 0 usuarios, crea usuario + rutinas. Se separará en dos pasos:

1. **Seed de usuario**: Si no existe `admin@rutinas.local`, crearlo.
2. **Seed de rutinas**: Si el usuario admin tiene 0 rutinas, insertar las rutinas por defecto.

**Rationale**: Esto cubre el caso donde la DB se crea con el usuario pero sin rutinas (volumen persistido parcialmente, o el usuario borró sus rutinas manualmente y quiere el reset).

### Usar `INSERT OR IGNORE` en lugar de verificación previa

No es necesario en este caso porque ya verificamos `COUNT(*) = 0` antes de insertar. Mantener la verificación explícita es más claro.

## Risks / Trade-offs

- **[Riesgo] Usuario borra rutinas intencionalmente** → Si el usuario borra todas sus rutinas y reinicia el contenedor, se re-insertan las por defecto. Esto es aceptable para el caso de uso actual (single-user, rutinas de Julian).
