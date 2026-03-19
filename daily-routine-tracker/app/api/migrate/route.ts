import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();

  const { routines, completions } = await request.json();
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
          r.id, auth.userId, r.name, r.description || "", r.category || "General",
          JSON.stringify(r.frequency || "daily"),
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

  return NextResponse.json({ routinesImported, completionsImported });
}
