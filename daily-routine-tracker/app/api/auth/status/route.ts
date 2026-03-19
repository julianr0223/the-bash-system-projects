import { NextResponse } from "next/server";
import { getUserCount } from "@/lib/db";

export async function GET() {
  return NextResponse.json({ needsSetup: getUserCount() === 0 });
}
