"use client";

import { useState } from 'react';
import { useReminders } from '@/hooks/useReminders';
import styles from './Settings.module.css';

export function Settings() {
  const { prefs, permissionState, enable, disable, setTime } = useReminders();
  const [timeInput, setTimeInput] = useState(prefs.time);

  async function handleEnable() {
    await enable(timeInput);
  }

  return (
    <div className={styles.container}>
      <h2>Ajustes</h2>

      <div className={styles.section}>
        <h3>Recordatorios</h3>

        {typeof Notification === 'undefined' ? (
          <p className={styles.note}>Tu navegador no soporta notificaciones.</p>
        ) : permissionState === 'denied' ? (
          <p className={styles.note}>
            Las notificaciones estan bloqueadas. Habilitalas en la configuracion de tu navegador.
          </p>
        ) : (
          <>
            <div className={styles.row}>
              <label className={styles.label}>
                Hora del recordatorio
                <input
                  className={styles.input}
                  type="time"
                  value={timeInput}
                  onChange={(e) => {
                    setTimeInput(e.target.value);
                    if (prefs.enabled) setTime(e.target.value);
                  }}
                />
              </label>
            </div>

            <div className={styles.row}>
              {prefs.enabled ? (
                <button className={styles.disableBtn} onClick={disable}>
                  Desactivar recordatorios
                </button>
              ) : (
                <button className={styles.enableBtn} onClick={handleEnable}>
                  Activar recordatorios
                </button>
              )}
            </div>

            {prefs.enabled && (
              <p className={styles.note}>
                Recibiras una notificacion a las {prefs.time} si tienes rutinas pendientes.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
