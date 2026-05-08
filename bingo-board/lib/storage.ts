import type { BingoState, Latest } from "./types";

const KEY = "bingo-state-v1";

function isLatest(value: unknown): value is Latest {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.n === "number" &&
    typeof v.letter === "string" &&
    ["B", "I", "N", "G", "O"].includes(v.letter)
  );
}

function isBingoState(value: unknown): value is BingoState {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.drawn) || !v.drawn.every((n) => typeof n === "number")) return false;
  if (typeof v.voiceOn !== "boolean") return false;
  if (v.latest !== null && !isLatest(v.latest)) return false;
  return true;
}

export function loadState(): BingoState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isBingoState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: BingoState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
}

export const STORAGE_KEY = KEY;
