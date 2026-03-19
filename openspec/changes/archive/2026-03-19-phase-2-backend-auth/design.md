## Context

La app de rutinas diarias tiene 8 capabilities funcionando en el frontend con localStorage. Para desplegarla en un servidor (Vercel/homelab) de forma segura, necesita un backend real con persistencia y autenticación. El usuario quiere: datos que no se pierdan, acceso protegido por contraseña, y recordatorios para mantener el engagement.

Stack actual: React + TypeScript + Vite (SPA). Storage: localStorage. Sin backend.

## Goals / Non-Goals

**Goals:**
- Backend API REST con Express + SQLite que reemplace localStorage
- Esquema de base de datos para routines, completions, y users
- Auth single-user: registro inicial (setup), login con email/password, JWT sessions
- Recordatorios via notificaciones del navegador (Push Notification API)
- Migración transparente: el frontend llama a la API en lugar de localStorage
- Desplegable en Vercel (serverless) o homelab (Node process)

**Non-Goals:**
- Multi-usuario / roles / permisos
- OAuth / login social
- Email de verificación o recuperación de contraseña
- Notificaciones push nativas en móvil (solo web browser)
- WebSockets / real-time
- Migración automática de localStorage (se provee herramienta manual)

## Decisions

### 1. Arquitectura: Monorepo con server/ y frontend en raíz

**Decisión**: El backend vive en `server/` dentro del mismo proyecto. El frontend se mantiene en la raíz. En desarrollo, Vite proxea `/api` al backend. En producción, el backend sirve los archivos estáticos del frontend.

**Alternativas consideradas**:
- **Repos separados**: Más overhead de deploy y configuración
- **Subdirectorios simétricos (client/ + server/)**: Requeriría mover todo el frontend, demasiado disruptivo

**Razón**: Mínima disrupción al frontend existente. Un solo `npm run dev` levanta todo.

### 2. Base de datos: better-sqlite3 (síncrono)

**Decisión**: Usar `better-sqlite3` como driver de SQLite. Es síncrono, más rápido que alternativas async para SQLite, y no requiere bindings nativos complicados.

**Alternativas consideradas**:
- **sql.js (WASM)**: Portátil pero más lento y sin persistencia directa a disco
- **Drizzle/Prisma ORM**: Demasiado para 3 tablas

**Razón**: Simple, rápido, queries SQL directos. Para 3 tablas y un solo usuario, un ORM es excesivo.

### 3. Esquema de base de datos

**Decisión**:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE routines (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  frequency TEXT NOT NULL DEFAULT 'daily',  -- JSON: 'daily' | 'weekdays' | '{"days":[1,3,5]}'
  start_time TEXT,
  end_time TEXT,
  goal INTEGER,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id TEXT NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  completed_at TEXT DEFAULT (datetime('now')),
  UNIQUE(routine_id, date)
);
```

**Razón**: `frequency` se almacena como JSON string para mantener la flexibilidad del tipo union de TypeScript. La constraint UNIQUE en completions previene duplicados.

### 4. Autenticación: bcryptjs + JWT stateless

**Decisión**: Passwords hasheados con bcryptjs. Login retorna un JWT (24h expiry) que el frontend almacena en localStorage y envía como Bearer token. Middleware verifica JWT en cada request a `/api/*`.

**Alternativas consideradas**:
- **Sessions con cookie**: Requiere session store, más estado en el server
- **Passkeys/WebAuthn**: Más seguro pero más complejo para v1

**Razón**: JWT stateless es simple, funciona con cualquier deployment, y para single-user el riesgo de token theft es aceptable.

### 5. Setup flow: primer usuario se registra, después solo login

**Decisión**: Si no hay usuarios en la DB, la app muestra un formulario de "Setup" para crear la primera cuenta. Después de eso, solo muestra login. No hay endpoint de registro público.

**Razón**: Single-user. Evita que cualquiera cree cuentas en una instancia expuesta.

### 6. API Routes

**Decisión**:
```
POST   /api/auth/setup       — Crear primera cuenta (solo si no hay usuarios)
POST   /api/auth/login        — Login, retorna JWT
GET    /api/auth/me            — Verificar token, retorna user info

GET    /api/routines           — Listar rutinas del usuario
POST   /api/routines           — Crear rutina
PUT    /api/routines/:id       — Actualizar rutina
DELETE /api/routines/:id       — Eliminar rutina

GET    /api/completions?date=  — Completions por fecha
POST   /api/completions        — Registrar completion
DELETE /api/completions/:routineId/:date — Eliminar completion

POST   /api/migrate            — Importar datos de localStorage (auth required)
```

### 7. Recordatorios: Notification API del browser

**Decisión**: Usar la Notification API nativa del browser con un Service Worker para mostrar recordatorios. El usuario configura un horario de recordatorio global (ej. "09:00 — recordar rutinas pendientes"). El SW revisa periódicamente y muestra la notificación.

**Alternativas consideradas**:
- **Web Push (servidor)**: Requiere servicio push, más complejo
- **Email reminders**: Requiere servicio de email

**Razón**: Funciona sin infraestructura adicional. Para uso personal es suficiente.

### 8. Frontend migration: API service layer

**Decisión**: Crear un módulo `src/api/` que reemplaza los imports de `src/storage/`. Los hooks (useRoutines, useCompletions) cambian de llamar localStorage a llamar `api.routines.list()`, `api.completions.add()`, etc. Se usa `fetch` nativo con el JWT en headers.

**Razón**: Cambio mínimo en componentes. Solo los hooks y la capa de datos cambian.

## Risks / Trade-offs

- **[SQLite concurrency]** → SQLite no maneja bien múltiples escrituras simultáneas. Mitigation: single-user, WAL mode habilitado.
- **[JWT en localStorage]** → Vulnerable a XSS. Mitigation: aplicación single-user, CSP headers, token corto (24h).
- **[Notification API requiere HTTPS]** → En desarrollo funciona en localhost, pero en deploy necesita HTTPS. Mitigation: Vercel y la mayoría de hosts proveen HTTPS por defecto.
- **[Service Worker lifecycle]** → Los SW tienen lifecycle complejo. Mitigation: mantenerlo mínimo, solo para notificaciones.
- **[Migración de datos]** → El usuario pierde datos de localStorage si no migra. Mitigation: herramienta de migración clara, aviso en la UI.
