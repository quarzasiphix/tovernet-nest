'use client';

import { useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { authClient } from '@/lib/tovernet/supabase';
import { registerWithInvite, sendLoginCode } from '@/lib/tovernet/auth';
import { identify, track } from '@/lib/tovernet/analytics';

export type PersonalInvite = { email: string; tokenHash: string; hasAccount: boolean };

/**
 * Sign-in without passwords. A personal link creates the account in one click, as the
 * KsięgaI invitation does. Anyone else gets a 6-digit code by e-mail, typed here, so the
 * visitor never leaves the page. New and existing KsięgaI accounts work the same way.
 */
export default function EmailAuth({ invite, onSignedIn }: { invite?: PersonalInvite | null; onSignedIn: (s: Session) => void }) {
  const supabase = authClient();
  const [email, setEmail] = useState(invite?.email ?? '');
  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [hasAccount, setHasAccount] = useState(invite?.hasAccount ?? false);

  if (!supabase) return <p role="alert">Logowanie nie jest jeszcze skonfigurowane.</p>;

  const primary = 'w-full rounded-none bg-[#15161A] px-6 py-4 font-semibold text-white hover:bg-[#2536C4] disabled:opacity-50';
  const field = 'mt-1 w-full rounded-none border border-[#15161A] px-4 py-3 text-[#15161A]';

  const oneClick = async () => {
    if (!invite) return;
    setBusy(true); setError('');
    const result = await registerWithInvite(supabase, invite.email, invite.tokenHash);
    setBusy(false);
    if (result === 'exists') { setHasAccount(true); track('auth_existing_account'); return; }
    if (!result) { setError('Nie udało się utworzyć konta. Spróbuj ponownie.'); track('auth_failed', { method: 'personal_link' }); return; }
    identify(result, 'personal_link');
    onSignedIn(result);
  };

  const sendCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setError('');
    const sent = await sendLoginCode(supabase, email.trim());
    setBusy(false);
    if (sent !== 'sent') {
      setError(sent === 'rate_limited' ? 'Kod został już wysłany. Spróbuj za chwilę.' : 'Nie udało się wysłać kodu.');
      track('auth_failed', { method: 'email_code', stage: 'send' });
    } else {
      setStage('code');
      track('auth_code_sent', { personal_link: Boolean(invite) });
    }
  };

  const verify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { data, error: err } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
    setBusy(false);
    if (err || !data.session) { setError('Kod jest nieprawidłowy albo wygasł.'); track('auth_failed', { method: 'email_code', stage: 'verify' }); return; }
    identify(data.session, 'email_code');
    onSignedIn(data.session);
  };

  const alert = error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>;

  if (invite && !hasAccount) {
    return (
      <div>
        <p className="text-[#5A5C60]">Utworzymy konto dla <strong>{invite.email}</strong>. Bez hasła, jednym kliknięciem.</p>
        <button disabled={busy} onClick={() => void oneClick()} className={`mt-4 ${primary}`}>{busy ? 'Tworzymy konto…' : 'Kontynuuj'}</button>
        {alert}
      </div>
    );
  }

  if (stage === 'code') {
    return (
      <form onSubmit={verify}>
        <p className="text-[#5A5C60]">Wysłaliśmy 6-cyfrowy kod na <strong>{email}</strong>. Wiadomość przyjdzie od KsięgaI, systemu kont, z którego korzystamy.</p>
        <label className="mt-4 block text-sm font-medium text-[#5A5C60]">Kod z e-maila
          <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric"
                 autoComplete="one-time-code" required pattern="\d{6}" className={`${field} text-center text-2xl tracking-[0.5em]`} />
        </label>
        <button disabled={busy || code.length !== 6} className={`mt-4 ${primary}`}>{busy ? 'Sprawdzamy…' : 'Potwierdź'}</button>
        <button type="button" onClick={() => { setStage('email'); setCode(''); }} className="mt-3 text-sm text-[#5A5C60] underline">Zmień adres</button>
        {alert}
      </form>
    );
  }

  return (
    <form onSubmit={sendCode}>
      <p className="text-[#5A5C60]">
        {hasAccount ? 'Masz już konto na ten adres. Wyślemy kod logowania.' : 'Podaj e-mail. Wyślemy kod, bez zakładania hasła. Jeśli masz konto KsięgaI, użyjemy go.'}
      </p>
      <label className="mt-4 block text-sm font-medium text-[#5A5C60]">E-mail
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email"
               readOnly={Boolean(invite)} className={field} />
      </label>
      <button disabled={busy} className={`mt-4 ${primary}`}>{busy ? 'Wysyłamy…' : 'Wyślij kod'}</button>
      {alert}
    </form>
  );
}
