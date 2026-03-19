import type { CompletionRecord } from '@/types';
import { save, load } from './localStorage';

const KEY = 'completions';

export function getCompletions(): CompletionRecord[] {
  return load<CompletionRecord[]>(KEY, []);
}

export function addCompletion(routineId: string, date: string): CompletionRecord {
  const completions = getCompletions();
  const existing = completions.find((c) => c.routineId === routineId && c.date === date);
  if (existing) return existing;

  const record: CompletionRecord = {
    routineId,
    date,
    completedAt: new Date().toISOString(),
  };
  completions.push(record);
  save(KEY, completions);
  return record;
}

export function removeCompletion(routineId: string, date: string): boolean {
  const completions = getCompletions();
  const filtered = completions.filter((c) => !(c.routineId === routineId && c.date === date));
  if (filtered.length === completions.length) return false;
  save(KEY, filtered);
  return true;
}

export function getCompletionsByDate(date: string): CompletionRecord[] {
  return getCompletions().filter((c) => c.date === date);
}

export function getCompletionsByRoutine(routineId: string): CompletionRecord[] {
  return getCompletions().filter((c) => c.routineId === routineId);
}

export function removeCompletionsByRoutine(routineId: string): void {
  const completions = getCompletions().filter((c) => c.routineId !== routineId);
  save(KEY, completions);
}
