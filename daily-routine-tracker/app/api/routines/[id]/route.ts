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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();

  const { id } = await params;
  const existing = getDb().prepare("SELECT * FROM routines WHERE id = ? AND user_id = ?").get(id, auth.userId) as RoutineRow | undefined;
  if (!existing) return NextResponse.json({ error: "Routine not found" }, { status: 404 });

  const body = await request.json();
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
    body.name ?? null,
    body.description ?? null,
    body.category ?? null,
    body.frequency !== undefined ? JSON.stringify(body.frequency) : null,
    body.startTime !== undefined ? (body.startTime || null) : existing.start_time,
    body.endTime !== undefined ? (body.endTime || null) : existing.end_time,
    body.goal !== undefined ? (body.goal || null) : existing.goal,
    body.isActive !== undefined ? (body.isActive ? 1 : 0) : null,
    id,
    auth.userId
  );

  const row = getDb().prepare("SELECT * FROM routines WHERE id = ?").get(id) as RoutineRow;
  return NextResponse.json(rowToRoutine(row));
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();

  const { id } = await params;
  const result = getDb().prepare("DELETE FROM routines WHERE id = ? AND user_id = ?").run(id, auth.userId);
  if (result.changes === 0) return NextResponse.json({ error: "Routine not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
