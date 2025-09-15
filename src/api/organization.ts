import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { Tables } from "@/src/types/database-types";

export type Organization = Tables<"organizations">;

export async function getOrganizationBySlug(
  slug: string
): Promise<Organization | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching organization:", error);
    return null;
  }

  return data as Organization;
}

export async function getAllOrganizations(): Promise<Organization[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("organizations").select("*");

  if (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }

  return data as Organization[];
}
