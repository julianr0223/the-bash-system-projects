## 1. Actualizar seed en lib/db.ts

- [x] 1.1 Agregar campo `freq` (tipo `Frequency`) a cada objeto del array de rutinas seed, usando `"weekdays"` para sesiones de trabajo y `"daily"` para las demás
- [x] 1.2 Cambiar el INSERT de rutinas para usar `JSON.stringify(r.freq)` en lugar del valor hardcodeado `'"daily"'`

## 2. Verificación

- [x] 2.1 Verificar que la app construye correctamente con `npm run build`
