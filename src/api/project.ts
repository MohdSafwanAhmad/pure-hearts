/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAnonymousServerSupabaseClient } from "@/src/lib/supabase/server";
import { PUBLIC_IMAGE_BUCKET_NAME } from "@/src/lib/constants";
import { getOrganizationBySlug } from "@/src/api/organization";

export interface ProjectDetail {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number;
  collected: number;
  remaining: number;
  percent: number;
  project_background_image: string | null;
  organization_user_id: string;
  beneficiary?: {
    beneficiary_type_id: string;
    label: string;
  } | null;
  slug: string;
  organization: {
    user_id: string;
    slug: string;
    name: string | null;
    logo?: string | null;
    mission_statement?: string | null;
  };
}

/**
 * Fetch a project by org slug and project slug, including totals and full org info.
 * Returns null if not found or not verified.
 */
export async function getProjectBySlugs(
  orgSlug: string,
  projectSlug: string
): Promise<ProjectDetail | null> {
  // 1. Get organization (with logo, description, etc)
  const organization = await getOrganizationBySlug(orgSlug);
  if (!organization) return null;

  const supabase = await createAnonymousServerSupabaseClient();

  // 2. Get project by org user id and slug
  const { data: project, error: projErr } = await supabase
    .from("projects")
    .select("*")
    .eq("organization_user_id", organization.user_id)
    .eq("slug", projectSlug)
    .maybeSingle();

  if (projErr || !project) {
    if (projErr) console.error("project fetch error:", projErr.message);
    return null;
  }

  // 3. Get donations for totals and beneficiary count
  const { data: donations, error: dErr } = await supabase
    .from("donations")
    .select("amount, donor_id")
    .eq("project_id", project.id);

  if (dErr) console.error("donations fetch error:", dErr.message);

  const collected = (donations ?? []).reduce((sum, r: any) => sum + Number(r?.amount ?? 0), 0);

  const goal = Number(project.goal_amount ?? 0);
  const remaining = Math.max(goal - collected, 0);
  const percent = goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;

  // 4. Get public image URL for project background
  let project_background_image: string | null = null;
  if (project.project_background_image) {
    const { data } = supabase.storage
      .from(PUBLIC_IMAGE_BUCKET_NAME)
      .getPublicUrl(project.project_background_image);
    project_background_image = data.publicUrl ?? "/placeholder.jpg";
  } else {
    project_background_image = "/placeholder.jpg";
  }

  // 5. Return all details
  const beneficiary = project.beneficiary_type_id
    ? (await (async () => {
        const { data: bt } = await supabase
          .from("beneficiary_types")
          .select("id, label")
          .eq("id", project.beneficiary_type_id as string)
          .maybeSingle();
        return bt ? { beneficiary_type_id: bt.id as string, label: bt.label as string } : null;
      })())
    : null;

  return {
    id: project.id,
    title: project.title ?? "",
    description: project.description ?? null,
    goal_amount: goal,
    collected,
    remaining,
    percent,
    project_background_image,
    organization_user_id: project.organization_user_id,
    beneficiary,
    slug: project.slug,
    organization: {
      user_id: organization.user_id,
      slug: organization.slug,
      name: organization.organization_name,
      logo: organization.logo ?? null,
      mission_statement: organization.mission_statement ?? null,
    },
  };
}


export async function getBeneficiaryTypes(): Promise<
  { value: string; label: string }[]
> {
  const supabase = await createAnonymousServerSupabaseClient();
  const { data, error } = await supabase
    .from("beneficiary_types")
    .select("id, code, label")
    .order("code", { ascending: true });

  if (error) {
    console.error("Error fetching beneficiary types:", error);
    return [];
  }

  return (
    data?.map(({ id, code, label }) => ({
      value: id,
      label: label || code,
    })) ?? []
  );
}

/**
 * Fetch a small list of recent, verified projects for display sections.
 * Uses getProjectBySlugs to assemble full details per project.
 */
export async function getRecentProjects(limit = 8): Promise<ProjectDetail[]> {
  const supabase = await createAnonymousServerSupabaseClient();

  type Row = {
    slug: string;
    organization: { slug: string; is_verified: boolean | null } | null;
  };

  const { data } = await supabase
    .from("projects")
    .select(
      `
      slug,
      organization:organizations!inner(slug, is_verified)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  const candidates = (data as Row[] | null ?? []).filter(
    (r) => r.organization?.is_verified
  );

  const details = await Promise.all(
    candidates.map((r) =>
      getProjectBySlugs(r.organization!.slug, r.slug)
    )
  );

  return details.filter(Boolean) as ProjectDetail[];
}

/**
 * Fetch multiple projects (cards) with totals and org info.
 * - limit/offset for pagination
 * - Only returns projects for verified organizations
 * - Designed for campaigns listing and featured sections
 */
export async function getProjects(
  limit = 24,
  offset = 0
): Promise<ProjectDetail[]> {
  const supabase = await createAnonymousServerSupabaseClient();

  type ProjectRow = {
    id: string;
    title: string | null;
    description: string | null;
    goal_amount: number | null;
    project_background_image: string | null;
    organization_user_id: string;
    slug: string;
    beneficiary_type: { id: string; label: string } | null;
    organization: {
      user_id: string;
      slug: string;
      organization_name: string | null;
      is_verified: boolean | null;
    } | null;
  };

  const { data: rows, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      title,
      description,
      goal_amount,
      project_background_image,
      organization_user_id,
      slug,
      beneficiary_type:beneficiary_types(id, label),
      organization:organizations!inner(user_id, slug, organization_name, is_verified)
    `
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + Math.max(0, limit) - 1);

  if (error) {
    console.error("getProjects: error fetching projects", error.message);
    return [];
  }

  const projects = (rows as ProjectRow[] | null ?? []).filter(
    (r) => r.organization?.is_verified
  );

  const projectIds = projects.map((p) => p.id);
  if (projectIds.length === 0) return [];

  const { data: donations, error: dErr } = await supabase
    .from("donations")
    .select("amount, donor_id, project_id")
    .in("project_id", projectIds);

  if (dErr) {
    console.error("getProjects: error fetching donations", dErr.message);
  }

  type DonationRow = { amount: number | null; donor_id: string | null; project_id: string };
  const donationsByProject = new Map<string, DonationRow[]>();
  for (const row of (donations as DonationRow[] | null ?? [])) {
    const list = donationsByProject.get(row.project_id) ?? [];
    list.push(row);
    donationsByProject.set(row.project_id, list);
  }

  const results: ProjectDetail[] = projects.map((p) => {
    const donationList = donationsByProject.get(p.id) ?? [];
    const collected = donationList.reduce(
      (sum, r) => sum + Number(r.amount ?? 0),
      0
    );

    const uniqueDonors = new Set(
      donationList.map((r) => (r.donor_id ? String(r.donor_id) : ""))
    );
    uniqueDonors.delete("");

    const goal = Number(p.goal_amount ?? 0);
    const percent = goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;

    let project_background_image: string | null = "/placeholder.jpg";
    if (p.project_background_image) {
      const { data } = supabase.storage
        .from(PUBLIC_IMAGE_BUCKET_NAME)
        .getPublicUrl(p.project_background_image);
      project_background_image = data.publicUrl ?? "/placeholder.jpg";
    }

    return {
      id: p.id,
      title: p.title ?? "",
      description: p.description,
      goal_amount: goal,
      collected,
      remaining: Math.max(goal - collected, 0),
      percent,
      project_background_image,
      organization_user_id: p.organization_user_id,
      beneficiary: p.beneficiary_type
        ? {
            beneficiary_type_id: p.beneficiary_type.id,
            label: p.beneficiary_type.label,
          }
        : null,
      slug: p.slug,
      organization: {
        user_id: p.organization!.user_id,
        slug: p.organization!.slug,
        name: p.organization!.organization_name,
      },
    };
  });

  return results;
}