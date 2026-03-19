## Why

Currently, pushing code to the repository has no automated validation. Broken builds or type errors can reach the Coolify deploy without any gate. We need a CI pipeline that validates the code before Coolify auto-deploys, ensuring only verified code goes to production.

## What Changes

- Add GitHub Actions workflow that runs on push to `main` and on pull requests
- Workflow validates: TypeScript type-check, successful build, Docker image builds
- Coolify webhook handles the actual deploy (already configured in Coolify UI)
- No changes to application code — this is purely CI/CD infrastructure

## Capabilities

### New Capabilities
- `ci-pipeline`: GitHub Actions workflow for build validation on push/PR

### Modified Capabilities
_None — no functional requirements change._

## Impact

- New `.github/workflows/ci.yml` file in the repository
- GitHub Actions will run on every push to `main` and on PRs
- Coolify auto-deploy via webhook remains unchanged (configured in Coolify UI, not in code)
