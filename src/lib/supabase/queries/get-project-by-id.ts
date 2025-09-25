import { createServerSupabaseClient } from "@/src/lib/supabase/server"; // <- your helper

// The shape your detail page needs
export type ProjectDetail = {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number;
  collected: number;
  remaining: number;
  percent: number;
  project_background_image: string | null;
  organization_user_id: string;
  organization?: { user_id: string; name: string | null } | null;
  beneficiary_count: number;
  // Add more optional fields later if you add columns (e.g. beneficiary_count)
};

export async function getProjectByIdWithTotals(
  id: string
): Promise<ProjectDetail | null> {
  const supabase = createServerSupabaseClient();

  // 1) Read a single project – only columns that actually exist
  const { data: p, error: projErr } = await (await supabase)
    .from("projects")
    .select(
      "id, title, description, goal_amount, organization_user_id, project_background_image"
    )
    .eq("id", id)
    .maybeSingle();

  if (projErr || !p) {
    console.error("project error:", projErr?.message);
    return null;
  }

  // 2) Compute collected amount
  let collected = 0;

  // Prefer the RPC (typed cast to avoid “never” if Database types don’t include the RPC)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: totals, error } = await (supabase as any).rpc(
      "get_project_donation_totals",
      { ids: [id] }
    );
    if (!error && Array.isArray(totals) && totals.length > 0) {
      collected = Number(totals[0]?.total ?? 0);
    } else if (error) {
      console.warn("RPC totals error (fallback to table sum):", error.message);
    }
  } catch {
    /* ignore, will fallback */
  }

  // Fallback: sum donations directly if RPC unavailable
  if (!collected) {
    const { data: donations, error: dErr } = await (await supabase)
      .from("donations")
      .select("amount")
      .eq("project_id", id);

    if (!dErr) {
      collected =
        donations?.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (s: number, d: any) => s + Number(d.amount ?? 0),
          0
        ) ?? 0;
    } else {
      console.warn("donations sum error:", dErr.message);
    }
  }

  const goal = Number(p.goal_amount ?? 0);
  const remaining = Math.max(goal - collected, 0);
  const percent =
    goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;
  const { count: benCount, error: countErr } = await (
    await supabase
  )
    .from("donations")
    .select("id", { head: true, count: "exact" }) // no rows returned, only count
    .eq("project_id", p.id);

  if (countErr) {
    console.error("beneficiary count error:", countErr);
  }

  // 3) Optional organization info (name to show a “Visit org” button)
  const { data: org } = await (await supabase)
    .from("organizations")
    .select("user_id, organization_name")
    .eq("user_id", p.organization_user_id)
    .maybeSingle();

  return {
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    goal_amount: goal,
    collected,
    remaining,
    percent,
    project_background_image: p.project_background_image ?? null,
    organization_user_id: p.organization_user_id,
    beneficiary_count: benCount ?? 0, // <-- ADD THIS

    organization: org
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { user_id: org.user_id, name: (org as any).organization_name ?? null }
      : null,
  };
}
