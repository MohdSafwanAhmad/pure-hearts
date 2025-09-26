/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache"; // <-- add this

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
};

export async function getProjectByIdWithTotals(
  id: string
): Promise<ProjectDetail | null> {
  noStore();
  const supabase = await createServerSupabaseClient();

  // 1) Project (select only existing columns)
  const { data: p, error: projErr } = await supabase
    .from("projects")
    .select(
      "id, title, description, goal_amount, organization_user_id, project_background_image"
    )
    .eq("id", id)
    .maybeSingle();

  if (projErr || !p) {
    console.error("project fetch error:", projErr?.message ?? "not found");
    return null;
  }

  // 2) Donations (aggregate in TS)
  // No status in your schema; we sum all rows for demo parity.
  const { data: donations, error: dErr } = await supabase
    .from("donations")
    .select("amount, donor_id")
    .eq("project_id", id);

  if (dErr) {
    console.error("donations fetch error:", dErr.message);
  }
  // DEBUG: see what we actually got back (server console)
  if (process.env.NODE_ENV !== "production") {
    console.log("[donations]", {
      projectId: id,
      rows: donations?.length ?? 0,
      sample: donations?.[0] ?? null,
    });
  }

  const collected = (donations ?? []).reduce(
    (sum, r: any) => sum + Number(r?.amount ?? 0),
    0
  );
  // Beneficiaries = unique donors for this project (feels more accurate than raw count)
  const beneficiary_count = new Set(
    (donations ?? []).map((r: any) => String(r?.donor_id))
  ).size;

  const goal = Number(p.goal_amount ?? 0);
  const remaining = Math.max(goal - collected, 0);
  const percent =
    goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;

  // 3) Organization (your table uses `organization_name`)
  const { data: orgRow, error: oErr } = await supabase
    .from("organizations")
    .select("user_id, organization_name")
    .eq("user_id", p.organization_user_id)
    .maybeSingle();

  if (oErr) {
    console.error("organization fetch error:", oErr.message);
  }

  const organization = orgRow
    ? {
        user_id: orgRow.user_id as string,
        name: (orgRow as any).organization_name ?? null,
      }
    : null;

  return {
    id: p.id,
    title: p.title ?? "",
    description: p.description ?? null,
    goal_amount: Number(p.goal_amount ?? 0),
    collected,
    remaining,
    percent,
    project_background_image: p.project_background_image ?? null,
    organization_user_id: p.organization_user_id,
    beneficiary_count,
    organization,
  };
}
