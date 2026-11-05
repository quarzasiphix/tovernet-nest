'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentName } from '@/lib/tovernet/construction';
import { brandFonts, TOVERNET_PHONE } from '@/lib/tovernet/brand';
import { STAGES, defaultCart, stageFromQuery, type Cart, type Stage } from '@/lib/tovernet/funnel';
import b from '../brand.module.css';
import f from './funnel.module.css';
import StageIntro from './StageIntro';
import StageConcept from './StageConcept';
import StageOffer from './StageOffer';
import StageCheckout from './StageCheckout';
import type { Capacity, Scope } from '@/lib/legal/versions';

export type Result = { ok: true } | { ok: false; code: string };

/** What the server created for the pay button: a PaymentIntent for Stripe's Payment Element. */
export type PaymentStart = {
  orderId: string;
  clientSecret: string;
  amountMinor: number;
  paymentOption: 'full' | 'instalments';
  instalments: { seq: number; amount_minor: number; due_date: string }[] | null;
};
export type PayResult = { ok: true; payment?: PaymentStart } | { ok: false; code: string };

/**
 * Everything the journey needs from the outside world. The preview passes simulated
 * versions; the live page binds them to the existing calls:
 * openWithAccount = registerWithInvite + tovernetOffer.claim, pay = claim + tovernetCheckout.create,
 * ask = tovernetLead.submit, track = lib/tovernet/analytics plus tovernetDemo.track.
 */
export type SignatoryCheck = {
  status: 'verified' | 'co_signatory_required' | 'poa_required' | 'not_in_registry' | 'staff_review';
  scope: Scope;
  method: string;
  representation?: string | null;
  organ?: string | null;
};

export type CheckoutOrder = {
  signatory: { name: string; capacity: Capacity };
  consents: { documents: boolean; authority: boolean; earlyStart: boolean };
  professional: 'yes' | 'no' | 'no_answer' | null;
};

export type JourneyActions = {
  /** Recipient of a valid personal invite, or null. */
  inviteEmail: string | null;
  /** The invite's address when it can no longer create the account (used, or the address already has one): sign in with a code, e-mail prefilled. */
  knownEmail?: string | null;
  /** Signed-in e-mail, or null. */
  account: string | null;
  openWithAccount: () => Promise<Result>;
  sendCode: (email: string) => Promise<Result>;
  verifyCode: (email: string, code: string) => Promise<Result>;
  signOut: () => void;
  /** Signatory, consents and the optional art. 7aa answer; documents are the current registry versions. */
  pay: (cart: Cart, order: CheckoutOrder) => Promise<PayResult>;
  /** After Stripe confirms in the browser: settle on the server and report the order state. */
  confirmPayment?: (orderId: string, paymentIntentId: string) => Promise<{ status: 'paid' | 'pending' | 'failed'; message?: string }>;
  /** "Kto podpisuje": name and capacity against KRS, before the order exists. */
  checkSignatory: (name: string, capacity: Capacity) => Promise<{ ok: boolean; check?: SignatoryCheck; code?: string }>;
  ask: (message: string, contact: string | null) => Promise<Result>;
  track: (event: string, props?: Record<string, unknown>) => void;
};

export default function Journey({ demo, actions }: { demo: PublicDemo; actions: JourneyActions }) {
  const [stage, setStage] = useState<Stage>('przywitanie');
  const [cart, setCart] = useState<Cart>(() => defaultCart(demo));
  const stageRef = useRef<Stage>('przywitanie');
  const name = presentName(demo.config.company.display_name);
  const { track } = actions;

  // Stage lives in ?krok= so back, forward and refresh keep the place. The fragment
  // (demo id) is never touched.
  useEffect(() => {
    const read = () => {
      const next = stageFromQuery(new URLSearchParams(window.location.search).get('krok'));
      track('stage_viewed', { stage: next, from: stageRef.current === next ? null : stageRef.current });
      stageRef.current = next;
      setStage(next);
    };
    read();
    if (stageRef.current === 'oferta') track('pricing_viewed');
    window.addEventListener('popstate', read);
    // In-page links inside a concept (#kontakt) would replace the #<demo id> fragment and
    // lose the offer on refresh. Scroll to the target instead.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const target = document.getElementById(a.getAttribute('href')!.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('popstate', read); document.removeEventListener('click', onClick); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const go = useCallback((next: Stage, via?: string) => {
    if (next === stageRef.current) return;
    const from = stageRef.current;
    const q = new URLSearchParams(window.location.search);
    const query = STAGES.find((s) => s.key === next)?.query;
    if (query) q.set('krok', query); else q.delete('krok');
    const qs = q.toString();
    window.history.pushState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`);
    if (via === 'bar' && STAGES.findIndex((s) => s.key === next) > STAGES.findIndex((s) => s.key === from) + 1) track('offer_skipped_to', { stage: next });
    if (next === 'oferta') track('pricing_viewed');
    track('stage_viewed', { stage: next, from });
    stageRef.current = next;
    setStage(next);
    window.scrollTo({ top: 0 });
    // Move focus to the new stage for keyboard and screen-reader users.
    requestAnimationFrame(() => document.getElementById('etap')?.focus({ preventScroll: true }));
  }, [track]);

  const index = STAGES.findIndex((s) => s.key === stage);
  const action = stage === 'koncept'
    ? { label: 'Przejdź do oferty', short: 'Oferta', to: 'oferta' as Stage, placement: 'bar_concept' }
    : stage === 'oferta'
      ? { label: 'Zamów', short: 'Zamów', to: 'zamowienie' as Stage, placement: 'bar_offer' }
      : null;

  return (
    <div lang="pl" className={`${brandFonts} ${b.tv} ${f.j}`}>
      <header className={f.bar}>
        <a href="/pl/" className={`${b.word} ${f.word}`}>tovernet</a>
        <nav aria-label="Etapy" className={f.stepsNav}>
          <ol className={f.steps}>
            {STAGES.map((s, i) => (
              <li key={s.key} className={`${i === index ? f.on : ''} ${i < index ? f.done : ''}`}>
                <button type="button" onClick={() => go(s.key, 'bar')} aria-current={i === index ? 'step' : undefined}>
                  <span className={f.num}>0{i + 1}</span>{s.label}
                </button>
              </li>
            ))}
          </ol>
          <p className={f.stepsPhone} aria-hidden="true"><span className={f.num}>{index + 1}/4</span> {STAGES[index].label}</p>
          <span className={f.progress} aria-hidden="true">{STAGES.map((s, i) => <i key={s.key} className={i <= index ? f.progressOn : ''} />)}</span>
        </nav>
        {action && (
          <button type="button" className={f.barGo} onClick={() => { track('cta_clicked', { placement: action.placement }); go(action.to, 'bar'); }}>
            <span className={f.long}>{action.label}</span><span className={f.short}>{action.short}</span><span aria-hidden="true"> →</span>
          </button>
        )}
      </header>

      <main id="etap" tabIndex={-1} className={f.stage} aria-label={`${STAGES[index].label}: ${name}`}>
        {stage === 'przywitanie' && <StageIntro demo={demo} actions={actions} onContinue={() => go('koncept')} onOffer={() => go('oferta')} />}
        {stage === 'koncept' && <StageConcept demo={demo} track={track} onOffer={() => go('oferta')} />}
        {stage === 'oferta' && <StageOffer demo={demo} cart={cart} setCart={setCart} actions={actions} onOrder={() => go('zamowienie')} onConcept={() => go('koncept')} />}
        {stage === 'zamowienie' && <StageCheckout demo={demo} cart={cart} actions={actions} onChange={() => go('oferta')} />}
      </main>

      <footer className={f.foot}>
        <div className={f.call}>
          <span className={b.word}>tovernet</span>
          <p>Masz pytania? Zadzwoń, odbieramy całą dobę: <a href={TOVERNET_PHONE.href}>{TOVERNET_PHONE.label}</a></p>
        </div>
        <p>Tovernet sp. z o.o., NIP 7322228540. Dane firmy pochodzą z publicznego rejestru KRS. Nie chcesz, żebyśmy przetwarzali te dane w celach marketingowych?
          {' '}Napisz na <a href="mailto:contact@tovernet.online">contact@tovernet.online</a>. <a href="/pl/polityka-prywatnosci/">Polityka prywatności</a>.</p>
      </footer>
    </div>
  );
}
