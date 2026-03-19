## 1. GitHub Actions Workflow

- [x] 1.1 Create `.github/workflows/ci.yml` with trigger on push to `main` and PRs, path filter for `daily-routine-tracker/**`
- [x] 1.2 Add type-check step: `npx tsc --noEmit` with `working-directory: daily-routine-tracker`
- [x] 1.3 Add build step: `npm run build` with `working-directory: daily-routine-tracker`
- [x] 1.4 Add Docker build step: `docker build -t daily-routine-tracker:test daily-routine-tracker/`

## 2. Verification

- [x] 2.1 Verify workflow YAML is valid syntax
- [x] 2.2 Run type-check locally to confirm it passes
- [x] 2.3 Run build locally to confirm it passes
