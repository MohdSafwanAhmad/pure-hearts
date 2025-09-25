import { getOrganizationProfile } from "@/src/lib/supabase/server";
import { OrganizationUpdateForm } from "@/src/components/page/update/organization-update-form";
import { redirect } from "next/navigation";

export default async function OrganizationUpdatePage() {
  const profile = await getOrganizationProfile();

  if (!profile) {
    redirect("/login/organization");
  }

  return <OrganizationUpdateForm initialData={profile} />;
}
