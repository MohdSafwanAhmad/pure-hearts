// app/organizations/[slug]/add-project/page.tsx
import { redirect } from "next/navigation";
import { getOrganizationProfile } from "@/src/lib/supabase/server";
import { getBeneficiaryTypes } from "@/src/lib/beneficiary-types";
import AddProjectForm from "@/src/components/page/organization/add-project/add-project-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";

export default async function AddProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  // who is logged in?
  const org = await getOrganizationProfile();
  if (!org) redirect("/login");

  // must be verified
  if (!org.is_verified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle>Organization Not Verified</CardTitle>
            <CardDescription>
              Your organization must be verified before you can create projects.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // optional: prevent adding to a different org via URL
  if (org.slug !== params.slug) {
    redirect(`/organizations/${org.slug}/add-project`);
  }

  const beneficiaryTypes = await getBeneficiaryTypes();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Project</CardTitle>
          <CardDescription>
            Add a new project for your organization. All fields marked with *
            are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <AddProjectForm
            beneficiaryTypes={beneficiaryTypes}
            organizationSlug={org.slug}
          />
        </CardContent>
      </Card>
    </div>
  );
}
