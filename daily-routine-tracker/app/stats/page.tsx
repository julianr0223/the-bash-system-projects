"use client";

import { useAppContext } from "../providers";
import { Stats } from "@/components/Stats/Stats";

export default function StatsPage() {
  const { routines, completions, getCompletionsByRoutine } = useAppContext();
  return <Stats routines={routines} completions={completions} getCompletionsByRoutine={getCompletionsByRoutine} />;
}
