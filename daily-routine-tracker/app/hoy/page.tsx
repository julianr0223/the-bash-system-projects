"use client";

import { useAppContext } from "../providers";
import { DailyView } from "@/components/DailyView/DailyView";

export default function HoyPage() {
  const { routines, isCompletedToday, toggleCompletion } = useAppContext();
  return <DailyView routines={routines} isCompleted={isCompletedToday} onToggle={toggleCompletion} />;
}
