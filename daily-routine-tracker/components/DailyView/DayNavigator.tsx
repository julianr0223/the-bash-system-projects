"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDays, formatDateReadable } from "@/utils/date";
import styles from "./DayNavigator.module.css";

interface Props {
  targetDate: string;
  today: string;
}

export function DayNavigator({ targetDate, today }: Props) {
  const router = useRouter();
  const isToday = targetDate === today;
  const prevDate = addDays(targetDate, -1);
  const nextDate = addDays(targetDate, 1);
  const nextHref = nextDate > today ? null : nextDate === today ? "/hoy" : `/dia/${nextDate}`;

  const onPickDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    if (value === today) {
      router.push("/hoy");
    } else if (value < today) {
      router.push(`/dia/${value}`);
    }
  };

  return (
    <div className={styles.navigator}>
      <Link
        href={`/dia/${prevDate}`}
        className={styles.arrow}
        aria-label="Día anterior"
      >
        ←
      </Link>

      <label className={styles.dateLabel}>
        <span className={styles.dateIcon}>📅</span>
        <span>{formatDateReadable(targetDate)}</span>
        <input
          type="date"
          className={styles.dateInput}
          value={targetDate}
          max={today}
          onChange={onPickDate}
          aria-label="Seleccionar fecha"
        />
      </label>

      {nextHref ? (
        <Link href={nextHref} className={styles.arrow} aria-label="Día siguiente">
          →
        </Link>
      ) : (
        <span className={`${styles.arrow} ${styles.arrowDisabled}`} aria-hidden="true">
          →
        </span>
      )}

      {!isToday && (
        <Link href="/hoy" className={styles.todayBtn}>
          Hoy
        </Link>
      )}
    </div>
  );
}
