'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SELLER_BLOCK } from '@/lib/seller';
import { ArrowRight, Check } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentName } from '@/lib/tovernet/construction';
import { TOVERNET_PHONE } from '@/lib/tovernet/brand';
import { STAGES, defaultCart, stageFromQuery, type Cart, type Stage } from '@/lib/tovernet/funnel';
import type { JourneyActions } from '../funnel/Journey';
import { studioFonts } from './fonts';
import Welcome from './Welcome';
import Concept from './Concept';
import Offer from './Offer';
import Checkout from './Checkout';
import s from './studio.module.css';

/**
 * Redesigned four-stage journey (owner review). Same contract as funnel/Journey.tsx:
 * stage in ?krok=, the demo id in the fragment, the same JourneyActions and the same
 * analytics events. Only presentation and copy differ.
 */
export default function StudioJourney({ demo, actions }: { demo: PublicDemo; actions: JourneyActions }) {
  const [stage, setStage] = useState<Stage>('przywitanie');
  const [cart, setCart] = useState<Cart>(() => defaultCart(demo));
  const stageRef = useRef<Stage>('przywitanie');
  const rootRef = useRef<HTMLDivElement>(null);
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

  // Scroll reveals. Content is hidden only once this has run, so nothing stays invisible
  // without JavaScript, and never with reduced motion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (still || typeof IntersectionObserver === 'undefined') { els.forEach((el) => { el.dataset.shown = ''; }); return; }
    root.dataset.motion = '';
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      (en.target as HTMLElement).dataset.shown = '';
      io.unobserve(en.target);
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [stage]);

  const go = useCallback((next: Stage, via?: string) => {
    if (next === stageRef.current) return;
    const from = stageRef.current;
    const q = new URLSearchParams(window.location.search);
    const query = STAGES.find((x) => x.key === next)?.query;
    if (query) q.set('krok', query); else q.delete('krok');
    const qs = q.toString();
    window.history.pushState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`);
    // Skipping only the optional example (Oferta -> Zamówienie) is the normal path, not a skip.
    const skipped = STAGES.slice(STAGES.findIndex((x) => x.key === from) + 1, STAGES.findIndex((x) => x.key === next)).filter((x) => x.key !== 'koncept');
    if (via === 'bar' && skipped.length > 0) track('offer_skipped_to', { stage: next });
    if (next === 'oferta') track('pricing_viewed');
    track('stage_viewed', { stage: next, from });
    stageRef.current = next;
    setStage(next);
    window.scrollTo({ top: 0 });
    // Move focus to the new stage for keyboard and screen-reader users.
    requestAnimationFrame(() => document.getElementById('etap')?.focus({ preventScroll: true }));
  }, [track]);

  const index = STAGES.findIndex((x) => x.key === stage);
  const action = stage === 'koncept'
    ? { label: 'Przejdź do zamówienia', short: 'Zamów', to: 'zamowienie' as Stage, placement: 'bar_concept' }
    : stage === 'oferta'
      ? { label: 'Przejdź do zamówienia', short: 'Zamów', to: 'zamowienie' as Stage, placement: 'bar_offer' }
      : null;

  return (
    <div ref={rootRef} lang="pl" data-stage={stage} className={`${studioFonts} ${s.root}`}>
      <div className={s.ambient} aria-hidden="true"><i className={s.o1} /><i className={s.o2} /><i className={s.grid} /></div>

      <header className={s.bar}>
        <a href="/pl/" className={s.logo}><i aria-hidden="true" />tovernet</a>
        <nav aria-label="Etapy" className={s.stepsNav}>
          <ol className={s.steps}>
            {STAGES.map((x, i) => (
              <li key={x.key} className={`${i === index ? s.on : ''} ${i < index ? s.done : ''}`}>
                <button type="button" onClick={() => go(x.key, 'bar')} aria-current={i === index ? 'step' : undefined}>
                  <span className={s.stepDot}>{i < index ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : i + 1}</span>
                  <span className={s.stepLabel}>{x.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className={s.stepsPhone} aria-hidden="true"><span>Krok {index + 1} z 4</span><b>{STAGES[index].label}</b></p>
        </nav>
        {action ? (
          <button type="button" className={s.barGo} onClick={() => { track('cta_clicked', { placement: action.placement }); go(action.to, 'bar'); }}>
            <span className={s.long}>{action.label}</span><span className={s.short}>{action.short}</span><ArrowRight size={16} aria-hidden="true" />
          </button>
        ) : <span className={s.barSpacer} />}
        <span className={s.barLine} style={{ width: `${(index / (STAGES.length - 1)) * 100}%` }} aria-hidden="true" />
      </header>

      <main id="etap" key={stage} tabIndex={-1} className={s.stage} aria-label={`${STAGES[index].label}: ${name}`}>
        {stage === 'przywitanie' && <Welcome demo={demo} actions={actions} onContinue={() => go('oferta')} onExample={() => { track('cta_clicked', { placement: 'intro_example' }); go('koncept'); }} />}
        {stage === 'koncept' && <Concept demo={demo} track={track} onOrder={() => go('zamowienie')} onOffer={() => go('oferta')} />}
        {stage === 'oferta' && <Offer demo={demo} cart={cart} setCart={setCart} actions={actions} onOrder={() => go('zamowienie')} onConcept={() => go('koncept')} />}
        {stage === 'zamowienie' && <Checkout demo={demo} cart={cart} actions={actions} onChange={() => go('oferta')} />}
      </main>

      <footer className={s.foot}>
        <div className={s.footTop}>
          <span className={s.logo}><i aria-hidden="true" />tovernet</span>
          <p>Masz pytania? Zadzwoń, odbieramy całą dobę: <a href={TOVERNET_PHONE.href}>{TOVERNET_PHONE.label}</a></p>
        </div>
        <p>Dane Twojej firmy pochodzą z publicznego rejestru KRS. Nie chcesz, żebyśmy przetwarzali je w celach marketingowych?
          {' '}Napisz na <a href="mailto:contact@tovernet.online">contact@tovernet.online</a>.</p>
        <p>{SELLER_BLOCK}</p>
        <p><a href="/pl/regulamin/">Regulamin</a> · <a href="/pl/polityka-prywatnosci/">Polityka prywatności</a> · <a href="/pl/umowa-powierzenia/">Umowa powierzenia</a></p>
      </footer>
    </div>
  );
}
