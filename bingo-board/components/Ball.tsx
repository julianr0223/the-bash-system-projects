"use client";

import type { CSSProperties } from "react";

import type { Latest } from "@/lib/types";

type Props = {
  latest: Latest | null;
  drawing: boolean;
};

export function Ball({ latest, drawing }: Props) {
  const ballColor = latest ? `var(--${latest.letter})` : "var(--O)";
  const glowStyle = { "--ball-color": ballColor } as CSSProperties;

  return (
    <>
      <div className="ball-bg-glow" style={glowStyle} />
      {latest ? (
        <div
          key={latest.n}
          className={`ball ${drawing ? "shaking" : "drawing"}`}
          style={{ "--ball-color": `var(--${latest.letter})` } as CSSProperties}
        >
          <div className="ball-letter">{latest.letter}</div>
          <div className="ball-number">{latest.n}</div>
        </div>
      ) : (
        <div className={`ball-empty ${drawing ? "shaking" : ""}`}>
          {drawing ? "SACANDO…" : "PULSA SACAR PARA EMPEZAR"}
        </div>
      )}
    </>
  );
}
