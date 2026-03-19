import { Router } from 'express';
import { getDb } from '../db.js';
import { getUserId } from '../middleware/auth.js';

export const completionsRouter = Router();

interface CompletionRow {
  id: number;
  routine_id: string;
  date: string;
  completed_at: string;
}

function rowToCompletion(row: CompletionRow) {
  return {
    routineId: row.routine_id,
    date: row.date,
    completedAt: row.completed_at,
  };
}

// GET /api/completions?date=YYYY-MM-DD
completionsRouter.get('/', (req, res) => {
  const userId = getUserId(req);
  const { date } = req.query;

  let rows: CompletionRow[];
  if (date) {
    rows = getDb().prepare(`
      SELECT c.* FROM completions c
      JOIN routines r ON c.routine_id = r.id
      WHERE r.user_id = ? AND c.date = ?
    `).all(userId, date) as CompletionRow[];
  } else {
    rows = getDb().prepare(`
      SELECT c.* FROM completions c
      JOIN routines r ON c.routine_id = r.id
      WHERE r.user_id = ?
    `).all(userId) as CompletionRow[];
  }
  res.json(rows.map(rowToCompletion));
});

// POST /api/completions
completionsRouter.post('/', (req, res) => {
  const userId = getUserId(req);
  const { routineId, date } = req.body;

  // Verify routine belongs to user
  const routine = getDb().prepare('SELECT id FROM routines WHERE id = ? AND user_id = ?').get(routineId, userId);
  if (!routine) {
    res.status(404).json({ error: 'Routine not found' });
    return;
  }

  // Check for existing
  const existing = getDb().prepare('SELECT * FROM completions WHERE routine_id = ? AND date = ?').get(routineId, date) as CompletionRow | undefined;
  if (existing) {
    res.json(rowToCompletion(existing));
    return;
  }

  getDb().prepare('INSERT INTO completions (routine_id, date) VALUES (?, ?)').run(routineId, date);
  const row = getDb().prepare('SELECT * FROM completions WHERE routine_id = ? AND date = ?').get(routineId, date) as CompletionRow;
  res.status(201).json(rowToCompletion(row));
});

// DELETE /api/completions/:routineId/:date
completionsRouter.delete('/:routineId/:date', (req, res) => {
  const userId = getUserId(req);
  const { routineId, date } = req.params;

  // Verify routine belongs to user
  const routine = getDb().prepare('SELECT id FROM routines WHERE id = ? AND user_id = ?').get(routineId, userId);
  if (!routine) {
    res.status(404).json({ error: 'Routine not found' });
    return;
  }

  getDb().prepare('DELETE FROM completions WHERE routine_id = ? AND date = ?').run(routineId, date);
  res.json({ ok: true });
});
