"use client";

import { useState, useEffect } from 'react';
import type { Routine } from '@/types';
import { getCurrentTime, getTodayString } from '@/utils/date';
import { appliesToDay } from '@/utils/frequency';
import styles from './DailyView.module.css';

interface Props {
  routines: Routine[];
  isCompletedToday: (routineId: string) => boolean;
  onToggle: (routineId: string) => void;
}

export function DailyView({ routines, isCompletedToday, onToggle }: Props) {
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

  const totalCount = activeRoutines.length;
  const completedCount = activeRoutines.filter((r) => isCompletedToday(r.id)).length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  if (totalCount === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay rutinas activas para hoy.</p>
        <p>Ve a "Rutinas" para crear una.</p>
      </div>
    );
  }

  const currentTimePosition = scheduled.findIndex((r) => r.startTime! > currentTime);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Hoy</h2>
        <span className={styles.progress}>{completedCount}/{totalCount}</span>
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

      {scheduled.length > 0 && (
        <div className={styles.timeline}>
          {scheduled.map((routine, idx) => {
            const done = isCompletedToday(routine.id);
            const showTimeMark = currentTimePosition === idx;
            const isPast = routine.endTime ? routine.endTime <= currentTime : routine.startTime! <= currentTime;

            return (
              <div key={routine.id}>
                {showTimeMark && <TimeMarker time={currentTime} />}
                <RoutineBlock
                  routine={routine}
                  done={done}
                  isPast={isPast}
                  onToggle={onToggle}
                />
              </div>
            );
          })}
          {currentTimePosition === -1 && <TimeMarker time={currentTime} />}
        </div>
      )}

      {unscheduled.length > 0 && (
        <div className={styles.unscheduled}>
          <h3 className={styles.unscheduledHeader}>Sin hora asignada</h3>
          {unscheduled.map((routine) => (
            <RoutineBlock
              key={routine.id}
              routine={routine}
              done={isCompletedToday(routine.id)}
              isPast={false}
              onToggle={onToggle}
              isUnscheduled
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RoutineBlock({
  routine,
  done,
  isPast,
  onToggle,
  isUnscheduled,
}: {
  routine: Routine;
  done: boolean;
  isPast: boolean;
  onToggle: (id: string) => void;
  isUnscheduled?: boolean;
}) {
  return (
    <button
      className={`${styles.block} ${done ? styles.blockDone : ''} ${isPast && !done ? styles.blockPast : ''} ${isUnscheduled ? styles.blockUnscheduled : ''}`}
      onClick={() => onToggle(routine.id)}
    >
      <span className={`${styles.checkbox} ${done ? styles.checkboxDone : ''}`}>
        {done ? '\u2713' : ''}
      </span>
      <div className={styles.blockTime}>
        <span className={styles.startTime}>
          {routine.startTime || '--:--'}
        </span>
        {routine.endTime && <span className={styles.endTime}>{routine.endTime}</span>}
      </div>
      <div className={styles.blockContent}>
        <span className={styles.blockName}>{routine.name}</span>
        {routine.description && (
          <span className={styles.blockDesc}>{routine.description}</span>
        )}
      </div>
      <span className={styles.blockCategory}>{routine.category}</span>
    </button>
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
