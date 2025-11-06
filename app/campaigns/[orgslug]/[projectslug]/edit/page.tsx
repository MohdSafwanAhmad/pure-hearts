import { notFound, redirect } from "next/navigation";
import EditProjectForm from "@/src/components/page/project/edit-project-form";
import { getProjectBySlugs, getBeneficiaryTypes } from "@/src/api/project";
import { getOrganizationProfile } from "@/src/lib/supabase/server";

/**
 * Edit page for a campaign, e.g. /campaigns/{orgslug}/{projectslug}/edit.
 * Loads the project and checks that the current organization owns it.
 */
export default async function EditProjectCampaignPage({
  params,
}: {
  params: { orgslug: string; projectslug: string };
}) {
  const { orgslug, projectslug } = params;

  // Lookup the project by organization slug and project slug
  const project = await getProjectBySlugs(orgslug, projectslug);
  if (!project) {
    notFound();
  }

  // Make sure an organization is logged in
  const organization = await getOrganizationProfile();
  if (!organization) {
    redirect("/login");
  }

  // Only owners can edit
  if (project.organization.user_id !== organization.user_id) {
    notFound();
  }

  // Get select options for beneficiary type
  const beneficiaryTypes = await getBeneficiaryTypes();

  return (
    <EditProjectForm
      project={project}
      beneficiaryTypes={beneficiaryTypes}
      organizationSlug={orgslug}
    />
  );
}
