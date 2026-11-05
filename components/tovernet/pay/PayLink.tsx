'use client';

// /platnosc/#<slug>: pay one Tovernet charge (instalment or plan month) from the e-mail link,
// without logging in. The slug is the KsięgaI share link of the charge's invoice; the server
// decides the amount (19-instalments.md §4).

import { useEffect, useState } from 'react';
import { ArrowRight, Check, FileText } from 'lucide-react';
import { publicAction } from '@/lib/tovernet/api';
import { track } from '@/lib/tovernet/analytics';
import { plDate } from '@/lib/tovernet/payments';
import PaymentForm, { paymentMessage } from './PaymentForm';
import p from './pay.module.css';

type Charge = {
  label: string; kind: 'instalment' | 'plan' | 'payoff'; amountMinor: number; currency: string; dueDate: string;
  invoiceNumber: string | null; company: string; status: 'invoiced' | 'paid'; paidAt: string | null; email: string | null;
};

const zl = (minor: number) => `${(minor / 100).toLocaleString('pl-PL', { maximumFractionDigits: 2 }).replace(/ /g, ' ')} zł`;
const SLUG_RE = /^tn-[0-9a-f]{32}$/;

export default function PayLink() {
  const [slug, setSlug] = useState<string | null>(null);
  const [charge, setCharge] = useState<Charge | null>(null);
  const [state, setState] = useState<'loading' | 'missing' | 'ready' | 'confirming' | 'paid' | 'pending'>('loading');
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const s = window.location.hash.replace(/^#/, '');
    if (!SLUG_RE.test(s)) { setState('missing'); return; }
    setSlug(s);
    (async () => {
      try {
        const { charge: c } = await publicAction<{ charge: Charge }>('tovernetPay.get', { slug: s });
        setCharge(c);
        // Back from a redirect-based confirmation (rare): Stripe appends the PaymentIntent.
        const pi = new URLSearchParams(window.location.search).get('payment_intent');
        if (c.status === 'paid') { setState('paid'); return; }
        if (pi) { await confirm(pi); return; }
        setState('ready');
        track('pay_link_opened', { kind: c.kind, amount: c.amountMinor / 100 });
        const r = await publicAction<{ clientSecret: string }>('tovernetPay.intent', { slug: s });
        setSecret(r.clientSecret);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        if (/already_paid/.test(msg)) { setState('paid'); return; }
        if (/payment_processing/.test(msg)) { setState('pending'); return; }
        if (/not_found/i.test(msg)) { setState('missing'); return; }
        setError('Nie udało się przygotować płatności. Odśwież stronę za chwilę.');
        setState('ready');
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const confirm = async (piId: string) => {
    setState('confirming');
    for (let i = 0; i < 8; i++) {
      try {
        const r = await publicAction<{ paymentStatus: string; settled: string | null; error: string | null }>('tovernetPay.confirm', { paymentIntentId: piId });
        if (r.paymentStatus === 'succeeded') { setState('paid'); track('payment_succeeded', { kind: charge?.kind, source: 'pay_link' }); return; }
        if (r.paymentStatus === 'requires_payment_method' || r.paymentStatus === 'canceled') {
          setError(paymentMessage(r.error)); setFormKey((k) => k + 1); setState('ready');
          track('payment_failed', { kind: charge?.kind, source: 'pay_link', reason: r.error });
          return;
        }
      } catch { /* retry */ }
      await new Promise((res) => setTimeout(res, i < 3 ? 1500 : 3000));
    }
    setState('pending');
  };

  const overdue = charge && charge.status !== 'paid' && new Date(`${charge.dueDate}T23:59:59`) < new Date();

  return (
    <main className={`${p.theme} ${p.page}`}>
      <div className={p.card}>
        <div className={p.side}>
          <p className={p.brand}><i aria-hidden="true" />Tovernet</p>
          {state === 'missing' ? (
            <>
              <h1 className={p.title}>Ten link do płatności nie działa</h1>
              <p>Mógł zostać skopiowany niecały albo płatność została anulowana. Zaloguj się do panelu klienta, tam widzisz wszystkie płatności.</p>
              <p style={{ marginTop: 18 }}><a className={p.ghost} href="/panel/?widok=platnosci">Otwórz panel klienta<ArrowRight size={16} aria-hidden="true" /></a></p>
            </>
          ) : charge ? (
            <>
              <p className={p.kicker}>{charge.company}</p>
              <h1 className={p.title}>{charge.label}</h1>
              <p className={p.todayLabel}>Do zapłaty</p>
              <p className={p.today}>{zl(charge.amountMinor)}</p>
              <ul className={p.lines}>
                <li><span>Termin</span><span style={overdue ? { color: 'var(--warn)' } : undefined}>{plDate(charge.dueDate)}{overdue ? ' (minął)' : ''}</span></li>
                {charge.invoiceNumber && <li><span>Faktura</span><span>{charge.invoiceNumber}</span></li>}
              </ul>
              <div className={p.future}>
                <p><FileText size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />Fakturę i harmonogram wszystkich płatności znajdziesz w panelu klienta.</p>
                {charge.kind !== 'payoff' && <p>Nie chcesz pamiętać o kolejnych płatnościach? W panelu włączysz automatyczną płatność kartą. Wyłączysz ją w każdej chwili.</p>}
              </div>
            </>
          ) : (
            <p className={p.status}><span className={p.spin} aria-hidden="true" /></p>
          )}
        </div>
        <div className={p.main} aria-live="polite">
          {state === 'loading' && <div className={p.status}><span className={p.spin} aria-hidden="true" /><p>Wczytujemy płatność…</p></div>}
          {state === 'ready' && charge && (
            <>
              {error && <p className={p.error} role="alert" style={{ marginBottom: 16 }}>{error}</p>}
              {secret
                ? <PaymentForm key={formKey} clientSecret={secret} submitLabel={`Zapłać ${zl(charge.amountMinor)}`}
                               returnUrl={`${window.location.origin}/platnosc/${window.location.hash}`}
                               onMethod={(type) => track('payment_method_selected', { method: type, source: 'pay_link' })}
                               email={charge.email} onDone={(id) => void confirm(id)} />
                : !error && <div className={p.status}><span className={p.spin} aria-hidden="true" /><p>Przygotowujemy bezpieczną płatność…</p></div>}
            </>
          )}
          {state === 'confirming' && (
            <div className={p.status} role="status"><span className={p.pulse}><span className={p.spin} aria-hidden="true" /></span><h2>Potwierdzamy płatność</h2><p>To trwa zwykle kilka sekund.</p></div>
          )}
          {state === 'pending' && (
            <div className={p.status} role="status"><h2>Płatność w drodze</h2><p>Bank jeszcze ją potwierdza. Gdy dotrze, zobaczysz ją w panelu klienta jako opłaconą. Nie płać drugi raz.</p>
              <a className={p.ghost} href="/panel/?widok=platnosci">Otwórz panel klienta<ArrowRight size={16} aria-hidden="true" /></a></div>
          )}
          {state === 'paid' && (
            <div className={p.status} role="status">
              <svg className={p.ring} viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="44" /><path d="M30 49 l12 12 l24 -26" /></svg>
              <h2>Opłacone. Dziękujemy.</h2>
              <p>Potwierdzenie i fakturę znajdziesz w panelu klienta.</p>
              <a className={p.ghost} href="/panel/?widok=platnosci"><Check size={16} aria-hidden="true" />Otwórz panel klienta</a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
