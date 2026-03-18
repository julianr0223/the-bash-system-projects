import type { CompletionRecord } from '../types';
import { getTodayString, addDays } from './date';

export function calculateCurrentStreak(completions: CompletionRecord[]): number {
  if (completions.length === 0) return 0;

  const dates = new Set(completions.map((c) => c.date));
  const today = getTodayString();

  // Start from today or yesterday (if not yet completed today)
  let checkDate = dates.has(today) ? today : addDays(today, -1);
  if (!dates.has(checkDate)) return 0;

  let streak = 0;
  while (dates.has(checkDate)) {
    streak++;
    checkDate = addDays(checkDate, -1);
  }
  return streak;
}

export function calculateBestStreak(completions: CompletionRecord[]): number {
  if (completions.length === 0) return 0;

  const dates = [...new Set(completions.map((c) => c.date))].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    if (addDays(dates[i - 1], 1) === dates[i]) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }
  return best;
}
