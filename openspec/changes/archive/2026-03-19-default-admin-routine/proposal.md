## Why

La app requiere que el usuario cree una cuenta manualmente en la primera visita. Para uso personal, es mejor que venga con un usuario admin precargado junto con una plantilla de rutina diaria lista para usar. Esto elimina fricción y permite empezar a trackear rutinas desde el primer login.

## What Changes

- **BREAKING**: Se elimina el flujo "Crear cuenta" (setup) — ya no es necesario porque el admin viene precargado
- Se agrega un usuario admin por defecto (`admin@rutinas.local` / `admin123`) que se crea automáticamente al inicializar la base de datos
- Se agrega un mecanismo de cambio de contraseña obligatorio en el primer login
- Se precargan 9 rutinas diarias con horarios definidos para el usuario admin
- Se agrega un nuevo endpoint y formulario para cambio de contraseña

## Capabilities

### New Capabilities

- `admin-seed`: Seed automático de usuario admin con contraseña temporal y rutinas precargadas al inicializar la DB
- `password-change`: Flujo de cambio de contraseña obligatorio en primer login, con endpoint y formulario dedicado

### Modified Capabilities

- `routine-management`: Las rutinas ahora pueden venir precargadas desde el seed de la DB, no solo creadas por el usuario desde la UI
- `daily-checkin`: El check-in debe funcionar inmediatamente con las rutinas precargadas sin configuración previa

## Impact

- `lib/db.ts` — Schema de users (nueva columna), lógica de seed
- `app/api/auth/*` — Endpoints de auth (login, me, status, nuevo change-password)
- `hooks/useAuth.ts` — State machine del cliente (nuevo estado must-change-password)
- `app/providers.tsx` — Renderizado condicional del nuevo formulario
- `components/Auth/` — Nuevo componente ChangePasswordForm
- Se elimina `app/api/auth/setup/route.ts`
