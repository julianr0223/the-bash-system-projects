export type Frequency = 'daily' | 'weekdays' | { days: number[] };

export interface Routine {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: Frequency;
  createdAt: string;
  isActive: boolean;
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  goal?: number;      // completions per week target
}

export interface CompletionRecord {
  routineId: string;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO timestamp
}

export interface RoutineWithStats extends Routine {
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
}
