// src/lib/supabase/server-admin.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database-types";

/**
 * Server-only admin client using the Service Role key.
 * No cookies / no next/headers. NEVER import this from client components.
 */
export function createServerSupabaseClient() {
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
