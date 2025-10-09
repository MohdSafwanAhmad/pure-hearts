"use server";

import { revalidatePath } from "next/cache";
import {
  createAnonymousServerSupabaseClient, // cookie session (publishable key)
  createServerSupabaseClient, // admin (service role)
} from "@/src/lib/supabase/server";

export type AddProjectPayload = {
  title: string;
  description: string;
  goal_amount: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  beneficiary_type_id: string;
  project_background_image?: string | null;
};

export type AddProjectResult =
  | { ok: true; project_id: string; slug: string }
  | { ok: false; error: string };

export async function addProject(
  payload: AddProjectPayload
): Promise<AddProjectResult> {
  // 1) Read current user from cookie-bound client
  const auth = await createAnonymousServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "Not authenticated. Please sign in." };
  }

  // 2) Use admin client for org lookup and insert (or keep using `auth` if your RLS handles it)
  const admin = await createServerSupabaseClient();

  // Ensure the user is an org and verified (also grab slug for revalidate)
  const { data: organization, error: orgError } = await admin
    .from("organizations")
    .select("user_id, slug, is_verified")
    .eq("user_id", user.id)
    .maybeSingle();

  if (orgError || !organization) {
    return {
      ok: false,
      error:
        "Organization profile not found. Only organizations can create projects.",
    };
  }
  if (!organization.is_verified) {
    return {
      ok: false,
      error: "Your organization must be verified before creating projects.",
    };
  }

  // Basic validation
  if (!payload.title?.trim())
    return { ok: false, error: "Project title is required" };
  if (!payload.description?.trim())
    return { ok: false, error: "Project description is required" };
  if (!payload.goal_amount || payload.goal_amount <= 0)
    return { ok: false, error: "Goal amount must be greater than 0" };
  if (!payload.beneficiary_type_id)
    return { ok: false, error: "Beneficiary type is required" };

  // Generate unique slug
  const slug = await generateUniqueSlug(admin, payload.title);

  // Insert project
  const { data: project, error: insertError } = await admin
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

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  // Revalidate org page and campaigns listing
  if (organization.slug) {
    revalidatePath(`/organizations/${organization.slug}`);
  }
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
