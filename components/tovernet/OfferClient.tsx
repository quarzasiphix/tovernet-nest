'use client';

import { useEffect, useState } from 'react';
import { nicheForVariant } from '@/lib/tovernet/niches';
import { usePersonalOffer } from './usePersonalOffer';
import OfferLoader from './OfferLoader';

// Old and fallback links: /oferta/#<demo id>. Moves to the niche page for the demo's
// template, keeping ?t= and the fragment (the invite token is already saved in this browser).
export default function OfferClient() {
  const { status, demo } = usePersonalOffer();
  // Before the fragment is read, assume an offer link: never flash "not available".
  const [noLink, setNoLink] = useState(false);
  useEffect(() => { setNoLink(!/^#[0-9a-f]{36}/.test(window.location.hash)); }, []);

  useEffect(() => {
    if (status === 'ready' && demo) {
      window.location.replace(`${nicheForVariant(demo.config.variant).path}${window.location.search}${window.location.hash}`);
    }
  }, [status, demo]);

  if (status === 'missing' || status === 'error' || (status === 'none' && noLink)) {
    return (
      <main className="grid min-h-screen place-items-center bg-white px-5 text-center text-slate-900">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold">{status === 'error' ? 'Nie udało się załadować projektu' : 'Ten projekt nie jest już dostępny'}</h1>
          <p className="mt-3 text-slate-600">
            {status === 'error' ? 'Odśwież stronę za chwilę.' : 'Link wygasł albo projekt został usunięty.'} Możesz też{' '}
            <a className="underline" href="/strony-dla-firm-budowlanych/">zobaczyć naszą ofertę</a>.
          </p>
        </div>
      </main>
    );
  }
  return <OfferLoader />;
}
