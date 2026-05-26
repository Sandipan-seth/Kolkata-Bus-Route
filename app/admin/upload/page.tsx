import AdminUploadForm from "@/components/AdminUploadForm";
import AdminShell from "@/components/AdminShell";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export default async function AdminUploadPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return (
    <AdminShell>
      <section className="grid gap-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Upload bus route</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Add stops in the exact travel order. Search will normalize spaces and casing automatically.
          </p>
        </div>
        <AdminUploadForm />
      </section>
    </AdminShell>
  );
}
