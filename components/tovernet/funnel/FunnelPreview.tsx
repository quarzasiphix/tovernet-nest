'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Journey, { type JourneyActions, type Result } from './Journey';
import type { PublicDemo } from '@/lib/tovernet/api';
import { INVITE_EMAIL, SCENARIOS, TRADES, fixtureDemo, type Scenario, type Trade } from './fixture';
import { brandFonts } from '@/lib/tovernet/brand';
import f from './funnel.module.css';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Owner review of the proposed journey. Fixture data, simulated network: nothing is
 * created, sent or charged. The review panel switches scenarios and shows the events
 * the live page would send.
 */
/** `journey`: an alternative presentation with the same contract, e.g. the redesign at /podglad-sciezki/nowa/. */
export default function FunnelPreview({ journey: J = Journey }: { journey?: (p: { demo: PublicDemo; actions: JourneyActions }) => JSX.Element } = {}) {
  const [scenario, setScenario] = useState<Scenario>('invite');
  const [trade, setTrade] = useState<Trade>('elektryk');
  const [account, setAccount] = useState<string | null>(null);
  const [inviteUsed, setInviteUsed] = useState(false);
  const [payMode, setPayMode] = useState<'ok' | 'checkout_disabled'>('ok');
  const [events, setEvents] = useState<{ t: number; name: string; props: string }[]>([]);
  const [panel, setPanel] = useState(false);
  const [clean, setClean] = useState(false);
  const [run, setRun] = useState(0);
  const demo = useMemo(() => fixtureDemo(scenario, trade), [scenario, trade]);
  const t0 = useRef(Date.now());

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setClean(q.has('czysto'));
    if (q.get('branza') === 'wykonczenia') setTrade('wykonczenia');
  }, []);

  const inviteEmail = scenario !== 'view' && !inviteUsed ? INVITE_EMAIL : null;

  const actions: JourneyActions = {
    inviteEmail: account ? null : inviteEmail,
    knownEmail: !account && inviteUsed ? INVITE_EMAIL : null,
    account,
    track: (name, props = {}) => setEvents((e) => [...e.slice(-60), { t: Date.now() - t0.current, name: `tovernet_${name}`, props: JSON.stringify(props) }]),
    openWithAccount: async (): Promise<Result> => {
      // Live: registerWithInvite(), then tovernetOffer.claim with the invite token hash.
      await wait(700);
      setAccount(INVITE_EMAIL); setInviteUsed(true);
      setEvents((e) => [...e, { t: Date.now() - t0.current, name: '(serwer) konto + claim', props: '{"method":"invite"}' }]);
      return { ok: true };
    },
    sendCode: async () => { await wait(500); return { ok: true }; },
    verifyCode: async (email) => { await wait(500); setAccount(email); return { ok: true }; },
    signOut: () => setAccount(null),
    checkSignatory: async (name) => {
      await wait(400);
      return { ok: true, check: { status: /kowalsk/i.test(name) ? 'verified' : 'not_in_registry', scope: /kowalsk/i.test(name) ? 'alone' : 'power_of_attorney', method: 'preview', representation: 'KAŻDY Z CZŁONKÓW ZARZĄDU SAMODZIELNIE.' } };
    },
    pay: async (): Promise<Result> => {
      // Live: tovernetOffer.claim (idempotent), tovernetCheckout.create, redirect to Stripe.
      await wait(900);
      return payMode === 'ok' ? { ok: true } : { ok: false, code: payMode };
    },
    ask: async () => { await wait(600); return { ok: true }; },
  };

  const restart = (next: Scenario = scenario, nextTrade: Trade = trade) => {
    setScenario(next); setTrade(nextTrade); setAccount(null); setInviteUsed(false); setEvents([]); t0.current = Date.now();
    const q = new URLSearchParams();
    if (clean) q.set('czysto', '');
    if (nextTrade !== 'elektryk') q.set('branza', nextTrade);
    const qs = q.toString().replace('czysto=', 'czysto');
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''));
    setRun((r) => r + 1);
  };

  return (
    <>
      <J key={`${trade}-${scenario}-${run}`} demo={demo} actions={actions} />
      {!clean && (
        <div className={`${brandFonts} ${f.review}`}>
          {panel && (
            <div className={f.reviewPanel} role="dialog" aria-label="Podgląd ścieżki">
              <p className={f.reviewTitle}>Podgląd dla właściciela. Dane fikcyjne, nic nie jest wysyłane ani pobierane.</p>
              <fieldset>
                <legend>Branża</legend>
                {TRADES.map((t) => (
                  <label key={t.key}><input type="radio" name="tr" checked={trade === t.key} onChange={() => restart(scenario, t.key)} /><span><b>{t.label}</b></span></label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Scenariusz</legend>
                {SCENARIOS.map((s) => (
                  <label key={s.key}><input type="radio" name="sc" checked={scenario === s.key} onChange={() => restart(s.key)} /><span><b>{s.label}</b> {s.note}</span></label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Płatność</legend>
                <label><input type="radio" name="pm" checked={payMode === 'ok'} onChange={() => setPayMode('ok')} /><span>Udana (w prawdziwej ścieżce: Stripe)</span></label>
                <label><input type="radio" name="pm" checked={payMode === 'checkout_disabled'} onChange={() => setPayMode('checkout_disabled')} /><span>Wyłączona (<code>checkout_disabled</code>)</span></label>
              </fieldset>
              <p className={f.reviewState}>Konto: {account ?? 'brak'} · Zaproszenie: {inviteEmail ? 'ważne' : 'brak lub wykorzystane'}</p>
              <button type="button" onClick={() => restart()}>Zacznij od początku</button>
              <details>
                <summary>Zdarzenia PostHog ({events.length})</summary>
                <ol className={f.reviewLog}>
                  {events.slice().reverse().map((e, i) => <li key={i}><code>{(e.t / 1000).toFixed(1)}s</code> <b>{e.name}</b> <code>{e.props}</code></li>)}
                </ol>
              </details>
            </div>
          )}
          <button type="button" className={f.reviewToggle} aria-expanded={panel} onClick={() => setPanel(!panel)}>{panel ? 'Zamknij' : 'Podgląd'}</button>
        </div>
      )}
    </>
  );
}
