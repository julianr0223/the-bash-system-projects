## Context

`Providers` llama `useAuth`, `useRoutines` y `useCompletions` en el top-level del componente. React ejecuta los tres hooks en cada render independientemente del estado de auth. `useRoutines` y `useCompletions` tienen `useEffect(() => refresh(), [refresh])` que dispara un fetch inmediato al montar.

Secuencia del bug:
1. Usuario entra a la app sin token → `Providers` monta → los 3 hooks se inicializan.
2. `useRoutines.refresh()` y `useCompletions.refresh()` disparan `fetch('/api/routines')` y `fetch('/api/completions')` sin Authorization header.
3. API responde 401 → `apiFetch` limpia token y tira error → los arreglos quedan `[]`.
4. `useAuth.checkAuth()` termina: no hay token → muestra login.
5. Usuario se loguea → `authApi.login()` hace `setToken()` → `state = 'authenticated'`.
6. `Providers` re-renderiza con los hooks de datos YA inicializados; sus efectos no se re-ejecutan porque `refresh` no cambió.
7. `/hoy` muestra vacío hasta un reload manual.

## Goals / Non-Goals

**Goals:**
- Los datos cargan correctamente en la primera visita post-login sin reload manual.
- No hacer fetches inútiles mientras la auth no esté lista.
- Mínimo refactor.

**Non-Goals:**
- Introducir una librería de data fetching (SWR, React Query).
- Cambiar el contrato de los hooks.

## Decisions

### 1. Montar los hooks de datos dentro del branch `authenticated`

Refactor de `Providers`:

```tsx
export function Providers({ children }) {
  const auth = useAuth();

  if (auth.state === 'loading') return <Loading />;
  if (auth.state === 'login') return <AuthForm ... />;
  if (auth.state === 'must-change-password') return <ChangePasswordForm ... />;

  return <AuthenticatedShell onLogout={auth.logout}>{children}</AuthenticatedShell>;
}

function AuthenticatedShell({ children, onLogout }) {
  const { routines, ... } = useRoutines();
  const { completions, ... } = useCompletions();
  // ... context provider ...
}
```

**Por qué:** al mover los hooks dentro de un sub-componente que solo se monta cuando `state === 'authenticated'`, React garantiza que `useEffect` dispare DESPUÉS de que el token exista. Cero cambios a los hooks mismos.

**Alternativa descartada:** agregar un parámetro `enabled` a los hooks. Más invasivo, requiere coordinación en múltiples sitios.

### 2. Preservar el shape del `AppContext`

El `AppContext.Provider` se mueve al sub-componente `AuthenticatedShell`, pero el contrato (campos, tipos) no cambia. `useAppContext()` en páginas funciona idéntico.

## Risks / Trade-offs

- **[Doble render al login]** → Aceptable: el salto de "login" → "authenticated" crea un mount limpio del shell, que es justamente lo que queremos (dispara los fetches con token ya disponible).
- **[Logout desmonta y pierde estado in-memory]** → Correcto: al hacer logout, los datos de rutinas deben limpiarse. Es el comportamiento deseado.
