"use client";

import type { Routine, CompletionRecord } from '@/types';
import { getTodayString } from '@/utils/date';
import { appliesToDay } from '@/utils/frequency';
import { calculateCurrentStreak } from '@/utils/streaks';
import { Heatmap } from '../Heatmap/Heatmap';
import styles from './Dashboard.module.css';

interface Props {
  routines: Routine[];
  completions: CompletionRecord[];
  isCompletedToday: (routineId: string) => boolean;
  onToggle: (routineId: string) => void;
  getCompletionsByRoutine: (routineId: string) => CompletionRecord[];
}

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? completed / total : 0;
  const offset = circumference * (1 - progress);
  const allDone = total > 0 && completed === total;

  return (
    <div className={styles.ringWrapper}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.ringSvg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={allDone ? 'var(--color-success)' : 'var(--color-primary)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 600ms cubic-bezier(0.34, 1.56, 0.64, 1), stroke 300ms ease',
            ['--ring-circumference' as string]: circumference,
            ['--ring-offset' as string]: offset,
          }}
        />
      </svg>
      <div className={styles.ringContent}>
        <span className={`${styles.ringNumber} ${allDone ? styles.ringDone : ''}`}>
          {completed}/{total}
        </span>
      </div>
    </div>
  );
}

export function Dashboard({ routines, completions, isCompletedToday, onToggle, getCompletionsByRoutine }: Props) {
  const today = getTodayString();
  const activeRoutines = routines.filter((r) => r.isActive && appliesToDay(r.frequency, today));
  const completedCount = activeRoutines.filter((r) => isCompletedToday(r.id)).length;
  const totalCount = activeRoutines.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

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
      <div className={`${styles.todayCard} ${allDone ? styles.todayCardDone : ''}`}>
        <div>
          <h2 className={styles.todayTitle}>Hoy</h2>
          <p className={styles.todaySubtitle}>
            {allDone ? '¡Todo listo!' : `${totalCount - completedCount} pendientes`}
          </p>
        </div>
        <ProgressRing completed={completedCount} total={totalCount} />
      </div>

      {totalCount > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Check-in rápido</h3>
          <div className={styles.routineChips}>
            {activeRoutines.map((r) => {
              const done = isCompletedToday(r.id);
              return (
                <button
                  key={r.id}
                  className={`${styles.chip} ${done ? styles.chipDone : ''}`}
                  onClick={() => onToggle(r.id)}
                >
                  {done && <span className={styles.chipCheck}>✓</span>}
                  {r.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {streaks.length > 0 && (
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.streakIcon}>🔥</span>
            Mejores rachas activas
          </h3>
          <div className={styles.streakList}>
            {streaks.map((s, i) => (
              <div key={i} className={styles.streakItem}>
                <span className={styles.streakName}>{s.name}</span>
                <span className={styles.streakValue}>{s.streak} días</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Actividad</h3>
        <Heatmap completions={completions} routineCount={totalCount} />
      </div>
    </div>
  );
}
