"use client";

import { FormEvent, useState } from "react";

type DirectRoute = {
  busNumber: string;
  busType: "G" | "P";
  isnonAc?: boolean;
  direction: "up" | "down";
  boardAt: string;
  deboardAt: string;
  stops: string[];
};

type IndirectRoute = {
  totalStops: number;
  totalBuses: number;
  totalBusChanges: number;
  path: string[];
  buses: Array<{
    busNumber?: string;
    busType?: "G" | "P";
    isnonAc?: boolean;
    direction?: "up" | "down";
  }>;
  instructions: Array<{
    busNumber: string;
    boardAt: string;
    deboardAt: string;
  }>;
};

type SearchResult =
  | { success: true; type: "direct"; data: DirectRoute[] }
  | { success: true; type: "indirect"; data: IndirectRoute }
  | { success: false; error: string };

function displayStop(stop: string) {
  return stop
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function RouteFinder() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams({
      source: String(formData.get("source") || ""),
      destination: String(formData.get("destination") || ""),
    });

    const response = await fetch(`/api/find?${params.toString()}`);
    const data = await response.json();
    setResult(data);
    setIsLoading(false);
  }

  return (
    <section className="grid gap-6">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="grid gap-2 text-sm font-medium text-zinc-700">
          Source
          <input
            name="source"
            required
            placeholder="Where are you starting?"
            className="h-12 rounded-md border border-zinc-300 px-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-zinc-700">
          Destination
          <input
            name="destination"
            required
            placeholder="Where do you want to go?"
            className="h-12 rounded-md border border-zinc-300 px-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="h-12 rounded-md bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Searching..." : "Find route"}
        </button>
      </form>

      {result && !result.success ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {result.error}
        </div>
      ) : null}

      {result?.success && result.type === "direct" ? (
        <div className="grid gap-3">
          <h2 className="text-xl font-semibold text-zinc-950">Direct buses</h2>
          {result.data.map((route) => (
            <article key={`${route.busNumber}-${route.direction}`} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-lg text-zinc-950">{route.busNumber.toUpperCase()}</strong>
                <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">{route.busType === "G" ? "Government" : "Private"}</span>
                <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">{route.isnonAc ? "Non AC" : "AC"}</span>
                <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">{route.direction}</span>
              </div>
              <p className="mt-3 text-zinc-700">
                Board at <strong>{displayStop(route.boardAt)}</strong> and deboard at <strong>{displayStop(route.deboardAt)}</strong>.
              </p>
              <p className="mt-2 text-sm text-zinc-500">{route.stops.map(displayStop).join(" -> ")}</p>
            </article>
          ))}
        </div>
      ) : null}

      {result?.success && result.type === "indirect" ? (
        <div className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">Route with bus changes</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-700"><strong>{result.data.totalStops}</strong> stops</div>
            <div className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-700"><strong>{result.data.totalBuses}</strong> buses</div>
            <div className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-700"><strong>{result.data.totalBusChanges}</strong> changes</div>
          </div>
          <div className="grid gap-3">
            {result.data.instructions.map((step, index) => (
              <div key={`${step.busNumber}-${index}`} className="rounded-md border border-zinc-200 p-3">
                <p className="font-semibold text-zinc-950">Take bus {step.busNumber.toUpperCase()}</p>
                <p className="text-sm text-zinc-600">Board at {displayStop(step.boardAt)} and deboard at {displayStop(step.deboardAt)}.</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-zinc-500">{result.data.path.map(displayStop).join(" -> ")}</p>
        </div>
      ) : null}
    </section>
  );
}
