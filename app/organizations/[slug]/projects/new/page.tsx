import { notFound } from "next/navigation";

import { getOrganizationBySlug } from "@/src/api/organization";
import { getBeneficiaryTypes } from "@/src/api/project";
import { getOrganizationProfile } from "@/src/lib/supabase/server";
import CreateProjectForm from "@/src/components/page/project/create-project-form";

interface NewProjectPageProps {
  params: { slug: string };
}

/**
 * Server page for creating a new project.  It ensures that the organization
 * exists and that the currently logged in user is the owner of that
 * organization.  If these checks pass, it fetches the list of
 * beneficiary types and renders the form.  Unauthorized or unknown
 * organizations return a 404.
 */
export default async function NewProjectPage({
  params,
}: NewProjectPageProps) {
  const { slug } = params;
  const organization = await getOrganizationBySlug(slug);
  if (!organization) {
    notFound();
  }
  const currentUser = await getOrganizationProfile();
  if (!currentUser || currentUser.user_id !== organization.user_id) {
    // Only organization owners are allowed to create new projects
    notFound();
  }
  const beneficiaryTypes = await getBeneficiaryTypes();
  return (
    <div className="container mx-auto px-4 py-6">
      <CreateProjectForm
        beneficiaryTypes={beneficiaryTypes}
        organizationSlug={slug}
      />
    </div>
  );
}