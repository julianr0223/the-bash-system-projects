## 1. Environment Configuration

- [x] 1.1 Update `lib/db.ts` to use `DATA_DIR` env var for DB path (default: project root)
- [x] 1.2 Create `.env.example` with JWT_SECRET, PORT, DATA_DIR

## 2. Docker Files

- [x] 2.1 Create `.dockerignore` (node_modules, .next, data.db, .git, .env)
- [x] 2.2 Create multi-stage `Dockerfile` (deps → build → runner with standalone output)
- [x] 2.3 Create `docker-compose.yml` with volume for data persistence and env vars

## 3. Verification

- [x] 3.1 Run `docker compose build` and verify image builds successfully
- [x] 3.2 Run `docker compose up -d`, verify app starts, login works, data persists after restart
