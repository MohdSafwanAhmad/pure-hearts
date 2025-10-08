import { redirect } from "next/navigation";
import { getOrganizationProfile } from "@/src/lib/supabase/server";
import { getBeneficiaryTypes } from "@/src/lib/beneficiary-types";
import AddProjectForm from "@/src/components/page/organization/add-project/add-project-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default async function Page({ params }: { params: { slug: string } }) {
  // must be signed in as an organization
  const org = await getOrganizationProfile();
  if (!org) redirect("/login");

  if (!org.is_verified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
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

  const beneficiaryTypes = await getBeneficiaryTypes();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Add a new project for your organization. All fields marked with *
            are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddProjectForm
            beneficiaryTypes={beneficiaryTypes}
            organizationSlug={params.slug}
          />
        </CardContent>
      </Card>
    </div>
  );
}
