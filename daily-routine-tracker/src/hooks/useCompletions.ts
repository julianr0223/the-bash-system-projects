import { useState, useCallback, useEffect } from 'react';
import type { CompletionRecord } from '../types';
import * as completionsApi from '../api/completions';
import { getTodayString } from '../utils/date';

export function useCompletions() {
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);

  const refresh = useCallback(async () => {
    const data = await completionsApi.getAll();
    setCompletions(data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const toggleCompletion = useCallback(async (routineId: string) => {
    const today = getTodayString();
    const existing = completions.find((c) => c.routineId === routineId && c.date === today);
    if (existing) {
      await completionsApi.remove(routineId, today);
    } else {
      await completionsApi.add(routineId, today);
    }
    await refresh();
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
