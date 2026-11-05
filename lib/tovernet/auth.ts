import type { Session, SupabaseClient } from '@supabase/supabase-js';

const GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? 'https://api.ksiegai.pl';

export async function sha256hex(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Personal-link signup through the KsięgaI invited-user endpoint: the link proved the
 * mailbox, so the account is created without a password or code.
 * Returns 'exists' when the address already has an account.
 */
export async function registerWithInvite(
  supabase: SupabaseClient,
  email: string,
  tokenHash: string,
): Promise<Session | 'exists' | null> {
  const res = await fetch(`${GATEWAY}/v1/public/invite/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token_hash: tokenHash }),
  });
  const envelope = await res.json().catch(() => null);
  if (!res.ok || !envelope?.data) {
    return /already|exists/i.test(envelope?.error?.message ?? '') ? 'exists' : null;
  }
  const { data, error } = await supabase.auth.setSession({
    access_token: envelope.data.access_token,
    refresh_token: envelope.data.refresh_token,
  });
  return error ? null : data.session;
}
