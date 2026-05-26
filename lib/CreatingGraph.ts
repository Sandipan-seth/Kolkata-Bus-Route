import BusModel from "@/model/BusModel";
import connectToDatabase from "@/utils/DataBaseConnection";

type Edge = {
  stop: string;
  busNumber: string;
};

type Graph = {
  [key: string]: Edge[];
};

export async function createGraph() {
    await connectToDatabase();
  const buses = await BusModel.find();

  const graph: Graph = {};

  buses.forEach((bus) => {
    const stops = bus.stops;

    for (let i = 0; i < stops.length - 1; i++) {
      const current = stops[i];
      const next = stops[i + 1];

      if (!graph[current]) {
        graph[current] = [];
      }

      graph[current].push({
        stop: next,
        busNumber: bus.busNumber,
      });

      // optional reverse edge
      if (!graph[next]) {
        graph[next] = [];
      }

      graph[next].push({
        stop: current,
        busNumber: bus.busNumber,
      });
    }
  });

  return graph;
}