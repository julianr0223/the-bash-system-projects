## Why

Tras iniciar sesión, la primera visita a `/hoy` (y en general al shell autenticado) muestra la vista vacía ("No hay rutinas activas para hoy") aunque sí existen rutinas. Un reload manual arregla el problema. Esto es porque `useRoutines` y `useCompletions` disparan su fetch inicial **al montarse**, antes de que el token esté en `localStorage`, reciben 401 y se quedan con arreglos vacíos. Cuando la autenticación finalmente termina, nadie refrescar los datos.

## What Changes

- Gatear los fetch de `useRoutines` y `useCompletions` a que el usuario esté autenticado: no pegar a la API mientras el `useAuth` esté en estado `loading` o `login`.
- Cuando el estado de auth transicione a `authenticated`, los hooks deben refrescar sus datos automáticamente.
- Opción de implementación: mover la llamada a los hooks de datos a **dentro** del branch `authenticated` de `Providers`, para que no se monten en absoluto hasta que haya token válido.

## Capabilities

### New Capabilities
*(ninguna)*

### Modified Capabilities
- `routine-management`: los datos de rutinas y completions se cargan solo después de autenticación exitosa, eliminando la race condition inicial.

## Impact

- **Frontend**: refactor de `app/providers.tsx` y/o `hooks/useRoutines.ts` + `hooks/useCompletions.ts`.
- **Sin cambios** en API ni DB.
- Eliminación del `unhandledRejection: HTTP 500/401` que aparecía en el log del server tras login.
