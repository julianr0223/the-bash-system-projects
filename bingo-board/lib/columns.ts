import type { Letter } from "./types";

export const COLUMNS: ReadonlyArray<{
  letter: Letter;
  range: readonly [number, number];
  varName: string;
}> = [
  { letter: "B", range: [1, 15], varName: "--B" },
  { letter: "I", range: [16, 30], varName: "--I" },
  { letter: "N", range: [31, 45], varName: "--N" },
  { letter: "G", range: [46, 60], varName: "--G" },
  { letter: "O", range: [61, 75], varName: "--O" },
];

export function getLetter(n: number): Letter {
  if (n <= 15) return "B";
  if (n <= 30) return "I";
  if (n <= 45) return "N";
  if (n <= 60) return "G";
  return "O";
}

export function getColorVar(n: number): string {
  return `var(--${getLetter(n)})`;
}
