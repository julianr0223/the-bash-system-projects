"use client";

import { useMemo, useState } from 'react';
import type { CompletionRecord } from '@/types';
import { getTodayString, addDays } from '@/utils/date';
import styles from './Heatmap.module.css';

interface Props {
  completions: CompletionRecord[];
  routineCount: number;
}

const WEEKS = 20;
const DAYS_PER_WEEK = 7;
const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function getLevel(rate: number): number {
  if (rate === 0) return 0;
  if (rate < 0.33) return 1;
  if (rate < 0.66) return 2;
  if (rate < 1) return 3;
  return 4;
}

export function Heatmap({ completions, routineCount }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const cells = useMemo(() => {
    const today = getTodayString();
    const todayDate = new Date();
    const todayDow = (todayDate.getDay() + 6) % 7; // Monday=0
    const totalDays = WEEKS * DAYS_PER_WEEK;
    const startOffset = totalDays - 1 - todayDow;
    const startDate = addDays(today, -startOffset);

    const completionsByDate = new Map<string, number>();
    for (const c of completions) {
      completionsByDate.set(c.date, (completionsByDate.get(c.date) ?? 0) + 1);
    }

    const grid: { date: string; level: number; count: number }[][] = [];
    let dayIdx = 0;
    for (let w = 0; w < WEEKS; w++) {
      const week: { date: string; level: number; count: number }[] = [];
      for (let d = 0; d < DAYS_PER_WEEK; d++) {
        const date = addDays(startDate, dayIdx);
        const count = completionsByDate.get(date) ?? 0;
        const rate = routineCount > 0 ? count / routineCount : 0;
        week.push({ date, level: getLevel(rate), count });
        dayIdx++;
      }
      grid.push(week);
    }
    return grid;
  }, [completions, routineCount]);

  return (
    <div className={styles.container}>
      <div className={styles.labels}>
        {DAY_LABELS.map((label, i) => (
          <span key={i} className={styles.dayLabel}>{i % 2 === 0 ? label : ''}</span>
        ))}
      </div>
      <div className={styles.grid}>
        {cells.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map((cell) => (
              <div
                key={cell.date}
                className={`${styles.cell} ${styles[`level${cell.level}`]}`}
                onMouseEnter={(e) => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setTooltip({
                    text: `${cell.date} — ${cell.count}/${routineCount}`,
                    x: rect.left + rect.width / 2,
                    y: rect.top - 8,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>
      {tooltip && (
        <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
