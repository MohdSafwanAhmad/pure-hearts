import { ChartAreaInteractive } from "@/src/components/donor-dashboard/chart-area-interactive";
import { DataTable } from "@/src/components/donor-dashboard/data-table";
import { SectionCards } from "@/src/components/donor-dashboard/section-cards";
import { SiteHeader } from "@/src/components/donor-dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";

// NEW: server fetch
import { getDonationRowsForCurrentUser } from "@/src/lib/supabase/queries/get-donation-rows";

export default async function DashboardView() {
  // <-- async
  const rows = await getDonationRowsForCurrentUser(); // <-- fetch on server

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={rows} /> {/* <-- from DB now */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
