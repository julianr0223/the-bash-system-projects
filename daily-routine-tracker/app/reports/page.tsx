"use client";

import { useAppContext } from "../providers";
import { Reports } from "@/components/Reports/Reports";

export default function ReportsPage() {
  const { routines, completions } = useAppContext();
  return <Reports routines={routines} completions={completions} />;
}
