'use client';

import { useState, type FormEvent } from 'react';
import { publicAction } from '@/lib/tovernet/api';
import { track } from '@/lib/tovernet/analytics';

/**
 * Message box on a personalised offer. Visitors from our e-mail only type a message:
 * the server takes the contact from the lead we wrote to. From a letter (no e-mail on
 * file) or if the server has none, it also asks for an e-mail or phone.
 */
export default function OfferMessageForm({ publicId, personalLink, onSent }: { publicId: string; personalLink: boolean; onSent?: () => void }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [needContact, setNeedContact] = useState(!personalLink);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const contact = String(f.get('contact') ?? '').trim();
    setState('sending');
    try {
      await publicAction('tovernetLead.submit', {
        source: `demo:${publicId}`,
        notes: String(f.get('message') ?? '').trim(),
        ...(contact.includes('@') ? { email: contact } : contact ? { phone: contact } : {}),
      });
      setState('sent');
      track('inquiry_sent', { source: 'offer' });
      onSent?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (/contact method/i.test(message)) {
        setNeedContact(true);
        setError('Podaj e-mail lub telefon, żebyśmy mogli odpowiedzieć.');
      } else {
        setError(message || 'Nie udało się wysłać.');
      }
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <p role="status" className="rounded-lg bg-emerald-50 p-5 text-emerald-900">
        Dziękujemy, wiadomość dotarła. Odpowiemy {needContact ? 'na podany kontakt' : 'na adres, na który wysłaliśmy ofertę'}.
      </p>
    );
  }

  const field = 'w-full rounded-none border border-[#15161A] bg-white px-4 py-3 text-[#15161A] focus:border-[#2536C4] focus:outline-none';
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm font-medium text-[#5A5C60]">Twoja wiadomość
        <textarea name="message" required rows={4} className={`mt-1 ${field}`} placeholder="Np. czy da się dodać galerię realizacji? Kiedy możecie zacząć?" />
      </label>
      {needContact && (
        <label className="block text-sm font-medium text-[#5A5C60]">E-mail lub telefon
          <input name="contact" required autoComplete="email" className={`mt-1 ${field}`} />
        </label>
      )}
      {state === 'error' && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button disabled={state === 'sending'} className="w-full rounded-none bg-[#15161A] px-6 py-4 font-semibold text-white hover:bg-[#2536C4] disabled:opacity-50">
        {state === 'sending' ? 'Wysyłanie…' : 'Wyślij wiadomość'}
      </button>
      <p className="text-xs text-[#5A5C60]">
        Odpowiemy tylko na tę wiadomość. Administrator: Tovernet sp. z o.o.{' '}
        <a href="/pl/polityka-prywatnosci/" className="underline">Polityka prywatności</a>.
      </p>
    </form>
  );
}
