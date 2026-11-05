'use client';

import { useEffect, useState } from 'react';
import { UserRound } from 'lucide-react';

// Same key as lib/tovernet/supabase.ts. Read directly so marketing pages do not load the
// Supabase SDK: a stored refresh token means the panel will sign this browser in.
const STORAGE_KEY = 'sb-tovernet-auth';

export type SignedIn = { email: string } | null;

export function readSignedIn(): SignedIn {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    const session = s?.currentSession ?? s;
    if (!session?.refresh_token) return null;
    return { email: String(session.user?.email ?? '') };
  } catch {
    return null;
  }
}

/** Follows sign-in and sign-out in this browser, including other tabs. */
export function useSignedIn(): SignedIn | undefined {
  const [state, setState] = useState<SignedIn | undefined>(undefined);
  useEffect(() => {
    setState(readSignedIn());
    const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY || e.key === null) setState(readSignedIn()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return state;
}

/**
 * Header link to the client panel: "Zaloguj się" for visitors, "Twój panel" for someone who
 * is signed in. The server render shows the visitor version; it switches after hydration.
 */
export default function AccountLink({ className, signedInClassName, style }: { className?: string; signedInClassName?: string; style?: React.CSSProperties }) {
  const signedIn = useSignedIn();
  const on = Boolean(signedIn);
  return (
    <a href="/panel/" className={on && signedInClassName ? signedInClassName : className} style={style}
       title={on && signedIn?.email ? `Zalogowano: ${signedIn.email}` : 'Logowanie do Panelu klienta'}
       data-testid="account-link" data-signed-in={on ? 'true' : 'false'}>
      <UserRound size={16} aria-hidden="true" style={{ flex: 'none' }} />
      <span>{on ? 'Twój panel' : 'Zaloguj się'}</span>
    </a>
  );
}
