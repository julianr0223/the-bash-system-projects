"use client";

import { useState, useEffect } from 'react';
import type { Routine } from '@/types';
import { getCurrentTime, getTodayString, formatDateReadable } from '@/utils/date';
import { appliesToDay } from '@/utils/frequency';
import { DayNavigator } from './DayNavigator';
import styles from './DailyView.module.css';

interface Props {
  routines: Routine[];
  isCompleted: (routineId: string) => boolean;
  onToggle?: (routineId: string) => void;
  date?: string;
  readOnly?: boolean;
}

export function DailyView({ routines, isCompleted, onToggle, date, readOnly = false }: Props) {
  const today = getTodayString();
  const targetDate = date ?? today;
  const isToday = targetDate === today;

  const [currentTime, setCurrentTime] = useState(getCurrentTime);

  useEffect(() => {
    if (!isToday) return;
    const interval = setInterval(() => setCurrentTime(getCurrentTime()), 60_000);
    return () => clearInterval(interval);
  }, [isToday]);

  const activeRoutines = routines.filter((r) => r.isActive && appliesToDay(r.frequency, targetDate));
  const scheduled = activeRoutines
    .filter((r) => r.startTime)
    .sort((a, b) => a.startTime!.localeCompare(b.startTime!));
  const unscheduled = activeRoutines.filter((r) => !r.startTime);

  const totalCount = activeRoutines.length;
  const completedCount = activeRoutines.filter((r) => isCompleted(r.id)).length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  const headerTitle = isToday ? 'Hoy' : formatDateReadable(targetDate);

  if (totalCount === 0) {
    return (
      <div className={`${styles.container} ${readOnly ? styles.containerReadOnly : ''}`}>
        <Header
          title={headerTitle}
          completedCount={0}
          totalCount={0}
          targetDate={targetDate}
          today={today}
          readOnly={readOnly}
        />
        <div className={styles.empty}>
          <p>No hay rutinas {isToday ? 'activas para hoy' : 'que apliquen a este día'}.</p>
          {isToday && <p>Ve a "Rutinas" para crear una.</p>}
        </div>
      </div>
    );
  }

  const currentTimePosition = isToday && !readOnly
    ? scheduled.findIndex((r) => r.startTime! > currentTime)
    : -2; // -2 = never show marker

  return (
    <div className={`${styles.container} ${readOnly ? styles.containerReadOnly : ''}`}>
      <Header
        title={headerTitle}
        completedCount={completedCount}
        totalCount={totalCount}
        targetDate={targetDate}
        today={today}
        readOnly={readOnly}
      />

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      {allDone && (
        <div className={styles.congrats}>
          {isToday ? 'Todas las rutinas completadas hoy!' : 'Todas las rutinas se completaron este día.'}
        </div>
      )}

      {scheduled.length > 0 && (
        <div className={styles.timeline}>
          {scheduled.map((routine, idx) => {
            const done = isCompleted(routine.id);
            const showTimeMark = currentTimePosition === idx;
            const isPast = isToday && !readOnly
              ? (routine.endTime ? routine.endTime <= currentTime : routine.startTime! <= currentTime)
              : false;

            return (
              <div key={routine.id}>
                {showTimeMark && <TimeMarker time={currentTime} />}
                <RoutineBlock
                  routine={routine}
                  done={done}
                  isPast={isPast}
                  onToggle={onToggle}
                  readOnly={readOnly}
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
              done={isCompleted(routine.id)}
              isPast={false}
              onToggle={onToggle}
              isUnscheduled
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Header({
  title,
  completedCount,
  totalCount,
  targetDate,
  today,
  readOnly,
}: {
  title: string;
  completedCount: number;
  totalCount: number;
  targetDate: string;
  today: string;
  readOnly: boolean;
}) {
  return (
    <>
      <div className={styles.header}>
        <h2>
          {title}
          {readOnly && <span className={styles.readOnlyBadge}>Solo lectura</span>}
        </h2>
        {totalCount > 0 && (
          <span className={styles.progress}>{completedCount}/{totalCount}</span>
        )}
      </div>
      <DayNavigator targetDate={targetDate} today={today} />
    </>
  );
}

function RoutineBlock({
  routine,
  done,
  isPast,
  onToggle,
  isUnscheduled,
  readOnly,
}: {
  routine: Routine;
  done: boolean;
  isPast: boolean;
  onToggle?: (id: string) => void;
  isUnscheduled?: boolean;
  readOnly?: boolean;
}) {
  const className = `${styles.block} ${done ? styles.blockDone : ''} ${isPast && !done ? styles.blockPast : ''} ${isUnscheduled ? styles.blockUnscheduled : ''}`;
  const content = (
    <>
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
    </>
  );

  if (readOnly || !onToggle) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button className={className} onClick={() => onToggle(routine.id)}>
      {content}
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
