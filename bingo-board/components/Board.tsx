"use client";

import { COLUMNS } from "@/lib/columns";

type Props = {
  drawnSet: Set<number>;
  latest: number | null;
  progress: number;
  drawnCount: number;
};

export function Board({ drawnSet, latest, progress, drawnCount }: Props) {
  const pct = Math.round(progress * 100);
  const meta = drawnCount === 0 ? "SIN NÚMEROS CANTADOS" : `${pct}% COMPLETADO`;

  return (
    <section className="board-card">
      <div className="board-header">
        <div className="board-title">TABLERO 1—75</div>
        <div className="board-meta">{meta}</div>
      </div>

      <div className="progress" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <div style={{ height: 16 }} />

      <div className="board-scroll">
        <div className="board-grid">
          {COLUMNS.map((col) => {
            const nums: number[] = [];
            for (let i = col.range[0]; i <= col.range[1]; i++) nums.push(i);
            return (
              <div key={col.letter} className="board-col">
                <div className={`col-header col-${col.letter}`}>{col.letter}</div>
                {nums.map((n) => {
                  const isDrawn = drawnSet.has(n);
                  const isLatest = latest === n;
                  return (
                    <div
                      key={n}
                      className={`cell col-${col.letter} ${isDrawn ? "drawn" : ""} ${
                        isLatest ? "latest" : ""
                      }`}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
