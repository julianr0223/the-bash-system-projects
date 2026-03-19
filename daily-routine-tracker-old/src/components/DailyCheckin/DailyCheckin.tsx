import type { Routine } from '../../types';
import { getTodayString } from '../../utils/date';
import { appliesToDay, formatFrequency } from '../../utils/frequency';
import styles from './DailyCheckin.module.css';

interface Props {
  routines: Routine[];
  isCompletedToday: (routineId: string) => boolean;
  onToggle: (routineId: string) => void;
}

function sortByTime(routines: Routine[]): Routine[] {
  const scheduled = routines.filter((r) => r.startTime).sort((a, b) => a.startTime!.localeCompare(b.startTime!));
  const unscheduled = routines.filter((r) => !r.startTime);
  return [...scheduled, ...unscheduled];
}

export function DailyCheckin({ routines, isCompletedToday, onToggle }: Props) {
  const today = getTodayString();
  const activeRoutines = sortByTime(routines.filter((r) => r.isActive && appliesToDay(r.frequency, today)));
  const completedCount = activeRoutines.filter((r) => isCompletedToday(r.id)).length;
  const totalCount = activeRoutines.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  if (totalCount === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay rutinas activas para hoy.</p>
        <p>Ve a "Rutinas" para crear una.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Hoy</h2>
        <span className={styles.progress}>
          {completedCount}/{totalCount}
        </span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      {allDone && (
        <div className={styles.congrats}>
          Todas las rutinas completadas hoy!
        </div>
      )}

      <div className={styles.list}>
        {activeRoutines.map((routine) => {
          const done = isCompletedToday(routine.id);
          return (
            <button
              key={routine.id}
              className={`${styles.routineItem} ${done ? styles.completed : ''}`}
              onClick={() => onToggle(routine.id)}
            >
              <span className={styles.checkbox}>{done ? '\u2713' : ''}</span>
              {routine.startTime && (
                <span className={styles.timeLabel}>
                  {routine.startTime}{routine.endTime ? ` - ${routine.endTime}` : ''}
                </span>
              )}
              <div className={styles.routineInfo}>
                <span className={styles.routineName}>{routine.name}</span>
                {routine.description && (
                  <span className={styles.routineDesc}>{routine.description}</span>
                )}
              </div>
              {routine.frequency !== 'daily' && (
                <span className={styles.freqLabel}>{formatFrequency(routine.frequency)}</span>
              )}
              <span className={styles.category}>{routine.category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
