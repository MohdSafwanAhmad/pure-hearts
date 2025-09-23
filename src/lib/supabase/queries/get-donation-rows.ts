"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export type DonationRow = {
  id: string;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
};

export async function getDonationRowsForCurrentUser(): Promise<DonationRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("donations")
    .select(`
      id,
      amount,
      created_at,
      projects:project_id (
        title,
        organizations:organization_user_id (
          organization_name
        )
      )
    `)
    .eq("donor_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((d: any): DonationRow => ({
    id: d.id,
    header: d.projects?.title ?? "Donation",
    type: d.projects?.title ?? "—",
    status: d.projects?.organizations?.organization_name ?? "—",
    target: String(d.amount ?? ""),
// in get-donation-rows.ts
// get-donation-rows.ts
limit: new Date(d.created_at).toISOString().slice(0, 10),
    reviewer: "",
  }));
}
