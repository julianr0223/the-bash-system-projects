## 1. Backend Setup

- [x] 1.1 Create `server/` directory with package.json, tsconfig.json for the backend
- [x] 1.2 Install backend dependencies (express, better-sqlite3, jsonwebtoken, bcryptjs, cors, and their @types)
- [x] 1.3 Create `server/src/index.ts` — Express server with CORS, JSON parsing, and static file serving
- [x] 1.4 Add dev script to run backend with ts-node/tsx and configure Vite proxy for `/api`

## 2. Database

- [x] 2.1 Create `server/src/db.ts` — SQLite initialization with better-sqlite3 and WAL mode
- [x] 2.2 Create schema: users, routines, completions tables with the SQL from design.md
- [x] 2.3 Create `server/src/db.ts` helper functions for common queries

## 3. Auth

- [x] 3.1 Create `server/src/routes/auth.ts` — POST `/api/auth/setup` (create first user, hash password, return JWT)
- [x] 3.2 Add POST `/api/auth/login` (verify password, return JWT)
- [x] 3.3 Add GET `/api/auth/me` (verify token, return user info, include setup status)
- [x] 3.4 Create `server/src/middleware/auth.ts` — JWT verification middleware
- [x] 3.5 Apply auth middleware to all `/api/*` routes except `/api/auth/*`

## 4. API Routes

- [x] 4.1 Create `server/src/routes/routines.ts` — GET, POST, PUT, DELETE for `/api/routines`
- [x] 4.2 Create `server/src/routes/completions.ts` — GET (by date), POST, DELETE for `/api/completions`
- [x] 4.3 Serialize/deserialize frequency field (JSON string in SQLite ↔ Frequency type)
- [x] 4.4 Register all routes in the Express app

## 5. Frontend API Layer

- [x] 5.1 Create `src/api/client.ts` — fetch wrapper with JWT token in headers, base URL config
- [x] 5.2 Create `src/api/routines.ts` — list, create, update, delete functions calling the API
- [x] 5.3 Create `src/api/completions.ts` — getByDate, add, remove functions calling the API
- [x] 5.4 Create `src/api/auth.ts` — setup, login, me, logout functions

## 6. Frontend Auth Integration

- [x] 6.1 Create `src/hooks/useAuth.ts` — manages JWT, login/logout, setup state, auto-check on mount
- [x] 6.2 Create `src/components/Auth/LoginForm.tsx` — email + password login form
- [x] 6.3 Create `src/components/Auth/SetupForm.tsx` — first-time registration form
- [x] 6.4 Update `App.tsx` — show SetupForm if no users, LoginForm if unauthenticated, main app if authenticated
- [x] 6.5 Add logout button to Navigation

## 7. Migrate Hooks to API

- [x] 7.1 Rewrite `useRoutines` hook to use `src/api/routines.ts` instead of localStorage
- [x] 7.2 Rewrite `useCompletions` hook to use `src/api/completions.ts` instead of localStorage
- [x] 7.3 Remove or deprecate `src/storage/` directory (keep for migration tool)

## 8. Data Migration

- [x] 8.1 Create `src/api/migrate.ts` — function to read localStorage and POST to `/api/migrate`
- [x] 8.2 Create `server/src/routes/migrate.ts` — POST `/api/migrate` that bulk-inserts routines and completions
- [x] 8.3 Create `src/components/MigrationBanner.tsx` — detects localStorage data, offers migration after login
- [x] 8.4 Wire MigrationBanner into App.tsx after authentication

## 9. Reminders

- [x] 9.1 Create `public/sw.js` — Service Worker for scheduled notifications
- [x] 9.2 Create `src/components/Settings/Settings.tsx` — enable/disable reminders, set reminder time
- [x] 9.3 Create `src/hooks/useReminders.ts` — manages notification permission, stores preferences in localStorage
- [x] 9.4 Add `/settings` route and "Ajustes" link to Navigation
- [x] 9.5 Implement notification logic: at configured time, check pending routines via API, show notification

## 10. Verification

- [x] 10.1 Build frontend and backend, verify no TypeScript errors
- [x] 10.2 Test: setup first user, login, create routine, check-in, verify data persists after browser restart
- [x] 10.3 Test: migrate localStorage data to backend via migration tool
- [x] 10.4 Test: enable reminder, verify notification appears at configured time
