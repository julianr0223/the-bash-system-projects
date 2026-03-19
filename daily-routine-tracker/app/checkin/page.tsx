"use client";

import { useAppContext } from "../providers";
import { DailyCheckin } from "@/components/DailyCheckin/DailyCheckin";

export default function CheckinPage() {
  const { routines, isCompletedToday, toggleCompletion } = useAppContext();
  return <DailyCheckin routines={routines} isCompletedToday={isCompletedToday} onToggle={toggleCompletion} />;
}
