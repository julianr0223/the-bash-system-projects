"use client";

import { useAppContext } from "./providers";
import { Dashboard } from "@/components/Dashboard/Dashboard";

export default function DashboardPage() {
  const { routines, completions, isCompletedToday, toggleCompletion, getCompletionsByRoutine } = useAppContext();
  return (
    <Dashboard
      routines={routines}
      completions={completions}
      isCompletedToday={isCompletedToday}
      onToggle={toggleCompletion}
      getCompletionsByRoutine={getCompletionsByRoutine}
    />
  );
}
