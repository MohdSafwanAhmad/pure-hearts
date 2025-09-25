import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/src/types/database-types";

/**
 * Creates a Supabase client for server-side use.
 * @returns A Supabase client instance.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getDonorProfile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }
  const { data: profile } = await supabase
    .from("donors")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return {
    ...profile,
    email: user.email,
  };
}

export async function getOrganizationProfile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  const { data: profile } = await supabase
    .from("organizations")
    .select("*")
    .eq("user_id", user.id)
    .single();
  
  if (!profile) {
    return null;
  }
  
  return profile;
}
