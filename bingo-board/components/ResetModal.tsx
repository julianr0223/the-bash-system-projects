"use client";

type Props = {
  open: boolean;
  drawnCount: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ResetModal({ open, drawnCount, onCancel, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>¿REINICIAR PARTIDA?</h2>
        <p>
          Se borrarán los {drawnCount} números cantados. Esta acción no se puede deshacer.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel} style={{ flex: 1 }}>
            CANCELAR
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            style={{ flex: 1, minWidth: 0 }}
          >
            REINICIAR
          </button>
        </div>
      </div>
    </div>
  );
}
