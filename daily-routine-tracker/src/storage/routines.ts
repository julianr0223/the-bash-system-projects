import type { Routine } from '../types';
import { save, load } from './localStorage';

const KEY = 'routines';

export function getRoutines(): Routine[] {
  return load<Routine[]>(KEY, []);
}

export function getActiveRoutines(): Routine[] {
  return getRoutines().filter((r) => r.isActive);
}

export function createRoutine(data: Pick<Routine, 'name' | 'description' | 'category' | 'frequency'>): Routine {
  const routines = getRoutines();
  const routine: Routine = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description || '',
    category: data.category || 'General',
    frequency: data.frequency || 'daily',
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  routines.push(routine);
  save(KEY, routines);
  return routine;
}

export function updateRoutine(id: string, updates: Partial<Pick<Routine, 'name' | 'description' | 'category' | 'frequency'>>): Routine | null {
  const routines = getRoutines();
  const idx = routines.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  routines[idx] = { ...routines[idx], ...updates };
  save(KEY, routines);
  return routines[idx];
}

export function deleteRoutine(id: string): boolean {
  const routines = getRoutines();
  const filtered = routines.filter((r) => r.id !== id);
  if (filtered.length === routines.length) return false;
  save(KEY, filtered);
  return true;
}

export function toggleRoutineActive(id: string): Routine | null {
  const routines = getRoutines();
  const idx = routines.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  routines[idx].isActive = !routines[idx].isActive;
  save(KEY, routines);
  return routines[idx];
}
