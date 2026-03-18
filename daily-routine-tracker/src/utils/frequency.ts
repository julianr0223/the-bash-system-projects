import type { Frequency } from '../types';
import { parseDate } from './date';

export function appliesToDay(frequency: Frequency, dateStr: string): boolean {
  if (frequency === 'daily') return true;

  const dayOfWeek = parseDate(dateStr).getDay(); // 0=Sun, 1=Mon...6=Sat

  if (frequency === 'weekdays') {
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  return frequency.days.includes(dayOfWeek);
}

export function getApplicableDaysPerWeek(frequency: Frequency): number {
  if (frequency === 'daily') return 7;
  if (frequency === 'weekdays') return 5;
  return frequency.days.length;
}

const DAY_LABELS_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

export function formatFrequency(frequency: Frequency): string {
  if (frequency === 'daily') return 'Diaria';
  if (frequency === 'weekdays') return 'L-V';
  return frequency.days.map((d) => DAY_LABELS_SHORT[d]).join(', ');
}
