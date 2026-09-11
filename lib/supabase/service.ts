import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for server-only writes that must bypass RLS
 * (`subscriptions`, `processed_sales` — see IP-0002 tasks 5–6 and migration
 * 000003). Reads `SUPABASE_SERVICE_ROLE_KEY`, which is set at runtime only and
 * never committed.
 *
 * NEVER import this into a Client Component or anything that ships to the
 * browser — it grants full, RLS-bypassing database access.
 */
export function createServiceRoleClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
