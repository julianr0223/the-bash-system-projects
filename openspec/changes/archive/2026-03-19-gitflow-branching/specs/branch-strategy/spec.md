# Branch Strategy

## Requirements

### REQ-1: Two Long-lived Branches
- `main`: production branch, deployed by Coolify on push
- `develop`: integration branch, receives feature PRs

### REQ-2: Feature Branch Flow
- Feature branches are created from `develop`
- PRs target `develop` for review and merge
- `develop` is merged to `main` when ready for production

### REQ-3: No Direct Push to Main
- All changes reach `main` via merge from `develop`
- Exception: hotfixes may go directly to `main` if critical
