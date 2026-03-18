import { useState, useCallback } from 'react';
import type { CompletionRecord } from '../types';
import * as completionStorage from '../storage/completions';
import { getTodayString } from '../utils/date';

export function useCompletions() {
  const [completions, setCompletions] = useState<CompletionRecord[]>(() => completionStorage.getCompletions());

  const refresh = useCallback(() => {
    setCompletions(completionStorage.getCompletions());
  }, []);

  const toggleCompletion = useCallback((routineId: string) => {
    const today = getTodayString();
    const existing = completions.find((c) => c.routineId === routineId && c.date === today);
    if (existing) {
      completionStorage.removeCompletion(routineId, today);
    } else {
      completionStorage.addCompletion(routineId, today);
    }
    refresh();
  }, [completions, refresh]);

  const isCompletedToday = useCallback((routineId: string): boolean => {
    const today = getTodayString();
    return completions.some((c) => c.routineId === routineId && c.date === today);
  }, [completions]);

  const getCompletionsByDate = useCallback((date: string): CompletionRecord[] => {
    return completions.filter((c) => c.date === date);
  }, [completions]);

  const getCompletionsByRoutine = useCallback((routineId: string): CompletionRecord[] => {
    return completions.filter((c) => c.routineId === routineId);
  }, [completions]);

  return { completions, toggleCompletion, isCompletedToday, getCompletionsByDate, getCompletionsByRoutine, refresh };
}
