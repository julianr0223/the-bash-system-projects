import { NavLink } from 'react-router-dom';
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
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>Rutinas</span>
      <div className={styles.links}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
        <button className={styles.logoutBtn} onClick={onLogout}>Salir</button>
      </div>
    </nav>
  );
}
