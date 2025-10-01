import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { getMyDonorProfile } from "@/src/api/donor-profile";
import ProfileForm from "./profile-form/profile-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const donor = await getMyDonorProfile(user!.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete your profile</CardTitle>
      </CardHeader>

      <CardContent>
        <ProfileForm
          userId={user!.id}
          initial={{
            first_name: donor?.first_name ?? null,
            last_name: donor?.last_name ?? null,
            phone: donor?.phone ?? null,
            address: donor?.address ?? null,
            city: donor?.city ?? null,
            state: donor?.state ?? null,
            country: donor?.country ?? null,
            profile_completed: donor?.profile_completed ?? false,
          }}
        />
      </CardContent>
    </Card>
  );
}
