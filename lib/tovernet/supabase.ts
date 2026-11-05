import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Authentication only: the same Supabase Auth project as KsięgaI, with data through
// the gateway. The session is stored in this origin's localStorage, so being signed in
// on ksiegai.pl does not sign anyone in here, and the reverse.
let client: SupabaseClient | null = null;

export function authClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, {
    // PKCE keeps a magic link from writing tokens into the URL fragment, where the demo id lives.
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce', storageKey: 'sb-tovernet-auth' },
  });
  return client;
}
