"use client";

import { useBingoEngine } from "@/hooks/useBingoEngine";

import { Board } from "./Board";
import { Caller } from "./Caller";
import { ResetModal } from "./ResetModal";
import { Toast } from "./Toast";
import { Topbar } from "./Topbar";

export function BingoApp() {
  const engine = useBingoEngine();

  return (
    <>
      <Topbar
        drawn={engine.drawn.length}
        remaining={engine.remaining}
        voiceOn={engine.voiceOn}
        onToggleVoice={engine.toggleVoice}
      />

      <main className="stage">
        <Caller
          latest={engine.latest}
          drawing={engine.drawing}
          drawn={engine.drawn}
          onDraw={engine.draw}
          onUndo={engine.undo}
          onResetRequest={engine.openResetModal}
        />
        <Board
          drawnSet={engine.drawnSet}
          latest={engine.latest?.n ?? null}
          progress={engine.progress}
          drawnCount={engine.drawn.length}
        />
      </main>

      <footer className="footnote">
        BINGO TABLERO · GENERADOR DE NÚMEROS · 75 BOLAS
      </footer>

      <Toast message={engine.toast} />
      <ResetModal
        open={engine.showResetModal}
        drawnCount={engine.drawn.length}
        onCancel={engine.closeResetModal}
        onConfirm={engine.reset}
      />
    </>
  );
}
