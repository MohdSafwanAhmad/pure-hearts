import LogoutButton from "@/src/components/global/logout-button";
import { getDonorProfile } from "@/src/lib/supabase/server";
import { AppSidebar } from "@/src/components/donor-dashboard/app-sidebar";
import { ChartAreaInteractive } from "@/src/components/donor-dashboard/chart-area-interactive";
import { DataTable } from "@/src/components/donor-dashboard/data-table";
import { SectionCards } from "@/src/components/donor-dashboard/section-cards";
import { SiteHeader } from "@/src/components/donor-dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import DashboardView from "@/app/(more)/donor-dashboard/dashboard-view";

export default async function DashboardPage() {
  const profile = await getDonorProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-red-600">
          Error loading user data
        </h1>
      </div>
    );
  }
  /*return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard Page</h1>
        <p className="mt-4">Welcome, {profile?.email || "User"}</p>
         <DashboardView /> 


        <div className="mt-6">
              
          <LogoutButton />
        </div>
      </div>
    </div>
  );*/
  return (
    <div className="min-h-screen w-full">
      <header className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold">Dashboard Page</h1>
        <p className="mt-2">Welcome, {profile.email}</p>
      </header>

      <main className="w-full max-w-7xl mx-auto p-4 md:p-6">
        <DashboardView />
        <div className="mt-6">
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
