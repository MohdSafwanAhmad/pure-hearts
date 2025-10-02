/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

type Payload = {
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
};

export async function upsertDonorProfile(payload: Payload) {
  const supabase = await createServerSupabaseClient();

  // Calculate if profile is complete based on required fields
  const profile_completed =
    !!payload.first_name &&
    !!payload.last_name &&
    !!payload.address &&
    !!payload.city &&
    !!payload.country;

  const { error } = await supabase.from("donors").upsert(
    {
      user_id: payload.user_id,
      first_name: payload.first_name ?? null,
      last_name: payload.last_name ?? null,
      phone: payload.phone ?? null,
      address: payload.address ?? null,
      city: payload.city ?? null,
      state: payload.state ?? null,
      country: payload.country ?? null,
      profile_completed,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    { onConflict: "user_id" }
  );
  revalidatePath("/dashboard/donor/profile");
  return { ok: true, profile_completed };
}

// DELETE - Delete Profile
export async function deleteDonorProfile(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("donors")
    .delete()
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/donor/profile");
  return { ok: true };
}
