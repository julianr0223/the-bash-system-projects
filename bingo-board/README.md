# Bingo Board

App de **tablero de registro de bingo** (75 bolas, B-I-N-G-O · 1-75) con estética neón oscuro tipo casino.

Un cantador pulsa "Sacar número", la app extrae aleatoriamente un número no cantado, lo anuncia por voz en español y lo marca en el tablero. Incluye historial de últimos cantados, deshacer, reiniciar con confirmación y persistencia local.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + CSS global con tokens `oklch`
- Web Speech API (`SpeechSynthesis`) para anuncio por voz
- `localStorage` para persistencia del estado

## Scripts

```bash
npm run dev        # arranca dev server en http://localhost:3100
npm run build      # build de producción
npm start          # sirve el build (puerto 3100)
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest run
npm run test:watch # vitest en watch
```

## Navegadores soportados

Por uso de `oklch()` y `oklch(from ...)`:
- Chrome 111+
- Safari 16.4+
- Firefox 113+

## Notas

- La voz usa la voz en español que el navegador tenga disponible (`lang.startsWith('es')`); si no hay ninguna, usa la voz por defecto con `lang = es-ES`.
- El estado se guarda en `localStorage` bajo la clave `bingo-state-v1` y sobrevive a refresco.
- En desktop (≥ 961px) el caller y el tablero caben en el viewport sin scroll global; el tablero tiene scroll vertical interno propio.
