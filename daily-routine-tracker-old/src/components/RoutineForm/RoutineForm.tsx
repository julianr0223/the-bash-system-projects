import { useState } from 'react';
import type { Routine, Frequency } from '../../types';
import { isValidTimeRange } from '../../utils/date';
import { getApplicableDaysPerWeek } from '../../utils/frequency';
import type { RoutineInput } from '../../storage/routines';
import styles from './RoutineForm.module.css';

interface Props {
  initial?: Routine;
  onSubmit: (data: RoutineInput) => void;
  onCancel: () => void;
}

const CATEGORIES = ['General', 'Salud', 'Ejercicio', 'Productividad', 'Aprendizaje', 'Bienestar'];
const DAY_OPTIONS = [
  { value: 1, label: 'L' },
  { value: 2, label: 'M' },
  { value: 3, label: 'X' },
  { value: 4, label: 'J' },
  { value: 5, label: 'V' },
  { value: 6, label: 'S' },
  { value: 0, label: 'D' },
];

function getFreqType(freq: Frequency): 'daily' | 'weekdays' | 'custom' {
  if (freq === 'daily') return 'daily';
  if (freq === 'weekdays') return 'weekdays';
  return 'custom';
}

function getCustomDays(freq: Frequency): number[] {
  if (typeof freq === 'object' && 'days' in freq) return freq.days;
  return [];
}

export function RoutineForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'General');
  const [startTime, setStartTime] = useState(initial?.startTime ?? '');
  const [endTime, setEndTime] = useState(initial?.endTime ?? '');
  const [freqType, setFreqType] = useState<'daily' | 'weekdays' | 'custom'>(
    initial ? getFreqType(initial.frequency) : 'daily'
  );
  const [customDays, setCustomDays] = useState<number[]>(
    initial ? getCustomDays(initial.frequency) : []
  );
  const [goalStr, setGoalStr] = useState(initial?.goal?.toString() ?? '');
  const [error, setError] = useState('');

  function buildFrequency(): Frequency {
    if (freqType === 'daily') return 'daily';
    if (freqType === 'weekdays') return 'weekdays';
    return { days: [...customDays].sort() };
  }

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
    if (freqType === 'custom' && customDays.length === 0) {
      setError('Selecciona al menos un dia');
      return;
    }
    const frequency = buildFrequency();
    const goal = goalStr ? parseInt(goalStr, 10) : undefined;
    if (goal !== undefined && goal > getApplicableDaysPerWeek(frequency)) {
      setError(`La meta no puede exceder ${getApplicableDaysPerWeek(frequency)} dias por semana`);
      return;
    }
    onSubmit({
      name: trimmed,
      description: description.trim(),
      category,
      frequency,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      goal,
    });
  }

  function toggleDay(day: number) {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    setError('');
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

      <label className={styles.label}>
        Frecuencia
        <select
          className={styles.select}
          value={freqType}
          onChange={(e) => { setFreqType(e.target.value as 'daily' | 'weekdays' | 'custom'); setError(''); }}
        >
          <option value="daily">Diaria</option>
          <option value="weekdays">Lunes a Viernes</option>
          <option value="custom">Dias personalizados</option>
        </select>
      </label>

      {freqType === 'custom' && (
        <div className={styles.dayPicker}>
          {DAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.dayBtn} ${customDays.includes(opt.value) ? styles.dayBtnActive : ''}`}
              onClick={() => toggleDay(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

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

      <label className={styles.label}>
        Meta semanal (opcional)
        <input
          className={styles.input}
          type="number"
          min="1"
          max="7"
          value={goalStr}
          onChange={(e) => { setGoalStr(e.target.value); setError(''); }}
          placeholder="Ej: 5"
        />
      </label>

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
