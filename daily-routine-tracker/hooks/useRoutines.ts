import { useState, useCallback, useEffect } from 'react';
import type { Routine } from '@/types';
import * as routinesApi from '@/api-client/routines';

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);

  const refresh = useCallback(async () => {
    const data = await routinesApi.list();
    setRoutines(data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (data: Partial<Routine>) => {
    await routinesApi.create(data);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, updates: Partial<Routine>) => {
    await routinesApi.update(id, updates);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await routinesApi.remove(id);
    await refresh();
  }, [refresh]);

  const toggleActive = useCallback(async (id: string) => {
    const routine = routines.find((r) => r.id === id);
    if (routine) {
      await routinesApi.update(id, { isActive: !routine.isActive } as any);
      await refresh();
    }
  }, [routines, refresh]);

  const activeRoutines = routines.filter((r) => r.isActive);

  return { routines, activeRoutines, create, update, remove, toggleActive, refresh };
}
