## 1. Database Schema & Seed

- [x] 1.1 Add `must_change_password INTEGER DEFAULT 0` to users CREATE TABLE in `lib/db.ts`
- [x] 1.2 Add ALTER TABLE migration (try/catch) for existing databases
- [x] 1.3 Add `import bcrypt from 'bcryptjs'` and seed logic in `initDb()`: create admin user with `must_change_password = 1` when `getUserCount() === 0`
- [x] 1.4 Seed 9 daily routines for admin user in a transaction
- [x] 1.5 Add `updateUserPassword(userId, passwordHash)` function
- [x] 1.6 Update `findUserById` to include `must_change_password` in SELECT and return type

## 2. API Endpoints

- [x] 2.1 Update `app/api/auth/login/route.ts` to return `mustChangePassword` flag
- [x] 2.2 Update `app/api/auth/me/route.ts` to return `mustChangePassword` flag
- [x] 2.3 Simplify `app/api/auth/status/route.ts` to always return `{ needsSetup: false }`
- [x] 2.4 Create `app/api/auth/change-password/route.ts` — POST endpoint
- [x] 2.5 Delete `app/api/auth/setup/route.ts`

## 3. Client API Layer

- [x] 3.1 Update `api-client/auth.ts`: add `mustChangePassword` to response types, add `changePassword()` function

## 4. Client Auth Flow

- [x] 4.1 Update `hooks/useAuth.ts`: replace `needs-setup` with `must-change-password` state, add `changePassword` callback, remove `setup`
- [x] 4.2 Create `components/Auth/ChangePasswordForm.tsx` using existing Auth.module.css styles
- [x] 4.3 Update `app/providers.tsx`: replace setup block with must-change-password block

## 5. Verification

- [x] 5.1 Delete `data.db` and run `npm run build` — verify zero TypeScript errors
- [x] 5.2 Test: `npm run dev`, login with admin@rutinas.local / admin123, change password, verify 9 routines appear
