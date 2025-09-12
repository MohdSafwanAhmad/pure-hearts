import { createBrowserClient } from "@supabase/ssr";

import { Database } from "@/src/types/database-types";

/**
 * Creates a Supabase client for client-side use.
 * @returns A Supabase client instance for client-side use.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
