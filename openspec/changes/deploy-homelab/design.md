## Context

App Next.js con SQLite (better-sqlite3), auth JWT, single-user. Necesita dockerizarse para homelab con Docker Compose. El output standalone de Next.js ya está configurado en `next.config.ts`.

## Goals / Non-Goals

**Goals:**
- Dockerfile multi-stage optimizado (imagen pequeña)
- Docker Compose con volumen para persistir `data.db`
- Variable de entorno para JWT_SECRET en producción
- Un solo comando para levantar: `docker compose up -d`

**Non-Goals:**
- HTTPS/SSL (se asume reverse proxy existente como Nginx/Caddy/Traefik)
- CI/CD pipeline
- Backups automáticos de la DB
- Health checks avanzados

## Decisions

### 1. Multi-stage Dockerfile con Next.js standalone

Next.js standalone output copia solo lo necesario a `.next/standalone/`. La imagen final solo necesita Node.js sin `node_modules` completo. Resultado: imagen ~200MB vs ~1GB.

### 2. Volumen Docker para datos

`data.db` se almacena en `/app/data/` dentro del container, mapeado a un volumen Docker. Requiere ajustar `DB_PATH` en `lib/db.ts` para usar una ruta configurable via env var.

### 3. JWT_SECRET obligatorio en producción

`lib/auth.ts` ya tiene fallback a un secret hardcoded. En producción debe ser obligatorio via env var. Se documenta en `.env.example`.

## Risks / Trade-offs

- **[SQLite write locking]** → Aceptable para single-user. No hay concurrencia real.
- **[Container restart pierde data sin volumen]** → Volumen Docker mitiga esto. Se documenta como requisito.
- **[better-sqlite3 necesita compilarse para la arquitectura del container]** → `npm rebuild` en el Dockerfile lo resuelve.
