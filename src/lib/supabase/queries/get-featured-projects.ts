/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export type ProjectWithTotals = {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number | null;
  collected: number;
  remaining: number;
  percent: number;
  beneficiary_count: number; // computed: unique donors for this project
  organization_user_id: string;
  project_background_image: string | null;
  organization?: { user_id: string; name: string } | null;
};

export async function getFeaturedProjectsWithTotals(
  limit = 8
): Promise<ProjectWithTotals[]> {
  const supabase = await createServerSupabaseClient();

  // 1) Featured projects (only existing columns)
  const { data: projects, error: pErr } = await supabase
    .from("projects")
    .select(
      "id, title, description, goal_amount, organization_user_id, project_background_image, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (pErr) {
    console.error("projects fetch error:", pErr.message);
    return [];
  }
  if (!projects?.length) return [];

  // 2) Donations for these projects (sum + unique donors in TS)
  const projectIds = projects.map((p) => p.id);

  const { data: donationRows, error: dErr } = await supabase
    .from("donations")
    .select("project_id, donor_id, amount")
    .in("project_id", projectIds);

  if (dErr) {
    console.error("donations fetch error:", dErr.message);
  }

  const totalById = new Map<string, number>();
  const donorsById = new Map<string, Set<string>>();

  for (const r of donationRows ?? []) {
    const pid = String((r as any).project_id);
    const amt = Number((r as any).amount ?? 0);
    if (Number.isFinite(amt)) {
      totalById.set(pid, (totalById.get(pid) ?? 0) + amt);
    }
    const donor = String((r as any).donor_id ?? "");
    if (donor) {
      if (!donorsById.has(pid)) donorsById.set(pid, new Set());
      donorsById.get(pid)!.add(donor);
    }
  }

  // 3) Organizations (map org name from `organization_name`)
  const orgIds = Array.from(
    new Set(projects.map((p) => p.organization_user_id).filter(Boolean))
  );

  const orgMap = new Map<string, { user_id: string; name: string }>();
  if (orgIds.length) {
    const { data: orgRows, error: oErr } = await supabase
      .from("organizations")
      .select("user_id, organization_name")
      .in("user_id", orgIds);

    if (oErr) {
      console.error("organizations fetch error:", oErr.message);
    }

    for (const o of orgRows ?? []) {
      const user_id = String((o as any).user_id);
      const name = String((o as any).organization_name ?? "");
      orgMap.set(user_id, { user_id, name });
    }
  }

  // 4) Build view models
  return projects.map((p) => {
    const goal = Number(p.goal_amount ?? 0);
    const collected = totalById.get(p.id) ?? 0;
    const remaining = Math.max(goal - collected, 0);
    const percent =
      goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;
    const beneficiary_count = donorsById.get(p.id)?.size ?? 0;
    const organization = orgMap.get(p.organization_user_id) ?? null;

    return {
      id: p.id,
      title: p.title ?? "",
      description: p.description ?? null,
      goal_amount: p.goal_amount ?? null,
      collected,
      remaining,
      percent,
      beneficiary_count,
      organization_user_id: p.organization_user_id,
      project_background_image: p.project_background_image ?? null,
      organization,
    };
  });
}
