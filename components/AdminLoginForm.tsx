"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.error || "Login failed");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium text-zinc-700">
        Password
        <input
          name="password"
          type="password"
          required
          className="h-11 rounded-md border border-zinc-300 px-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </label>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Checking..." : "Enter admin panel"}
      </button>
    </form>
  );
}
