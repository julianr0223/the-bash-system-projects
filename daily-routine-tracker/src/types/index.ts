export interface Routine {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: 'daily';
  createdAt: string;
  isActive: boolean;
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
