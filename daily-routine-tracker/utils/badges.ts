import type { Routine, CompletionRecord } from '@/types';
import { addDays, getTodayString } from './date';
import { appliesToDay } from './frequency';
import { calculateBestStreak } from './streaks';

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  condition: (completions: CompletionRecord[], routines: Routine[]) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first-completion',
    name: 'Primera rutina completada',
    description: 'Completa cualquier rutina por primera vez',
    condition: (completions) => completions.length > 0,
  },
  {
    id: 'streak-7',
    name: 'Racha de 7 dias',
    description: '7 dias consecutivos aplicables completados en cualquier rutina',
    condition: (completions, routines) =>
      routines.some((r) => {
        const rc = completions.filter((c) => c.routineId === r.id);
        return calculateBestStreak(rc, r.frequency) >= 7;
      }),
  },
  {
    id: 'streak-30',
    name: 'Racha de 30 dias',
    description: '30 dias consecutivos aplicables completados en cualquier rutina',
    condition: (completions, routines) =>
      routines.some((r) => {
        const rc = completions.filter((c) => c.routineId === r.id);
        return calculateBestStreak(rc, r.frequency) >= 30;
      }),
  },
  {
    id: 'perfect-week',
    name: 'Semana perfecta',
    description: '100% de completado en todas las rutinas aplicables durante una semana',
    condition: (completions, routines) => {
      const today = getTodayString();
      // Check last 8 weeks for any perfect week
      for (let w = 0; w < 8; w++) {
        const weekStart = addDays(today, -(w * 7 + ((new Date(today + 'T00:00:00').getDay() + 6) % 7)));
        let allPerfect = true;
        let hasApplicable = false;
        for (let d = 0; d < 7; d++) {
          const day = addDays(weekStart, d);
          for (const r of routines) {
            if (r.isActive && appliesToDay(r.frequency, day)) {
              hasApplicable = true;
              if (!completions.some((c) => c.routineId === r.id && c.date === day)) {
                allPerfect = false;
              }
            }
          }
        }
        if (hasApplicable && allPerfect) return true;
      }
      return false;
    },
  },
  {
    id: 'first-month',
    name: 'Primer mes',
    description: 'Al menos una rutina completada en 30 dias diferentes',
    condition: (completions) => {
      const uniqueDays = new Set(completions.map((c) => c.date));
      return uniqueDays.size >= 30;
    },
  },
];

export function evaluateBadges(completions: CompletionRecord[], routines: Routine[]): { badge: BadgeDef; unlocked: boolean }[] {
  return BADGES.map((badge) => ({
    badge,
    unlocked: badge.condition(completions, routines),
  }));
}
