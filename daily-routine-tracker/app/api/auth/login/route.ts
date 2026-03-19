import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const user = findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = signToken(user.id);
  return NextResponse.json({ token, user: { id: user.id, email: user.email }, mustChangePassword: user.must_change_password === 1 });
}
