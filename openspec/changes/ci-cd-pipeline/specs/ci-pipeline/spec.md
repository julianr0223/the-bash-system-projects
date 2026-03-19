# CI Pipeline

## Requirements

### REQ-1: Type Check
- Run `npx tsc --noEmit` on push to `main` and on PRs
- Fail the pipeline if TypeScript errors exist

### REQ-2: Build Validation
- Run `npm run build` to verify Next.js standalone build succeeds
- Fail the pipeline if build fails

### REQ-3: Docker Build Validation
- Run `docker build` to verify the Dockerfile produces a valid image
- Tag as `test` (not pushed to any registry)
- Fail the pipeline if Docker build fails

### REQ-4: Path Filtering
- Only trigger when files under `daily-routine-tracker/` change
- Ignore changes to other directories in the monorepo

### REQ-5: Working Directory
- All npm/node steps run with `working-directory: daily-routine-tracker`
