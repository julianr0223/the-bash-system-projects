import { apiFetch } from './client';

const ROUTINES_KEY = 'routine-tracker:routines';
const COMPLETIONS_KEY = 'routine-tracker:completions';

export function hasLocalData(): boolean {
  const routines = localStorage.getItem(ROUTINES_KEY);
  if (!routines) return false;
  try {
    const parsed = JSON.parse(routines);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
}

export async function migrateLocalData(): Promise<{ routinesImported: number; completionsImported: number }> {
  const routinesRaw = localStorage.getItem(ROUTINES_KEY);
  const completionsRaw = localStorage.getItem(COMPLETIONS_KEY);

  const routines = routinesRaw ? JSON.parse(routinesRaw) : [];
  const completions = completionsRaw ? JSON.parse(completionsRaw) : [];

  const result = await apiFetch<{ routinesImported: number; completionsImported: number }>('/api/migrate', {
    method: 'POST',
    body: JSON.stringify({ routines, completions }),
  });

  // Clear local data after successful migration
  localStorage.removeItem(ROUTINES_KEY);
  localStorage.removeItem(COMPLETIONS_KEY);

  return result;
}
