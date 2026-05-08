"use client";

import type { CSSProperties } from "react";

import { getColorVar, getLetter } from "@/lib/columns";

type Props = {
  drawn: number[];
};

const MAX = 12;

export function RecentList({ drawn }: Props) {
  const recent = [...drawn].reverse().slice(0, MAX);

  return (
    <div className="recent">
      <div className="recent-label">
        ÚLTIMOS CANTADOS · {recent.length > 0 ? `${recent.length} de ${drawn.length}` : "—"}
      </div>
      <div className="recent-list">
        {recent.length === 0 ? (
          <div className="recent-empty">Aún no se ha cantado ningún número.</div>
        ) : (
          recent.map((n) => (
            <div
              key={n}
              className="mini-ball"
              style={{ "--c": getColorVar(n) } as CSSProperties}
            >
              <span>{getLetter(n)}</span>
              <span>{n}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
