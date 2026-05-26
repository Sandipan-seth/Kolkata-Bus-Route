import AdminShell from "@/components/AdminShell";
import AdminDashboard, { AdminRoute } from "@/components/AdminDashboard";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import BusRoute from "@/model/BusModel";
import connectToDatabase from "@/utils/DataBaseConnection";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  await connectToDatabase();
  const routes = await BusRoute.find()
    .sort({ busNumber: 1, direction: 1 })
    .lean<AdminRoute[]>();

  const plainRoutes = routes.map((route) => ({
    _id: String(route._id),
    busNumber: route.busNumber,
    busType: route.busType,
    isnonAc: route.isnonAc,
    direction: route.direction,
    stops: route.stops,
  }));

  return (
    <AdminShell>
      <section className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950">Route dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              View, edit, and delete saved bus routes.
            </p>
          </div>
          <p className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm">
            {plainRoutes.length} routes
          </p>
        </div>
        <AdminDashboard routes={plainRoutes} />
      </section>
    </AdminShell>
  );
}
