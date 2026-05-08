"use client";

import type { Latest } from "@/lib/types";

import { Ball } from "./Ball";
import { RecentList } from "./RecentList";

type Props = {
  latest: Latest | null;
  drawing: boolean;
  drawn: number[];
  onDraw: () => void;
  onUndo: () => void;
  onResetRequest: () => void;
};

export function Caller({ latest, drawing, drawn, onDraw, onUndo, onResetRequest }: Props) {
  const drawDisabled = drawing || drawn.length >= 75;
  const undoDisabled = drawing || drawn.length === 0;
  const resetDisabled = drawn.length === 0;

  return (
    <section className="caller">
      <div className="caller-header">
        <span>NÚMERO ACTUAL</span>
        <span className="live">
          {drawing ? "SACANDO…" : latest ? "CANTADO" : "EN ESPERA"}
        </span>
      </div>

      <div className="ball-stage">
        <Ball latest={latest} drawing={drawing} />
      </div>

      <div className="controls">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onDraw}
          disabled={drawDisabled}
        >
          {drawing ? "SACANDO…" : "SACAR NÚMERO"}
        </button>
        <button
          type="button"
          className="btn"
          onClick={onUndo}
          disabled={undoDisabled}
          title="Deshacer último"
        >
          ↶ DESHACER
        </button>
        <button
          type="button"
          className="btn"
          onClick={onResetRequest}
          disabled={resetDisabled}
          title="Reiniciar partida"
        >
          ⟲ REINICIAR
        </button>
      </div>

      <RecentList drawn={drawn} />
    </section>
  );
}
