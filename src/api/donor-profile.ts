import { createServerSupabaseClient } from "@/src/lib/supabase/server";
export type DonorProfile = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null; // keep if you created this column
  country: string | null;
  profile_completed: boolean | null;
};

export async function getMyDonorProfile(
  userId: string
): Promise<DonorProfile | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("donors")
    .select(
      // if your DB is still missing some of these, we’ll fall back below
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "user_id, first_name, last_name, phone, address, city, state, country, profile_completed" as any
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error && /does not exist/.test(error.message)) {
    // Fallback while columns are still being added
    const { data: basic, error: e2 } = await supabase
      .from("donors")
      .select("user_id, first_name, last_name, profile_completed")
      .eq("user_id", userId)
      .maybeSingle();

    if (e2) throw new Error(e2.message);
    if (!basic) return null;

    return {
      user_id: basic.user_id,
      first_name: basic.first_name ?? null,
      last_name: basic.last_name ?? null,
      phone: null,
      address: null,
      city: null,
      state: null,
      country: null,
      profile_completed: basic.profile_completed ?? false,
    };
  }

  if (error) throw new Error(error.message);
  return data as unknown as DonorProfile;
}
