## Why

Necesitamos una app de **tablero de registro de bingo** (75 bolas, B-I-N-G-O · 1-75) que permita a un cantador generar números aleatorios uno a uno, mostrarlos con prominencia visual y voz, y llevar el registro de cuáles han salido. El diseño ya está validado por el usuario en Claude Design (estética neón oscuro tipo casino moderno, layout de dos columnas en escritorio, responsive); falta implementarlo en stack productivo dentro del workspace como subproyecto independiente.

## What Changes

- Nuevo subproyecto `bingo-board/` (hermano de `daily-routine-tracker/`) con Next.js 15 + TypeScript (App Router) y Tailwind para estilos.
- Recreación pixel-perfect del diseño `Bingo Board.html` con componentes React modulares (no copiar la estructura del prototipo, solo el output visual).
- Lógica de juego cliente-only: extracción aleatoria de 1-75 sin repetición, deshacer último, reiniciar con confirmación, contador y barra de progreso.
- Anuncio por voz (Web Speech API / SpeechSynthesis) en español con toggle ON/OFF.
- Persistencia del estado de partida en `localStorage` (sobrevive a refresco).
- Animaciones: shake "drum-roll" mientras saca, pop al revelar bola, pop al marcar celda, glow neón por columna.
- Layout responsive: desktop con caller + tablero visibles sin scroll global; tablero con scroll interno propio; móvil flujo vertical.

## Capabilities

### New Capabilities
- `bingo-drawing`: motor de extracción aleatoria sin repetición de 1-75, con deshacer, reiniciar y persistencia local del estado.
- `bingo-board-view`: presentación visual del cantador (bola grande con letra+número, glow por columna, mini-bolas de últimos cantados) y del tablero 1-75 organizado en 5 columnas B-I-N-G-O con celdas marcadas por color.
- `bingo-voice-callout`: anuncio por voz del número extraído usando Web Speech API en español, con toggle de activación.

### Modified Capabilities
<!-- Ninguna: el subproyecto bingo-board es independiente de los specs existentes (daily-routine-tracker). -->

## Impact

- **Código nuevo**: directorio `bingo-board/` con app Next.js (package.json propio, tsconfig, tailwind).
- **Dependencias nuevas**: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, fuentes Google (Bebas Neue, JetBrains Mono, Sora).
- **APIs del navegador usadas**: `localStorage`, `window.speechSynthesis`.
- **Sin backend**: app puramente cliente, hosteable como estática (Vercel/Netlify/Cloudflare Pages).
- **Sin afectación** a `daily-routine-tracker/` ni a specs existentes.
