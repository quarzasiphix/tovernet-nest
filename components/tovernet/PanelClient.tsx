'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { authClient } from '@/lib/tovernet/supabase';
import { track } from '@/lib/tovernet/analytics';
import { brandFonts } from '@/lib/tovernet/brand';
import { SELLER_BLOCK } from '@/lib/seller';
import EmailAuth from './EmailAuth';
import PushCard from './panel/PushCard';
import { onForegroundPush, syncPush } from '@/lib/tovernet/push';
import PanelWorkspace from './panel/PanelWorkspace';
import { liveApi } from './panel/api';
import type { Overview } from './panel/types';
import p from './panel/panel.module.css';

/** /panel/: sign-in, the wait for a fresh payment, then the client workspace. */
export default function PanelClient() {
  const supabase = authClient();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [waitingFor, setWaitingFor] = useState<string | null>(null);
  const [waitExpired, setWaitExpired] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [paidSeen, setPaidSeen] = useState(false);
  const [hasOrder, setHasOrder] = useState(false);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    setWaitingFor(new URLSearchParams(window.location.search).get('zamowienie'));
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data: d }) => { setSession(d.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // One API object per user; it reads the current token, so refreshes do not reload views.
  const tokenRef = useRef('');
  tokenRef.current = session?.access_token ?? '';
  const userId = session?.user.id;
  const api = useMemo(() => (userId ? liveApi(() => tokenRef.current) : null), [userId]);
  const [tracked, setTracked] = useState(false);

  // Push: keep this browser's token current; while the panel is open a push reloads it.
  useEffect(() => {
    if (!userId) return;
    void syncPush(tokenRef.current);
    return onForegroundPush((m) => { setToast(m); setReloadKey((k) => k + 1); });
  }, [userId]);
  // A notification click while the panel is open: go to its link.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === 'tovernet-push-click' && typeof e.data.path === 'string' && e.data.path.startsWith('/panel')) {
        window.location.assign(e.data.path);
      }
    };
    navigator.serviceWorker.addEventListener('message', onMsg);
    return () => navigator.serviceWorker.removeEventListener('message', onMsg);
  }, []);

  const onOverview = useCallback((o: Overview) => {
    setHasOrder(o.orders.some((x) => x.status === 'paid' || x.status === 'payment_review'));
    if (!tracked) { setTracked(true); track('panel_viewed', { projects: o.projects.length, orders: o.orders.length }); }
    if (!waitingFor) return;
    const paid = o.orders.find((x) => x.id === waitingFor);
    if (paid) {
      setWaitingFor(null);
      setPaidSeen(true);
      window.history.replaceState(null, '', `/panel/${window.location.hash}`);
      // Client-side confirmation of the webhook-verified order, for funnel reporting.
      track('payment_confirmed', { order_id: paid.id, value: paid.total_gross_minor / 100, monthly_value: paid.recurring_gross_minor / 100, currency: 'PLN', requires_review: paid.requires_review });
    }
  }, [tracked, waitingFor]);

  // After Stripe: the order turns paid when the webhook lands, usually within seconds.
  useEffect(() => {
    if (!api || !waitingFor) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (tries > 20) { clearInterval(timer); setWaitExpired(true); track('payment_confirmation_slow', { order_id: waitingFor }); return; }
      setReloadKey((k) => k + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [api, waitingFor]);

  if (!ready || !supabase || !session || !api) {
    return (
      <main lang="pl" className={`${brandFonts} ${p.root}`}>
        <header className={p.bar}><a href="/pl/" className={p.word}>tovernet</a><div className={p.switch}><div className={p.switchBtn} style={{ cursor: 'default' }}><span><small>Tovernet</small><b>Panel klienta</b></span></div></div></header>
        {!ready ? <p className={p.muted} style={{ padding: 32 }}>Ładowanie…</p>
          : !supabase ? <p role="alert" style={{ padding: 32 }}>Panel nie jest jeszcze skonfigurowany.</p>
          : (
            <div className={p.signin}>
              <div className={p.signinCopy}>
                <span className={p.l}>Panel klienta</span>
                <h1>Twoja strona, krok po kroku</h1>
                <ul>
                  <li><span>01</span>Widzisz, na jakim etapie jest strona i czyj jest ruch.</li>
                  <li><span>02</span>Wysyłasz materiały i zdjęcia prosto z telefonu.</li>
                  <li><span>03</span>Oglądasz podgląd i akceptujesz, zanim cokolwiek opublikujemy.</li>
                </ul>
              </div>
              <div className={p.sheet} style={{ padding: 24 }}>
                <h2 className={p.h2} style={{ marginBottom: 6 }}>Zaloguj się</h2>
                <p className={`${p.small} ${p.muted}`} style={{ margin: '0 0 12px' }}>Bez hasła. Wyślemy 6-cyfrowy kod na e-mail podany przy zamówieniu.</p>
                <EmailAuth onSignedIn={setSession} />
              </div>
            </div>
          )}
        <p className={`${p.tiny} ${p.muted}`} style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 32px' }}>{SELLER_BLOCK}</p>
      </main>
    );
  }

  const pay = waitingFor ? (
    <p role="status" className={p.banner}>
      {waitExpired
        ? 'Płatność jeszcze się przetwarza. Odśwież stronę za kilka minut. Jeśli zostałeś obciążony, zamówienie na pewno do nas trafi.'
        : 'Dziękujemy! Potwierdzamy płatność…'}
    </p>
  ) : paidSeen ? <p role="status" className={`${p.okNote}`} style={{ marginBottom: 16 }}>Płatność potwierdzona. Dziękujemy, zaczynamy od Twoich materiałów.</p> : null;

  const notice = (
    <>
      {pay}
      {toast && (
        <p role="status" className={p.banner}>
          <span style={{ flex: 1 }}><b>{toast.title}</b>{toast.body ? <><br />{toast.body}</> : null}</span>
          <button type="button" className={p.btnGhost} onClick={() => setToast(null)}>Zamknij</button>
        </p>
      )}
      {hasOrder && !waitingFor && api.push && <PushCard push={api.push} variant="prompt" />}
    </>
  );

  return (
    <PanelWorkspace
      api={api}
      email={session.user.email ?? ''}
      onSignOut={() => void supabase.auth.signOut({ scope: 'local' })}
      notice={notice}
      reloadKey={reloadKey}
      onOverview={onOverview}
    />
  );
}
