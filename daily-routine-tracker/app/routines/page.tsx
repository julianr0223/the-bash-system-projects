"use client";

import { useAppContext } from "../providers";
import { RoutineList } from "@/components/RoutineList/RoutineList";

export default function RoutinesPage() {
  const { routines, create, update, remove, toggleActive } = useAppContext();
  return (
    <RoutineList
      routines={routines}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      onToggleActive={toggleActive}
    />
  );
}
