## Why

La app actualmente requiere dos procesos separados: Vite (frontend en :5173) y Express (API en :3001), conectados por un proxy. Esto complica el desarrollo (dos terminales, dos `npm run dev`) y el deploy. Migrar a Next.js unifica frontend y API en un solo framework, un solo proceso, y un solo comando.

## What Changes

- **BREAKING**: Reescribir el proyecto como app Next.js con App Router
- Migrar componentes React existentes a Next.js pages/layouts (client components)
- Migrar API Express a Next.js Route Handlers (`app/api/`)
- Migrar lógica de SQLite (`server/src/db.ts`, routes) a `lib/` dentro del proyecto Next.js
- Eliminar directorio `server/` y dependencia de Express/cors
- Eliminar Vite y su configuración (Next.js incluye su propio bundler)
- Los hooks del frontend (`useRoutines`, `useCompletions`, etc.) se mantienen — solo cambia la URL base de la API (de `/api/` a `/api/`, mismo path)
- El Service Worker de recordatorios se mantiene en `public/sw.js`

## Capabilities

### New Capabilities
- `nextjs-app`: Estructura de proyecto Next.js con App Router — layout principal, páginas, y API Route Handlers que reemplazan Express

### Modified Capabilities
<!-- Esta es una migración de infraestructura. Los requirements funcionales de las capabilities existentes no cambian.
     Las mismas APIs, misma auth, mismos datos. Solo cambia la implementación subyacente. -->

## Impact

- **Estructura completa**: El proyecto se reestructura de Vite+Express a Next.js App Router
- **Dependencies**: Se eliminan express, cors, vite, @vitejs/plugin-react. Se agrega next, react (ya existe)
- **Build**: De `vite build` + `tsc` (server) a `next build`
- **Dev**: De dos procesos a un solo `npm run dev` (next dev)
- **Deploy**: Un solo artefacto desplegable (Next.js standalone o Vercel)
- **Frontend API layer** (`src/api/`): Se mantiene, mismos endpoints `/api/*`
- **SQLite**: Se mantiene mejor-sqlite3, se mueve de `server/src/db.ts` a `lib/db.ts`
