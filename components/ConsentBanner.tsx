'use client';

import { useEffect, useState } from 'react';
import { CONSENT_OPEN_EVENT, readConsent, saveConsent } from '@/lib/consent';

// Two equal choices, nothing pre-ticked, no analytics until "Zgadzam się".
export default function ConsentBanner({ initiallyOpen }: { initiallyOpen: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (initiallyOpen) setOpen(true); }, [initiallyOpen]);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, show);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, show);
  }, []);
  if (!open) return null;

  const choose = (analytics: boolean) => { saveConsent(analytics); setOpen(false); };
  const current = typeof window !== 'undefined' ? readConsent() : null;

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title"
         className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-slate-900/95 p-4 sm:p-5 text-sm text-gray-300 shadow-2xl backdrop-blur">
        <p id="consent-title" className="font-semibold text-white mb-1">Statystyki odwiedzin</p>
        <p className="mb-3 leading-relaxed">
          Za Twoją zgodą używamy PostHog (serwery w UE), żeby liczyć odwiedziny i sprawdzać, co na stronie działa.
          Na stronach ofert, zamówienia i panelu klienta nie nagrywamy sesji. Bez zgody strona działa tak samo.
          Zgodę zmienisz w każdej chwili linkiem „Ustawienia cookie” w stopce.{' '}
          <a href="/pl/polityka-prywatnosci/" className="underline hover:text-white">Polityka prywatności</a>
          {current && <span className="block mt-1 text-gray-500">Obecny wybór: {current.analytics ? 'zgoda na statystyki' : 'tylko niezbędne'}.</span>}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" onClick={() => choose(true)} className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-semibold text-white hover:bg-white/20">Zgadzam się</button>
          <button type="button" onClick={() => choose(false)} className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-semibold text-white hover:bg-white/20">Tylko niezbędne</button>
        </div>
      </div>
    </div>
  );
}
