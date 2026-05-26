import BusRoute from "@/model/BusModel";
import connectDB from "@/utils/DataBaseConnection";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  cleanBusNumber,
  cleanBusType,
  cleanDirection,
  parseStops,
} from "@/lib/busUtils";

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const formData = await req.formData();
    const busNumber = cleanBusNumber(formData.get("busNumber"));
    const direction = cleanDirection(formData.get("direction"));
    const isnonAc = formData.get("isnonAc") === "true";
    const stops = parseStops(formData.get("stops"));
    const busType = cleanBusType(formData.get("busType"));

    if (!busNumber || stops.length < 2 || !busType || !direction) {
      return NextResponse.json(
        { success: false, error: "Bus number, type, direction, and at least two stops are required" },
        { status: 400 },
      );
    }

    const existingRoute = await BusRoute.find({ busNumber, direction });
    if (existingRoute.length > 0) {
      return NextResponse.json(
        { success: false, error: "Bus route with the same number and direction already exists" },
        { status: 409 },
      );
    }
    

    const newBusRoute = await BusRoute.create({
        busNumber,
        isnonAc,
        stops,
        busType,
        direction,
    });

    return NextResponse.json(
      { success: true,
        message: "Bus route added successfully",
        data: newBusRoute },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding bus route:", error);

    return NextResponse.json(
      { success: false, error: "Failed to add bus route" },
      { status: 500 },
    );
  }
}
