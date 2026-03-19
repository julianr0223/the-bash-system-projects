"use client";

import { useState } from 'react';
import styles from './Auth.module.css';

interface Props {
  onSubmit: (currentPassword: string, newPassword: string) => void;
  error: string;
}

export function ChangePasswordForm({ onSubmit, error }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError('');
    if (newPassword !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    onSubmit(currentPassword, newPassword);
  }

  const displayError = error || localError;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Cambiar contraseña</h1>
        <p className={styles.subtitle}>Debes cambiar tu contraseña antes de continuar</p>

        {displayError && <p className={styles.error}>{displayError}</p>}

        <label className={styles.label}>
          Contraseña actual
          <input
            className={styles.input}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="********"
            autoFocus
            required
          />
        </label>

        <label className={styles.label}>
          Nueva contraseña
          <input
            className={styles.input}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="********"
            required
            minLength={6}
          />
        </label>

        <label className={styles.label}>
          Confirmar nueva contraseña
          <input
            className={styles.input}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            required
            minLength={6}
          />
        </label>

        <button type="submit" className={styles.btn}>Cambiar contraseña</button>
      </form>
    </div>
  );
}
