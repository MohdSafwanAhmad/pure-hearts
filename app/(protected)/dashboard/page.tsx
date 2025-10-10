import { getDonorProfile } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardDefaultPage() {
  const donorProfile = await getDonorProfile();

  if (!donorProfile) {
    redirect("/login");
  }

  if (donorProfile) {
    redirect("/dashboard/donor/overview");
  }
}
