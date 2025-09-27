import { PUBLIC_IMAGE_BUCKET_NAME } from "@/src/lib/constants";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { Tables } from "@/src/types/database-types";

export type Organization = Tables<"organizations">;
export type Project = Tables<"projects">;

export interface OrganizationStats {
  completedProjects: number;
  activeProjects: number;
  totalDonations: number;
  donorsCount: number;
}

export interface EnhancedProject extends Project {
  slug: string;
  projectBackgroundImage: string;
}

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

export async function getOrganizationStats(
  organizationUserId: string
): Promise<OrganizationStats> {
  const supabase = await createServerSupabaseClient();
  const today = new Date().toISOString();

  interface DonorData {
    donor_id: string;
    project: {
      organization_user_id: string;
    };
  }

  // Run all queries in parallel
  const [
    completedProjectsResult,
    activeProjectsResult,
    donationsDataResult,
    donorsDataResult,
  ] = await Promise.all([
    // 1. Get completed projects (projects with end_date in the past)
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("organization_user_id", organizationUserId)
      .lt("end_date", today)
      .not("end_date", "is", null),

    // 2. Get active projects (projects with no end_date or end_date in the future)
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("organization_user_id", organizationUserId)
      .or(`end_date.gt.${today},end_date.is.null`),

    // 3. Get total donations for all projects of this organization
    supabase
      .from("donations")
      .select("amount, project:projects!inner(organization_user_id)")
      .eq("project.organization_user_id", organizationUserId),

    // 4. Get count of unique donors
    supabase
      .from("donations")
      .select(
        `
        donor_id,
        project:projects!inner(organization_user_id)
      `
      )
      .eq("project.organization_user_id", organizationUserId),
  ]);

  console.log(organizationUserId);

  const { count: completedProjectsCount, error: completedError } =
    completedProjectsResult;
  const { count: activeProjectsCount, error: activeError } =
    activeProjectsResult;
  const { data: donationsData, error: donationsError } = donationsDataResult;
  const { data: donorsData, error: donorsError } = donorsDataResult;

  // 2) Calculate total donations
  let totalDonations = 0;

  if (donationsData) {
    for (const { amount } of donationsData) {
      // If there are donations for this project
      if (amount) {
        // Sum up the donations
        totalDonations += amount || 0;
      }
    }
  }

  // 3) Count unique donors
  const uniqueDonors = new Set<string>();
  if (donorsData) {
    donorsData.forEach((donation: DonorData) => {
      if (donation.donor_id) {
        uniqueDonors.add(donation.donor_id);
      }
    });
  }

  if (completedError || activeError || donationsError || donorsError) {
    console.error("Error fetching organization stats:", {
      completedError,
      activeError,
      donationsError,
      donorsError,
    });
  }

  // 4) Return the stats
  return {
    completedProjects: completedProjectsCount || 0,
    activeProjects: activeProjectsCount || 0,
    totalDonations: parseFloat(totalDonations.toFixed(2)),
    donorsCount: uniqueDonors.size,
  };
}

/**
 * Get all projects for a specific organization
 * @param organizationUserId The user_id of the organization
 * @returns Array of projects with enhanced data (slug and default background image)
 */
export async function getOrganizationProjects(
  organizationUserId: string
): Promise<EnhancedProject[]> {
  const supabase = await createServerSupabaseClient();
  const defaultBackgroundImage = "/project-background.webp";

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("organization_user_id", organizationUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching organization projects:", error);
    return [];
  }

  // Transform the projects data to include the slug and default background image if needed
  const enhancedProjects: EnhancedProject[] = projects.map((project) => {
    // Generate a slug from the project title
    return {
      ...project,
      start_date: project.start_date || new Date().toISOString(),
      slug: project.slug,
      projectBackgroundImage:
        project.project_background_image || defaultBackgroundImage,
    };
  });

  return enhancedProjects;
}
