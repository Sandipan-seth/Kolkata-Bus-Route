import BusRoute from "@/model/BusModel";
import connectDB from "@/utils/DataBaseConnection";
import { NextRequest, NextResponse } from "next/server";

export const metadata = {
  title: "Add Bus Route",
  description: "Add a new bus route to the system",
};

const normalizeStopName = (stop: string) => {
    let normalizedStop = stop.trim().toLowerCase();
    normalizedStop = normalizedStop.replace(/\s+/g, "_");
    return normalizedStop;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const busNumber = formData.get("busNumber")?.toString().toLowerCase() as string;
    const direction = formData.get("direction")?.toString().toLowerCase() as "up" | "down";
    const isnonAc = formData.get("isnonAc") as string === "true"|| "false";
    const stops = JSON.parse(formData.get("stops") as string);
    const busType = formData.get("busType")?.toString().toLowerCase() as "govt" | "private";

    if (!busNumber || !stops || !busType || !direction) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
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
        isnonAc: true === isnonAc,
        stops: [...stops.map((stop: string) => normalizeStopName(stop))],
        busType:"govt" === busType ? "G" : "P",
        direction,
    });

    newBusRoute.save();


    return NextResponse.json(
      { success: true,
        message: "Bus route added successfully" },
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
