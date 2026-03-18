import { useState, useEffect } from 'react';
import type { Routine } from '../../types';
import { getCurrentTime, getTodayString } from '../../utils/date';
import { appliesToDay } from '../../utils/frequency';
import styles from './DailyAgenda.module.css';

interface Props {
  routines: Routine[];
  isCompletedToday: (routineId: string) => boolean;
  onToggle: (routineId: string) => void;
}

export function DailyAgenda({ routines, isCompletedToday, onToggle }: Props) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(getCurrentTime()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const today = getTodayString();
  const activeRoutines = routines.filter((r) => r.isActive && appliesToDay(r.frequency, today));
  const scheduled = activeRoutines
    .filter((r) => r.startTime)
    .sort((a, b) => a.startTime!.localeCompare(b.startTime!));
  const unscheduled = activeRoutines.filter((r) => !r.startTime);

  if (scheduled.length === 0 && unscheduled.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay rutinas activas.</p>
        <p>Ve a "Rutinas" para crear una.</p>
      </div>
    );
  }

  if (scheduled.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Agenda del dia</h2>
        <div className={styles.emptySchedule}>
          <p>Ninguna rutina tiene horario asignado.</p>
          <p>Edita tus rutinas para agregar hora de inicio y fin.</p>
        </div>
        <UnscheduledSection
          routines={unscheduled}
          isCompletedToday={isCompletedToday}
          onToggle={onToggle}
        />
      </div>
    );
  }

  // Find where current time falls among scheduled routines
  const currentTimePosition = scheduled.findIndex(
    (r) => r.startTime! > currentTime
  );

  return (
    <div className={styles.container}>
      <h2>Agenda del dia</h2>
      <div className={styles.timeline}>
        {scheduled.map((routine, idx) => {
          const done = isCompletedToday(routine.id);
          const showTimeMark = currentTimePosition === idx;
          const isPast = routine.endTime ? routine.endTime <= currentTime : routine.startTime! <= currentTime;

          return (
            <div key={routine.id}>
              {showTimeMark && <TimeMarker time={currentTime} />}
              <button
                className={`${styles.block} ${done ? styles.blockDone : ''} ${isPast && !done ? styles.blockPast : ''}`}
                onClick={() => onToggle(routine.id)}
              >
                <div className={styles.blockTime}>
                  <span className={styles.startTime}>{routine.startTime}</span>
                  {routine.endTime && <span className={styles.endTime}>{routine.endTime}</span>}
                </div>
                <div className={styles.blockContent}>
                  <span className={styles.blockName}>
                    {done && <span className={styles.checkmark}>{'\u2713'} </span>}
                    {routine.name}
                  </span>
                  {routine.description && (
                    <span className={styles.blockDesc}>{routine.description}</span>
                  )}
                </div>
                <span className={styles.blockCategory}>{routine.category}</span>
              </button>
            </div>
          );
        })}
        {currentTimePosition === -1 && <TimeMarker time={currentTime} />}
      </div>

      {unscheduled.length > 0 && (
        <UnscheduledSection
          routines={unscheduled}
          isCompletedToday={isCompletedToday}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}

function TimeMarker({ time }: { time: string }) {
  return (
    <div className={styles.timeMarker}>
      <span className={styles.timeMarkerLabel}>{time}</span>
      <div className={styles.timeMarkerLine} />
    </div>
  );
}

function UnscheduledSection({
  routines,
  isCompletedToday,
  onToggle,
}: {
  routines: Routine[];
  isCompletedToday: (id: string) => boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={styles.unscheduled}>
      <h3 className={styles.unscheduledHeader}>Sin hora asignada</h3>
      {routines.map((routine) => {
        const done = isCompletedToday(routine.id);
        return (
          <button
            key={routine.id}
            className={`${styles.block} ${done ? styles.blockDone : ''}`}
            onClick={() => onToggle(routine.id)}
          >
            <div className={styles.blockTime}>
              <span className={styles.startTime}>--:--</span>
            </div>
            <div className={styles.blockContent}>
              <span className={styles.blockName}>
                {done && <span className={styles.checkmark}>{'\u2713'} </span>}
                {routine.name}
              </span>
              {routine.description && (
                <span className={styles.blockDesc}>{routine.description}</span>
              )}
            </div>
            <span className={styles.blockCategory}>{routine.category}</span>
          </button>
        );
      })}
    </div>
  );
}
