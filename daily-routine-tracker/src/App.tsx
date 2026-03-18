import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { DailyCheckin } from './components/DailyCheckin/DailyCheckin';
import { RoutineList } from './components/RoutineList/RoutineList';
import { Stats } from './components/Stats/Stats';
import { useRoutines } from './hooks/useRoutines';
import { useCompletions } from './hooks/useCompletions';

function AppContent() {
  const { routines, create, update, remove, toggleActive } = useRoutines();
  const { completions, toggleCompletion, isCompletedToday, getCompletionsByRoutine } = useCompletions();

  return (
    <>
      <Navigation />
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
            path="/stats"
            element={
              <Stats
                routines={routines}
                completions={completions}
                getCompletionsByRoutine={getCompletionsByRoutine}
              />
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
