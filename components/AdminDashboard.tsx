"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export type AdminRoute = {
  _id: string;
  busNumber: string;
  busType: "G" | "P";
  isnonAc?: boolean;
  direction: "up" | "down";
  stops: string[];
};

function stopText(stops: string[]) {
  return stops.map((stop) => stop.replaceAll("_", " ")).join("\n");
}

export default function AdminDashboard({ routes }: { routes: AdminRoute[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveRoute(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/admin/routes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        busNumber: formData.get("busNumber"),
        busType: formData.get("busType"),
        direction: formData.get("direction"),
        isnonAc: formData.get("isnonAc") === "true",
        stops: String(formData.get("stops") || ""),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Could not save route");
      return;
    }

    setEditingId(null);
    setMessage("Route updated.");
    router.refresh();
  }

  async function deleteRoute(id: string) {
    setMessage("");
    setError("");

    const response = await fetch(`/api/admin/routes/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Could not delete route");
      return;
    }

    setMessage("Route deleted.");
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      {message ? <p className="rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="grid gap-3">
        {routes.map((route) => {
          const isEditing = editingId === route._id;

          return (
            <article key={route._id} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              {isEditing ? (
                <form onSubmit={(event) => saveRoute(event, route._id)} className="grid gap-4">
                  <div className="grid gap-3 md:grid-cols-4">
                    <input
                      name="busNumber"
                      defaultValue={route.busNumber}
                      required
                      className="h-10 rounded-md border border-zinc-300 px-3"
                    />
                    <select name="direction" defaultValue={route.direction} className="h-10 rounded-md border border-zinc-300 px-3">
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                    </select>
                    <select name="busType" defaultValue={route.busType} className="h-10 rounded-md border border-zinc-300 px-3">
                      <option value="P">Private</option>
                      <option value="G">Government</option>
                    </select>
                    <select name="isnonAc" defaultValue={String(Boolean(route.isnonAc))} className="h-10 rounded-md border border-zinc-300 px-3">
                      <option value="true">Non AC</option>
                      <option value="false">AC</option>
                    </select>
                  </div>
                  <textarea
                    name="stops"
                    defaultValue={stopText(route.stops)}
                    rows={6}
                    required
                    className="rounded-md border border-zinc-300 px-3 py-2"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button type="submit" className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-lg text-zinc-950">{route.busNumber.toUpperCase()}</strong>
                      <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">{route.direction}</span>
                      <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">{route.busType === "G" ? "Government" : "Private"}</span>
                      <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">{route.isnonAc ? "Non AC" : "AC"}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(route._id)} className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700">Edit</button>
                      <button onClick={() => deleteRoute(route._id)} className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Delete</button>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-zinc-600">{route.stops.map((stop) => stop.replaceAll("_", " ")).join(" -> ")}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
