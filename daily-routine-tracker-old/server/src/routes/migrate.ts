import { Router } from 'express';
import { getDb } from '../db.js';
import { getUserId } from '../middleware/auth.js';

export const migrateRouter = Router();

// POST /api/migrate — bulk import from localStorage
migrateRouter.post('/', (req, res) => {
  const userId = getUserId(req);
  const { routines, completions } = req.body;

  let routinesImported = 0;
  let completionsImported = 0;

  const db = getDb();
  const insertRoutine = db.prepare(`
    INSERT OR IGNORE INTO routines (id, user_id, name, description, category, frequency, start_time, end_time, goal, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertCompletion = db.prepare(`
    INSERT OR IGNORE INTO completions (routine_id, date, completed_at)
    VALUES (?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    if (Array.isArray(routines)) {
      for (const r of routines) {
        const result = insertRoutine.run(
          r.id, userId, r.name, r.description || '', r.category || 'General',
          JSON.stringify(r.frequency || 'daily'),
          r.startTime || null, r.endTime || null, r.goal || null,
          r.isActive !== false ? 1 : 0, r.createdAt || new Date().toISOString()
        );
        if (result.changes > 0) routinesImported++;
      }
    }
    if (Array.isArray(completions)) {
      for (const c of completions) {
        const result = insertCompletion.run(c.routineId, c.date, c.completedAt || new Date().toISOString());
        if (result.changes > 0) completionsImported++;
      }
    }
  });

  transaction();

  res.json({ routinesImported, completionsImported });
});
