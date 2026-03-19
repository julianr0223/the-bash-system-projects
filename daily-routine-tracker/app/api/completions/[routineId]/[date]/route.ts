import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ routineId: string; date: string }> }
) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();

  const { routineId, date } = await params;
  const routine = getDb().prepare("SELECT id FROM routines WHERE id = ? AND user_id = ?").get(routineId, auth.userId);
  if (!routine) return NextResponse.json({ error: "Routine not found" }, { status: 404 });

  getDb().prepare("DELETE FROM completions WHERE routine_id = ? AND date = ?").run(routineId, date);
  return NextResponse.json({ ok: true });
}
