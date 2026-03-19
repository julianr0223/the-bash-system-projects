## Context

La app es un tracker de rutinas diarias en Next.js (App Router) con SQLite (better-sqlite3), auth por JWT, y single-user. Actualmente requiere crear cuenta manualmente. Se necesita un admin precargado con rutinas template y cambio de password obligatorio.

## Goals / Non-Goals

**Goals:**
- Admin precargado al inicializar la DB (`admin@rutinas.local` / `admin123`)
- Cambio de password obligatorio en primer login
- 9 rutinas diarias precargadas con horarios
- Migración transparente para DBs existentes

**Non-Goals:**
- Multi-usuario o sistema de roles
- Gestión de templates de rutinas desde la UI
- Recuperación de contraseña (no hay email service)

## Decisions

### 1. Seed en `initDb()` con guard `getUserCount() === 0`

**Alternativa**: Script de migración separado.
**Decisión**: Seed inline en `initDb()` — es más simple, idempotente, y no requiere paso adicional de deploy. Solo corre cuando la DB está vacía.

### 2. Columna `must_change_password` en tabla users

**Alternativa**: Flag en localStorage o claim del JWT.
**Decisión**: Columna en DB — es la fuente de verdad del servidor. El JWT no se invalida al cambiar password (aceptable para single-user).

### 3. `bcrypt.hashSync` para seed

Se ejecuta síncronamente en `initDb()` (module load time). Solo corre una vez en DB nueva. ~100ms impacto negligible en startup.

### 4. Eliminar flujo de setup

El endpoint `/api/auth/setup` y el estado `needs-setup` del cliente se eliminan. Siempre hay un usuario, siempre se va a login.

## Risks / Trade-offs

- **[DB existente sin columna]** → `ALTER TABLE ADD COLUMN` en try/catch dentro de `initDb()`. Idempotente.
- **[Token válido post password-change]** → JWT no codifica password, sigue siendo válido. Aceptable para single-user. El flag `must_change_password` se limpia en DB.
- **[Password default visible en código]** → Solo es el seed inicial. El usuario DEBE cambiarlo en primer login.
