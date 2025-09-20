import { redirect } from "next/navigation";
// import LogoutButton from "@/components/global/logout-button";
import { getDonorProfile } from "@/src/lib/supabase/server";
import DashboardView from "@/components/donor-dashboard/dashboard-view";

export default async function DashboardPage() {
  const profile = await getDonorProfile()
  if (!profile) redirect("/login")

  // Keep it minimal: no centering wrappers, no extra headings
  return <DashboardView />
}