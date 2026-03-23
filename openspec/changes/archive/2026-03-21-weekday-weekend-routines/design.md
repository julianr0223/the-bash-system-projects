## Context

El seed en `lib/db.ts` crea 9 rutinas con frecuencia `"daily"`. El tipo `Frequency` ya soporta `"weekdays"` y el filtro `appliesToDay()` ya lo maneja. Solo falta asignar la frecuencia correcta en el seed.

## Goals / Non-Goals

**Goals:**
- Que las rutinas de trabajo se filtren automáticamente en fines de semana.
- Mantener las rutinas personales (Kefir, Gym, etc.) visibles todos los días.

**Non-Goals:**
- Migrar rutinas existentes en bases de datos ya creadas.
- Agregar rutinas nuevas exclusivas de fin de semana.
- Modificar el sistema de frecuencias del frontend.

## Decisions

### Agregar campo `freq` al array de rutinas seed

Actualmente el INSERT usa `'"daily"'` hardcodeado. Se añadirá un campo `freq` a cada objeto del array seed, y el INSERT usará `JSON.stringify(r.freq)` en lugar del valor fijo.

**Rutinas weekdays:** `Sesion trabajo 1`, `Sesion trabajo 2`
**Rutinas daily:** todas las demás

## Risks / Trade-offs

- **[Riesgo] Bases existentes no se actualizan** → Aceptable. El usuario puede cambiar la frecuencia manualmente desde la UI de rutinas. Una migración automática sería más compleja y no justificada para un solo usuario.
