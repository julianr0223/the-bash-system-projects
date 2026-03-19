import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth";
import { findUserById } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return unauthorizedResponse();
  const user = findUserById(auth.userId);
  if (!user) return unauthorizedResponse();
  return NextResponse.json({ user: { id: user.id, email: user.email }, mustChangePassword: user.must_change_password === 1 });
}
