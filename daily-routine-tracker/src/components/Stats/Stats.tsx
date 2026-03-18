import type { Routine, CompletionRecord } from '../../types';
import { getTodayString, addDays } from '../../utils/date';
import { calculateCurrentStreak, calculateBestStreak } from '../../utils/streaks';
import styles from './Stats.module.css';

interface Props {
  routines: Routine[];
  completions: CompletionRecord[];
  getCompletionsByRoutine: (routineId: string) => CompletionRecord[];
}

export function Stats({ routines, completions, getCompletionsByRoutine }: Props) {
  const activeRoutines = routines.filter((r) => r.isActive);
  const today = getTodayString();

  const todayCompletions = completions.filter((c) => c.date === today);
  const todayRate = activeRoutines.length > 0
    ? Math.round((todayCompletions.length / activeRoutines.length) * 100)
    : 0;

  // Weekly average
  const weekDays: string[] = [];
  for (let i = 6; i >= 0; i--) {
    weekDays.push(addDays(today, -i));
  }
  const weeklyRates = weekDays.map((day) => {
    const dayCompletions = completions.filter((c) => c.date === day);
    return activeRoutines.length > 0 ? dayCompletions.length / activeRoutines.length : 0;
  });
  const weeklyAvg = Math.round((weeklyRates.reduce((a, b) => a + b, 0) / 7) * 100);

  return (
    <div className={styles.container}>
      <h2>Estadisticas</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardValue}>{todayRate}%</span>
          <span className={styles.cardLabel}>Hoy ({todayCompletions.length}/{activeRoutines.length})</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{weeklyAvg}%</span>
          <span className={styles.cardLabel}>Promedio semanal</span>
        </div>
      </div>

      <h3>Rachas por rutina</h3>
      <div className={styles.streakList}>
        {activeRoutines.map((routine) => {
          const routineCompletions = getCompletionsByRoutine(routine.id);
          const current = calculateCurrentStreak(routineCompletions);
          const best = calculateBestStreak(routineCompletions);
          return (
            <div key={routine.id} className={styles.streakItem}>
              <span className={styles.streakName}>{routine.name}</span>
              <div className={styles.streakValues}>
                <span className={styles.currentStreak}>{current}d actual</span>
                <span className={styles.bestStreak}>{best}d mejor</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
