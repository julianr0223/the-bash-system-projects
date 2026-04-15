"use client";

import { useEffect, useState } from 'react';
import { useAppContext } from "../providers";
import { RoutineList } from "@/components/RoutineList/RoutineList";
import { RoutineCalendar } from "@/components/RoutineCalendar/RoutineCalendar";
import styles from "./page.module.css";

type ViewMode = 'list' | 'calendar';
const STORAGE_KEY = 'routinesViewMode';

export default function RoutinesPage() {
  const { routines, create, update, remove, toggleActive } = useAppContext();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'calendar' || saved === 'list') setViewMode(saved);
  }, []);

  function handleChange(mode: ViewMode) {
    setViewMode(mode);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, mode);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toggleRow}>
        <div className={styles.segmented} role="tablist" aria-label="Vista de rutinas">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'list'}
            className={`${styles.segment} ${viewMode === 'list' ? styles.segmentActive : ''}`}
            onClick={() => handleChange('list')}
          >
            Lista
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'calendar'}
            className={`${styles.segment} ${viewMode === 'calendar' ? styles.segmentActive : ''}`}
            onClick={() => handleChange('calendar')}
          >
            Calendario
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <RoutineList
          routines={routines}
          onCreate={create}
          onUpdate={update}
          onDelete={remove}
          onToggleActive={toggleActive}
        />
      ) : (
        <RoutineCalendar
          routines={routines}
          onCreate={create}
          onUpdate={update}
          onDelete={remove}
          onToggleActive={toggleActive}
        />
      )}
    </div>
  );
}
