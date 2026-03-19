import type { Routine, CompletionRecord } from '../../types';
import { getTodayString } from '../../utils/date';
import { appliesToDay } from '../../utils/frequency';
import { calculateCurrentStreak } from '../../utils/streaks';
import { Heatmap } from '../Heatmap/Heatmap';
import styles from './Dashboard.module.css';

interface Props {
  routines: Routine[];
  completions: CompletionRecord[];
  isCompletedToday: (routineId: string) => boolean;
  onToggle: (routineId: string) => void;
  getCompletionsByRoutine: (routineId: string) => CompletionRecord[];
}

export function Dashboard({ routines, completions, isCompletedToday, onToggle, getCompletionsByRoutine }: Props) {
  const today = getTodayString();
  const activeRoutines = routines.filter((r) => r.isActive && appliesToDay(r.frequency, today));
  const completedCount = activeRoutines.filter((r) => isCompletedToday(r.id)).length;
  const totalCount = activeRoutines.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  // Top streaks
  const streaks = activeRoutines
    .map((r) => ({
      name: r.name,
      streak: calculateCurrentStreak(getCompletionsByRoutine(r.id), r.frequency),
    }))
    .filter((s) => s.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3);

  return (
    <div className={styles.container}>
      <div className={styles.todayCard}>
        <h2>Hoy</h2>
        <div className={styles.progressCircle}>
          <span className={styles.progressNumber}>{completedCount}/{totalCount}</span>
          <span className={styles.progressLabel}>
            {allDone ? 'Todo listo!' : 'rutinas'}
          </span>
        </div>
      </div>

      {totalCount > 0 && (
        <div className={styles.quickCheckin}>
          <h3>Check-in rapido</h3>
          <div className={styles.routineChips}>
            {activeRoutines.map((r) => {
              const done = isCompletedToday(r.id);
              return (
                <button
                  key={r.id}
                  className={`${styles.chip} ${done ? styles.chipDone : ''}`}
                  onClick={() => onToggle(r.id)}
                >
                  {done ? '\u2713 ' : ''}{r.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {streaks.length > 0 && (
        <div className={styles.streaksCard}>
          <h3>Mejores rachas activas</h3>
          <div className={styles.streakList}>
            {streaks.map((s, i) => (
              <div key={i} className={styles.streakItem}>
                <span className={styles.streakName}>{s.name}</span>
                <span className={styles.streakValue}>{s.streak} dias</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.heatmapCard}>
        <h3>Actividad</h3>
        <Heatmap completions={completions} routineCount={totalCount} />
      </div>
    </div>
  );
}
