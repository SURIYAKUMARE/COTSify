import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;
let _clientUrl: string | null = null;
let _clientKey: string | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    !url || !key ||
    url.includes("YOUR_PROJECT_REF") ||
    url.includes("placeholder") ||
    key.includes("your_supabase") ||
    key.includes("placeholder")
  ) return null;

  // Reset singleton if credentials changed (e.g. after env update in dev)
  if (_client && (_clientUrl !== url || _clientKey !== key)) {
    _client = null;
  }

  try {
    if (!_client) {
      _client = createClient(url, key, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          // Use implicit flow — avoids PKCE code verifier mismatch across redirects
          flowType: "implicit",
        },
      });
      _clientUrl = url;
      _clientKey = key;
    }
    return _client;
  } catch {
    return null;
  }
}

export const isSupabaseConfigured = () => {
  if (typeof window === "undefined") return false;
  return getSupabaseClient() !== null;
};
