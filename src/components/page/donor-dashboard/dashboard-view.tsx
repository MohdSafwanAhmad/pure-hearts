// app/(more)/donor-dashboard/dashboard-view.tsx
import { DataTable } from "@/src/components/page/donor-dashboard/data-table";
import ChartAreaInteractive from "@/src/components/page/donor-dashboard/chart-area-interactive";
import { SectionCards } from "@/src/components/page/donor-dashboard/section-cards";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { getDonationRowsForCurrentUser } from "@/src/lib/supabase/queries/get-donation-rows";
import { getDonationSeriesForCurrentUser } from "@/src/lib/supabase/queries/get-donation-series";

export default async function DashboardView() {
  const rows = await getDonationRowsForCurrentUser();
  const series = await getDonationSeriesForCurrentUser();

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
              <div className="px-4 lg:px-6 max-w-7xl w-full mx-auto space-y-6">
                <ChartAreaInteractive series={series} />
                <DataTable data={rows} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
