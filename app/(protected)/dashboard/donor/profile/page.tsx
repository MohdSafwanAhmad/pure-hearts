/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { createAnonymousServerSupabaseClient } from "@/src/lib/supabase/server";
import { getDonorProfile } from "@/src/lib/supabase/server";
import ProfileForm from "./profile-form/profile-form";

export default async function ProfilePage() {
  const supabase = await createAnonymousServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ✅ no arguments now
  const donor = await getDonorProfile();

  return (
    <div className="container mx-auto max-w-3xl">
      <ProfileForm
        userId={user.id}
        initial={{
          first_name: donor?.first_name ?? "",
          last_name: donor?.last_name ?? "",
          phone: (donor as any)?.phone ?? "", // see NOTE below
          address: (donor as any)?.address ?? "",
          city: (donor as any)?.city ?? "",
          state: (donor as any)?.state ?? "",
          country: (donor as any)?.country ?? "",
          profile_completed: Boolean(donor?.profile_completed),
        }}
      />
    </div>
  );
}
