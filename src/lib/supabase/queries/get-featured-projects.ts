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
  beneficiary_count: number;
  slug: string;
  project_background_image: string | null;
  organization?: { user_id: string; name: string; slug: string } | null;
};

// Local row shapes to bypass stale generated types
type ProjectRowLite = {
  id: string;
  title: string | null;
  description: string | null;
  goal_amount: number | null;
  organization_user_id: string;
  project_background_image: string | null;
  slug: string;
  created_at: string | null;
};
type DonationRow = { project_id: string; donor_id: string; amount: number | string | null };
type OrgRow = { user_id: string; organization_name: string | null; slug: string };

export async function getFeaturedProjectsWithTotals(
  limit = 8
): Promise<ProjectWithTotals[]> {
  const supabase = await createServerSupabaseClient();

  // 1) Featured projects (+ slug)
  const { data: projects, error: pErr } = await supabase
    .from("projects")
    .select(
      "id, title, description, goal_amount, organization_user_id, project_background_image, slug, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<ProjectRowLite[]>(); // <-- key

  if (pErr) {
    console.error("projects fetch error:", pErr.message);
    return [];
  }
  if (!projects?.length) return [];

  // 2) Donations (sum + unique donors)
  const projectIds = projects.map((p) => p.id);
  const { data: donationRows, error: dErr } = await supabase
    .from("donations")
    .select("project_id, donor_id, amount")
    .in("project_id", projectIds)
    .returns<DonationRow[]>(); // <-- key

  if (dErr) {
    console.error("donations fetch error:", dErr.message);
  }

  const totalById = new Map<string, number>();
  const donorsById = new Map<string, Set<string>>();

  for (const r of donationRows ?? []) {
    const pid = String(r.project_id);
    const amt = Number(r.amount ?? 0);
    if (Number.isFinite(amt)) {
      totalById.set(pid, (totalById.get(pid) ?? 0) + amt);
    }
    const donor = String(r.donor_id ?? "");
    if (donor) {
      if (!donorsById.has(pid)) donorsById.set(pid, new Set());
      donorsById.get(pid)!.add(donor);
    }
  }

  // 3) Organizations (name + slug)
  const orgIds = Array.from(new Set(projects.map((p) => p.organization_user_id)));
  const orgMap = new Map<string, { user_id: string; name: string; slug: string }>();

  if (orgIds.length) {
    const { data: orgRows, error: oErr } = await supabase
      .from("organizations")
      .select("user_id, organization_name, slug")
      .in("user_id", orgIds)
      .returns<OrgRow[]>(); // <-- key

    if (oErr) {
      console.error("organizations fetch error:", oErr.message);
    }

    for (const o of orgRows ?? []) {
      orgMap.set(o.user_id, {
        user_id: o.user_id,
        name: String(o.organization_name ?? ""),
        slug: String(o.slug ?? ""),
      });
    }
  }

  // 4) View models
  return projects.map((p) => {
    const goal = Number(p.goal_amount ?? 0);
    const collected = totalById.get(p.id) ?? 0;
    const remaining = Math.max(goal - collected, 0);
    const percent = goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;
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
      slug: p.slug,
      project_background_image: p.project_background_image ?? null,
      organization,
    };
  });
}
