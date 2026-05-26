"use client";

import { FormEvent, useState } from "react";

export default function AdminUploadForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const response = await fetch("/api/addRoutes", {
      method: "POST",
      body: new FormData(form),
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.error || "Could not add route");
      return;
    }

    form.reset();
    setMessage("Route added. It is now available in route search and dashboard.");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-zinc-700">
          Bus number
          <input
            name="busNumber"
            required
            placeholder="e.g. 215A"
            className="h-11 rounded-md border border-zinc-300 px-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-zinc-700">
          Direction
          <select
            name="direction"
            defaultValue="up"
            className="h-11 rounded-md border border-zinc-300 px-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="up">Up</option>
            <option value="down">Down</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-zinc-700">
          Bus type
          <select
            name="busType"
            defaultValue="private"
            className="h-11 rounded-md border border-zinc-300 px-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="private">Private</option>
            <option value="govt">Government</option>
          </select>
        </label>
        <label className="flex items-center gap-3 self-end rounded-md border border-zinc-200 px-3 py-3 text-sm font-medium text-zinc-700">
          <input name="isnonAc" type="checkbox" value="true" defaultChecked />
          Non AC bus
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-zinc-700">
        Stops
        <textarea
          name="stops"
          required
          rows={9}
          placeholder={"Write stops in travel order, one per line\nEsplanade\nPark Street\nGariahat"}
          className="rounded-md border border-zinc-300 px-3 py-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </label>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {message ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-fit rounded-md bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Adding..." : "Add route"}
      </button>
    </form>
  );
}
