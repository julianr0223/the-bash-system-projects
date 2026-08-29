# CLAUDE.md — The Bash System Projects

Guía para Claude Code al trabajar en este repositorio.

## Qué es

Monorepo paraguas de proyectos web pequeños bajo la marca *The Bash System*. Cada subproyecto vive en su propia carpeta, con su `package.json` y su `CLAUDE.md` propio; este repo solo los agrupa bajo un control de versiones común.

- `bingo-board/` — registro de bingo de 75 bolas, tema neón (Next.js)
- `daily-routine-tracker/` — **completado y archivado** (ver `Archivo/Proyectos/Daily Routine Tracker.md` en el vault)

## Vault (centro de operaciones)

Este repo tiene su stub en el vault de Obsidian:
`~/projects/tools/obsidian/Proyectos/The Bash System Projects - Repo.md`

- Decisiones, bitácora y pendientes de alto nivel se registran en el stub del vault, **no** acá.
- Al iniciar una sesión de trabajo, leer el stub para recuperar contexto (estado, pendientes, decisiones).
- Un subproyecto con vida propia puede tener su **propia** nota de proyecto en el vault, que referencia este repo. El stub del repo sigue siendo uno solo.
- Para escribir en el vault desde este repo, leer antes `~/projects/tools/obsidian/CLAUDE.md` (contrato de convenciones) — o usar la skill `vault-obsidian`.

## Cómo trabajar acá

Los comandos se corren **dentro de la carpeta del subproyecto**, no en la raíz. Antes de tocar uno, leer su `CLAUDE.md` local.

## Nota sobre openspec

`openspec/` en la raíz es residuo del workflow que ya no se usa (ver la decisión de retiro en `Proyectos/Transcript Studio.md`, 2026-08-15). No agregar changes nuevos ahí; si algo del contenido sirve, migrarlo al stub del vault.
