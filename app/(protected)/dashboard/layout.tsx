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
  const [organizationProfile, donorProfile] = await Promise.all([
    getOrganizationProfile(),
    getDonorProfile(),
  ]);

  if (!organizationProfile && !donorProfile) {
    return redirect("/login");
  }
  const donorType = donorProfile ? "donor" : "organization";

  const sections = {
    donor: [
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
    ],
    organization: [
      {
        id: "overview",
        name: "Overview",
        icon: "Home",
        href: `/dashboard/organization/overview`,
      },
      {
        id: "analytics",
        name: "Analytics",
        icon: "BarChart3",
        href: `/dashboard/organization/analytics`,
      },
      {
        id: "profile",
        name: "Profile",
        icon: "User",
        href: `/dashboard/organization/profile`,
      },
    ],
  };

  return (
    <DashboardNavigation
      dashboardType={donorType}
      sections={sections[donorType]}
    >
      {children}
    </DashboardNavigation>
  );
}
