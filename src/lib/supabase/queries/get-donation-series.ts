"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database-types";

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
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return [];

  const { data, error } = await supabase
    .from("donations")
    .select("amount, created_at")
    .eq("donor_id", user.id)
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
