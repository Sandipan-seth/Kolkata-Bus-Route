import { createGraph } from "./CreatingGraph";

type PathNode = {
  stop: string;
  busNumber: string | null;
};

export async function bfs(source: string, destination: string) {
  const graph = await createGraph();

  const queue: PathNode[][] = [
    [
      {
        stop: source,
        busNumber: null,
      },
    ],
  ];

  const visited = new Set<string>();

  while (queue.length > 0) {
    const path = queue.shift();

    if (!path) continue;

    const currentNode = path[path.length - 1];

    if (currentNode.stop === destination) {
      return path;
    }

    if (!visited.has(currentNode.stop)) {
      visited.add(currentNode.stop);

      const neighbors = graph[currentNode.stop] || [];

      for (const neighbor of neighbors) {
        queue.push([
          ...path,
          {
            stop: neighbor.stop,
            busNumber: neighbor.busNumber,
          },
        ]);
      }
    }
  }

  return null;
}