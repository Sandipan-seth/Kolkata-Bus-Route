import AdminLoginForm from "@/components/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-12">
      <div className="mx-auto grid w-full max-w-md gap-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Admin login</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Enter the admin password to manage bus route data.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
