import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/src/api/organization";
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
  const stats = [
    { title: "Completed Projects", stat: "4", description: "Projects" },
    { title: "Active Projects", stat: "2", description: "Projects" },
    {
      title: "Total Donations",
      stat: "$12,450",
      description: "Raised",
    },
    { title: "Donors", stat: "89", description: "Contributors" },
  ];
  const projects = [
    {
      title: "Nutrition for children with Down syndrome",
      description:
        "Providing nutritional support for children with special needs",
      startDate: new Date("2023-05-01"),
      completionDate: new Date("2023-11-24"),
      projectId: "1",
      projectBackgroundImage: "/project-background.webp",
    },
    {
      projectId: "2",
      title: "Medical care for children with Down syndrome",
      completionDate: new Date("2023-08-15"),
      description: "Access to healthcare services and treatments",
      startDate: new Date("2022-08-15"),
      projectBackgroundImage: "/project-background.webp",
    },
    {
      projectId: "3",
      title: "Therapy for children with Down syndrome",
      completionDate: new Date("2022-05-01"),
      description: "Therapeutic interventions and support services",
      startDate: new Date("2021-05-01"),
      projectBackgroundImage: "/project-background.webp",
    },
    {
      projectId: "4",
      title: "Education for children with Down syndrome",
      description: "Inclusive education programs and resources",
      startDate: new Date("2024-01-10"),
      projectBackgroundImage: "/project-background.webp",
    },
    {
      projectId: "5",
      title: "Community support for families",
      description: "Building a supportive community network",
      startDate: new Date("2023-09-20"),
      projectBackgroundImage: "/project-background.webp",
    },
  ];

  if (!organization) {
    notFound();
  }

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
