import type { CompletionRecord, Frequency } from '../types';
import { getTodayString, addDays } from './date';
import { appliesToDay } from './frequency';

export function calculateCurrentStreak(completions: CompletionRecord[], frequency: Frequency = 'daily'): number {
  if (completions.length === 0) return 0;

  const dates = new Set(completions.map((c) => c.date));
  const today = getTodayString();

  // Find starting point: today or the most recent applicable day
  let checkDate = today;

  // If today is not applicable, go back to the last applicable day
  if (!appliesToDay(frequency, checkDate)) {
    checkDate = addDays(checkDate, -1);
    while (!appliesToDay(frequency, checkDate)) {
      checkDate = addDays(checkDate, -1);
    }
  }

  // If the starting applicable day isn't completed, check one more back
  if (!dates.has(checkDate)) {
    // Maybe today is applicable but not completed yet — check previous applicable day
    if (checkDate === today) {
      checkDate = addDays(checkDate, -1);
      while (!appliesToDay(frequency, checkDate)) {
        checkDate = addDays(checkDate, -1);
      }
      if (!dates.has(checkDate)) return 0;
    } else {
      return 0;
    }
  }

  let streak = 0;
  // Count consecutive applicable days that have completions
  while (dates.has(checkDate)) {
    streak++;
    // Move to previous applicable day
    let prev = addDays(checkDate, -1);
    while (!appliesToDay(frequency, prev)) {
      prev = addDays(prev, -1);
    }
    checkDate = prev;
  }
  return streak;
}

export function calculateBestStreak(completions: CompletionRecord[], frequency: Frequency = 'daily'): number {
  if (completions.length === 0) return 0;

  const dates = [...new Set(completions.map((c) => c.date))].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    // Find next applicable day after dates[i-1]
    let nextApplicable = addDays(dates[i - 1], 1);
    while (!appliesToDay(frequency, nextApplicable)) {
      nextApplicable = addDays(nextApplicable, 1);
    }

    if (nextApplicable === dates[i]) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }
  return best;
}
