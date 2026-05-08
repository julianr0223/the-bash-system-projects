export type Letter = "B" | "I" | "N" | "G" | "O";

export type Latest = {
  n: number;
  letter: Letter;
};

export type BingoState = {
  drawn: number[];
  latest: Latest | null;
  voiceOn: boolean;
};
