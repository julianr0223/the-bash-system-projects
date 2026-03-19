"use client";

import { useAppContext } from "../providers";
import { Badges } from "@/components/Badges/Badges";

export default function BadgesPage() {
  const { routines, completions } = useAppContext();
  return <Badges routines={routines} completions={completions} />;
}
