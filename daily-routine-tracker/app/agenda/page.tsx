"use client";

import { useAppContext } from "../providers";
import { DailyAgenda } from "@/components/DailyAgenda/DailyAgenda";

export default function AgendaPage() {
  const { routines, isCompletedToday, toggleCompletion } = useAppContext();
  return <DailyAgenda routines={routines} isCompletedToday={isCompletedToday} onToggle={toggleCompletion} />;
}
