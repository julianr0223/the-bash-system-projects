## 1. Refactor de Providers

- [x] 1.1 Extraer un sub-componente `AuthenticatedShell` dentro de `app/providers.tsx` que contenga las llamadas a `useRoutines()` y `useCompletions()`, el `<AppContext.Provider>`, y el `<Navigation>`, `<MigrationBanner>`, `<main>`, `<VersionBadge />`.
- [x] 1.2 Mover las llamadas a `useRoutines` y `useCompletions` FUERA del top-level de `Providers` y DENTRO de `AuthenticatedShell`, de modo que solo se monten cuando `auth.state === 'authenticated'`.
- [x] 1.3 `Providers` pasa a ser un switch: `loading` → spinner; `login` → `AuthForm`; `must-change-password` → `ChangePasswordForm`; `authenticated` → `<AuthenticatedShell onLogout={logout}>{children}</AuthenticatedShell>`.

## 2. Verificación

- [x] 2.1 `npm run build` compila sin errores.
- [ ] 2.2 Probar manualmente: logout, login de nuevo, confirmar que `/hoy` muestra las rutinas inmediatamente sin reload.
