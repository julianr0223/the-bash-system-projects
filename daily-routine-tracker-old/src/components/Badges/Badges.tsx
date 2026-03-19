import { useMemo } from 'react';
import type { Routine, CompletionRecord } from '../../types';
import { evaluateBadges } from '../../utils/badges';
import styles from './Badges.module.css';

interface Props {
  routines: Routine[];
  completions: CompletionRecord[];
}

export function Badges({ routines, completions }: Props) {
  const results = useMemo(
    () => evaluateBadges(completions, routines),
    [completions, routines]
  );

  const unlockedCount = results.filter((r) => r.unlocked).length;

  return (
    <div className={styles.container}>
      <h2>Logros</h2>
      <p className={styles.summary}>{unlockedCount} de {results.length} desbloqueados</p>

      <div className={styles.grid}>
        {results.map(({ badge, unlocked }) => (
          <div key={badge.id} className={`${styles.card} ${unlocked ? styles.unlocked : styles.locked}`}>
            <span className={styles.icon}>{unlocked ? '\u2B50' : '\uD83D\uDD12'}</span>
            <span className={styles.name}>{badge.name}</span>
            <span className={styles.desc}>{badge.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
