/**
 * @file campaigns.ts
 * @description Contains reusable server-side search logic for campaigns.
 * This moves all logic out of the API route so it can be reused anywhere.
 *
 * @version 1.0.0
 * @since 2025-11-18
 */

import { createAnonymousServerSupabaseClient } from "@/src/lib/supabase/server";

interface SearchParams {
  q: string;
  sort: string;
  category?: string | null;
}

/**
 * @function searchCampaigns
 * @description Executes a full Supabase search query for campaigns.
 * This is used by the API route: /api/campaigns/search
 *
 * @param {SearchParams} params - Search parameters (q, sort, category)
 * @returns {Promise<{ results: any[] }>} A formatted array ready for frontend
 */
export async function searchCampaigns({ q, sort, category }: SearchParams) {
  // ==== Create Supabase client ====
  const supabase = await createAnonymousServerSupabaseClient();

  // ==== Build project query ====
  let query = supabase
    .from("projects")
    .select(`
      id,
      title,
      description,
      slug,
      project_background_image,
      organization_user_id,
      created_at,
      beneficiary_type_id
    `);

  // ---- Text search ----
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // ---- Category filter ----
  if (category) {
    query = query.eq("beneficiary_type_id", category);
  }

  // ---- Sorting ----
  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    // fallback sorting before relevance sorting
    query = query.order("id", { ascending: true });
  }

  // ==== Execute query ====
  const { data: projects, error } = await query;

  if (error) {
    console.error("Supabase search error:", error.message);
    return { results: [] };
  }

  if (!projects || projects.length === 0) {
    return { results: [] };
  }

  // ==== Fetch organizations for orgslug ====
  const orgIds = projects.map((p) => p.organization_user_id);

  const { data: orgs } = await supabase
    .from("organizations")
    .select("user_id, slug")
    .in("user_id", orgIds);

  // ==== Format output ====
  let results = projects.map((project) => {
    const org = orgs?.find((o) => o.user_id === project.organization_user_id);

    return {
      id: project.id,
      title: project.title,
      description: project.description || "",
      image_url: project.project_background_image || "",
      orgslug: org?.slug || "",
      projectslug: project.slug, // frontend expects projectslug
      created_at: project.created_at,
    };
  });

  // ==== Relevance Sort (JS-side) ====
  if (q && sort === "relevance") {
    const regex = new RegExp(q, "gi");
    results.sort((a, b) => {
      const aCount = (a.title + " " + a.description).match(regex)?.length || 0;
      const bCount = (b.title + " " + b.description).match(regex)?.length || 0;
      return bCount - aCount;
    });
  }

  return { results };
}
