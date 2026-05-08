"use client";

import { VoiceToggle } from "./VoiceToggle";

type Props = {
  drawn: number;
  remaining: number;
  voiceOn: boolean;
  onToggleVoice: () => void;
};

export function Topbar({ drawn, remaining, voiceOn, onToggleVoice }: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">B</div>
        <div className="brand-text">
          BINGO 75
          <span>TABLERO DE REGISTRO</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="stat-pill">
          <span className="dot" />
          CANTADOS&nbsp;<b>{drawn}</b>/75
        </div>
        <div className="stat-pill">
          RESTAN&nbsp;<b>{remaining}</b>
        </div>
        <VoiceToggle on={voiceOn} onToggle={onToggleVoice} />
      </div>
    </header>
  );
}
