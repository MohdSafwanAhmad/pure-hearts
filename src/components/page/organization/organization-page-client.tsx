/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ProjectsSection } from "@/src/components/page/organization/projects-section";

type StatCard = { title: string; stat: string; description: string };

export function OrganizationPageClient({
  organization,
  stats, // array of cards, as you’re building in the page
  projects,
  isOwner = false, // <-- your prop name
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization: any;
  stats: StatCard[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: any[];
  isOwner?: boolean;
}) {
  // render any header/stats UI you have here using `stats` if needed

  return (
    <div className="container mx-auto px-4 py-6">
      <ProjectsSection
        projects={projects}
        // derive slug here so the page doesn’t need to pass it
        organizationSlug={organization.slug}
        // translate your prop name to what ProjectsSection expects
        isOwnOrganization={!!isOwner}
      />
    </div>
  );
}

// (Optional) also export default if other files import the default
export default OrganizationPageClient;
