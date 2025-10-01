"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";

type Payload = {
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string; // keep if you added this column
  country?: string;
  profile_completed?: boolean;
};

export async function upsertDonorProfile(payload: Payload) {
  const supabase = await createServerSupabaseClient();

  // Build the row; everything nullable on purpose
  const row = {
    user_id: payload.user_id,
    first_name: payload.first_name ?? null,
    last_name: payload.last_name ?? null,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
    city: payload.city ?? null,
    state: payload.state ?? null, // remove line if you don’t have this column
    country: payload.country ?? null,
    profile_completed: payload.profile_completed ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any; // <-- TEMPORARY: bypass stale generated types

  const { error } = await supabase
    .from("donors")
    .upsert(row, { onConflict: "user_id" });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
