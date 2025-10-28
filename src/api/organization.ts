import { PUBLIC_IMAGE_BUCKET_NAME } from "@/src/lib/constants";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export interface OrganizationStats {
  completedProjects: number;
  activeProjects: number;
  totalDonations: number;
  donorsCount: number;
}

export async function getOrganizationBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data: organization, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!organization?.is_verified) return null;

  // 2. Fetch project areas via join table
  const { data: projectAreas, error: areasError } = await supabase
    .from("organization_project_areas")
    .select("project_areas(id, label)")
    .eq("organization_id", organization.user_id);

  // 3. Map to array of { id, label }
  const areas =
    projectAreas?.map(
      (row: { project_areas: { id: number; label: string } }) =>
        row.project_areas
    ) ?? [];

  if (organization?.logo) {
    const dataUrl = supabase.storage
      .from(PUBLIC_IMAGE_BUCKET_NAME)
      .getPublicUrl(organization?.logo);
    organization.logo = dataUrl.data.publicUrl;
  }

  if (error || areasError) {
    console.error("Error fetching organization:", error);
    return null;
  }

  return { ...organization, project_areas: areas };
}

export async function getOrganizationStats(
  organizationUserId: string
): Promise<OrganizationStats> {
  const supabase = await createServerSupabaseClient();

  interface DonorData {
    donor_id: string | null;
    project: {
      organization_user_id: string;
    };
  }

  // Run all queries in parallel
  const [allProjectsResult, donationsDataResult, donorsDataResult] =
    await Promise.all([
      // 1. Get all projects (both completed and active)
      supabase
        .from("project_status_view")
        .select(
          `
        *
      `
        )
        .eq("organization_user_id", organizationUserId),

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

  const { data: allProjectsData, error: allProjectsError } = allProjectsResult;
  // const { count: activeProjectsCount, error: activeError } =
  //   activeProjectsResult;
  const { data: donationsData, error: donationsError } = donationsDataResult;
  const { data: donorsData, error: donorsError } = donorsDataResult;

  // 2) Compute project that are completed vs active - based on date and if donation goal met
  const completedProjectsCount =
    allProjectsData?.filter((project) => project.is_completed).length || 0;
  const activeProjectsCount =
    allProjectsData?.filter((project) => !project.is_completed).length || 0;

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
      } else {
        uniqueDonors.add(`anonymous-${Math.random()}`); // Count anonymous donors uniquely
      }
    });
  }

  if (allProjectsError || donationsError || donorsError) {
    console.error("Error fetching organization stats:", {
      completedError: allProjectsError,
      donationsError,
      donorsError,
    });
  }

  // 4) Return the stats
  return {
    completedProjects: completedProjectsCount,
    activeProjects: activeProjectsCount,
    totalDonations: parseFloat(totalDonations.toFixed(2)),
    donorsCount: uniqueDonors.size,
  };
}

/**
 * Get all projects for a specific organization
 * @param organizationUserId The user_id of the organization
 * @returns Array of projects with enhanced data (slug, default background image, beneficiary count, collected amount)
 */
export async function getOrganizationProjects(organizationUserId: string) {
  const supabase = await createServerSupabaseClient();
  const defaultBackgroundImage = "/project-background.webp";

  // Fetch projects and related donation data
  const { data: projects, error } = await supabase
    .from("project_status_view")
    .select(
      `
      *,
      donations:donations(
        amount,
        donor_id
      ),
      beneficiary_types(
        id, 
        label
      )
    `
    )
    .eq("organization_user_id", organizationUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching organization projects:", error);
    return [];
  }

  // Transform the projects data to include all required fields
  const enhancedProjects = projects.map((project) => {
    let backgroundImage = defaultBackgroundImage;

    if (project.project_background_image) {
      backgroundImage = supabase.storage
        .from(PUBLIC_IMAGE_BUCKET_NAME)
        .getPublicUrl(project.project_background_image).data.publicUrl;
    }

    // Calculate collected amount (sum of all donations)
    const collected =
      project.donations?.reduce(
        (sum: number, donation: { amount: number }) =>
          sum + (donation.amount || 0),
        0
      ) || 0;

    // Count unique donors (beneficiary count)
    const uniqueDonors = new Set<string>();
    project.donations?.forEach((donation: { donor_id: string | null }) => {
      if (donation.donor_id) {
        uniqueDonors.add(donation.donor_id);
      } else {
        uniqueDonors.add(`anonymous-${Math.random()}`); // Count anonymous donors uniquely
      }
    });

    // Return enhanced project with all requested fields
    return {
      id: project.id!,
      title: project.title!,
      description: project.description!,
      projectId: project.id!,
      slug: project.slug!,
      goal_amount: project.goal_amount!,
      project_background_image: backgroundImage,
      start_date: project.start_date || new Date().toISOString(),
      end_date: project.end_date,
      beneficary_type: project.beneficiary_types?.label || "General",
      collected: parseFloat(collected.toFixed(2)),
      is_completed: project.is_completed!,
    };
  });

  return enhancedProjects;
}

/**
 * Fetches all project areas from the database and returns them in a format suitable for select inputs.
 * Each project area is represented as an object with 'label' and 'value' properties.
 *
 * @returns {Promise<{ label: string; value: number }[]>} An array of project areas.
 */
export async function getProjectAreas(): Promise<
  { label: string; value: number }[]
> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("project_areas")
    .select("id, label")
    .order("label", { ascending: true });

  if (error) {
    console.error("Error fetching project areas:", error);
    return [];
  }

  return data.map(({ id, label }) => ({ label, value: id }));
}
