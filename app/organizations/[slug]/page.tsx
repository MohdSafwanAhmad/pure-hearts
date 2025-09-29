import { notFound } from "next/navigation";
import {
  getOrganizationBySlug,
  getOrganizationStats,
  getOrganizationProjects,
} from "@/src/api/organization";
import { OrganizationPageClient } from "@/src/components/page/organization/organization-page-client";
import { getOrganizationProfile } from "@/src/lib/supabase/server";

interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { slug } = await params;
  const [organization, organizationProfile] = await Promise.all([
    getOrganizationBySlug(slug),
    getOrganizationProfile(),
  ]);

  if (!organization) {
    notFound();
  }

  const [organizationStats, organizationProjects] = await Promise.all([
    getOrganizationStats(organization.user_id),
    getOrganizationProjects(organization.user_id),
  ]);

  const stats = [
    {
      title: "Completed Projects",
      stat: String(organizationStats.completedProjects),
      description: "Projects",
    },
    {
      title: "Active Projects",
      stat: String(organizationStats.activeProjects),
      description: "Projects",
    },
    {
      title: "Total Donations",
      stat: `$${organizationStats.totalDonations.toLocaleString()}`,
      description: "Raised",
    },
    {
      title: "Donors",
      stat: String(organizationStats.donorsCount),
      description: "Contributors",
    },
  ];

  // Map the database projects to the format expected by ProjectsSection component
  const projects = organizationProjects
    .filter((project) => project.start_date !== null) // Filter out projects without start dates
    .map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description || "",
      startDate: new Date(project.start_date!), // We know start_date is not null because of the filter
      completionDate: project.end_date ? new Date(project.end_date) : undefined,
      projectId: project.id,
      projectBackgroundImage: project.project_background_image || "",
      slug: project.slug,
      goal_amount: project.goal_amount,
      collected: project.collected,
      percent: project.goal_amount
        ? (project.collected / project.goal_amount) * 100
        : 0,
      organizationSlug: organization.slug,
      beneficiaryCount: project.beneficiary_count,
      organization: {
        name: organization.organization_name,
        organizationSlug: organization.slug,
      },
    }));

  // Check if the logged-in user is the owner of this organization
  const isOwner = organizationProfile?.user_id === organization.user_id;

  return (
    <OrganizationPageClient
      organization={organization}
      isOwner={isOwner}
      stats={stats}
      projects={projects}
    />
  );
}
