import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/src/api/organization";
import { OrganizationHeader } from "@/src/components/page/organization/organization-header";
import { OrganizationStats } from "@/src/components/page/organization/organization-stats";
import { OrganizationDetails } from "@/src/components/page/organization/organization-details";
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

  return (
    <div>
      {/* Header Section */}
      <OrganizationHeader organization={organization} />

      {/* Content Section */}
      <div className="container mx-auto px-4">
        {/* Statistics Cards */}
        <OrganizationStats />

        {/* Organization Details Tabs */}
        <OrganizationDetails organization={organization} />
        <ProjectsSection />
      </div>
    </div>
  );
}
