import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { integrations } from "@/lib/integrations";

/**
 * Server-side Supabase client. Uses the service-role key when available
 * (API routes, webhooks) and falls back to the anon key for reads.
 * Returns null when Supabase isn't configured yet.
 */
export function getSupabase(): SupabaseClient | null {
  if (!integrations.supabase()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}
