import LogoutButton from "@/src/components/global/logout-button";
import { getDonorProfile } from "@/src/lib/supabase/server";

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard Page</h1>
        <p className="mt-4">Welcome, {profile?.email || "User"}</p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
