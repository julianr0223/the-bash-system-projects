import { useState, useEffect, useCallback } from 'react';

const PREFS_KEY = 'routine-tracker:reminders';

interface ReminderPrefs {
  enabled: boolean;
  time: string; // HH:mm
}

function loadPrefs(): ReminderPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { enabled: false, time: '09:00' };
}

function savePrefs(prefs: ReminderPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function useReminders() {
  const [prefs, setPrefs] = useState<ReminderPrefs>(loadPrefs);
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const enable = useCallback(async (time: string) => {
    if (typeof Notification === 'undefined') return;

    const permission = await Notification.requestPermission();
    setPermissionState(permission);

    if (permission !== 'granted') return;

    // Register SW
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/sw.js');
    }

    const newPrefs = { enabled: true, time };
    setPrefs(newPrefs);
    savePrefs(newPrefs);
  }, []);

  const disable = useCallback(() => {
    const newPrefs = { enabled: false, time: prefs.time };
    setPrefs(newPrefs);
    savePrefs(newPrefs);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.active?.postMessage({ type: 'CLEAR_REMINDER' });
      });
    }
  }, [prefs.time]);

  const setTime = useCallback((time: string) => {
    const newPrefs = { ...prefs, time };
    setPrefs(newPrefs);
    savePrefs(newPrefs);
  }, [prefs]);

  // Check reminders periodically
  useEffect(() => {
    if (!prefs.enabled) return;

    const check = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (currentTime === prefs.time && 'serviceWorker' in navigator) {
        // We'll pass pendingCount from the component that uses this hook
        // For now, just trigger the notification via SW
        navigator.serviceWorker.ready.then((reg) => {
          reg.active?.postMessage({ type: 'SET_REMINDER', time: prefs.time });
        });
      }
    };

    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [prefs.enabled, prefs.time]);

  const triggerCheck = useCallback((pendingCount: number) => {
    if (!prefs.enabled || pendingCount === 0) return;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.active?.postMessage({ type: 'CHECK_REMINDERS', pendingCount });
      });
    }
  }, [prefs.enabled]);

  return { prefs, permissionState, enable, disable, setTime, triggerCheck };
}
