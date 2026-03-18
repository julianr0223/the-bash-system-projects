import { useState, useCallback } from 'react';
import type { Routine } from '../types';
import * as routineStorage from '../storage/routines';
import * as completionStorage from '../storage/completions';

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>(() => routineStorage.getRoutines());

  const refresh = useCallback(() => {
    setRoutines(routineStorage.getRoutines());
  }, []);

  const create = useCallback((data: Pick<Routine, 'name' | 'description' | 'category' | 'frequency'>) => {
    routineStorage.createRoutine(data);
    refresh();
  }, [refresh]);

  const update = useCallback((id: string, updates: Partial<Pick<Routine, 'name' | 'description' | 'category' | 'frequency'>>) => {
    routineStorage.updateRoutine(id, updates);
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string) => {
    routineStorage.deleteRoutine(id);
    completionStorage.removeCompletionsByRoutine(id);
    refresh();
  }, [refresh]);

  const toggleActive = useCallback((id: string) => {
    routineStorage.toggleRoutineActive(id);
    refresh();
  }, [refresh]);

  const activeRoutines = routines.filter((r) => r.isActive);

  return { routines, activeRoutines, create, update, remove, toggleActive, refresh };
}
