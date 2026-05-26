import Link from "next/link";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8">
        <nav className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <Link href="/" className="font-semibold text-zinc-950">
            Kolkata Bus Admin
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/upload" className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
              Upload
            </Link>
            <Link href="/admin/dashboard" className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
              Dashboard
            </Link>
            <AdminLogoutButton />
          </div>
        </nav>
        {children}
      </div>
    </main>
  );
}
