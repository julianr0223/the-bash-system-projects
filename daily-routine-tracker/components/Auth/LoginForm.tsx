"use client";

import { useState } from 'react';
import styles from './Auth.module.css';

interface Props {
  onSubmit: (email: string, password: string) => void;
  error: string;
  title: string;
  buttonText: string;
}

export function AuthForm({ onSubmit, error, title, buttonText }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim() && password) {
      onSubmit(email.trim(), password);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⌘</span>
          <h1 className={styles.title}>Rutinas</h1>
        </div>
        <p className={styles.subtitle}>Tracker de hábitos diarios</p>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoFocus
            required
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            minLength={6}
          />
        </label>

        <button type="submit" className={styles.btn}>{buttonText}</button>
      </form>
    </div>
  );
}
