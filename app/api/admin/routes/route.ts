import { isAdminAuthenticated } from "@/lib/adminAuth";
import BusRoute from "@/model/BusModel";
import connectToDatabase from "@/utils/DataBaseConnection";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectToDatabase();
  const routes = await BusRoute.find().sort({ busNumber: 1, direction: 1 }).lean();

  return NextResponse.json({ success: true, data: routes });
}
