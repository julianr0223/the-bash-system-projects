"use client";

import { useMemo, useState } from 'react';
import type { Routine } from '@/types';
import type { RoutineInput, RoutineUpdate } from '@/storage/routines';
import { categoryColor } from '@/utils/categoryColor';
import { sortRoutinesBySchedule } from '@/utils/sortRoutines';
import { RoutineForm } from '../RoutineForm/RoutineForm';
import styles from './RoutineCalendar.module.css';

interface Props {
  routines: Routine[];
  onUpdate: (id: string, data: RoutineUpdate) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onCreate: (data: RoutineInput) => void;
}

const SLOT_MINUTES = 15;
const DEFAULT_WINDOW_START_MIN = 5 * 60;
const DEFAULT_WINDOW_END_MIN = 23 * 60;
const SLOT_HEIGHT_PX = 24;
const PX_PER_MIN = SLOT_HEIGHT_PX / SLOT_MINUTES;
const LABEL_INTERVAL_MIN = 30;
const SHORT_BLOCK_THRESHOLD_MIN = 25;

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

type Positioned = {
  routine: Routine;
  startMin: number;
  endMin: number;
  isInstant: boolean;
  lane: number;
  laneCount: number;
};

type LaneInput = { routine: Routine; startMin: number; endMin: number; isInstant: boolean };

function assignLanes(items: LaneInput[]): Positioned[] {
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const laneEnds: number[] = [];
  const withLane = sorted.map((it) => {
    let lane = laneEnds.findIndex((end) => end <= it.startMin);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(it.endMin);
    } else {
      laneEnds[lane] = it.endMin;
    }
    return { ...it, lane };
  });

  const results: Positioned[] = withLane.map((it) => ({ ...it, laneCount: 1 }));
  for (let i = 0; i < results.length; i++) {
    const cluster: number[] = [i];
    let maxEnd = results[i].endMin;
    for (let j = i + 1; j < results.length; j++) {
      if (results[j].startMin < maxEnd) {
        cluster.push(j);
        maxEnd = Math.max(maxEnd, results[j].endMin);
      } else {
        break;
      }
    }
    const laneCount = Math.max(...cluster.map((k) => results[k].lane)) + 1;
    for (const k of cluster) {
      if (laneCount > results[k].laneCount) results[k].laneCount = laneCount;
    }
  }
  return results;
}

export function RoutineCalendar({ routines, onUpdate, onDelete, onToggleActive, onCreate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const active = routines.filter((r) => r.isActive);
  const withTime = active.filter((r) => r.startTime);
  const withoutTime = active.filter((r) => !r.startTime);

  const { windowStart, windowEnd, positioned } = useMemo(() => {
    const items: LaneInput[] = withTime.map((r) => {
      const startMin = timeToMinutes(r.startTime!);
      const isInstant = !r.endTime;
      const rawEnd = isInstant ? startMin + SLOT_MINUTES : timeToMinutes(r.endTime!);
      return {
        routine: r,
        startMin,
        endMin: Math.max(rawEnd, startMin + SLOT_MINUTES),
        isInstant,
      };
    });

    let start = DEFAULT_WINDOW_START_MIN;
    let end = DEFAULT_WINDOW_END_MIN;
    for (const it of items) {
      if (it.startMin < start) start = Math.floor(it.startMin / 60) * 60;
      if (it.endMin > end) end = Math.ceil(it.endMin / 60) * 60;
    }
    return { windowStart: start, windowEnd: end, positioned: assignLanes(items) };
  }, [withTime]);

  const gridHeightPx = (windowEnd - windowStart) * PX_PER_MIN;
  const labels: number[] = [];
  for (let m = windowStart; m <= windowEnd; m += LABEL_INTERVAL_MIN) labels.push(m);

  const editingRoutine = editingId ? routines.find((r) => r.id === editingId) ?? null : null;

  if (routines.length === 0 && !showCreate) {
    return (
      <div className={styles.empty}>
        <p>No tienes rutinas aun.</p>
        <p>Crea tu primera rutina para empezar a dar seguimiento a tus habitos diarios.</p>
        <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
          + Nueva rutina
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Mis rutinas</h2>
        <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
          + Nueva rutina
        </button>
      </div>

      {showCreate && (
        <RoutineForm
          onSubmit={(data) => { onCreate(data); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editingRoutine && (
        <div className={styles.editorSlot}>
          <RoutineForm
            initial={editingRoutine}
            onSubmit={(data) => { onUpdate(editingRoutine.id, data); setEditingId(null); }}
            onCancel={() => setEditingId(null)}
          />
          <div className={styles.editorActions}>
            <button className={styles.actionBtn} onClick={() => onToggleActive(editingRoutine.id)}>
              {editingRoutine.isActive ? 'Desactivar' : 'Activar'}
            </button>
            {confirmDeleteId === editingRoutine.id ? (
              <span className={styles.confirmDelete}>
                Eliminar?{' '}
                <button
                  className={styles.dangerBtn}
                  onClick={() => { onDelete(editingRoutine.id); setConfirmDeleteId(null); setEditingId(null); }}
                >
                  Si
                </button>
                <button className={styles.actionBtn} onClick={() => setConfirmDeleteId(null)}>
                  No
                </button>
              </span>
            ) : (
              <button className={styles.dangerBtn} onClick={() => setConfirmDeleteId(editingRoutine.id)}>
                Eliminar
              </button>
            )}
          </div>
        </div>
      )}

      <div className={styles.calendar}>
        <div className={styles.hourColumn} style={{ height: `${gridHeightPx}px` }} aria-hidden>
          {labels.map((m) => (
            <span
              key={m}
              className={`${styles.hourLabel} ${m % 60 !== 0 ? styles.hourLabelHalf : ''}`}
              style={{ top: `${(m - windowStart) * PX_PER_MIN}px` }}
            >
              {minutesToLabel(m)}
            </span>
          ))}
        </div>

        <div className={styles.grid} style={{ height: `${gridHeightPx}px` }}>
          {labels.map((m) => (
            <div
              key={`line-${m}`}
              className={`${styles.hourLine} ${m % 60 !== 0 ? styles.hourLineHalf : ''}`}
              style={{ top: `${(m - windowStart) * PX_PER_MIN}px` }}
              aria-hidden
            />
          ))}

          {positioned.map(({ routine, startMin, endMin, isInstant, lane, laneCount }) => {
            const top = (startMin - windowStart) * PX_PER_MIN;
            const durationMin = endMin - startMin;
            const actualDurationMin = routine.endTime
              ? timeToMinutes(routine.endTime) - timeToMinutes(routine.startTime!)
              : 0;
            const isShortBounded = !isInstant && actualDurationMin < SHORT_BLOCK_THRESHOLD_MIN;
            const height = durationMin * PX_PER_MIN;
            const widthPct = 100 / laneCount;
            const classes = [styles.block];
            if (isInstant) classes.push(styles.blockInstant);
            if (isShortBounded) classes.push(styles.blockShort);
            return (
              <button
                key={routine.id}
                type="button"
                className={classes.join(' ')}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  left: `calc(${lane * widthPct}% + 2px)`,
                  width: `calc(${widthPct}% - 4px)`,
                  ['--cat-color' as string]: categoryColor(routine.category),
                }}
                onClick={() => setEditingId(routine.id)}
                title={`${routine.name} (${routine.startTime}${routine.endTime ? ` - ${routine.endTime}` : ''})`}
              >
                {isInstant ? (
                  <span className={styles.blockInstantRow}>
                    <span className={styles.instantDot} aria-hidden />
                    <span className={styles.blockTime}>{routine.startTime}</span>
                    <span className={styles.blockName}>{routine.name}</span>
                  </span>
                ) : isShortBounded ? (
                  <span className={styles.blockShortRow}>
                    <span className={styles.blockTime}>
                      {routine.startTime}-{routine.endTime}
                    </span>
                    <span className={styles.blockName}>{routine.name}</span>
                  </span>
                ) : (
                  <>
                    <span className={styles.blockName}>{routine.name}</span>
                    <span className={styles.blockTime}>
                      {routine.startTime} - {routine.endTime}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {withoutTime.length > 0 && (
        <div className={styles.unscheduled}>
          <h3 className={styles.unscheduledHeader}>Sin horario</h3>
          <div className={styles.chips}>
            {sortRoutinesBySchedule(withoutTime).map((routine) => (
              <button
                key={routine.id}
                type="button"
                className={styles.chip}
                style={{ ['--cat-color' as string]: categoryColor(routine.category) }}
                onClick={() => setEditingId(routine.id)}
              >
                {routine.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
