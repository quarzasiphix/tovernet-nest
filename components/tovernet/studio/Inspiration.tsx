'use client';

import { useState, type FormEvent } from 'react';
import { Check, Link2 } from 'lucide-react';
import type { JourneyActions } from '../funnel/Journey';
import s from './studio.module.css';

/**
 * "Send us a site you like" (owner 2026-11-06, 20-conversion-rethink.md): visitors are not
 * interested in the exact sample, so we invite their own taste. Sent like the offer's
 * question form (actions.ask, tovernetLead.submit), so it lands on the lead in admin.
 */
export default function Inspiration({ actions, placement }: { actions: JourneyActions; placement: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const known = Boolean(actions.inviteEmail || actions.account);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const links = String(d.get('links') ?? '').trim();
    const note = String(d.get('note') ?? '').trim();
    if (!links && !note) return;
    setState('sending');
    const message = `Inspiracja (strony, które się podobają): ${links || '—'}${note ? `\nUwagi: ${note}` : ''}`;
    const r = await actions.ask(message, known ? null : String(d.get('contact') ?? '').trim());
    setState(r.ok ? 'sent' : 'error');
    if (r.ok) actions.track('inquiry_sent', { source: 'inspiration', placement });
  };

  if (state === 'sent') {
    return (
      <p role="status" className={s.sent}>
        <Check size={18} aria-hidden="true" />Dziękujemy. Uwzględnimy je przy projekcie i odezwiemy się e-mailem{actions.inviteEmail ? ` na ${actions.inviteEmail}` : ''}.
      </p>
    );
  }
  return (
    <form onSubmit={submit} className={s.inspo}>
      <p className={s.inspoTitle}><Link2 size={18} aria-hidden="true" />Podoba Ci się czyjaś strona?</p>
      <p className={s.inspoText}>Wklej link albo kilka linków. Weźmiemy z nich kierunek: kolory, układ, zdjęcia, w ramach wybranego pakietu.</p>
      <label><span className={s.label}>Linki do stron</span>
        <input className={s.field} name="links" inputMode="url" placeholder="np. strona konkurencji albo dowolna, która Ci się podoba" />
      </label>
      <label><span className={s.label}>Co chcesz inaczej? (opcjonalnie)</span>
        <input className={s.field} name="note" placeholder="np. jaśniejsze kolory, zdjęcia moich realizacji" />
      </label>
      {!known && <label><span className={s.label}>E-mail lub telefon do odpowiedzi</span><input className={s.field} name="contact" required autoComplete="email" /></label>}
      <button type="submit" className={s.ghost} disabled={state === 'sending'}>{state === 'sending' ? 'Wysyłamy…' : 'Wyślij inspirację'}</button>
      {state === 'error' && <p role="alert" className={s.err}>Nie udało się wysłać. Spróbuj ponownie.</p>}
    </form>
  );
}
