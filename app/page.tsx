import RouteFinder from "@/components/RouteFinder";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-8 md:py-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Kolkata bus route guide
            </p>
            <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              Find where to board, change, and deboard.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
              Enter your starting stop and destination. The site checks direct buses first, then suggests a route with bus changes when needed.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-400"
          >
            Admin
          </Link>
        </header>
        <RouteFinder />
      </div>
    </main>
  );
}
