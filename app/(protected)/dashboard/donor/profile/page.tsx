/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDonorProfile } from "@/src/lib/supabase/server";
import ProfileForm from "./profile-form/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const donor = await getDonorProfile();

  if (!donor) redirect("/login");

  return (
    <div className="container mx-auto max-w-3xl">
      <ProfileForm
        userId={donor.user_id}
        initial={{
          first_name: donor?.first_name ?? "",
          last_name: donor?.last_name ?? "",
          phone: (donor as any)?.phone ?? "", // see NOTE below
          address: (donor as any)?.address ?? "",
          city: (donor as any)?.city ?? "",
          state: (donor as any)?.state ?? "",
          country: (donor as any)?.country ?? "",
          profile_completed: Boolean(donor?.profile_completed),
          postal_code: donor?.postal_code ?? "",
        }}
      />
    </div>
  );
}
