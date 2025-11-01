import {
  createServerSupabaseClient,
  getDonorProfile,
} from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database-types";

export async function fetchDonationsForUser() {
  const donor = await getDonorProfile();
  if (!donor) return [];

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("donations")
    .select("amount, project_id, created_at")
    .eq("donor_id", donor.user_id);

  if (error) {
    console.error("SectionCards donations fetch error:", error.message);
    return [];
  }
  return data;
}

export type DonationRow = {
  id: string;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
  organizationSlug: string | null;
};

export async function getDonationRowsForCurrentUser(): Promise<DonationRow[]> {
  const supabase = await createServerSupabaseClient();
  const donor = await getDonorProfile();

  if (!donor) return [];

  const { data, error } = await supabase
    .from("donations")
    .select(
      `
      id,
      amount,
      created_at,
      projects:project_id (
        title,
        organizations:organization_user_id (
          organization_name,
          slug
        )
      )
    `
    )
    .eq("donor_id", donor.user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (d: any): DonationRow => ({
      id: d.id,
      header: d.projects?.title ?? "Donation",
      type: d.projects?.title ?? "—",
      status: d.projects?.organizations?.organization_name ?? "—",
      target: String(d.amount ?? ""),
      limit: new Date(d.created_at).toISOString().slice(0, 10),
      reviewer: "",
      organizationSlug: d.projects?.organizations?.slug ?? null,
    })
  );
}

export type DonationPoint = { date: string; amount: number };

// narrow row type from your DB types
type DonationSlim = Pick<
  Database["public"]["Tables"]["donations"]["Row"],
  "amount" | "created_at"
>;

/** turn a timestamp into YYYY-MM-DD or null if invalid */
function toIsoDay(v: string | null | undefined): string | null {
  if (!v) return null;
  const t = Date.parse(v);
  if (!Number.isFinite(t)) return null;
  return new Date(t).toISOString().slice(0, 10);
}

export async function getDonationSeriesForCurrentUser(): Promise<
  DonationPoint[]
> {
  const supabase = await createServerSupabaseClient();
  const donor = await getDonorProfile();
  if (!donor) return [];

  const { data, error } = await supabase
    .from("donations")
    .select("amount, created_at")
    .eq("donor_id", donor.user_id)
    .order("created_at", { ascending: true });

  if (error) throw error;

  // --- aggregate by day (UTC) ---
  const byDay = new Map<string, number>();

  for (const row of (data ?? []) as DonationSlim[]) {
    const key = toIsoDay(row.created_at);
    if (!key) continue; // skip bad/empty timestamps

    const num =
      typeof row.amount === "string"
        ? parseFloat(row.amount)
        : Number(row.amount ?? 0);

    const safe = Number.isFinite(num) ? num : 0;
    byDay.set(key, (byDay.get(key) ?? 0) + safe);
  }

  // --- build a continuous 90-day series (fill gaps with 0) ---
  const end = new Date(); // today
  const start = new Date();
  start.setDate(end.getDate() - 89); // 90 points inclusive

  const out: DonationPoint[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, amount: byDay.get(key) ?? 0 });
  }

  return out;
}
