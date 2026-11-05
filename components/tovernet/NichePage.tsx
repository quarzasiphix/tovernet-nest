'use client';

import ConceptSite from './ConceptSite';
import InquiryForm from './InquiryForm';
import OfferGate from './OfferGate';
import { usePersonalOffer } from './usePersonalOffer';
import { NICHES, NICHE_BY_KEY, type NicheKey } from '@/lib/tovernet/niches';
import { brandFonts, TOVERNET_PHONE } from '@/lib/tovernet/brand';
import s from './brand.module.css';
import { track } from '@/lib/tovernet/analytics';
import { useEffect } from 'react';
import OfferLoader, { OFFER_PRELOAD_SCRIPT } from './OfferLoader';
import { INSTALMENTS_MARKETING, MARKETING_START } from '@/lib/tovernet/payments';

import { price as zl } from './studio/motion';
import AccountLink from './AccountLink';
import l from './loader.module.css';

/**
 * Niche landing page. The static HTML is the generic, indexable page with a sample
 * company. Opened from a letter or e-mail (fragment with a demo id), the same URL turns
 * into that company's personalised concept and pricing.
 */
export default function NichePage({ nicheKey }: { nicheKey: NicheKey }) {
  const niche = NICHE_BY_KEY[nicheKey];
  const offer = usePersonalOffer();
  // Offer link that failed: drop the pre-paint flag so the generic page and its notice show.
  useEffect(() => {
    if (offer.status === 'missing' || offer.status === 'error') document.documentElement.classList.remove('tv-offer');
  }, [offer.status]);
  if (offer.status === 'ready' && offer.demo) return <OfferGate demo={offer.demo} track={offer.track} personalLink={offer.personalLink} />;
  if (offer.status === 'loading') return <OfferLoader />;

  const t = { bg: '#F1F2ED', surface: '#FAFAF7', ink: '#15161A', muted: '#5A5C60', accent: '#15161A', onAccent: '#FAFAF7', line: '#C8C9C2' };
  const others = NICHES.filter((n) => n.key !== niche.key);

  return (
    <>
    <script dangerouslySetInnerHTML={{ __html: OFFER_PRELOAD_SCRIPT }} />
    <OfferLoader className={l.pre} />
    <main lang="pl" className={`${brandFonts} ${s.tv} ${l.generic}`}>
      {(offer.status === 'missing' || offer.status === 'error') && (
        <div role="alert" className="bg-amber-100 px-5 py-3 text-center text-sm text-amber-900">
          {offer.status === 'error' ? 'Nie udało się załadować Twojego konceptu. Odśwież stronę za chwilę.' : 'Ten koncept wygasł albo został usunięty. Poniżej zobaczysz przykład, a o nowy możesz zapytać w formularzu.'}
        </div>
      )}

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <a href="/pl/" className={s.word}>tovernet</a>
        <span className="flex items-center gap-5">
        <AccountLink className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline" />
        <a href="#zapytanie" onClick={() => track('cta_clicked', { placement: 'landing_header', page: niche.key })}
           style={{ background: t.accent, color: t.onAccent }} className="px-4 py-2 text-sm font-bold">Zapytaj o wycenę</a>
        </span>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:pt-16">
        <p className={`${s.l} mb-4`}>Strony internetowe · {niche.label}</p>
        <h1 className={`${s.h2} max-w-4xl`}>{niche.h1}</h1>
        <p style={{ color: t.muted }} className="mt-6 max-w-2xl text-lg leading-relaxed">{niche.intro}</p>
        {INSTALMENTS_MARKETING && (
          <p style={{ borderColor: t.ink }} className="mt-6 inline-block max-w-2xl border-l-4 pl-4 text-lg leading-relaxed">
            <b>Zacznij od {zl(MARKETING_START.upfront)}.</b> Resztę płacisz w miesięcznych ratach, bez odsetek. Strona razem od {zl(MARKETING_START.total)}.
          </p>
        )}
      </section>

      <section aria-label="Przykładowa strona" className="mx-auto max-w-6xl px-0 sm:px-5">
        <p style={{ color: t.muted }} className="mb-3 px-5 text-sm sm:px-0">Przykład z fikcyjną firmą:</p>
        <div className="overflow-clip" style={{ boxShadow: `0 0 0 1px ${t.ink}` }}>
          <ConceptSite company={{ ...niche.sample, krs: null }} variant={niche.variant} embedded />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight md:text-4xl">Co ma znaczenie na takiej stronie</h2>
        <div className="grid gap-px md:grid-cols-2" style={{ background: t.line }}>
          {niche.needs.map(([title, text]) => (
            <div key={title} style={{ background: t.bg }} className="p-6 md:p-8">
              <h3 className="text-xl font-bold">{title}</h3>
              <p style={{ color: t.muted }} className="mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: t.surface }}>
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight">Pytania</h2>
          {niche.faq.map(([q, a]) => (
            <details key={q} className="border-b py-4" style={{ borderColor: t.line }}>
              <summary className="cursor-pointer text-lg font-semibold">{q}</summary>
              <p style={{ color: t.muted }} className="mt-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="zapytanie" style={{ background: t.surface, borderTop: `1px solid ${t.ink}` }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Zapytaj o wycenę</h2>
            <p className="mt-4 text-lg text-slate-700">Napisz, czym zajmuje się Twoja firma. Odpowiemy z propozycją zakresu i ceną. Nie obiecujemy pozycji w Google ani liczby zapytań, bo na to nie mamy pełnego wpływu.</p>
          </div>
          <div className={s.box}>
            <InquiryForm source={`landing:${niche.key}`} intro={`Zapytanie ze strony: ${niche.label}`} />
          </div>
        </div>
      </section>

      <nav aria-label="Inne branże" className="mx-auto max-w-6xl px-5 py-10 text-sm">
        <p style={{ color: t.muted }} className="mb-3">Strony dla innych branż:</p>
        <ul className="flex flex-wrap gap-3">
          {others.map((n) => <li key={n.key}><a href={n.path} className="underline">{n.label}</a></li>)}
        </ul>
      </nav>

      <footer className="mx-auto max-w-6xl px-5 pb-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-t pt-6" style={{ borderColor: t.ink }}>
          <span className={s.word}>tovernet</span>
          <p className="text-lg">Masz pytania? Zadzwoń, odbieramy całą dobę: <a href={TOVERNET_PHONE.href} className="whitespace-nowrap font-bold underline">{TOVERNET_PHONE.label}</a></p>
        </div>
      </footer>
    </main>
    </>
  );
}
