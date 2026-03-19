import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth";
import { getDb, updateUserPassword } from "@/lib/db";

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();

  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Ambas contraseñas son requeridas" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "La nueva contraseña debe tener al menos 6 caracteres" }, { status: 400 });
  }

  const user = getDb().prepare("SELECT * FROM users WHERE id = ?").get(auth.userId) as
    | { id: number; password_hash: string }
    | undefined;
  if (!user) return unauthorizedResponse();

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  updateUserPassword(user.id, hash);

  return NextResponse.json({ success: true });
}
