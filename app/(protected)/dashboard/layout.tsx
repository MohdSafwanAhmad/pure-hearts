import { DashboardNavigation } from "@/src/components/page/dashboard/dashboard-navigation";
import {
  getDonorProfile,
  getOrganizationProfile,
} from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [donorProfile, organizationProfile] = await Promise.all([
    getDonorProfile(),
    getOrganizationProfile(),
  ]);

  if (organizationProfile) {
    return redirect(`/organizations/${organizationProfile.slug}`);
  }

  if (!donorProfile) {
    return redirect("/login");
  }

  return (
    <DashboardNavigation
      sections={[
        {
          id: "overview",
          name: "Overview",
          icon: "Home",
          href: `/dashboard/donor/overview`,
        },
        {
          id: "profile",
          name: "Profile",
          icon: "User",
          href: `/dashboard/donor/profile`,
        },
      ]}
    >
      {children}
    </DashboardNavigation>
  );
}
