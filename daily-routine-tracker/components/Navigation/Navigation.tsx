"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/checkin', label: 'Check-in' },
  { to: '/routines', label: 'Rutinas' },
  { to: '/reports', label: 'Reportes' },
  { to: '/badges', label: 'Logros' },
  { to: '/stats', label: 'Estadisticas' },
  { to: '/settings', label: 'Ajustes' },
];

interface Props {
  onLogout: () => void;
}

export function Navigation({ onLogout }: Props) {
  const pathname = usePathname();
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>Rutinas</span>
      <div className={styles.links}>
        {links.map((link) => (
          <Link
            key={link.to}
            href={link.to}
            className={`${styles.link} ${pathname === link.to ? styles.active : ''}`}
          >
            {link.label}
          </Link>
        ))}
        <button className={styles.logoutBtn} onClick={onLogout}>Salir</button>
      </div>
    </nav>
  );
}
