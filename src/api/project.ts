// src/api/project.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { createServerSupabaseClient } from "@/src/lib/supabase/server-admin";
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
  beneficiary?: { beneficiary_type_id: string; label: string } | null;
  slug: string;
  organization: {
    user_id: string;
    slug: string;
    name: string | null;
    logo?: string | null;
    mission_statement?: string | null;
  };
}

export async function getProjectBySlugs(
  orgSlug: string,
  projectSlug: string
): Promise<ProjectDetail | null> {
  const organization = await getOrganizationBySlug(orgSlug);
  if (!organization) return null;

  const supabase = createServerSupabaseClient();

  const { data: project, error: projErr } = await supabase
    .from("projects")
    .select("*")
    .eq("organization_user_id", organization.user_id)
    .eq("slug", projectSlug)
    .maybeSingle();

  if (projErr || !project) return null;

  const { data: donations } = await supabase
    .from("donations")
    .select("amount, donor_id")
    .eq("project_id", project.id);

  const collected = (donations ?? []).reduce(
    (sum: number, r: any) => sum + Number(r?.amount ?? 0),
    0
  );

  const goal = Number(project.goal_amount ?? 0);
  const remaining = Math.max(goal - collected, 0);
  const percent =
    goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;

  let project_background_image: string | null = "/placeholder.jpg";
  if (project.project_background_image) {
    const { data } = supabase.storage
      .from(PUBLIC_IMAGE_BUCKET_NAME)
      .getPublicUrl(project.project_background_image);
    project_background_image = data.publicUrl ?? "/placeholder.jpg";
  }

  const beneficiary = project.beneficiary_type_id
    ? await (async () => {
        const { data: bt } = await supabase
          .from("beneficiary_types")
          .select("id, label")
          .eq("id", project.beneficiary_type_id as string)
          .maybeSingle();
        return bt
          ? { beneficiary_type_id: String(bt.id), label: String(bt.label) }
          : null;
      })()
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

export async function getProjects(
  limit = 24,
  offset = 0
): Promise<ProjectDetail[]> {
  const supabase = await createServerSupabaseClient(); // works for both async/sync exports

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

  const { data: rows, error: projectsError } = await supabase
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

  if (projectsError) {
    console.error(
      "getProjects: error fetching projects",
      projectsError.message
    );
    return [];
  }

  const projects = ((rows as ProjectRow[] | null) ?? []).filter(
    (r) => r.organization?.is_verified
  );

  const ids = projects.map((p) => p.id);
  if (ids.length === 0) return [];

  const { data: donations, error: donationsError } = await supabase
    .from("donations")
    .select("amount, donor_id, project_id")
    .in("project_id", ids);

  if (donationsError) {
    console.error(
      "getProjects: error fetching donations",
      donationsError.message
    );
  }

  type DonationRow = {
    amount: number | null;
    donor_id: string | null;
    project_id: string;
  };
  const donationsByProject = new Map<string, DonationRow[]>();
  for (const row of (donations as DonationRow[] | null) ?? []) {
    const list = donationsByProject.get(row.project_id) ?? [];
    list.push(row);
    donationsByProject.set(row.project_id, list);
  }

  return projects.map((p) => {
    const donationList = donationsByProject.get(p.id) ?? [];
    const collected = donationList.reduce(
      (sum, r) => sum + Number(r.amount ?? 0),
      0
    );

    const goal = Number(p.goal_amount ?? 0);
    const percent =
      goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;

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
}
