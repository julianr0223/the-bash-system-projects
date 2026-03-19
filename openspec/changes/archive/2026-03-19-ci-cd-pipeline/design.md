## Context

The daily-routine-tracker app is a Next.js app with SQLite (better-sqlite3), deployed to a homelab server via Coolify. Coolify already handles auto-deploy on push via webhook. We need a CI gate before that deploy happens.

The project lives in `daily-routine-tracker/` subdirectory within a monorepo.

## Goals / Non-Goals

**Goals:**
- Validate TypeScript compilation on every push to `main` and on PRs
- Validate that the Next.js build succeeds
- Validate that the Docker image builds correctly
- Keep the pipeline fast (<5 minutes)

**Non-Goals:**
- Automated testing (no test suite exists yet)
- Deploying from GitHub Actions (Coolify handles deploy)
- Linting or formatting enforcement
- Notifications or Slack integration

## Decisions

**Single workflow file:** One `.github/workflows/ci.yml` with sequential jobs (type-check → build → docker). Simple and sufficient for a single-app repo.

**Working directory:** All steps use `working-directory: daily-routine-tracker` since the app is in a subdirectory.

**Docker build validation:** Build the image but don't push it anywhere. Just verify it compiles. Tag it as `test` to avoid confusion with production images.

**Node 20 + Alpine for Docker consistency:** Match the Dockerfile's Node version in CI to catch issues early.

**Trigger on paths:** Only trigger when files in `daily-routine-tracker/` change, to avoid running CI on unrelated changes in the monorepo.

## Risks / Trade-offs

- **No tests in CI:** We validate build, not behavior. Acceptable for now — tests can be added later.
- **Docker build adds ~2 min:** Worth it to catch Dockerfile issues before Coolify tries to build.
- **Path filter may miss some triggers:** Changes to root-level configs (if any) won't trigger CI. Acceptable since the app is self-contained.
