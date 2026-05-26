import { clearAdminSession } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
