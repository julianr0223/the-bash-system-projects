import { Router } from 'express';
import { getDb } from '../db.js';
import { getUserId } from '../middleware/auth.js';

export const routinesRouter = Router();

interface RoutineRow {
  id: string;
  user_id: number;
  name: string;
  description: string;
  category: string;
  frequency: string;
  start_time: string | null;
  end_time: string | null;
  goal: number | null;
  is_active: number;
  created_at: string;
}

function rowToRoutine(row: RoutineRow) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    frequency: JSON.parse(row.frequency),
    startTime: row.start_time ?? undefined,
    endTime: row.end_time ?? undefined,
    goal: row.goal ?? undefined,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
  };
}

// GET /api/routines
routinesRouter.get('/', (req, res) => {
  const rows = getDb()
    .prepare('SELECT * FROM routines WHERE user_id = ? ORDER BY created_at')
    .all(getUserId(req)) as RoutineRow[];
  res.json(rows.map(rowToRoutine));
});

// POST /api/routines
routinesRouter.post('/', (req, res) => {
  const userId = getUserId(req);
  const { name, description, category, frequency, startTime, endTime, goal } = req.body;
  const id = crypto.randomUUID();
  getDb().prepare(`
    INSERT INTO routines (id, user_id, name, description, category, frequency, start_time, end_time, goal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, userId, name, description || '', category || 'General', JSON.stringify(frequency || 'daily'), startTime || null, endTime || null, goal || null);

  const row = getDb().prepare('SELECT * FROM routines WHERE id = ?').get(id) as RoutineRow;
  res.status(201).json(rowToRoutine(row));
});

// PUT /api/routines/:id
routinesRouter.put('/:id', (req, res) => {
  const userId = getUserId(req);
  const { id } = req.params;

  const existing = getDb().prepare('SELECT * FROM routines WHERE id = ? AND user_id = ?').get(id, userId) as RoutineRow | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Routine not found' });
    return;
  }

  const { name, description, category, frequency, startTime, endTime, goal, isActive } = req.body;
  getDb().prepare(`
    UPDATE routines SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      category = COALESCE(?, category),
      frequency = COALESCE(?, frequency),
      start_time = ?,
      end_time = ?,
      goal = ?,
      is_active = COALESCE(?, is_active)
    WHERE id = ? AND user_id = ?
  `).run(
    name ?? null,
    description ?? null,
    category ?? null,
    frequency !== undefined ? JSON.stringify(frequency) : null,
    startTime !== undefined ? (startTime || null) : existing.start_time,
    endTime !== undefined ? (endTime || null) : existing.end_time,
    goal !== undefined ? (goal || null) : existing.goal,
    isActive !== undefined ? (isActive ? 1 : 0) : null,
    id,
    userId
  );

  const row = getDb().prepare('SELECT * FROM routines WHERE id = ?').get(id) as RoutineRow;
  res.json(rowToRoutine(row));
});

// DELETE /api/routines/:id
routinesRouter.delete('/:id', (req, res) => {
  const userId = getUserId(req);
  const result = getDb().prepare('DELETE FROM routines WHERE id = ? AND user_id = ?').run(req.params.id, userId);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Routine not found' });
    return;
  }
  res.json({ ok: true });
});
