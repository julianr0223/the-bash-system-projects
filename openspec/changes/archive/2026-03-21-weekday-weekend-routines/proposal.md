## Why

Todas las rutinas seed están configuradas como `"daily"`, lo que hace que se muestren también en fines de semana. Las sesiones de trabajo no aplican los sábados y domingos, generando ruido en la vista diaria del weekend.

## What Changes

- Cambiar la frecuencia de las rutinas de trabajo en el seed (`Sesion trabajo 1`, `Sesion trabajo 2`) de `"daily"` a `"weekdays"`.
- Las demás rutinas (Kefir, Gym, estudio, medicamento, etc.) se mantienen como `"daily"`.

## Capabilities

### New Capabilities

- `weekday-seed-routines`: Asignación de frecuencia `"weekdays"` a rutinas de trabajo en el seed inicial.

### Modified Capabilities

- `admin-seed`: Las rutinas de trabajo seed cambian de frecuencia `"daily"` a `"weekdays"`.

## Impact

- Archivo afectado: `lib/db.ts` (array de rutinas en el seed)
- Sin cambios en el frontend — `appliesToDay()` ya filtra correctamente por frecuencia.
- Sin cambios en APIs ni esquema de DB.
- Solo afecta bases de datos nuevas (seed). Bases existentes no se modifican automáticamente.
