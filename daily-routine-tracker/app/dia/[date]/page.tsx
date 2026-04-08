"use client";

import { use } from "react";
import { notFound, redirect } from "next/navigation";
import { useAppContext } from "../../providers";
import { DailyView } from "@/components/DailyView/DailyView";
import { getTodayString, isValidDateString } from "@/utils/date";

export default function DiaPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);

  if (!isValidDateString(date)) {
    notFound();
  }

  const today = getTodayString();
  if (date >= today) {
    redirect("/hoy");
  }

  const { routines, completions } = useAppContext();
  const isCompleted = (routineId: string) =>
    completions.some((c) => c.routineId === routineId && c.date === date);

  return <DailyView routines={routines} isCompleted={isCompleted} date={date} readOnly />;
}
