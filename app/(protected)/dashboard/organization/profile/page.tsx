import { OrganizationUpdateForm } from "@/src/components/page/organization-dashboard/profile/organization-update-form";
import { getOrganizationProfile } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OrganizationProfilePage() {
  const profile = await getOrganizationProfile();

  if (!profile) {
    return redirect("/login/organization");
  }

  return <OrganizationUpdateForm initialData={profile} />;
}
