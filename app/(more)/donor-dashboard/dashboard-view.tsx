// app/(more)/donor-dashboard/dashboard-view.tsx
import { DataTable } from "@/src/components/donor-dashboard/data-table";
import ChartAreaInteractive from "@/src/components/donor-dashboard/chart-area-interactive";
import { getDonationSeriesForCurrentUser } from "@/src/lib/supabase/queries/get-donation-series";

//import { ChartAreaInteractive } from "@/src/components/donor-dashboard/chart-area-interactive";
import { SectionCards } from "@/src/components/donor-dashboard/section-cards";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { getDonationRowsForCurrentUser } from "@/src/lib/supabase/queries/get-donation-rows";
//mport { getDonationSeriesForCurrentUser } from "@/src/lib/supabase/queries/get-donation-series";

export default async function DashboardView() {
  const rows = await getDonationRowsForCurrentUser(); // table rows (you already use this)
  //const series = await getDonationSeriesForCurrentUser();   // new: chart series
  const series = await getDonationSeriesForCurrentUser(); // [{date, amount}]

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
                <ChartAreaInteractive series={series} />
              </div>
              <DataTable data={rows} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
