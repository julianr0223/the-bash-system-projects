import type { Routine } from '../types';
import { apiFetch } from './client';

export async function list(): Promise<Routine[]> {
  return apiFetch('/api/routines');
}

export async function create(data: Partial<Routine>): Promise<Routine> {
  return apiFetch('/api/routines', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function update(id: string, data: Partial<Routine>): Promise<Routine> {
  return apiFetch(`/api/routines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function remove(id: string): Promise<void> {
  await apiFetch(`/api/routines/${id}`, { method: 'DELETE' });
}
