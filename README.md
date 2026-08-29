# The Bash System Projects

Monorepo paraguas de proyectos web pequeños bajo la marca *The Bash System*. Cada subproyecto vive en su propia carpeta con su `package.json`; este repositorio solo los agrupa bajo un control de versiones común.

## Subproyectos

| Carpeta | Qué es | Estado |
|---------|--------|--------|
| `bingo-board/` | Registro de bingo de 75 bolas, tema neón (Next.js) | Pausado |
| `daily-routine-tracker/` | Tracker de rutina diaria | Completado |

## Uso

Los comandos se corren dentro de la carpeta del subproyecto, no en la raíz:

```bash
cd bingo-board && npm install && npm run dev
```
