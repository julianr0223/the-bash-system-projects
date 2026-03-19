## Why

La app actualmente corre 100% en el navegador con localStorage. Los datos se pierden al limpiar el browser, no hay forma de acceder desde otro dispositivo, y cualquiera con la URL puede entrar. Para desplegar en Vercel o un homelab de forma segura, se necesita un backend con persistencia real y autenticación.

## What Changes

- **BREAKING**: Nueva API REST backend con Express + SQLite reemplaza localStorage como fuente de datos
- Nuevo sistema de autenticación con email/password (bcrypt + JWT), single-user
- Nuevo sistema de recordatorios basado en notificaciones del navegador (Push API)
- Migración del frontend: todos los hooks de datos cambian de localStorage a fetch contra la API
- El frontend se convierte en cliente de la API; ya no accede directamente a storage

## Capabilities

### New Capabilities
- `api-backend`: API REST con Express y SQLite — endpoints CRUD para rutinas, completions, estadísticas. Incluye esquema de base de datos y migraciones.
- `user-auth`: Autenticación single-user con email y password — registro inicial (setup), login, logout, sesiones con JWT, middleware de protección de rutas.
- `reminders`: Sistema de recordatorios — notificaciones del navegador para rutinas pendientes, configuración de horarios de recordatorio por rutina.
- `data-migration`: Migración de datos de localStorage a SQLite — herramienta one-time para importar datos existentes al backend.

### Modified Capabilities
<!-- No spec-level behavior changes — the existing capabilities (routine-management, daily-checkin, etc.) keep the same requirements. The change is purely in the implementation layer (localStorage → API). -->

## Impact

- **Backend**: Nuevo servidor Express con SQLite (better-sqlite3), JWT (jsonwebtoken), bcrypt
- **Database**: Esquema SQLite con tablas: users, routines, completions
- **Frontend**: Todos los hooks (useRoutines, useCompletions) migran de localStorage a API calls
- **Storage layer**: Se elimina la dependencia directa de localStorage; se reemplaza con un servicio HTTP
- **Deployment**: El proyecto pasa de SPA estática a SPA + API server (monorepo o separados)
- **Dependencies**: express, better-sqlite3, jsonwebtoken, bcryptjs, cors
