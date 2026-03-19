import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "routine-tracker-secret-change-in-production";

export function signToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

export function getAuthUser(request: NextRequest): { userId: number } | null {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  return verifyToken(header.slice(7));
}

export function requireAuth(request: NextRequest): { userId: number } {
  const auth = getAuthUser(request);
  if (!auth) throw new Error("Unauthorized");
  return auth;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
