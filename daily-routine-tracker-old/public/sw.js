// Service Worker for routine reminders
const REMINDER_KEY = 'routine-reminder-time';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data.type === 'SET_REMINDER') {
    // Store reminder time
    self.reminderTime = event.data.time; // HH:mm
  }
  if (event.data.type === 'CLEAR_REMINDER') {
    self.reminderTime = null;
  }
  if (event.data.type === 'CHECK_REMINDERS') {
    checkAndNotify(event.data.pendingCount);
  }
});

function checkAndNotify(pendingCount) {
  if (pendingCount > 0) {
    self.registration.showNotification('Rutinas pendientes', {
      body: `Tienes ${pendingCount} rutina${pendingCount > 1 ? 's' : ''} pendiente${pendingCount > 1 ? 's' : ''} hoy`,
      icon: '/favicon.svg',
      tag: 'routine-reminder',
    });
  }
}
