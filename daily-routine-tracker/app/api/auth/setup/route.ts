import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserCount, createUser } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (getUserCount() > 0) {
    return NextResponse.json({ error: "Setup already completed" }, { status: 403 });
  }
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = createUser(email, hash);
  const token = signToken(user.id);
  return NextResponse.json({ token, user: { id: user.id, email: user.email } });
}
