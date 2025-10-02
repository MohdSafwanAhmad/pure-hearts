import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { getMyDonorProfile } from "@/src/api/donor";
import ProfileForm from "./profile-form/profile-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const donor = await getMyDonorProfile(user.id);

  const isProfileComplete = donor?.profile_completed ?? false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isProfileComplete ? "Manage Your Profile" : "Complete Your Profile"}
        </CardTitle>
        <CardDescription>
          {isProfileComplete
            ? "Update your information or manage your profile"
            : "Please complete your profile to access all features"}
        </CardDescription>
      </CardHeader>

      <CardContent>
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
            profile_completed: isProfileComplete,
          }}
        />
      </CardContent>
    </Card>
  );
}
