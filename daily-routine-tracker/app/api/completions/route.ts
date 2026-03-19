import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth";

interface CompletionRow {
  id: number;
  routine_id: string;
  date: string;
  completed_at: string;
}

function rowToCompletion(row: CompletionRow) {
  return { routineId: row.routine_id, date: row.date, completedAt: row.completed_at };
}

export async function GET(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();

  const date = request.nextUrl.searchParams.get("date");
  let rows: CompletionRow[];
  if (date) {
    rows = getDb().prepare(`
      SELECT c.* FROM completions c JOIN routines r ON c.routine_id = r.id
      WHERE r.user_id = ? AND c.date = ?
    `).all(auth.userId, date) as CompletionRow[];
  } else {
    rows = getDb().prepare(`
      SELECT c.* FROM completions c JOIN routines r ON c.routine_id = r.id
      WHERE r.user_id = ?
    `).all(auth.userId) as CompletionRow[];
  }
  return NextResponse.json(rows.map(rowToCompletion));
}

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();

  const { routineId, date } = await request.json();
  const routine = getDb().prepare("SELECT id FROM routines WHERE id = ? AND user_id = ?").get(routineId, auth.userId);
  if (!routine) return NextResponse.json({ error: "Routine not found" }, { status: 404 });

  const existing = getDb().prepare("SELECT * FROM completions WHERE routine_id = ? AND date = ?").get(routineId, date) as CompletionRow | undefined;
  if (existing) return NextResponse.json(rowToCompletion(existing));

  getDb().prepare("INSERT INTO completions (routine_id, date) VALUES (?, ?)").run(routineId, date);
  const row = getDb().prepare("SELECT * FROM completions WHERE routine_id = ? AND date = ?").get(routineId, date) as CompletionRow;
  return NextResponse.json(rowToCompletion(row), { status: 201 });
}
