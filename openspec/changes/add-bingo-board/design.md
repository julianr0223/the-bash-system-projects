## Context

El usuario validó en Claude Design un prototipo de "Tablero de Registro de Bingo" (75 bolas) construido como un único HTML autocontenido con React UMD + Babel standalone. El bundle incluye `Bingo Board.html` (790 líneas: estilos `:root` + componentes React + Web Speech API + localStorage) y la transcripción del chat donde se itera el layout (caller + tablero, scroll interno del tablero, columna O sin recorte).

El workspace actual hospeda `daily-routine-tracker/` (Next.js + SQLite). El stack preferido del usuario es Next.js + TypeScript. El bingo es 100% cliente (sin backend), pero se aprovecha el ecosistema Next.js por consistencia con el resto de proyectos del workspace y para tener build/optimización de fuentes y deploy estándar (Vercel).

El README del bundle es explícito: el HTML es un **prototipo**, no debe copiarse 1:1; hay que **recrear el output visual** en stack productivo.

## Goals / Non-Goals

**Goals:**
- Subproyecto `bingo-board/` independiente que renderiza pixel-perfect el diseño del prototipo.
- Componentes React TypeScript modulares (Caller, Board, Topbar, RecentList, ResetModal, Toast) — separación de presentación y lógica.
- Lógica de juego encapsulada en un hook `useBingoEngine()` (sorteo, deshacer, reiniciar, persistencia).
- Hook `useVoiceCallout()` que abstrae la Web Speech API.
- Estilos: Tailwind para layout/utilidades + un módulo CSS / archivo global con las variables `oklch()` y animaciones `@keyframes` que Tailwind no expresa cómodamente.
- Persistencia en `localStorage` con clave `bingo-state-v1` (compatible con la del prototipo, formato `{drawn, latest, voiceOn}`).
- Responsive: ≥ 961px dos columnas con altura `calc(100vh - 79px)`; ≤ 960px flujo vertical.

**Non-Goals:**
- Backend, base de datos, multi-usuario, autenticación.
- Gestión de cartones de jugadores (mencionado como posible extensión en el chat — explícitamente fuera).
- Modo automático con temporizador.
- Exportar listado o estadísticas.
- PWA / offline-first (puede llegar después; no en este change).
- Internacionalización: la UI se queda en español como el prototipo.

## Decisions

### 1. Stack: Next.js 15 App Router + TypeScript + Tailwind v4
- **Por qué**: coincide con el resto del workspace; Next.js da optimización de fuentes Google (Bebas Neue, JetBrains Mono, Sora) vía `next/font`, build estático directo (`output: 'export'` opcional), y la familia ya conocida por el usuario.
- **Alternativa considerada**: Vite + React puro. Más liviano para una app cliente-only, pero introduce un patrón distinto al ya usado en `daily-routine-tracker/`. Descartado por consistencia.
- **Tailwind v4** porque permite `@theme` con tokens `oklch` directos sin plugins.

### 2. Estilos: Tailwind + CSS global con tokens `oklch`
- **Por qué**: la paleta del prototipo usa `oklch()` con la sintaxis `oklch(from var(--X) calc(l + 0.18) c h)` para variantes. Tailwind utility-first cubre layout/spacing/typography, pero las variantes derivadas y los gradientes radiales complejos de la bola se expresan más limpiamente en CSS plano. Mezclar ambos.
- **Variables**: declarar `--B/--I/--N/--G/--O` en `:root` exactamente como en el prototipo.
- **Animaciones**: `@keyframes drawIn`, `shake`, `cellPop`, `pulse`, `toastIn` en CSS global.

### 3. Lógica de juego en un hook `useBingoEngine()`
- **Estado**: `{drawn: number[], latest: {n, letter} | null, drawing: boolean, voiceOn: boolean}`.
- **API expuesta**: `draw()`, `undo()`, `reset()`, `toggleVoice()`, derivados (`drawnSet`, `remaining`, `progress`).
- **Por qué un hook único**: evita prop-drilling y consolida la persistencia + sincronización con voz en un solo lugar.
- **Alternativa considerada**: Zustand/Redux. Sobredimensionado para una app de un solo cliente sin estado compartido entre rutas.

### 4. Voz: hook separado `useVoiceCallout()`
- **Contrato**: `speak(letter, n)` y `cancel()`. Internamente gestiona `getVoices()`, `onvoiceschanged`, selección de voz `es-*`, y noop si la API no existe.
- **Por qué separado**: testeable en aislamiento, y la lógica de voces tiene su propio ciclo de vida (eventos del navegador) que no debe contaminar el motor de juego.

### 5. Persistencia: efecto que escribe en cada cambio relevante
- Lectura única en `useEffect` de montaje con `try/catch` — si el JSON está corrupto, arrancar limpio.
- Escritura en `useEffect` con dependencias `[drawn, latest, voiceOn]`.
- Clave `bingo-state-v1` (versionada por si más adelante cambia el shape).

### 6. Estructura de archivos
```
bingo-board/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts          (si Tailwind v4 lo requiere)
├── postcss.config.mjs
├── app/
│   ├── layout.tsx              (fuentes Google vía next/font, body con gradiente)
│   ├── page.tsx                (monta <BingoApp/>)
│   └── globals.css             (variables, keyframes, body bg, grid overlay)
├── components/
│   ├── BingoApp.tsx            (composición top-level)
│   ├── Topbar.tsx
│   ├── Caller.tsx              (bola grande + controles + recent)
│   ├── Ball.tsx
│   ├── Board.tsx               (5 columnas × 15 filas)
│   ├── RecentList.tsx
│   ├── ResetModal.tsx
│   ├── Toast.tsx
│   └── VoiceToggle.tsx
├── hooks/
│   ├── useBingoEngine.ts
│   └── useVoiceCallout.ts
└── lib/
    ├── columns.ts              (COLUMNS const, getLetter, getColorVar)
    └── storage.ts              (load/save con guard)
```

### 7. Mapping prototipo → componentes
| Prototipo (Bingo Board.html) | Implementación |
|---|---|
| `<header className="topbar">` | `Topbar.tsx` |
| `<section className="caller">` | `Caller.tsx` con `<Ball/>` y `<RecentList/>` |
| `<section className="board-card">` | `Board.tsx` |
| Modal de reinicio | `ResetModal.tsx` |
| `<div className="toast">` | `Toast.tsx` |
| Toggle "VOZ ON/OFF" en topbar | `VoiceToggle.tsx` |
| `function App()` (estado global) | `useBingoEngine()` + `BingoApp.tsx` |
| `function speak(letter, num)` | `useVoiceCallout()` |

### 8. Tipografías vía `next/font/google`
- `Bebas_Neue` con `weight: '400'` para títulos/marca.
- `JetBrains_Mono` con `weight: ['400','500','700']` para metadatos/mono.
- `Sora` con `weight: ['300','400','600','800']` como sans por defecto.
- Asignar a CSS variables `--font-bebas`, `--font-jetbrains`, `--font-sora` via `variable` config.

### 9. Componente cliente
- `BingoApp` y descendientes que usan estado/efectos llevan `'use client'`.
- `app/page.tsx` puede ser server component que renderiza `<BingoApp/>`.

## Risks / Trade-offs

- **[Riesgo] `oklch()` y `oklch(from ...)` no soportado en navegadores antiguos** → Mitigación: documentar requisito Chrome 111+/Safari 16.4+/Firefox 113+. El prototipo ya asume esto. No añadir fallbacks (alcance fuera del change).
- **[Riesgo] `speechSynthesis` puede tardar en cargar voces y la primera locución sale en voz default** → Mitigación: pre-carga en montaje + handler `onvoiceschanged` (igual que el prototipo). Aceptable.
- **[Riesgo] Tailwind v4 aún emergente y la sintaxis `@theme` puede cambiar** → Mitigación: si surgen incompatibilidades durante la implementación, fallback a v3.4 documentando el motivo.
- **[Trade-off] Mezcla Tailwind + CSS global** → menos uniforme que una sola estrategia, pero más eficiente para gradientes/keyframes complejos. Aceptable.
- **[Trade-off] localStorage no se sincroniza entre pestañas** → Aceptable; un cantador usa una pestaña.
- **[Riesgo] Layout `100vh` problemático en móviles iOS (barra de URL)** → Mitigación: el diseño del prototipo solo aplica `100vh` en ≥ 961px (desktop), en móvil usa `auto`. Mantener esa condicional.

## Migration Plan

No aplica: subproyecto nuevo aislado. Plan de despliegue:
1. Crear `bingo-board/` con `npx create-next-app@latest --ts --tailwind --app --no-src-dir`.
2. Implementar siguiendo `tasks.md`.
3. Verificar build (`pnpm build`) sin errores.
4. Deploy opcional: `vercel --prod` o `next export` + cualquier hosting estático.

## Open Questions

- ¿Mantener exactamente `bingo-state-v1` como clave de localStorage, o versionarla a `v2` ahora que el shape lo controla TypeScript? — Decisión por defecto: mantener `v1` para no exigir migración.
- ¿Añadir tests? El prototipo no los tiene; el motor de juego es testeable (Vitest + React Testing Library). Decisión: incluir tests unitarios mínimos para `useBingoEngine` (sortear sin repetir, deshacer, reset) en `tasks.md`. Tests de UI quedan fuera.
