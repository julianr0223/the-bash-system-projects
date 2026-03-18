import { useState } from 'react';
import type { Routine } from '../../types';
import { RoutineForm } from '../RoutineForm/RoutineForm';
import styles from './RoutineList.module.css';

interface Props {
  routines: Routine[];
  onUpdate: (id: string, data: Partial<Pick<Routine, 'name' | 'description' | 'category' | 'frequency' | 'startTime' | 'endTime'>>) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onCreate: (data: Pick<Routine, 'name' | 'description' | 'category' | 'frequency'> & { startTime?: string; endTime?: string }) => void;
}

export function RoutineList({ routines, onUpdate, onDelete, onToggleActive, onCreate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const grouped = routines.reduce<Record<string, Routine[]>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});

  if (routines.length === 0 && !showCreate) {
    return (
      <div className={styles.empty}>
        <p>No tienes rutinas aun.</p>
        <p>Crea tu primera rutina para empezar a dar seguimiento a tus habitos diarios.</p>
        <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
          + Nueva rutina
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Mis rutinas</h2>
        <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
          + Nueva rutina
        </button>
      </div>

      {showCreate && (
        <RoutineForm
          onSubmit={(data) => { onCreate(data); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className={styles.group}>
          <h3 className={styles.categoryHeader}>{category}</h3>
          {items.map((routine) => (
            <div key={routine.id} className={styles.routineCard}>
              {editingId === routine.id ? (
                <RoutineForm
                  initial={routine}
                  onSubmit={(data) => { onUpdate(routine.id, data); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className={styles.routineInfo}>
                    <span className={`${styles.routineName} ${!routine.isActive ? styles.inactive : ''}`}>
                      {routine.name}
                      {routine.startTime && (
                        <span className={styles.timeRange}>
                          {routine.startTime}{routine.endTime ? ` - ${routine.endTime}` : ''}
                        </span>
                      )}
                    </span>
                    {routine.description && (
                      <span className={styles.routineDesc}>{routine.description}</span>
                    )}
                    {!routine.isActive && <span className={styles.badge}>Inactiva</span>}
                  </div>
                  <div className={styles.routineActions}>
                    <button className={styles.actionBtn} onClick={() => setEditingId(routine.id)}>Editar</button>
                    <button className={styles.actionBtn} onClick={() => onToggleActive(routine.id)}>
                      {routine.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    {confirmDeleteId === routine.id ? (
                      <span className={styles.confirmDelete}>
                        Eliminar?{' '}
                        <button className={styles.dangerBtn} onClick={() => { onDelete(routine.id); setConfirmDeleteId(null); }}>Si</button>
                        <button className={styles.actionBtn} onClick={() => setConfirmDeleteId(null)}>No</button>
                      </span>
                    ) : (
                      <button className={styles.dangerBtn} onClick={() => setConfirmDeleteId(routine.id)}>Eliminar</button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
