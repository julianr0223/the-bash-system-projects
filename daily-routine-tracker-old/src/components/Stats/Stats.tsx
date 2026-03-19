import type { Routine, CompletionRecord } from '../../types';
import { getTodayString, addDays } from '../../utils/date';
import { appliesToDay } from '../../utils/frequency';
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

  // Today: only count routines that apply today
  const todayApplicable = activeRoutines.filter((r) => appliesToDay(r.frequency, today));
  const todayCompleted = todayApplicable.filter((r) =>
    completions.some((c) => c.routineId === r.id && c.date === today)
  ).length;
  const todayRate = todayApplicable.length > 0
    ? Math.round((todayCompleted / todayApplicable.length) * 100)
    : 0;

  // Weekly average considering frequency
  let weekApplicable = 0;
  let weekCompleted = 0;
  for (let i = 6; i >= 0; i--) {
    const day = addDays(today, -i);
    for (const r of activeRoutines) {
      if (appliesToDay(r.frequency, day)) {
        weekApplicable++;
        if (completions.some((c) => c.routineId === r.id && c.date === day)) {
          weekCompleted++;
        }
      }
    }
  }
  const weeklyAvg = weekApplicable > 0 ? Math.round((weekCompleted / weekApplicable) * 100) : 0;

  return (
    <div className={styles.container}>
      <h2>Estadisticas</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardValue}>{todayRate}%</span>
          <span className={styles.cardLabel}>Hoy ({todayCompleted}/{todayApplicable.length})</span>
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
          const current = calculateCurrentStreak(routineCompletions, routine.frequency);
          const best = calculateBestStreak(routineCompletions, routine.frequency);
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
