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

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `change-me-to-a-random-string` | Secret for JWT token signing |
| `DATA_DIR` | `/app/data` | Directory for SQLite database storage |
| `PORT` | `3000` | Application port |

### Diagnostics

On startup, the application logs the database path:
```
[entrypoint] Data directory OK: /app/data
[db] Database path: /app/data/data.db
```

If you see the database path pointing somewhere other than `/app/data/data.db`, the volume is not mounted correctly.
