/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/project.ts

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Tables } from "@/src/types/database-types";
import { PUBLIC_IMAGE_BUCKET_NAME } from "@/src/lib/constants";

/** ---------- Existing lightweight helpers (kept) ---------- */

export type Project = Tables<"projects">;


/** ---------- Merged view-model types from queries ---------- */

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
  // public URL (resolved from storage key)
  project_background_image: string | null;
  organization?: { user_id: string; name: string; slug: string } | null;
};

export type ProjectDetail = {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number;
  collected: number;
  remaining: number;
  percent: number;
  // public URL (resolved)
  project_background_image: string | null;
  organization_user_id: string;
  organization?: { user_id: string; slug: string; name: string | null } | null;
  beneficiary_count: number;
};

// Narrow row shapes to avoid coupling to generated types here
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



function toPublicImageUrl(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  key?: string | null
) {
  if (!key) return "/placeholder.jpg";
  const { data } = supabase.storage.from(PUBLIC_IMAGE_BUCKET_NAME).getPublicUrl(key);
  return data.publicUrl ?? "/placeholder.jpg";
}

/** ---------- featured projects + totals ---------- */
export async function getFeaturedProjectsWithTotals(
  limit = 8
): Promise<ProjectWithTotals[]> {
  const supabase = await createServerSupabaseClient();

  // 1) Featured projects (currently: latest N)
  const { data: projects, error: pErr } = await supabase
    .from("projects")
    .select(
      "id, title, description, goal_amount, organization_user_id, project_background_image, slug, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<ProjectRowLite[]>();

  if (pErr) {
    console.error("projects fetch error:", pErr.message);
    return [];
  }
  if (!projects?.length) return [];

  // 2) Donations: sum + unique donors
  const projectIds = projects.map((p) => p.id);
  const { data: donationRows, error: dErr } = await supabase
    .from("donations")
    .select("project_id, donor_id, amount")
    .in("project_id", projectIds)
    .returns<DonationRow[]>();

  if (dErr) {
    console.error("donations fetch error:", dErr.message);
  }

  const totalById = new Map<string, number>();
  const donorsById = new Map<string, Set<string>>();

  for (const r of donationRows ?? []) {
    const pid = String(r.project_id);
    const amt = Number(r.amount ?? 0);
    if (Number.isFinite(amt)) totalById.set(pid, (totalById.get(pid) ?? 0) + amt);

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
      .returns<OrgRow[]>();

    if (oErr) console.error("organizations fetch error:", oErr.message);

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
    const imgUrl = toPublicImageUrl(supabase, p.project_background_image);
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
      slug: String(p.slug ?? ""),
      project_background_image: imgUrl,
      organization,
    };
  });
}

/** ---------- project detail by id + totals ---------- */
export async function getProjectByIdWithTotals(id: string): Promise<ProjectDetail | null> {
  const supabase = await createServerSupabaseClient();

  // 1) Project
  const { data: p, error: projErr } = await supabase
    .from("projects")
    .select("id, title, description, goal_amount, organization_user_id, project_background_image")
    .eq("id", id)
    .maybeSingle();

  if (projErr || !p) {
    if (projErr) console.error("project fetch error:", projErr.message);
    return null;
  }

  // 2) Donations
  const { data: donations, error: dErr } = await supabase
    .from("donations")
    .select("amount, donor_id")
    .eq("project_id", id);

  if (dErr) console.error("donations fetch error:", dErr.message);

  const collected = (donations ?? []).reduce((sum, r: any) => sum + Number(r?.amount ?? 0), 0);
  const beneficiary_count = new Set((donations ?? []).map((r: any) => String(r?.donor_id))).size;

  const goal = Number(p.goal_amount ?? 0);
  const remaining = Math.max(goal - collected, 0);
  const percent = goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;

  // 3) Org (name + slug)
  const { data: orgRow, error: oErr } = await supabase
    .from("organizations")
    .select("user_id, organization_name, slug")
    .eq("user_id", p.organization_user_id)
    .maybeSingle();

  if (oErr) console.error("organization fetch error:", oErr.message);

  const organization = orgRow
    ? {
        user_id: orgRow.user_id as string,
        slug: String((orgRow as any).slug ?? ""),
        name: ((orgRow as any).organization_name as string) ?? null,
      }
    : null;

  const imgUrl = toPublicImageUrl(supabase, p.project_background_image);

  return {
    id: p.id,
    title: p.title ?? "",
    description: p.description ?? null,
    goal_amount: Number(p.goal_amount ?? 0),
    collected,
    remaining,
    percent,
    project_background_image: imgUrl,
    organization_user_id: p.organization_user_id,
    beneficiary_count,
    organization,
  };
}


// src/api/project.ts (append)
export async function getProjectsWithTotals(
  limit = 24,
  offset = 0
): Promise<ProjectWithTotals[]> {
  const supabase = await createServerSupabaseClient();

  // 1) Page of projects
  const { data: projects, error: pErr } = await supabase
    .from("projects")
    .select(
      "id, title, description, goal_amount, organization_user_id, project_background_image, slug, created_at"
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
    .returns<ProjectRowLite[]>();

  if (pErr || !projects?.length) return [];

  // 2) Donations -> totals + unique donors
  const ids = projects.map((p) => p.id);
  const { data: donationRows } = await supabase
    .from("donations")
    .select("project_id, donor_id, amount")
    .in("project_id", ids)
    .returns<DonationRow[]>();

  const totalById = new Map<string, number>();
  const donorsById = new Map<string, Set<string>>();
  for (const r of donationRows ?? []) {
    const pid = String(r.project_id);
    const amt = Number(r.amount ?? 0);
    if (Number.isFinite(amt)) totalById.set(pid, (totalById.get(pid) ?? 0) + amt);
    if (r.donor_id) {
      if (!donorsById.has(pid)) donorsById.set(pid, new Set());
      donorsById.get(pid)!.add(String(r.donor_id));
    }
  }

  // 3) Orgs (name+slug)
  const orgIds = Array.from(new Set(projects.map((p) => p.organization_user_id)));
  const orgMap = new Map<string, { user_id: string; name: string; slug: string }>();
  if (orgIds.length) {
    const { data: orgRows } = await supabase
      .from("organizations")
      .select("user_id, organization_name, slug")
      .in("user_id", orgIds)
      .returns<OrgRow[]>();
    for (const o of orgRows ?? []) {
      orgMap.set(o.user_id, {
        user_id: o.user_id,
        name: String(o.organization_name ?? ""),
        slug: String(o.slug ?? ""),
      });
    }
  }

  // 4) Map to card-friendly view model (with public image URL)
  return projects.map((p) => {
    const cover = toPublicImageUrl(supabase, p.project_background_image);
    const goal = Number(p.goal_amount ?? 0);
    const collected = totalById.get(p.id) ?? 0;
    const remaining = Math.max(goal - collected, 0);
    const percent = goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;

    return {
      id: p.id,
      title: p.title ?? "",
      description: p.description ?? null,
      goal_amount: p.goal_amount ?? null,
      collected,
      remaining,
      percent,
      beneficiary_count: donorsById.get(p.id)?.size ?? 0,
      slug: String(p.slug ?? ""),
      project_background_image: cover,
      organization: orgMap.get(p.organization_user_id) ?? null,
    };
  });
}
