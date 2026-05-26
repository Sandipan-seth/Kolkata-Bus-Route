import { NextRequest, NextResponse } from "next/server";
import BusModel from "@/model/BusModel";
import connectToDatabase from "@/utils/DataBaseConnection";
import { bfs } from "@/lib/BFS";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const source = request.nextUrl.searchParams.get("source");
    const destination = request.nextUrl.searchParams.get("destination");

    if (!source || !destination) {
      return NextResponse.json(
        {
          success: false,
          error: "Source and destination are required",
        },
        { status: 400 }
      );
    }

    // DIRECT BUS SEARCH

    const busRoutes = await BusModel.find({
      stops: { $all: [source, destination] },
    });

    const filteredRoutes = busRoutes.filter((route) => {
      const indexSource = route.stops.indexOf(source);
      const indexDestination = route.stops.indexOf(destination);

      return (
        indexSource !== -1 &&
        indexDestination !== -1 &&
        indexSource < indexDestination
      );
    });

    const responseData = filteredRoutes.map((route) => ({
      busNumber: route.busNumber,
      busType: route.busType,
      isnonAc: route.isnonAc,
      direction: route.direction,

      boardAt: source,
      deboardAt: destination,

      stops: route.stops.slice(
        route.stops.indexOf(source),
        route.stops.indexOf(destination) + 1
      ),
    }));

    if (responseData.length > 0) {
      return NextResponse.json(
        {
          success: true,
          type: "direct",
          data: responseData,
        },
        { status: 200 }
      );
    }


    const bfsResult = await bfs(source, destination);

    if (!bfsResult) {
      return NextResponse.json(
        {
          success: false,
          error: "No route found",
        },
        { status: 404 }
      );
    }

    const instructions = [];

    let previousBus = "";
    let boardStop = "";

    for (let i = 1; i < bfsResult.length; i++) {
      const current = bfsResult[i];
      const previous = bfsResult[i - 1];

      // first bus boarding
      if (previousBus === "") {
        previousBus = current.busNumber!;
        boardStop = previous.stop;
      }

      if (current.busNumber !== previousBus) {
        instructions.push({
          busNumber: previousBus,
          boardAt: boardStop,
          deboardAt: previous.stop,
        });

        previousBus = current.busNumber!;
        boardStop = previous.stop;
      }


      if (i === bfsResult.length - 1) {
        instructions.push({
          busNumber: current.busNumber,
          boardAt: boardStop,
          deboardAt: current.stop,
        });
      }
    }

    const uniqueBuses = [
      ...new Set(
        bfsResult
          .map((item) => item.busNumber)
          .filter((bus) => bus !== null)
      ),
    ];

    const buses = await Promise.all(
      uniqueBuses.map(async (busNumber) => {
        const busInfo = await BusModel.findOne({ busNumber });

        return {
          busNumber: busInfo?.busNumber,
          busType: busInfo?.busType,
          isnonAc: busInfo?.isnonAc,
          direction: busInfo?.direction,
        };
      })
    );

    const formattedResult = {
      source,
      destination,

      totalStops: bfsResult.length - 1,
      totalBuses: uniqueBuses.length,
      totalBusChanges: uniqueBuses.length - 1,

      path: bfsResult.map((item) => item.stop),

      buses,

      instructions,
    };

    return NextResponse.json(
      {
        success: true,
        type: "indirect",
        data: formattedResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bus routes:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bus routes",
      },
      { status: 500 }
    );
  }
}