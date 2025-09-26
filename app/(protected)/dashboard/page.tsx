import {
  getDonorProfile,
  getOrganizationProfile,
} from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardDefaultPage() {
  const [organizationProfile, donorProfile] = await Promise.all([
    getOrganizationProfile(),
    getDonorProfile(),
  ]);

  if (!organizationProfile && !donorProfile) {
    redirect("/login");
  }

  if (donorProfile) {
    redirect("/dashboard/donor/overview");
  }

  redirect("/dashboard/organization/overview");
}
