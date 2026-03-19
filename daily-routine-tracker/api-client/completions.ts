import type { CompletionRecord } from '@/types';
import { apiFetch } from './client';

export async function getAll(): Promise<CompletionRecord[]> {
  return apiFetch('/api/completions');
}

export async function getByDate(date: string): Promise<CompletionRecord[]> {
  return apiFetch(`/api/completions?date=${date}`);
}

export async function add(routineId: string, date: string): Promise<CompletionRecord> {
  return apiFetch('/api/completions', {
    method: 'POST',
    body: JSON.stringify({ routineId, date }),
  });
}

export async function remove(routineId: string, date: string): Promise<void> {
  await apiFetch(`/api/completions/${routineId}/${date}`, { method: 'DELETE' });
}
