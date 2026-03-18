import { useState } from 'react';
import type { Routine } from '../../types';
import { isValidTimeRange } from '../../utils/date';
import styles from './RoutineForm.module.css';

interface RoutineFormData {
  name: string;
  description: string;
  category: string;
  frequency: 'daily';
  startTime?: string;
  endTime?: string;
}

interface Props {
  initial?: Routine;
  onSubmit: (data: RoutineFormData) => void;
  onCancel: () => void;
}

const CATEGORIES = ['General', 'Salud', 'Ejercicio', 'Productividad', 'Aprendizaje', 'Bienestar'];

export function RoutineForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'General');
  const [startTime, setStartTime] = useState(initial?.startTime ?? '');
  const [endTime, setEndTime] = useState(initial?.endTime ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('El nombre es obligatorio');
      return;
    }
    if (startTime && endTime && !isValidTimeRange(startTime, endTime)) {
      setError('La hora de fin debe ser posterior a la de inicio');
      return;
    }
    onSubmit({
      name: trimmed,
      description: description.trim(),
      category,
      frequency: 'daily',
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{initial ? 'Editar rutina' : 'Nueva rutina'}</h3>

      <label className={styles.label}>
        Nombre *
        <input
          className={styles.input}
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="Ej: Meditar"
          autoFocus
        />
      </label>
      {error && <p className={styles.error}>{error}</p>}

      <label className={styles.label}>
        Descripcion
        <input
          className={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: 10 minutos de meditacion"
        />
      </label>

      <label className={styles.label}>
        Categoria
        <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <div className={styles.timeRow}>
        <label className={styles.label}>
          Hora inicio
          <input
            className={styles.input}
            type="time"
            value={startTime}
            onChange={(e) => { setStartTime(e.target.value); setError(''); }}
          />
        </label>
        <label className={styles.label}>
          Hora fin
          <input
            className={styles.input}
            type="time"
            value={endTime}
            onChange={(e) => { setEndTime(e.target.value); setError(''); }}
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn}>
          {initial ? 'Guardar' : 'Crear'}
        </button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
