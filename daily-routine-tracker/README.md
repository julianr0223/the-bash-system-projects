This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Releasing a new version

This project uses [SemVer](https://semver.org/) (`MAJOR.MINOR.PATCH`). The version lives in `package.json#version` and is shown in the UI footer alongside the commit SHA.

### When to bump what

- **PATCH** (`0.1.0` → `0.1.1`) — bug fixes, UI tweaks, internal refactors, seed/migration changes that don't break existing data.
- **MINOR** (`0.1.0` → `0.2.0`) — new user-visible functionality (new page, new routine type, new metric).
- **MAJOR** (`0.1.0` → `1.0.0`) — changes that require manual data migration or change how the app is used.

### Workflow

1. Commit any pending changes on `develop` (working tree must be clean).
2. Run the release command:
   ```bash
   npm run release          # patch bump (default)
   npm run release minor    # minor bump
   npm run release major    # major bump
   ```
3. `npm version` edits `package.json`, creates a commit `vX.Y.Z` and a git tag `vX.Y.Z`.
4. `git push --follow-tags` pushes both to `develop`. Coolify detects the push and deploys automatically.
5. After the deploy finishes, the new version appears in the UI footer.

> **Note:** Tags live on `develop` since that's the deployment branch. The commit SHA in the badge always identifies the exact build, even between bumps.

## Deploy with Docker

The application uses SQLite for data storage. The database file is stored in `/app/data` inside the container, which must be backed by a persistent Docker volume.

### Start the application

```bash
docker compose up -d --build
```

### Update/redeploy (data persists)

```bash
docker compose down
docker compose up -d --build
```

### WARNING: Destroying data

Running `docker compose down -v` **will delete the volume and all data**. Only use this if you intentionally want to reset the database.

### Build args

| Arg | Default | Description |
|-----|---------|-------------|
| `APP_COMMIT_SHA` | `dev` | Short git SHA inlined into the bundle and shown in the UI footer. Pass with `--build-arg APP_COMMIT_SHA=$(git rev-parse --short HEAD)` so deployments are identifiable. |

Example:

```bash
docker build --build-arg APP_COMMIT_SHA=$(git rev-parse --short HEAD) -t daily-routine-tracker .
```

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `change-me-to-a-random-string` | Secret for JWT token signing |
| `DATA_DIR` | `/app/data` | Directory for SQLite database storage |
| `PORT` | `3000` | Application port |

## Deploy with Coolify

Coolify does not use `docker-compose.yml` — it builds the Docker image and runs the container independently. The `VOLUME /app/data` declaration in the Dockerfile allows Coolify to detect the persistent mount point automatically.

### Steps

1. Create a new resource in Coolify and point it to the Git repository.
2. Set the build pack to **Dockerfile**.
3. Go to **Storages** (or **Persistent Storage**) in the resource settings.
4. Add a new volume mount:
   - **Source (Host Path or Volume Name)**: Leave blank for a Docker-managed volume, or specify a host path like `/data/daily-routine-tracker`.
   - **Destination**: `/app/data`
5. Add the required environment variables:
   - `JWT_SECRET`: A random, secure string (do not use the default).
   - `DATA_DIR`: `/app/data`
   - `PORT`: `3000`
6. Deploy. Check the logs for:
   ```
   [entrypoint] Volume mount detected at /app/data
   [entrypoint] Data directory OK: /app/data
   ```

### Verify persistence

1. Create a routine or make a change in the app.
2. Redeploy the application from Coolify.
3. Confirm the data is still there after redeploy.

### Troubleshooting

**Permission errors (`Data directory is not writable`)**:
The container runs as UID 1001 / GID 1001. If using a host bind mount, fix permissions:
```bash
sudo chown -R 1001:1001 /data/daily-routine-tracker
```

**Data lost after redeploy (`No existing database found`)**:
The volume is not correctly mounted. Check:
1. In Coolify, verify **Storages** has `/app/data` configured.
2. Check logs for `WARNING: /app/data is NOT a mounted volume` — this means no volume was mounted.
3. If using a Docker-managed volume, ensure you are not deleting volumes between deploys.

**WAL files (`data.db-wal`, `data.db-shm`)**:
These are normal SQLite WAL mode files. Do not delete them — they contain uncommitted data.

### Diagnostics

On startup, the application logs the database path:
```
[entrypoint] Data directory OK: /app/data
[db] Database path: /app/data/data.db
```

If you see the database path pointing somewhere other than `/app/data/data.db`, the volume is not mounted correctly.
