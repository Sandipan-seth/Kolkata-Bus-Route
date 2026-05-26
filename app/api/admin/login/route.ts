import { createAdminSession, isValidAdminPassword } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const password = String(formData.get("password") ?? "");

  if (!isValidAdminPassword(password)) {
    return NextResponse.json(
      { success: false, error: "Wrong admin password" },
      { status: 401 },
    );
  }

  await createAdminSession();

  return NextResponse.json({ success: true });
}
