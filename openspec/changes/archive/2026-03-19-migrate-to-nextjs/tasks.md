## 1. Scaffold Next.js Project

- [x] 1.1 Create new Next.js app with `create-next-app` (App Router, TypeScript, no Tailwind, no src dir — use app/ at root)
- [x] 1.2 Install better-sqlite3, jsonwebtoken, bcryptjs and their @types
- [x] 1.3 Configure next.config.ts: output standalone, experimental serverComponentsExternalPackages for better-sqlite3

## 2. Database & Auth Library

- [x] 2.1 Copy `server/src/db.ts` to `lib/db.ts`, adjust DB path to project root
- [x] 2.2 Copy auth helpers (JWT sign/verify, password hash) to `lib/auth.ts`

## 3. API Route Handlers

- [x] 3.1 Create `app/api/auth/status/route.ts` — GET (public, returns needsSetup)
- [x] 3.2 Create `app/api/auth/setup/route.ts` — POST (create first user)
- [x] 3.3 Create `app/api/auth/login/route.ts` — POST (verify credentials, return JWT)
- [x] 3.4 Create `app/api/auth/me/route.ts` — GET (verify token, return user)
- [x] 3.5 Create `app/api/routines/route.ts` — GET (list), POST (create)
- [x] 3.6 Create `app/api/routines/[id]/route.ts` — PUT (update), DELETE (delete)
- [x] 3.7 Create `app/api/completions/route.ts` — GET (by date or all), POST (add)
- [x] 3.8 Create `app/api/completions/[routineId]/[date]/route.ts` — DELETE
- [x] 3.9 Create `app/api/migrate/route.ts` — POST (bulk import)

## 4. Copy Frontend Assets

- [x] 4.1 Copy `src/types/` to `types/`
- [x] 4.2 Copy `src/utils/` to `utils/`
- [x] 4.3 Copy `src/api/` (client, auth, routines, completions, migrate) to `api-client/`
- [x] 4.4 Copy `src/hooks/` to `hooks/`
- [x] 4.5 Copy `src/components/` to `components/`
- [x] 4.6 Copy `public/sw.js` to `public/sw.js`
- [x] 4.7 Copy global CSS (`src/index.css`) to `app/globals.css`

## 5. Next.js Pages & Layout

- [x] 5.1 Create `app/layout.tsx` — root layout with global CSS import and html/body tags
- [x] 5.2 Create `app/providers.tsx` — client component with auth check, navigation, migration banner (extracted from old App.tsx)
- [x] 5.3 Create `app/page.tsx` — Dashboard page (client component)
- [x] 5.4 Create `app/agenda/page.tsx` — DailyAgenda page
- [x] 5.5 Create `app/checkin/page.tsx` — DailyCheckin page
- [x] 5.6 Create `app/routines/page.tsx` — RoutineList page
- [x] 5.7 Create `app/reports/page.tsx` — Reports page
- [x] 5.8 Create `app/badges/page.tsx` — Badges page
- [x] 5.9 Create `app/stats/page.tsx` — Stats page
- [x] 5.10 Create `app/settings/page.tsx` — Settings page

## 6. Fix Imports & Adapt

- [x] 6.1 Add "use client" directive to all components that use hooks/state/events
- [x] 6.2 Update import paths across all copied files (src/ → root-relative)
- [x] 6.3 Replace react-router-dom NavLink with next/link in Navigation component
- [x] 6.4 Replace react-router-dom useNavigate (if any) with next/navigation
- [x] 6.5 Remove BrowserRouter wrapper — Next.js handles routing

## 7. Cleanup & Verification

- [x] 7.1 Build the Next.js project, fix any TypeScript errors
- [x] 7.2 Delete old `server/` directory from new project
- [x] 7.3 Delete old Vite config files (vite.config.ts, etc.) from new project
- [x] 7.4 Replace old `daily-routine-tracker/` with the new Next.js version
- [x] 7.5 Test: run `npm run dev`, setup first user, create routine, check-in, verify all pages work
