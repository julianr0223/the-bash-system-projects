## Context

La app tiene: React SPA (Vite) con 8 páginas/rutas + Express backend con SQLite + JWT auth. Funciona pero requiere dos procesos. El objetivo es consolidar todo en Next.js App Router para un solo proceso, un solo `npm run dev`, un solo deploy.

Los componentes React son todos client components (usan hooks, state, events). Los API endpoints son 4 archivos Express (auth, routines, completions, migrate). El frontend ya se comunica vía `fetch('/api/...')` — los mismos paths funcionan en Next.js.

## Goals / Non-Goals

**Goals:**
- Un solo `npm run dev` levanta todo (frontend + API + SQLite)
- Mantener TODA la funcionalidad existente sin cambios visibles al usuario
- Reutilizar componentes, hooks, utils, y estilos existentes con mínimos cambios
- Next.js App Router con client components (no SSR para esta app)

**Non-Goals:**
- Aprovechar SSR/RSC de Next.js (los componentes son interactivos, client-only)
- Cambiar la lógica de negocio, auth, o base de datos
- Rediseñar la UI

## Decisions

### 1. Crear proyecto Next.js nuevo junto al existente, luego reemplazar

**Decisión**: Crear la app Next.js en un directorio nuevo (`daily-routine-tracker-next/`), mover todo, y luego renombrar. No intentar migrar in-place.

**Razón**: Migrar in-place es propenso a conflictos de configuración entre Vite y Next.js. Un proyecto limpio es más seguro.

### 2. App Router con layout + client pages

**Decisión**: Usar App Router (`app/` directory). Un `layout.tsx` con el auth check y navigation. Cada ruta es un `page.tsx` que importa el componente existente como client component.

**Estructura**:
```
app/
├── layout.tsx          ← Auth wrapper + Navigation + MigrationBanner
├── page.tsx            ← Dashboard (client)
├── agenda/page.tsx     ← DailyAgenda (client)
├── checkin/page.tsx    ← DailyCheckin (client)
├── routines/page.tsx   ← RoutineList (client)
├── reports/page.tsx    ← Reports (client)
├── badges/page.tsx     ← Badges (client)
├── stats/page.tsx      ← Stats (client)
├── settings/page.tsx   ← Settings (client)
├── login/page.tsx      ← Login/Setup form (client)
└── api/
    ├── auth/
    │   ├── setup/route.ts
    │   ├── login/route.ts
    │   ├── me/route.ts
    │   └── status/route.ts
    ├── routines/
    │   ├── route.ts         ← GET, POST
    │   └── [id]/route.ts    ← PUT, DELETE
    ├── completions/
    │   ├── route.ts         ← GET, POST
    │   └── [routineId]/[date]/route.ts  ← DELETE
    └── migrate/route.ts
```

### 3. API Route Handlers: conversión directa de Express

**Decisión**: Cada Express route se convierte 1:1 a un Next.js Route Handler. La lógica se copia directa — solo cambia de `(req, res) =>` a `(request: NextRequest) => NextResponse.json(...)`.

**Razón**: La lógica de negocio no cambia. Es una traducción mecánica.

### 4. SQLite: misma lógica en `lib/db.ts`

**Decisión**: Mover `server/src/db.ts` a `lib/db.ts`. Mismo código, solo cambia el path de la DB para que esté en la raíz del proyecto.

**Razón**: better-sqlite3 funciona igual en Next.js (Node runtime en API routes).

### 5. Auth middleware como helper function

**Decisión**: En lugar de middleware Express, crear una función `getAuthUser(request)` en `lib/auth.ts` que cada Route Handler llama al inicio. Retorna el userId o lanza error.

**Razón**: Next.js Route Handlers no tienen middleware chain como Express. Una función helper logra lo mismo.

### 6. Componentes: client components con "use client"

**Decisión**: Todos los componentes existentes se marcan con `"use client"` al top. Los hooks (useRoutines, useCompletions, useAuth) siguen llamando a `fetch('/api/...')`.

**Razón**: Estos componentes usan useState, useEffect, onClick — son inherentemente client components. No intentar convertirlos a RSC.

### 7. CSS Modules: se mantienen sin cambios

**Decisión**: Next.js soporta CSS Modules nativamente. Los archivos `.module.css` se copian sin cambios.

**Razón**: Compatibilidad directa.

### 8. next.config: output standalone para deploy

**Decisión**: Configurar `output: 'standalone'` para que el build genere un servidor Node autocontenido, desplegable en Vercel o homelab.

**Razón**: Necesitamos Node runtime para SQLite (no funciona en Edge/serverless puro).

## Risks / Trade-offs

- **[better-sqlite3 en Next.js]** → Necesita Node runtime, no funciona en Edge. Mitigation: configurar `runtime: 'nodejs'` en los Route Handlers.
- **[Tamaño del bundle]** → Next.js puede ser más pesado que Vite para SPA pura. Mitigation: aceptable para una app personal.
- **[Client components everywhere]** → No aprovechamos RSC. Mitigation: está bien para esta app — es interactiva, no content-heavy.
