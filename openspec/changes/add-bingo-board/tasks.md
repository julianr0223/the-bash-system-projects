## 1. Bootstrap del subproyecto

- [x] 1.1 Crear `bingo-board/` con `npx create-next-app@latest bingo-board --ts --tailwind --app --no-src-dir --eslint --import-alias "@/*"`
- [x] 1.2 Verificar que `pnpm dev` arranca sin errores (puerto distinto al del daily-routine-tracker)
- [x] 1.3 Configurar `tsconfig.json` con `strict: true` y paths `@/components/*`, `@/hooks/*`, `@/lib/*`
- [x] 1.4 Limpiar boilerplate de `app/page.tsx` y `app/globals.css` (dejar solo `@tailwind` directives + reset)
- [x] 1.5 Añadir scripts útiles en `package.json`: `dev`, `build`, `start`, `lint`, `typecheck`, `test`

## 2. Sistema de diseño y fuentes

- [x] 2.1 Configurar `next/font/google` en `app/layout.tsx` para Bebas Neue, JetBrains Mono y Sora con sus pesos respectivos, exponiéndolas como variables CSS (`--font-bebas`, `--font-jetbrains`, `--font-sora`)
- [x] 2.2 En `app/globals.css` declarar `:root` con las variables: `--bg-0`, `--bg-1`, `--bg-2`, `--line`, `--line-strong`, `--text`, `--text-dim`, `--text-faint` y los acentos `--B`, `--I`, `--N`, `--G`, `--O` con los mismos valores `oklch` del prototipo
- [x] 2.3 Aplicar al `body` el gradiente radial de fondo y la rejilla `60×60px` con máscara radial (pseudo-elemento `::before`)
- [x] 2.4 Definir keyframes globales: `pulse`, `drawIn`, `shake`, `cellPop`, `toastIn`
- [x] 2.5 Configurar Tailwind para reconocer las variables como utilidades cuando convenga (o dejarlas como CSS plano en clases utilitarias custom)

## 3. Utilidades y tipos

- [x] 3.1 Crear `lib/columns.ts` con la const `COLUMNS` (B/I/N/G/O con sus rangos), `getLetter(n)` y `getColorVar(n)`
- [x] 3.2 Crear `lib/storage.ts` con `loadState()` y `saveState(state)` usando clave `bingo-state-v1`, con `try/catch` y guard de shape
- [x] 3.3 Definir tipos `BingoState`, `Latest`, `Letter` en `lib/types.ts`

## 4. Hooks de dominio

- [x] 4.1 Implementar `hooks/useBingoEngine.ts` con estado `{drawn, latest, drawing, voiceOn}` y acciones `draw`, `undo`, `reset`, `toggleVoice`
- [x] 4.2 Integrar persistencia: efecto de carga en montaje (try/catch) y efecto de guardado con deps `[drawn, latest, voiceOn]`
- [x] 4.3 En `draw()`: calcular `available = {1..75} \ drawn`, seleccionar uniformemente, manejar caso lleno (toast), respetar lock `drawing` (~900 ms con `setTimeout`)
- [x] 4.4 En `undo()`: pop del array `drawn`, recomputar `latest`, mostrar toast
- [x] 4.5 En `reset()`: limpiar estado, cancelar voz pendiente, mostrar toast
- [x] 4.6 Implementar `hooks/useVoiceCallout.ts` con `speak(letter, n)` y `cancel()`; pre-cargar voces en montaje + handler `onvoiceschanged`; selección de voz `lang.startsWith('es')`; noop si la API no existe
- [x] 4.7 Cablear `useBingoEngine` para llamar `speak(latest.letter, latest.n)` cuando se revele un nuevo `latest` y `voiceOn === true`

## 5. Componentes de presentación

- [x] 5.1 `components/Topbar.tsx` con logo (cuadrado gradiente B↔O con letra "B"), texto "BINGO 75 / TABLERO DE REGISTRO", pills "CANTADOS X/75" y "RESTAN Y", `<VoiceToggle/>`. Sticky top.
- [x] 5.2 `components/VoiceToggle.tsx` con dot indicador y labels ON/OFF, estilo pill
- [x] 5.3 `components/Ball.tsx` que recibe `{letter, n, drawing}` y renderiza la bola grande con `--ball-color`, glow halo, brillo `::after`, anima `drawIn` al cambiar `key={n}` y `shake` cuando `drawing`. Variante vacía con texto placeholder.
- [x] 5.4 `components/Caller.tsx` que compone header de sección, `<Ball/>`, controles (`SACAR NÚMERO` primario, `DESHACER`, `REINICIAR`), y `<RecentList/>`. Maneja estados disabled.
- [x] 5.5 `components/RecentList.tsx` que recibe `drawn` y muestra hasta 12 mini-bolas en orden inverso, label "ÚLTIMOS CANTADOS · K de M", scroll horizontal, fallback "Aún no se ha cantado ningún número."
- [x] 5.6 `components/Board.tsx` que renderiza grid 5 columnas × (1 header + 15 celdas). Header con clase `col-{letter}`. Celda con `col-{letter}`, modificadores `drawn` y `latest`. Maneja scroll interno y barra de progreso fija arriba.
- [x] 5.7 `components/ResetModal.tsx` controlado por prop `open`, con backdrop blur, `h2` "¿REINICIAR PARTIDA?", texto con conteo, acciones CANCELAR / REINICIAR, cierre por click en backdrop
- [x] 5.8 `components/Toast.tsx` que muestra mensaje fijo abajo-centro durante ~1800 ms con animación `toastIn`

## 6. Composición y layout

- [x] 6.1 `components/BingoApp.tsx` (`'use client'`) que llama `useBingoEngine`, monta `<Topbar/>`, `<main className="stage">` con `<Caller/>` y `<Board/>`, footer condicional móvil, `<Toast/>` y `<ResetModal/>`
- [x] 6.2 `app/page.tsx` server component que importa y renderiza `<BingoApp/>`
- [x] 6.3 Aplicar layout grid `1fr 1.35fr` con `height: calc(100vh - 79px)` en ≥ 961px y colapso a una columna en ≤ 960px
- [x] 6.4 Verificar que en desktop ambas columnas son visibles sin scroll global y la columna O del board NO queda recortada
- [x] 6.5 Verificar que el board tiene scroll vertical interno propio cuando no cabe

## 7. Pruebas y verificación

- [x] 7.1 Añadir Vitest + jsdom en `bingo-board/` (`pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom`)
- [x] 7.2 Test de `useBingoEngine.draw()`: tras 75 llamadas se han extraído todos los números 1..75 sin repetidos
- [x] 7.3 Test de `useBingoEngine.undo()`: tras `draw()`+`undo()` el estado vuelve al inicial
- [x] 7.4 Test de `useBingoEngine.reset()`: limpia `drawn` y `latest`
- [x] 7.5 Test de `lib/storage`: roundtrip save/load conserva el estado; load con JSON corrupto retorna `null` sin lanzar
- [x] 7.6 Verificar `pnpm typecheck` y `pnpm lint` sin errores
- [x] 7.7 Verificar `pnpm build` produce build de producción sin warnings críticos
- [x] 7.8 Smoke test manual: sortear 5 números, escuchar voz, deshacer, reiniciar (con confirmación), refrescar página y comprobar persistencia, alternar VOZ ON/OFF y verificar persistencia del toggle

## 8. Cierre

- [x] 8.1 Crear `bingo-board/README.md` con: descripción, comandos (`pnpm dev/build/start/test`), navegadores soportados (Chrome 111+, Safari 16.4+, Firefox 113+ por uso de `oklch`), nota sobre Web Speech API
- [x] 8.2 Añadir `.gitignore` con `node_modules`, `.next`, `out`, `coverage`
- [x] 8.3 Commit de la implementación completa
