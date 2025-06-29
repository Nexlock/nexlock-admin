import { redirect } from "next/navigation";
import { getCurrentAdminAction } from "@/lib/actions/admin";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SystemOverview } from "@/components/dashboard/SystemOverview";

export default async function HomePage() {
  try {
    const admin = await getCurrentAdminAction();

    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your locker system and monitor operations
          </p>
        </div>

        <DashboardHeader admin={admin} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SystemOverview />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    );
  } catch {
    // If user is not authenticated, redirect to login
    redirect("/login");
  }
}
