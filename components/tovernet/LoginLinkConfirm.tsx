'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/tovernet/supabase';
import { identify, track } from '@/lib/tovernet/analytics';

/**
 * The link in the "Logowanie do Tovernet" e-mail lands on the page that asked for it with
 * ?logowanie=<hashed token>. Mail scanners open links and run scripts, and the token works
 * once (it also ends the e-mail's code), so it is used only when a person clicks here.
 * The session then reaches the panel and the offer through onAuthStateChange.
 */
export default function LoginLinkConfirm() {
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const [state, setState] = useState<'ask' | 'busy' | 'failed'>('ask');

  useEffect(() => {
    const url = new URL(window.location.href);
    const t = url.searchParams.get('logowanie');
    if (!t) return;
    url.searchParams.delete('logowanie');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    if (/^[0-9a-f]{20,128}$/i.test(t) && authClient()) setTokenHash(t);
  }, []);

  if (!tokenHash) return null;

  const signIn = async () => {
    const supabase = authClient();
    if (!supabase) return;
    setState('busy');
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email' });
    if (error || !data.session) { setState('failed'); track('auth_failed', { method: 'email_link' }); return; }
    identify(data.session, 'email_link');
    setTokenHash(null);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="tn-login-title"
         className="fixed inset-0 z-[2147483000] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm bg-white p-6 text-[#15161A] shadow-2xl">
        <h2 id="tn-login-title" className="text-xl font-semibold">Logowanie do Tovernet</h2>
        {state === 'failed' ? (
          <>
            <p className="mt-3 text-[#5A5C60]">Ten link już wygasł albo został użyty. Poproś o nowy link i kod na stronie logowania.</p>
            <a href="/panel/" className="mt-5 block w-full bg-[#15161A] px-6 py-4 text-center font-semibold text-white hover:bg-[#2536C4]">Przejdź do logowania</a>
            <button type="button" onClick={() => setTokenHash(null)} className="mt-3 w-full text-sm text-[#5A5C60] underline">Zamknij</button>
          </>
        ) : (
          <>
            <p className="mt-3 text-[#5A5C60]">Kliknij, aby dokończyć logowanie z e-maila.</p>
            <button type="button" disabled={state === 'busy'} onClick={() => void signIn()}
                    className="mt-5 w-full bg-[#15161A] px-6 py-4 font-semibold text-white hover:bg-[#2536C4] disabled:opacity-50">
              {state === 'busy' ? 'Logujemy…' : 'Zaloguj się do Tovernet'}
            </button>
            <button type="button" onClick={() => setTokenHash(null)} className="mt-3 w-full text-sm text-[#5A5C60] underline">Anuluj</button>
          </>
        )}
      </div>
    </div>
  );
}
