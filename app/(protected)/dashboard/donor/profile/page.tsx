import ProfileForm from "@/app/(protected)/dashboard/donor/profile/profile-form/profile-form";
import { getMyDonorProfile } from "@/src/api/donor";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const donor = await getMyDonorProfile(user.id);

  return (
    <div className="container mx-auto max-w-3xl">
      <ProfileForm
        userId={user.id}
        initial={{
          first_name: donor?.first_name ?? null,
          last_name: donor?.last_name ?? null,
          phone: donor?.phone ?? null,
          address: donor?.address ?? null,
          city: donor?.city ?? null,
          state: donor?.state ?? null,
          country: donor?.country ?? null,
          profile_image: donor?.profile_image ?? null,
          profile_completed: Boolean(donor?.profile_completed),
        }}
      />
    </div>
  );
}
