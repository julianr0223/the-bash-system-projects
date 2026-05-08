"use client";

type Props = {
  on: boolean;
  onToggle: () => void;
};

export function VoiceToggle({ on, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`voice-toggle ${on ? "on" : ""}`}
      onClick={onToggle}
      aria-label="Alternar voz"
      aria-pressed={on}
    >
      <span className="vdot" />
      VOZ&nbsp;{on ? "ON" : "OFF"}
    </button>
  );
}
