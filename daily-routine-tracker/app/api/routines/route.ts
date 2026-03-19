import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth";

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

export async function GET(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();

  const rows = getDb()
    .prepare("SELECT * FROM routines WHERE user_id = ? ORDER BY created_at")
    .all(auth.userId) as RoutineRow[];
  return NextResponse.json(rows.map(rowToRoutine));
}

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();

  const { name, description, category, frequency, startTime, endTime, goal } = await request.json();
  const id = crypto.randomUUID();
  getDb().prepare(`
    INSERT INTO routines (id, user_id, name, description, category, frequency, start_time, end_time, goal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, auth.userId, name, description || "", category || "General", JSON.stringify(frequency || "daily"), startTime || null, endTime || null, goal || null);

  const row = getDb().prepare("SELECT * FROM routines WHERE id = ?").get(id) as RoutineRow;
  return NextResponse.json(rowToRoutine(row), { status: 201 });
}
