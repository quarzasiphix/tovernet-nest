'use client';

import { useState, type FormEvent } from 'react';
import { publicAction } from '@/lib/tovernet/api';
import { track } from '@/lib/tovernet/analytics';

export default function InquiryForm({ source, intro, onSent }: { source: string; intro: string; onSent?: () => void }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('sending');
    try {
      await publicAction('tovernetLead.submit', {
        source,
        contactName: String(f.get('name') ?? ''),
        email: String(f.get('email') ?? ''),
        phone: String(f.get('phone') ?? ''),
        notes: String(f.get('message') ?? '') || intro,
      });
      setState('sent');
      track('inquiry_sent', { source: source.startsWith('demo:') ? 'offer' : source });
      onSent?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się wysłać.');
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <p role="status" className="rounded-lg bg-emerald-50 p-5 text-emerald-900">
        Dziękujemy. Odezwiemy się w sprawie tego zapytania i niczego więcej nie wyślemy bez Twojej zgody.
      </p>
    );
  }

  const field = 'w-full rounded-none border border-[#15161A] bg-white px-4 py-3 text-[#15161A] focus:border-slate-900 focus:outline-none';
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm font-medium text-[#5A5C60]">Imię i nazwisko
        <input name="name" required autoComplete="name" className={`mt-1 ${field}`} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#5A5C60]">E-mail
          <input name="email" type="email" required autoComplete="email" className={`mt-1 ${field}`} />
        </label>
        <label className="block text-sm font-medium text-[#5A5C60]">Telefon (opcjonalnie)
          <input name="phone" type="tel" autoComplete="tel" className={`mt-1 ${field}`} />
        </label>
      </div>
      <label className="block text-sm font-medium text-[#5A5C60]">Wiadomość (opcjonalnie)
        <textarea name="message" rows={3} className={`mt-1 ${field}`} />
      </label>
      {state === 'error' && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button disabled={state === 'sending'} className="w-full rounded-none bg-[#15161A] px-6 py-4 font-semibold text-white hover:bg-[#2536C4] disabled:opacity-50">
        {state === 'sending' ? 'Wysyłanie…' : 'Wyślij zapytanie'}
      </button>
      <p className="text-xs text-[#5A5C60]">
        Dane wykorzystamy do odpowiedzi na to zapytanie. Administrator: Tovernet sp. z o.o.{' '}
        <a href="/pl/polityka-prywatnosci/" className="underline">Polityka prywatności</a>.
      </p>
    </form>
  );
}
