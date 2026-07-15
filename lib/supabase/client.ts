import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Keeping this optional makes the public site render before Supabase is configured.
// Mutations and sign-in provide a clear setup error instead of silently using mock data.
export const supabase =
  url && publishableKey ? createBrowserClient(url, publishableKey) : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }
  return supabase;
}
