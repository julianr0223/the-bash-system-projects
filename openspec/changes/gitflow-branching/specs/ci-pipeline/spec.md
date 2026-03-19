# CI Pipeline (Modified)

## Changes from Base Spec

### REQ-4 MODIFIED: Branch Triggers
- CI triggers on push to `main` AND `develop`
- CI triggers on PRs targeting `main` AND `develop`
- Path filter for `daily-routine-tracker/**` remains unchanged

### All other requirements unchanged
- REQ-1 (Type Check), REQ-2 (Build), REQ-3 (Docker Build), REQ-5 (Working Directory) remain as-is
