const STORAGE_PREFIX = 'routine-tracker:';

export function save<T>(key: string, data: T): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

export function load<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function remove(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key);
}
