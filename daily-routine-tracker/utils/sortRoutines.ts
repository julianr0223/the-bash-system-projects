import type { Routine } from '@/types';

export function sortRoutinesBySchedule<T extends Pick<Routine, 'startTime' | 'name'>>(
  routines: T[]
): T[] {
  return [...routines].sort((a, b) => {
    if (!a.startTime && !b.startTime) return a.name.localeCompare(b.name);
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    const cmp = a.startTime.localeCompare(b.startTime);
    return cmp !== 0 ? cmp : a.name.localeCompare(b.name);
  });
}
