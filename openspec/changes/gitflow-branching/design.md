## Context

The app has a CI pipeline (`.github/workflows/ci.yml`) that validates on push to `main`. Coolify watches `main` for auto-deploy. We need to add `develop` as the day-to-day working branch.

## Goals / Non-Goals

**Goals:**
- `develop` as integration branch — all PRs target here
- CI runs on push to `develop` and `main`, and on PRs to both
- `main` only receives merges from `develop` — production-ready code
- Coolify continues deploying only from `main`

**Non-Goals:**
- Release branches or hotfix branches (keep it simple)
- Separate staging environment for `develop`
- Branch protection rules (configured in GitHub UI, not in code)

## Decisions

**Simplified gitflow:** Only two long-lived branches (`develop` and `main`). No release branches. Feature branches merge into `develop`, `develop` merges into `main` for production.

**Same CI for both branches:** Both branches run the full pipeline (type-check, build, docker). No differentiation — if it passes on `develop`, it passes on `main`.

**Coolify unchanged:** Coolify already watches `main`. No configuration needed.

## Risks / Trade-offs

- **Extra merge step:** Merging `develop` → `main` is a manual step. This is intentional — it's the production gate.
- **No staging:** `develop` doesn't deploy anywhere. Testing happens locally or via PR previews if added later.
