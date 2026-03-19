import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { DailyAgenda } from './components/DailyAgenda/DailyAgenda';
import { DailyCheckin } from './components/DailyCheckin/DailyCheckin';
import { RoutineList } from './components/RoutineList/RoutineList';
import { Stats } from './components/Stats/Stats';
import { Reports } from './components/Reports/Reports';
import { Badges } from './components/Badges/Badges';
import { Settings } from './components/Settings/Settings';
import { AuthForm } from './components/Auth/LoginForm';
import { MigrationBanner } from './components/MigrationBanner';
import { useAuth } from './hooks/useAuth';
import { useRoutines } from './hooks/useRoutines';
import { useCompletions } from './hooks/useCompletions';

function AppContent({ onLogout }: { onLogout: () => void }) {
  const { routines, create, update, remove, toggleActive } = useRoutines();
  const { completions, toggleCompletion, isCompletedToday, getCompletionsByRoutine } = useCompletions();

  return (
    <>
      <Navigation onLogout={onLogout} />
      <MigrationBanner />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '1.5rem 1rem' }}>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                routines={routines}
                completions={completions}
                isCompletedToday={isCompletedToday}
                onToggle={toggleCompletion}
                getCompletionsByRoutine={getCompletionsByRoutine}
              />
            }
          />
          <Route
            path="/agenda"
            element={
              <DailyAgenda
                routines={routines}
                isCompletedToday={isCompletedToday}
                onToggle={toggleCompletion}
              />
            }
          />
          <Route
            path="/checkin"
            element={
              <DailyCheckin
                routines={routines}
                isCompletedToday={isCompletedToday}
                onToggle={toggleCompletion}
              />
            }
          />
          <Route
            path="/routines"
            element={
              <RoutineList
                routines={routines}
                onCreate={create}
                onUpdate={update}
                onDelete={remove}
                onToggleActive={toggleActive}
              />
            }
          />
          <Route
            path="/reports"
            element={<Reports routines={routines} completions={completions} />}
          />
          <Route
            path="/badges"
            element={<Badges routines={routines} completions={completions} />}
          />
          <Route
            path="/stats"
            element={
              <Stats
                routines={routines}
                completions={completions}
                getCompletionsByRoutine={getCompletionsByRoutine}
              />
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  const { state, error, setup, login, logout } = useAuth();

  if (state === 'loading') {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}>Cargando...</div>;
  }

  if (state === 'needs-setup') {
    return <AuthForm title="Crear cuenta" buttonText="Registrar" onSubmit={setup} error={error} />;
  }

  if (state === 'login') {
    return <AuthForm title="Iniciar sesion" buttonText="Entrar" onSubmit={login} error={error} />;
  }

  return (
    <BrowserRouter>
      <AppContent onLogout={logout} />
    </BrowserRouter>
  );
}
