import LogoutButton from "@/src/components/global/logout-button";
import { getDonorProfile } from "@/src/lib/supabase/server";
import DashboardView from "@/src/components/page/donor-dashboard/dashboard-view";

export default async function DashboardPage() {
  const profile = await getDonorProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-red-600">
          Error loading user data
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <header className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold">My Donations</h1>
        <p className="mt-2">
          Welcome {profile.first_name} {profile.last_name}!
        </p>
      </header>

      <main className="w-full max-w-7xl mx-auto p-4 md:p-6">
        <DashboardView />
        <div className="mt-6">
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
