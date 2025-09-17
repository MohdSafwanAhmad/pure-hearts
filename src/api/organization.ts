import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { Tables } from "@/src/types/database-types";
import { PUBLIC_IMAGE_BUCKET_NAME } from "@/src/lib/constants";

export type Organization = Tables<"organizations">;

export async function getOrganizationBySlug(
  slug: string
): Promise<Organization | null> {
  const supabase = await createServerSupabaseClient();

  const { data: organization, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!organization?.is_verified) return null;

  if (organization?.logo) {
    const dataUrl = supabase.storage
      .from(PUBLIC_IMAGE_BUCKET_NAME)
      .getPublicUrl(organization?.logo);
    organization.logo = dataUrl.data.publicUrl;
  }

  if (error) {
    console.error("Error fetching organization:", error);
    return null;
  }

  return organization as Organization;
}
