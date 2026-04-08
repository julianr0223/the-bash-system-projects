## Context

La app es un Next.js 16 (Turbopack) desplegado vía Docker. No existe ningún mecanismo para identificar qué build está corriendo en una instancia. `package.json` actualmente tiene un `version` por defecto que nadie consulta.

## Goals / Non-Goals

**Goals:**
- Una sola fuente de verdad para la versión: `package.json`.
- Versión y SHA del commit visibles en la UI sin requerir login adicional ni endpoints.
- Funciona en dev (`npm run dev`) y en producción (Docker).

**Non-Goals:**
- Automatizar bumps de versión (eso lo decide el desarrollador o un release script futuro).
- Mostrar changelog en la UI.
- Versionado de la API (semver de endpoints).

## Decisions

### 1. `package.json` como fuente de verdad

La versión vive en `package.json#version`. Todas las demás referencias (UI, env vars) se derivan de ahí en build time. Alternativa descartada: archivo `VERSION` separado — agrega ceremonia sin beneficio.

### 2. Inyección via `next.config.ts` → `env`

`next.config.ts` lee `package.json` y ejecuta `git rev-parse --short HEAD` (con fallback a build arg) para poblar:

```ts
env: {
  NEXT_PUBLIC_APP_VERSION: pkg.version,
  NEXT_PUBLIC_APP_COMMIT: process.env.APP_COMMIT_SHA || gitSha || 'dev',
}
```

Las `NEXT_PUBLIC_*` quedan inlineadas en el bundle del cliente en build time, sin runtime overhead. Alternativa descartada: endpoint `/api/version` — innecesario ya que el valor es estático por build.

### 3. Componente `<VersionBadge />` en el layout

Un único componente client `components/VersionBadge.tsx` que lee `process.env.NEXT_PUBLIC_APP_VERSION` y `NEXT_PUBLIC_APP_COMMIT` y los muestra como `v1.2.3 (abc1234)` en el footer del layout autenticado. Estilo discreto (texto pequeño, color muted).

### 4. Docker: pasar SHA como build arg

En entornos donde `.git` no está disponible en el contexto del build (típico en Docker multi-stage), el `Dockerfile` recibe `ARG APP_COMMIT_SHA` y lo pasa como `ENV APP_COMMIT_SHA=...` antes de `npm run build`. CI/CD (Coolify, etc.) debe pasar `--build-arg APP_COMMIT_SHA=$(git rev-parse --short HEAD)`.

Si no se pasa, el fallback es `'dev'` para builds locales sin git.

## Risks / Trade-offs

- **[SHA no disponible en algunos builds]** → Fallback a `'dev'` para no romper. La versión semver siempre estará presente.
- **[Olvidar bumpear `package.json` antes de release]** → Mitigado documentando en CONTRIBUTING o con un script futuro; fuera del scope de este change.
- **[Cache del navegador puede mostrar versión vieja]** → Aceptable: al ser inlineada en el bundle, un hard reload basta. Next.js ya invalida assets por hash.
