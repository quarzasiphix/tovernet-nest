'use client';

import { useEffect, useState } from 'react';
import InquiryForm from './InquiryForm';
import { brandFonts, TOVERNET_PHONE } from '@/lib/tovernet/brand';
import { track } from '@/lib/tovernet/analytics';
import s from './brand.module.css';

const NEEDS: [string, string][] = [
  ['What you do, on the first screen', 'Services, area and who you work for are visible before anyone scrolls, so the right customers stay and the wrong ones do not call.'],
  ['Requests with the details you need', 'The contact form asks the questions you would ask on the phone, so you can quote without a back-and-forth.'],
  ['Built for phones', 'Most visitors arrive on a phone. Your number and the form are always one tap away.'],
  ['Yours to keep', 'The domain is registered to your company and you can download the site files at any time.'],
];

const STEPS: [string, string][] = [
  ['Tell us about your company', 'A few sentences in the form below: what you do, where, and what the site should achieve.'],
  ['Scope and quote', 'We reply with a proposed scope, timeline and price for your company. No obligation.'],
  ['Build', 'We write the structure, design the pages and collect your texts and photos with you.'],
  ['Launch and care', 'We publish the site on your domain and can keep it updated afterwards.'],
];

const FAQ: [string, string][] = [
  ['How much does a website cost?', 'It depends on the number of pages and features. We quote per company after reading your request, before you commit to anything.'],
  ['Which language will the site be in?', 'English by default. If you need another language, say so in your request and we will confirm it in the quote.'],
  ['Will the domain and the site be mine?', 'Yes. The domain is registered to your company, and the texts and design are transferred to you once the order is paid.'],
  ['Do you promise a position in Google?', 'No. We build the site to be technically ready for search engines, but rankings depend on many factors outside our control.'],
  ['Do I need texts and photos ready?', 'No. We help you collect them with a short questionnaire, and photos can be sent from your phone.'],
];

/**
 * English offer page for companies outside Poland. Static copy only (no KRS demo, no PLN
 * checkout); the inquiry goes to tovernetLead.submit with source `landing:intl`, plus the
 * company id when the visitor came from the accounting app.
 */
export default function IntlOfferPage() {
  const t = { bg: '#F1F2ED', surface: '#FAFAF7', ink: '#15161A', muted: '#5A5C60', line: '#C8C9C2' };

  const [source, setSource] = useState('landing:intl');

  // Visitors from the accounting app arrive with utm_source and the company's jurisdiction.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSource(['landing:intl', params.get('utm_source'), params.get('country')].filter(Boolean).join(':').slice(0, 80));
    track('intl_offer_viewed', {
      utm_source: params.get('utm_source'),
      utm_campaign: params.get('utm_campaign'),
      country: params.get('country'),
    });
  }, []);

  return (
    <main lang="en" className={`${brandFonts} ${s.tv}`}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <a href="/en/" className={s.word}>tovernet</a>
        <a
          href="#quote"
          onClick={() => track('cta_clicked', { placement: 'landing_header', page: 'intl' })}
          style={{ background: t.ink, color: t.surface }}
          className="px-4 py-2 text-sm font-bold"
        >
          Ask for a quote
        </a>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:pt-16">
        <p className={`${s.l} mb-4`}>Websites · Companies</p>
        <h1 className={`${s.h2} max-w-4xl`}>A company website your customers understand in five seconds</h1>
        <p style={{ color: t.muted }} className="mt-6 max-w-2xl text-lg leading-relaxed">
          What you do, where you work and how to reach you, on a fast site that works on every phone. Tell us about your
          company and we reply with a scope and a price.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight md:text-4xl">What matters on a company website</h2>
        <div className="grid gap-px md:grid-cols-2" style={{ background: t.line }}>
          {NEEDS.map(([title, text]) => (
            <div key={title} style={{ background: t.bg }} className="p-6 md:p-8">
              <h3 className="text-xl font-bold">{title}</h3>
              <p style={{ color: t.muted }} className="mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: t.surface }}>
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="mb-10 text-3xl font-extrabold tracking-tight md:text-4xl">How it works</h2>
          <ol className="grid gap-8 md:grid-cols-4">
            {STEPS.map(([title, text], i) => (
              <li key={title}>
                <span className={s.l}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-lg font-bold">{title}</h3>
                <p style={{ color: t.muted }} className="mt-2 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight">Questions</h2>
        {FAQ.map(([q, a]) => (
          <details key={q} className="border-b py-4" style={{ borderColor: t.line }}>
            <summary className="cursor-pointer text-lg font-semibold">{q}</summary>
            <p style={{ color: t.muted }} className="mt-2 leading-relaxed">{a}</p>
          </details>
        ))}
      </section>

      <section id="quote" style={{ background: t.surface, borderTop: `1px solid ${t.ink}` }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Ask for a quote</h2>
            <p className="mt-4 text-lg text-slate-700">
              Tell us what your company does and what the site should achieve. We reply with a proposed scope and price.
              We do not promise Google rankings or a number of enquiries, because those are not fully in our control.
            </p>
          </div>
          <div className={s.box}>
            <InquiryForm locale="en" source={source} intro="Website request from the English offer page" />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 pb-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-t pt-6" style={{ borderColor: t.ink }}>
          <span className={s.word}>tovernet</span>
          <p className="text-lg">
            Questions? Call us:{' '}
            <a href={TOVERNET_PHONE.href} className="whitespace-nowrap font-bold underline">{TOVERNET_PHONE.label}</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
