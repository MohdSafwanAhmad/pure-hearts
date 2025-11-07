import "server-only";
import { Database } from "@/src/types/database-types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

/**
 * Creates a Supabase client for server-side use. With Admin privileges using the Service Role Key.
 * Cannot manage user sessions and cookies.
 * Do not expose this to the client!
 * @returns A Supabase client instance. with Admin privileges using the Service Role Key.
 */
export async function createServerSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

/**
 * Creates a Supabase client for server-side use. With Anonymous privileges.
 * Can manage user sessions using cookies.
 * @returns A Supabase client instance. with Anonymous privileges.
 */
export async function createAnonymousServerSupabaseClient() {
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

export const getDonorProfile = cache(
  async (parameters?: { optionalClient?: SupabaseClient<Database> }) => {
    const supabase =
      parameters?.optionalClient ||
      (await createAnonymousServerSupabaseClient());
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

    if (!profile) {
      return null;
    }

    return {
      ...profile,
      email: user.email,
    };
  }
);

export const getOrganizationProfile = cache(
  async (parameters?: { optionalClient?: SupabaseClient<Database> }) => {
    const supabase =
      parameters?.optionalClient ||
      (await createAnonymousServerSupabaseClient());
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

    return { email: user.email, ...profile };
  }
);
export { createClient };

