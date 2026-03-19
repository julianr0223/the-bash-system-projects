import { useState, useEffect } from 'react';
import { hasLocalData, migrateLocalData } from '../api/migrate';

export function MigrationBanner() {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<'idle' | 'migrating' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  useEffect(() => {
    setShow(hasLocalData());
  }, []);

  if (!show) return null;

  async function handleMigrate() {
    setStatus('migrating');
    try {
      const { routinesImported, completionsImported } = await migrateLocalData();
      setResult(`Migrados: ${routinesImported} rutinas, ${completionsImported} completados`);
      setStatus('done');
      setTimeout(() => setShow(false), 5000);
    } catch {
      setResult('Error al migrar datos');
      setStatus('error');
    }
  }

  return (
    <div style={{
      padding: '0.75rem 1.5rem',
      background: 'var(--color-primary-bg)',
      borderBottom: '1px solid var(--color-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      fontSize: '0.9rem',
    }}>
      {status === 'idle' && (
        <>
          <span>Se detectaron datos locales. Deseas migrarlos al servidor?</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleMigrate} style={{
              padding: '0.35rem 0.75rem', background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
            }}>Migrar</button>
            <button onClick={() => setShow(false)} style={{
              padding: '0.35rem 0.75rem', background: 'transparent', border: '1px solid var(--color-border)',
              borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text)',
            }}>Ignorar</button>
          </div>
        </>
      )}
      {status === 'migrating' && <span>Migrando datos...</span>}
      {(status === 'done' || status === 'error') && <span>{result}</span>}
    </div>
  );
}
