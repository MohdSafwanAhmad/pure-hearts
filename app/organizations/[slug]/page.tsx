import { notFound } from "next/navigation";
import {
  getOrganizationBySlug,
  getOrganizationStats,
  getOrganizationProjects,
} from "@/src/api/organization";
import { OrganizationHeader } from "@/src/components/page/organization/header-section";
import { OrganizationStats } from "@/src/components/page/organization/stats-section";
import { OrganizationDetails } from "@/src/components/page/organization/details-section";
import { ProjectsSection } from "@/src/components/page/organization/projects-section";
interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);

  if (!organization) {
    notFound();
  }

  const organizationStats = await getOrganizationStats(organization.user_id);
  const organizationProjects = await getOrganizationProjects(
    organization.user_id
  );

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
      title: project.title,
      description: project.description || "",
      startDate: new Date(project.start_date!), // We know start_date is not null because of the filter
      completionDate: project.end_date ? new Date(project.end_date) : undefined,
      projectId: project.id,
      projectBackgroundImage: project.projectBackgroundImage,
      slug: project.slug,
      organizationSlug: organization.slug,
    }));

  return (
    <div>
      {/* Header Section */}
      <OrganizationHeader organization={organization} />
      {/* Content Section */}
      <div className="container mx-auto px-4">
        {/* Statistics Cards */}
        <OrganizationStats stats={stats} />
        {/* Organization Details Tabs */}
        <OrganizationDetails organization={organization} />
        <ProjectsSection projects={projects} />
      </div>
    </div>
  );
}
