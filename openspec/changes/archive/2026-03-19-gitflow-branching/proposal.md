## Why

Currently CI only runs on `main`, which means all development goes directly to the production branch. Adding a `develop` branch as integration branch allows testing and validating changes before they reach production via Coolify auto-deploy.

## What Changes

- Update CI workflow to run on both `develop` and `main` branches
- PRs target `develop` for integration; `main` receives only merged, validated code
- Coolify auto-deploy triggers only on `main` (production)
- Create `develop` branch from current `main`

## Capabilities

### New Capabilities
- `branch-strategy`: Git branching model with develop for integration and main for production

### Modified Capabilities
- `ci-pipeline`: CI triggers on both `develop` (push + PRs) and `main` (push only from merge)

## Impact

- `.github/workflows/ci.yml` — updated branch triggers
- Git branches — new `develop` branch created
- Coolify — no change needed (already watches `main` only)
