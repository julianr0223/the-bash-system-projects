import { useMemo } from 'react';
import type { Routine, CompletionRecord } from '../../types';
import { getTodayString, addDays } from '../../utils/date';
import { appliesToDay, getApplicableDaysPerWeek } from '../../utils/frequency';
import styles from './Reports.module.css';

interface Props {
  routines: Routine[];
  completions: CompletionRecord[];
}

function getWeekStart(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay(); // 0=Sun
  const diff = day === 0 ? 6 : day - 1; // Monday start
  return addDays(dateStr, -diff);
}

function calcWeekRate(
  weekStart: string,
  routines: Routine[],
  completions: CompletionRecord[]
): { completed: number; applicable: number; rate: number } {
  let applicable = 0;
  let completed = 0;
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    for (const r of routines) {
      if (r.isActive && appliesToDay(r.frequency, day)) {
        applicable++;
        if (completions.some((c) => c.routineId === r.id && c.date === day)) {
          completed++;
        }
      }
    }
  }
  return { completed, applicable, rate: applicable > 0 ? Math.round((completed / applicable) * 100) : 0 };
}

export function Reports({ routines, completions }: Props) {
  const today = getTodayString();
  const thisWeekStart = getWeekStart(today);
  const lastWeekStart = addDays(thisWeekStart, -7);
  const activeRoutines = routines.filter((r) => r.isActive);

  const thisWeek = useMemo(
    () => calcWeekRate(thisWeekStart, routines, completions),
    [thisWeekStart, routines, completions]
  );
  const lastWeek = useMemo(
    () => calcWeekRate(lastWeekStart, routines, completions),
    [lastWeekStart, routines, completions]
  );

  const diff = thisWeek.rate - lastWeek.rate;

  // 30-day trend
  const trend = useMemo(() => {
    const bars: { date: string; rate: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = addDays(today, -i);
      let applicable = 0;
      let completed = 0;
      for (const r of activeRoutines) {
        if (appliesToDay(r.frequency, day)) {
          applicable++;
          if (completions.some((c) => c.routineId === r.id && c.date === day)) {
            completed++;
          }
        }
      }
      bars.push({ date: day, rate: applicable > 0 ? Math.round((completed / applicable) * 100) : 0 });
    }
    return bars;
  }, [today, activeRoutines, completions]);

  // Per-routine weekly progress
  const routineProgress = useMemo(() => {
    return activeRoutines.map((r) => {
      let applicable = 0;
      let completed = 0;
      for (let i = 0; i < 7; i++) {
        const day = addDays(thisWeekStart, i);
        if (appliesToDay(r.frequency, day)) {
          applicable++;
          if (completions.some((c) => c.routineId === r.id && c.date === day)) {
            completed++;
          }
        }
      }
      return {
        name: r.name,
        completed,
        applicable,
        goal: r.goal,
        maxDays: getApplicableDaysPerWeek(r.frequency),
      };
    });
  }, [activeRoutines, thisWeekStart, completions]);

  return (
    <div className={styles.container}>
      <h2>Reportes</h2>

      <div className={styles.weekSummary}>
        <div className={styles.weekCard}>
          <span className={styles.weekRate}>{thisWeek.rate}%</span>
          <span className={styles.weekLabel}>Esta semana</span>
          <span className={styles.weekDetail}>{thisWeek.completed}/{thisWeek.applicable}</span>
        </div>
        <div className={styles.weekCard}>
          <span className={styles.weekRate}>{lastWeek.rate}%</span>
          <span className={styles.weekLabel}>Semana pasada</span>
          <span className={styles.weekDetail}>{lastWeek.completed}/{lastWeek.applicable}</span>
        </div>
        <div className={styles.weekCard}>
          <span className={`${styles.weekRate} ${diff > 0 ? styles.positive : diff < 0 ? styles.negative : ''}`}>
            {diff > 0 ? '+' : ''}{diff}%
          </span>
          <span className={styles.weekLabel}>Cambio</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Tendencia 30 dias</h3>
        <div className={styles.trendChart}>
          {trend.map((bar) => (
            <div key={bar.date} className={styles.trendBar} title={`${bar.date}: ${bar.rate}%`}>
              <div className={styles.trendFill} style={{ height: `${bar.rate}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Progreso por rutina (esta semana)</h3>
        <div className={styles.routineList}>
          {routineProgress.map((rp, i) => {
            const target = rp.goal ?? rp.maxDays;
            const pct = target > 0 ? Math.min(100, Math.round((rp.completed / target) * 100)) : 0;
            const met = rp.goal !== undefined && rp.completed >= rp.goal;
            return (
              <div key={i} className={styles.routineRow}>
                <span className={styles.routineRowName}>{rp.name}</span>
                <div className={styles.progressBarWrap}>
                  <div className={`${styles.progressBarFill} ${met ? styles.goalMet : ''}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={styles.routineRowCount}>
                  {rp.completed}/{rp.goal !== undefined ? rp.goal : `${rp.applicable} dias`}
                  {met && ' \u2713'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
