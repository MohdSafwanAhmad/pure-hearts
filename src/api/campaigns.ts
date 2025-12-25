/**
 * Campaigns API (Server-only)
 * ----------------------------------------------------
 * Server-side function to search campaigns directly from Supabase.
 * Supports:
 * - Full-text search via `search_vector`
 * - Category filtering (project areas)
 * - Sorting by relevance or newest
 * - Pagination
 */

import "server-only";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export type ProjectSearchRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  project_background_image: string | null;
  created_at: string | null;
  goal_amount: number | null;

  organization: {
    slug: string;
    name: string;
  } | null;

  beneficiary: {
    label: string;
  } | null;

  collected: number;
  percent: number;
};

export interface SearchCampaignsParams {
  query?: string;
  areaId?: number;
  sortBy?: "relevance" | "newest";
  limit?: number;
  offset?: number;
}

export const searchCampaigns = async ({
  query = "",
  areaId,
  sortBy = "relevance",
  limit = 24,
  offset = 0,
}: SearchCampaignsParams): Promise<ProjectSearchRow[]> => {
  const supabase = await createServerSupabaseClient();

let qb = supabase
  .from("projects")
  .select(
    `
      id,
      slug,
      title,
      description,
      project_background_image,
      created_at,
      goal_amount,

      organizations:organization_user_id (
        slug,
        organization_name,
        organization_project_areas (
          project_area_id
        )
      ),

      beneficiary_types (
        label
      ),

      donations ( amount )
    `,
    { count: "exact" }
  )
  .range(offset, offset + limit - 1);


  // Full-text search
  if (query.trim()) {
    qb = qb.textSearch("search_vector", query, { type: "plain" });
  }


/**
 * Filter by project area
 * ------------------------------------------
 * Supabase does NOT support subqueries in `.in()`,
 * so we must resolve organization IDs first.
 */
if (areaId) {
  const { data: orgRows, error: orgError } = await supabase
    .from("organization_project_areas")
    .select("organization_id")
    .eq("project_area_id", areaId);

  if (orgError) {
    console.error("Area filter error:", orgError.message);
    return [];
  }

  const organizationIds = orgRows?.map((r) => r.organization_id) ?? [];

  // No organizations → no campaigns
  if (organizationIds.length === 0) {
    return [];
  }

  qb = qb.in("organization_user_id", organizationIds);
}


  
  // Sorting
  qb =
    sortBy === "newest"
      ? qb.order("created_at", { ascending: false })
      : qb.order("created_at", { ascending: false }); // placeholder until RPC rank

  const { data, error } = await qb;

  if (error) {
    console.error("searchCampaigns error:", error.message);
    return [];
  }

  return (
    data?.map((p: any) => {
      const collected =
        p.donations?.reduce(
          (sum: number, d: { amount: number }) => sum + d.amount,
          0
        ) ?? 0;

      const goal = p.goal_amount ?? 0;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        project_background_image: p.project_background_image,
        created_at: p.created_at,
        goal_amount: goal,

        organization: p.organizations
          ? {
              slug: p.organizations.slug,
              name: p.organizations.organization_name,
            }
          : null,

        beneficiary: p.beneficiary_types
          ? { label: p.beneficiary_types.label }
          : null,

        collected,
        percent: goal > 0 ? Math.round((collected / goal) * 100) : 0,
      };
    }) ?? []
  );
};


/**
 * Fetch all project areas (for search filters)
 * --------------------------------------------
 * Used by CampaignSearchPage dropdown.
 * Server-only, minimal, alphabetical.
 */
export type ProjectArea = {
  id: number;
  label: string;
};

export const getProjectAreas = async (): Promise<ProjectArea[]> => {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("project_areas")
    .select("id, label")
    .order("label", { ascending: true });

  if (error) {
    console.error("getProjectAreas error:", error.message);
    return [];
  }

  return data ?? [];
};