// src/components/donor-dashboard/section-cards.tsx
import { IconTrendingUp } from "@tabler/icons-react";
import type { Database } from "@/src/types/database-types";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

// Narrow row type for our select
type DonationSlim = Pick<
  Database["public"]["Tables"]["donations"]["Row"],
  "amount" | "project_id" | "created_at"
>;

// Formatters
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n || 0
  );
const fmtNumber = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n || 0);

// Windows for "active" logic
const DAILY_MS = 24 * 60 * 60 * 1000;
const MONTHLY_MS = 31 * DAILY_MS;

async function fetchDonationsForUser(): Promise<DonationSlim[]> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return [];

  const { data, error } = await supabase
    .from("donations")
    .select("amount, project_id, created_at")
    .eq("donor_id", user.id);

  if (error) {
    console.error("SectionCards donations fetch error:", error.message);
    return [];
  }
  return (data ?? []) as DonationSlim[];
}

/**
 * Server Component: fetches metrics for the current donor and renders the cards
 */
async function SectionCards() {
  const rows = await fetchDonationsForUser();

  // Total amount (Supabase may return numeric as string)
  const totalDonations = rows.reduce((sum, r) => {
    const v =
      typeof r.amount === "string"
        ? parseFloat(r.amount)
        : typeof r.amount === "number"
        ? r.amount
        : 0;
    return sum + (Number.isFinite(v) ? v : 0);
  }, 0);

  // Distinct projects the donor has ever contributed to
  const totalCampaigns = new Set(
    rows.map((r) => r.project_id).filter(Boolean) as string[]
  ).size;

  // Active projects: donations in the last 31 days (monthly) and last 24h (daily)
  const now = Date.now();
  const monthlyCutoff = now - MONTHLY_MS;
  const dailyCutoff = now - DAILY_MS;

  const activeMonthlySet = new Set<string>();
  const activeDailySet = new Set<string>();

  for (const r of rows) {
    if (!r.project_id || !r.created_at) continue;
    const ts = Date.parse(r.created_at);
    if (!Number.isFinite(ts)) continue;

    if (ts >= monthlyCutoff) activeMonthlySet.add(r.project_id);
    if (ts >= dailyCutoff) activeDailySet.add(r.project_id);
  }

  const activeMonthly = activeMonthlySet.size;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Donations */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Donations</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtCurrency(totalDonations)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Total Campaigns (distinct projects ever donated to) */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Campaigns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtNumber(totalCampaigns)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Active Donations (projects in last 31 days). Badge shows 24h. */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Donations</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtNumber(activeMonthly)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default SectionCards;
// If some places import it as a named export:
export { SectionCards };
