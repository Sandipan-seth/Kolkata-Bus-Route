import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  cleanBusNumber,
  cleanBusType,
  cleanDirection,
  parseStops,
} from "@/lib/busUtils";
import BusRoute from "@/model/BusModel";
import connectToDatabase from "@/utils/DataBaseConnection";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const body = await req.json();
  const busNumber = cleanBusNumber(body.busNumber);
  const busType = cleanBusType(body.busType);
  const direction = cleanDirection(body.direction);
  const stops = parseStops(body.stops);

  if (!busNumber || !busType || !direction || stops.length < 2) {
    return NextResponse.json(
      { success: false, error: "Bus number, type, direction, and at least two stops are required" },
      { status: 400 },
    );
  }

  await connectToDatabase();

  const duplicate = await BusRoute.findOne({
    _id: { $ne: id },
    busNumber,
    direction,
  });

  if (duplicate) {
    return NextResponse.json(
      { success: false, error: "Another route already uses that bus number and direction" },
      { status: 409 },
    );
  }

  const updatedRoute = await BusRoute.findByIdAndUpdate(
    id,
    {
      busNumber,
      busType,
      direction,
      isnonAc: Boolean(body.isnonAc),
      stops,
    },
    { new: true, runValidators: true },
  );

  if (!updatedRoute) {
    return NextResponse.json(
      { success: false, error: "Bus route not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: updatedRoute }, { status: 200 });
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  await connectToDatabase();

  const deletedRoute = await BusRoute.findByIdAndDelete(id);

  if (!deletedRoute) {
    return NextResponse.json(
      { success: false, error: "Bus route not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
