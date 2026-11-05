'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Bell, ChevronsUpDown, Check, Home, ListChecks, MonitorSmartphone, MessageSquare, MoreHorizontal } from 'lucide-react';
import { brandFonts } from '@/lib/tovernet/brand';
import { presentName } from '@/lib/tovernet/construction';
import { track } from '@/lib/tovernet/analytics';
import { SELLER_BLOCK } from '@/lib/seller';
import { STATUS_LABEL, VIEWS, nextAction, onboarding, openQuestions, when, type View } from './model';
import type { Overview, PanelApi, Workspace } from './types';
import { readSeen, writeSeen } from './memory';
import type { Go, Intent } from './view';
import Dashboard from './Dashboard';
import Onboarding from './Onboarding';
import Materials from './Materials';
import Preview from './Preview';
import Messages from './Messages';
import Domain from './Domain';
import Account from './Account';
import Payments from './Payments';
import p from './panel.module.css';

const NAV: { view: View; label: string; n: string }[] = [
  { view: 'pulpit', label: 'Pulpit', n: '01' },
  { view: 'start', label: 'Start strony', n: '02' },
  { view: 'materialy', label: 'Materiały', n: '03' },
  { view: 'podglad', label: 'Podgląd strony', n: '04' },
  { view: 'wiadomosci', label: 'Wiadomości', n: '05' },
  { view: 'domena', label: 'Domena', n: '06' },
  { view: 'platnosci', label: 'Płatności', n: '07' },
  { view: 'konto', label: 'Konto i dokumenty', n: '08' },
];

type Props = {
  api: PanelApi;
  email: string;
  onSignOut?: () => void;
  /** Rendered above the current view, e.g. "Potwierdzamy płatność…". */
  notice?: ReactNode;
  /** Bumped by the parent to reload everything (e.g. after a payment lands). */
  reloadKey?: number;
  onOverview?: (o: Overview) => void;
};


/** The client workspace: one business at a time, eight views, one next action. */
export default function PanelWorkspace({ api, email, onSignOut, notice, reloadKey = 0, onOverview }: Props) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [ws, setWs] = useState<Workspace | null>(null);
  const [view, setView] = useState<View>('pulpit');
  const [intent, setIntent] = useState<Intent>({});
  const [menu, setMenu] = useState<'switch' | 'bell' | 'more' | null>(null);
  const [seen, setSeen] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Overview: businesses, orders, offers.
  useEffect(() => {
    let live = true;
    api.overview().then((o) => {
      if (!live) return;
      setOverview(o);
      onOverview?.(o);
      setProjectId((cur) => {
        if (cur && o.projects.some((x) => x.id === cur)) return cur;
        let saved: string | null = null;
        try { saved = localStorage.getItem('tv-panel-project'); } catch { /* private mode */ }
        return o.projects.find((x) => x.id === saved)?.id ?? o.projects[0]?.id ?? null;
      });
    }).catch((e) => setError(e instanceof Error ? e.message : 'Nie udało się pobrać danych.'));
    return () => { live = false; };
  }, [api, reloadKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const project = useMemo(() => (projectId ? api.project(projectId) : null), [api, projectId]);

  const refresh = useCallback(async () => {
    if (!project) return;
    try { setWs(await project.get()); } catch (e) { setError(e instanceof Error ? e.message : 'Nie udało się pobrać projektu.'); }
  }, [project]);

  useEffect(() => {
    setWs(null);
    if (!project || !projectId) return;
    try { localStorage.setItem('tv-panel-project', projectId); } catch { /* ignore */ }
    setSeen(readSeen(projectId));
    void refresh();
  }, [project, projectId, refresh]);
  // Parent reloads (payment landed) refresh in place, without the loading state.
  useEffect(() => { if (reloadKey) void refresh(); }, [reloadKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hash routing: #start, #podglad… Back and forward work, links can be shared with oneself.
  useEffect(() => {
    const read = () => {
      // E-mail links use ?widok=platnosci (the hash is free for the pay page's own use).
      const h = (window.location.hash.replace('#', '') || new URLSearchParams(window.location.search).get('widok') || '') as View;
      setView(VIEWS.includes(h) ? h : 'pulpit');
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  const go: Go = useCallback((v, opts = {}) => {
    setIntent(opts);
    setMenu(null);
    if (window.location.hash !== `#${v}`) window.history.pushState(null, '', `#${v}`);
    setView(v);
    track('panel_view_opened', { view: v });
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }));
  }, []);

  // Messages from Tovernet newer than the last visit to "Wiadomości".
  const staff = useMemo(() => (ws?.items ?? []).filter((i) => i.author_side === 'staff'), [ws]);
  const localUnread = staff.filter((i) => !seen || i.created_at > seen).length;
  const unread = view === 'wiadomosci' ? 0 : typeof ws?.unread === 'number' ? ws.unread : localUnread;
  useEffect(() => {
    if (view !== 'wiadomosci' || !ws || !projectId) return;
    const last = ws.items.at(-1)?.created_at;
    if (last) writeSeen(projectId, last);
    if (ws.unread) void project?.markRead().then(() => setWs((cur) => (cur ? { ...cur, unread: 0 } : cur)));
    // The divider stays where it was for this visit; the badge clears on the next one.
    return () => { if (last) setSeen(last); };
  }, [view, ws?.items.length, projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(null); };
    const click = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest('[data-menu]')) setMenu(null); };
    window.addEventListener('keydown', close);
    window.addEventListener('mousedown', click);
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('mousedown', click); };
  }, [menu]);

  const projects = overview?.projects ?? [];
  const current = projects.find((x) => x.id === projectId) ?? null;
  const companyName = presentName(ws?.prefill.company_name ?? current?.company_name ?? 'Twoja firma');
  const next = ws ? nextAction(ws) : null;
  const ob = ws ? onboarding(ws.brief, ws.files, Boolean(ws.brief_submitted_at)) : null;
  const questions = ws ? openQuestions(ws.items).length : 0;

  const badge = (v: View): ReactNode => {
    if (!ws) return null;
    if (v === 'start' && ob) return <span className={`${p.frac} ${ob.submitted ? p.fracDone : ''}`}>{ob.submitted ? <Check size={14} aria-label="gotowe" /> : `${ob.done}/${ob.total}`}</span>;
    if (v === 'wiadomosci' && (unread || questions)) return <span className={p.count} aria-label={`nowe: ${Math.max(unread, questions)}`}>{Math.max(unread, questions)}</span>;
    if (v === 'podglad' && ws.status === 'client_review') return <span className={p.count} aria-label="czeka na Ciebie">1</span>;
    return null;
  };

  const turnLabel = next?.turn === 'client' ? 'Teraz Twój ruch' : next?.turn === 'tovernet' ? 'Teraz pracujemy my' : next ? 'Gotowe' : '';
  const Turn = () => (
    <div className={p.turn} data-turn={next?.turn ?? 'tovernet'} role="img" aria-label={turnLabel}>
      <i aria-hidden="true" />
      <span aria-hidden="true">Ty</span>
      <span aria-hidden="true">Tovernet</span>
    </div>
  );

  const content = (() => {
    if (error && !overview) return <p role="alert" className={p.alert}>{error}</p>;
    if (!overview) return <Loading />;
    if (!projectId) return <Account overview={overview} api={api} ws={null} go={go} standalone />;
    if (!ws) return <Loading />;
    const props = { ws, api: project!, go, refresh, setWs, intent };
    switch (view) {
      case 'start': return <Onboarding {...props} />;
      case 'materialy': return <Materials {...props} />;
      case 'podglad': return <Preview {...props} />;
      case 'wiadomosci': return <Messages {...props} seen={seen} />;
      case 'domena': return <Domain {...props} />;
      case 'platnosci': return api.billing ? <Payments billing={api.billing} email={email} /> : <Account overview={overview} api={api} ws={ws} go={go} />;
      case 'konto': return <Account overview={overview} api={api} ws={ws} go={go} />;
      default: return <Dashboard {...props} overview={overview} unread={unread} />;
    }
  })();

  const feed = useMemo(() => [...staff].reverse().slice(0, 8), [staff]);

  return (
    <main lang="pl" className={`${brandFonts} ${p.root}`}>
      <header className={p.bar}>
        <a href="/pl/" className={p.word}>tovernet</a>
        <div className={p.switch} data-menu>
          {projects.length > 1 ? (
            <button type="button" className={p.switchBtn} aria-haspopup="menu" aria-expanded={menu === 'switch'} onClick={() => setMenu(menu === 'switch' ? null : 'switch')}>
              <span style={{ minWidth: 0 }}><small>Firma</small><b>{companyName}</b></span>
              <ChevronsUpDown size={16} aria-hidden="true" />
            </button>
          ) : (
            <div className={p.switchBtn} style={{ cursor: 'default' }}><span style={{ minWidth: 0 }}><small>Panel klienta</small><b>{companyName}</b></span></div>
          )}
          {menu === 'switch' && (
            <div className={p.menu} role="menu">
              {projects.map((x) => (
                <button key={x.id} role="menuitem" type="button" aria-current={x.id === projectId} onClick={() => { setProjectId(x.id); setMenu(null); go('pulpit'); }}>
                  <span>{presentName(x.company_name)}</span><small>{STATUS_LABEL[x.status] ?? x.status}</small>
                </button>
              ))}
            </div>
          )}
        </div>
        {ws && (
          <div data-menu style={{ position: 'relative', display: 'flex' }}>
            <button type="button" className={p.barBtn} aria-label={`Powiadomienia${unread ? `, nowe: ${unread}` : ''}`} aria-expanded={menu === 'bell'} onClick={() => setMenu(menu === 'bell' ? null : 'bell')}>
              <Bell size={18} aria-hidden="true" />
              {unread > 0 && <span className={p.pip}>{unread}</span>}
            </button>
            {menu === 'bell' && (
              <div className={p.bell} role="dialog" aria-label="Powiadomienia">
                <header><b>Od Tovernet</b><button type="button" className={p.btnGhost} onClick={() => go('wiadomosci')}>Wszystkie wiadomości</button></header>
                {feed.length === 0 ? <p className={`${p.small} ${p.muted}`} style={{ padding: 14, margin: 0 }}>Nic nowego. Gdy coś napiszemy albo podgląd będzie gotowy, zobaczysz to tutaj i dostaniesz e-mail.</p> : (
                  <ol>
                    {feed.map((i) => (
                      <li key={i.id}>
                        <button type="button" className={!seen || i.created_at > seen ? p.unread : ''} onClick={() => go('wiadomosci')}>
                          <span className={p.l}>{i.kind === 'info_request' ? 'Pytanie' : 'Wiadomość'} · {when(i.created_at)}</span>
                          <p>{i.body}</p>
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </div>
        )}
        <span className={p.barMail} data-testid="panel-email">{email}</span>
        {onSignOut && <button type="button" className={`${p.barBtn} ${p.barOut}`} onClick={onSignOut}>Wyloguj</button>}
      </header>

      <div className={p.layout}>
        <aside className={p.side} aria-label="Projekt">
          {ws && (
            <>
              <dl className={p.sideKarta} style={{ margin: '0 20px' }}>
                <div><dt className={p.l}>Dla</dt><dd className={p.name}>{companyName}</dd></div>
                <div><dt className={p.l}>Etap</dt><dd>{STATUS_LABEL[ws.status] ?? ws.status}</dd></div>
                {ws.package && <div><dt className={p.l}>Pakiet · plan</dt><dd>{[ws.package.name, ws.plan?.name].filter(Boolean).join(' · ')}</dd></div>}
              </dl>
              <div className={p.turnWrap}>
                <span className={p.l}>Czyja kolej</span>
                <Turn />
                <p className={p.turnNote}>{next?.turn === 'client' ? next.title : next?.turn === 'done' ? 'Strona działa.' : 'Nic nie musisz robić. Napiszemy, gdy będziesz potrzebny.'}</p>
              </div>
            </>
          )}
          <nav aria-label="Sekcje panelu">
            <ul className={p.nav}>
              {NAV.filter((n) => ws || projectId || !overview || n.view === 'pulpit' || n.view === 'konto').map((n) => (
                <li key={n.view}>
                  <a href={`#${n.view}`} aria-current={view === n.view ? 'page' : undefined} onClick={(e) => { e.preventDefault(); go(n.view); }}>
                    <em>{n.n}</em><span>{n.label}</span>{badge(n.view)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={p.sideFoot}>
            Pytanie? <a href="#wiadomosci" onClick={(e) => { e.preventDefault(); go('wiadomosci'); }}>Napisz do nas</a> albo <a href="mailto:contact@tovernet.online">contact@tovernet.online</a>
          </div>
        </aside>

        <div className={p.main} ref={mainRef}>
          {ws && next && (
            <div className={p.mobTurn}>
              <span><b>{turnLabel}</b></span>
              <Turn />
            </div>
          )}
          <div className={p.mainIn}>
            {notice}
            {error && overview && <p role="alert" className={p.alert}>{error}</p>}
            <div key={`${view}-${projectId}`} className={p.view}>{content}</div>
            <footer className={p.foot}>
              <p style={{ margin: 0 }}>{SELLER_BLOCK}</p>
              <p style={{ margin: '4px 0 0' }}><a href="/pl/regulamin/">Regulamin</a> · <a href="/pl/polityka-prywatnosci/">Polityka prywatności</a> · <a href="/pl/umowa-powierzenia/">Umowa powierzenia</a></p>
            </footer>
          </div>
        </div>
      </div>

      {/* Phone: the four places a client returns to, plus the rest. */}
      <nav className={p.tabs} aria-label="Sekcje panelu" data-menu>
        {([
          ['pulpit', 'Pulpit', <Home key="i" size={20} aria-hidden="true" />],
          [ws?.brief_submitted_at ? 'materialy' : 'start', ws?.brief_submitted_at ? 'Materiały' : 'Start', <ListChecks key="i" size={20} aria-hidden="true" />],
          ['podglad', 'Podgląd', <MonitorSmartphone key="i" size={20} aria-hidden="true" />],
          ['wiadomosci', 'Wiadomości', <MessageSquare key="i" size={20} aria-hidden="true" />],
        ] as [View, string, ReactNode][]).map(([v, label, icon]) => (
          <a key={v} href={`#${v}`} aria-current={view === v ? 'page' : undefined} onClick={(e) => { e.preventDefault(); go(v); }}>
            {icon}{label}{v === 'wiadomosci' || v === 'podglad' ? badge(v) : null}
          </a>
        ))}
        <button type="button" aria-expanded={menu === 'more'} aria-current={['domena', 'konto', 'start', 'materialy'].includes(view) && menu !== 'more' && !(view === (ws?.brief_submitted_at ? 'materialy' : 'start')) ? 'page' : undefined} onClick={() => setMenu(menu === 'more' ? null : 'more')}>
          <MoreHorizontal size={20} aria-hidden="true" />Więcej
        </button>
        {menu === 'more' && (
          <div className={p.more}>
            {(ws?.brief_submitted_at ? [['start', 'Start strony (wysłany)'], ['domena', 'Domena'], ['konto', 'Konto i płatności']] : [['materialy', 'Materiały'], ['domena', 'Domena'], ['konto', 'Konto i płatności']]).map(([v, label]) => (
              <a key={v} href={`#${v}`} onClick={(e) => { e.preventDefault(); go(v as View); }}>{label}<span aria-hidden="true">›</span></a>
            ))}
            {onSignOut && <button type="button" onClick={onSignOut}>Wyloguj<span className={p.muted}>{email}</span></button>}
          </div>
        )}
      </nav>
    </main>
  );
}

function Loading() {
  return (
    <div aria-busy="true" aria-label="Ładowanie">
      <div className={p.skel} style={{ height: 180, border: '1px solid var(--hair)' }} />
      <div className={p.skel} style={{ height: 120, marginTop: 16, border: '1px solid var(--hair)' }} />
      <div className={p.grid3} style={{ marginTop: 16 }}>
        {[0, 1, 2].map((i) => <div key={i} className={p.skel} style={{ height: 130, border: '1px solid var(--hair)' }} />)}
      </div>
    </div>
  );
}
