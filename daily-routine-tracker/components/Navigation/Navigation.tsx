"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Navigation.module.css';

const primaryLinks = [
  { to: '/', label: 'Dashboard', icon: '◩' },
  { to: '/hoy', label: 'Hoy', icon: '◉' },
  { to: '/routines', label: 'Rutinas', icon: '↻' },
  { to: '/reports', label: 'Reportes', icon: '▤' },
];

const secondaryLinks = [
  { to: '/badges', label: 'Logros', icon: '✦' },
  { to: '/stats', label: 'Estadísticas', icon: '◈' },
  { to: '/settings', label: 'Ajustes', icon: '⚙' },
];

const allDesktopLinks = [...primaryLinks, ...secondaryLinks];

interface Props {
  onLogout: () => void;
}

export function Navigation({ onLogout }: Props) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Navigation ── */}
      <nav className={styles.navDesktop}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandLeaf}>⌘</span>
            Rutinas
          </Link>
          <div className={styles.desktopLinks}>
            {allDesktopLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`${styles.desktopLink} ${pathname === link.to ? styles.desktopActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button className={styles.logoutBtn} onClick={onLogout}>
            Salir
          </button>
        </div>
      </nav>

      {/* ── Mobile Navigation ── */}
      <nav className={styles.navMobile}>
        {primaryLinks.map((link) => (
          <Link
            key={link.to}
            href={link.to}
            className={`${styles.mobileTab} ${pathname === link.to ? styles.mobileActive : ''}`}
            onClick={() => setMoreOpen(false)}
          >
            <span className={styles.mobileIcon}>{link.icon}</span>
            <span className={styles.mobileLabel}>{link.label}</span>
          </Link>
        ))}
        <button
          className={`${styles.mobileTab} ${moreOpen ? styles.mobileActive : ''}`}
          onClick={() => setMoreOpen((v) => !v)}
        >
          <span className={styles.mobileIcon}>⋯</span>
          <span className={styles.mobileLabel}>Más</span>
        </button>

        {/* ── Overflow menu ── */}
        {moreOpen && (
          <>
            <div className={styles.moreBackdrop} onClick={() => setMoreOpen(false)} />
            <div className={styles.moreMenu}>
              {secondaryLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`${styles.moreLink} ${pathname === link.to ? styles.moreLinkActive : ''}`}
                  onClick={() => setMoreOpen(false)}
                >
                  <span className={styles.moreLinkIcon}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <button className={styles.moreLogout} onClick={onLogout}>
                <span className={styles.moreLinkIcon}>↗</span>
                Salir
              </button>
            </div>
          </>
        )}
      </nav>
    </>
  );
}
