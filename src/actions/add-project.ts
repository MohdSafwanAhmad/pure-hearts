"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export type AddProjectPayload = {
  title: string;
  description: string;
  goal_amount: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  beneficiary_type_id: string;
  project_background_image?: string | null;
};
// src/lib/projects.ts
export type MinimalProject = {
  status?: string | null;
  is_completed?: boolean | null;
  end_date?: string | null; // ISO or YYYY-MM-DD
};

/**
 * Treat null/undefined as NOT completed.
 * Completed if:
 *  - status === "completed" (case-insensitive), OR
 *  - is_completed === true, OR
 *  - end_date is strictly before today (ignores time-of-day)
 */
export function isProjectCompleted(p: MinimalProject): boolean {
  const statusCompleted =
    typeof p.status === "string" &&
    p.status.toLowerCase().trim() === "completed";

  const flagCompleted = p.is_completed === true;

  const endDateCompleted =
    !!p.end_date &&
    !Number.isNaN(Date.parse(p.end_date)) &&
    new Date(p.end_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  return statusCompleted || flagCompleted || endDateCompleted;
}
export type AddProjectResult =
  | { ok: true; project_id: string; slug: string }
  | { ok: false; error: string };

export async function addProject(
  payload: AddProjectPayload
): Promise<AddProjectResult> {
  const supabase = await createServerSupabaseClient();

  // auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user)
    return { ok: false, error: "Not authenticated. Please sign in." };

  // org (need slug for revalidate)
  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("user_id, slug, is_verified")
    .eq("user_id", user.id)
    .maybeSingle();

  if (orgError || !organization)
    return {
      ok: false,
      error:
        "Organization profile not found. Only organizations can create projects.",
    };
  if (!organization.is_verified)
    return {
      ok: false,
      error: "Your organization must be verified before creating projects.",
    };

  // validate
  if (!payload.title?.trim())
    return { ok: false, error: "Project title is required" };
  if (!payload.description?.trim())
    return { ok: false, error: "Project description is required" };
  if (!payload.goal_amount || payload.goal_amount <= 0)
    return { ok: false, error: "Goal amount must be greater than 0" };
  if (!payload.beneficiary_type_id)
    return { ok: false, error: "Beneficiary type is required" };

  // slug
  const slug = await generateUniqueSlug(supabase, payload.title);

  // insert
  const { data: project, error: insertError } = await supabase
    .from("projects")
    .insert({
      title: payload.title.trim(),
      description: payload.description.trim(),
      goal_amount: payload.goal_amount,
      start_date: payload.start_date,
      end_date: payload.end_date,
      beneficiary_type_id: payload.beneficiary_type_id,
      organization_user_id: user.id,
      slug,
      project_background_image: payload.project_background_image ?? null,
    })
    .select("id, slug")
    .single();

  if (insertError) return { ok: false, error: insertError.message };

  // revalidate org page (so the new card appears)
  if (organization.slug) {
    revalidatePath(`/organizations/${organization.slug}`);
  }
  // also refresh any global listings if needed
  revalidatePath("/campaigns");

  return { ok: true, project_id: project.id, slug: project.slug };
}

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  title: string
): Promise<string> {
  const { data: slugData } = await supabase.rpc("slugify", { txt: title });
  const base = slugData || title.toLowerCase().replace(/\s+/g, "-");
  let slug = base;
  let i = 1;

  // ensure uniqueness
  while (true) {
    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${base}-${i++}`;
  }
  return slug;
}
