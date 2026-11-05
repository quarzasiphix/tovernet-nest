'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { price as money } from '../studio/motion';
import { ksiegaiState, openKsiegaiInvoices } from '@/lib/tovernet/ksiegai';
import { BUILD, STATUS_LABEL, buildIndex, day, docsOf, logosOf, nextAction, onboarding, photosOf, when } from './model';
import { firstStamp } from './memory';
import InvoiceLink from './InvoiceLink';
import type { Overview } from './types';
import type { ViewProps } from './view';
import p from './panel.module.css';

const SUB: Record<string, string> = {
  active: 'aktywny', trialing: 'aktywny', past_due: 'zaległa płatność', unpaid: 'nieopłacony',
  canceled: 'zakończony', incomplete: 'oczekuje na płatność', incomplete_expired: 'nieopłacony',
};

export default function Dashboard({ ws, go, overview, unread }: ViewProps & { overview: Overview; unread: number }) {
  const next = nextAction(ws);
  const ob = onboarding(ws.brief, ws.files, Boolean(ws.brief_submitted_at));
  const ks = ksiegaiState(ws);
  const summary = overview.projects.find((x) => x.id === ws.id);
  const order = overview.orders.find((o) => o.id === summary?.order_id);
  const build = buildIndex(ws.status);
  const lastMsg = ws.items.filter((i) => i.kind !== 'internal_note').at(-1);
  const photos = photosOf(ws.files).length;
  const logo = logosOf(ws.files).length;
  const docs = docsOf(ws.files).length;
  // Stamps animate only the first time this browser sees the milestone.
  const [fresh] = useState(() => ({
    brief: ws.brief_submitted_at ? firstStamp(ws.id, 'brief') : false,
    ksiegai: ks === 'ready' ? firstStamp(ws.id, 'ksiegai') : false,
  }));
  const [opening, setOpening] = useState(false);
  const [ksError, setKsError] = useState('');

  const live = ws.production_url ?? (ws.status === 'completed' && ws.domain ? `https://${ws.domain}` : null);

  const domainLine = useMemo(() => {
    if (live) return `Strona działa pod adresem ${ws.domain ?? live.replace(/^https?:\/\//, '')}.`;
    if (ws.domain) return `Ustalony adres: ${ws.domain}.`;
    if (ws.brief.domain_choice === 'have' && ws.brief.domain) return `Twoja domena: ${ws.brief.domain}. Przed publikacją ustalimy, jak ją podpiąć.`;
    if (ws.brief.domain_choice === 'new') return 'Zaproponujemy wolne adresy dla Twojej firmy.';
    if (ws.brief.domain_choice === 'unsure') return 'Sprawdzimy, czy firma ma już domenę.';
    return 'Powiedz nam, czy masz już domenę.';
  }, [live, ws]);

  return (
    <div>
      <section className={p.next} data-turn={next.turn} aria-labelledby="next-title">
        <div>
          <span className={p.who}><i aria-hidden="true" />{next.turn === 'client' ? 'Twój następny krok' : next.turn === 'done' ? 'Gotowe' : 'Teraz pracujemy my'}</span>
          <h1 id="next-title" className={p.nextTitle}>{next.title}</h1>
          <p className={p.nextText}>{next.text}</p>
        </div>
        {next.cta && (
          <button type="button" className={`${next.turn === 'client' ? p.btn : p.btnLine} ${p.nextCta}`} onClick={() => go(next.cta!.view)}>
            {next.cta.label}<ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
      </section>

      <section className={p.tracks} aria-label="Postęp">
        <div className={p.track}>
          <div className={p.trackHead}><b>Twoja część</b><span className={p.l}>{ob.submitted ? 'gotowe' : `${ob.done} z ${ob.total}`}</span></div>
          <ol className={p.trail} style={{ gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }}>
            <li className={p.done}><span className={p.node}><Check size={13} aria-hidden="true" /></span><p>Zamówienie<small>{order?.paid_at ? day(order.paid_at) : 'opłacone'}</small></p></li>
            <li className={ob.submitted ? p.done : p.now} aria-current={!ob.submitted ? 'step' : undefined}>
              <span className={p.node}>{ob.submitted ? <Check size={13} aria-hidden="true" /> : '2'}</span>
              <p>Start strony<small>{ob.submitted ? day(ws.brief_submitted_at!) : `${ob.done} z ${ob.total} gotowe`}</small></p>
            </li>
            <li className={ks === 'ready' ? p.ok : ks === 'preparing' ? p.now : ''}>
              <span className={p.node}>{ks === 'ready' ? <Check size={13} aria-hidden="true" /> : '3'}</span>
              <p>Profil w Księgai<small>{ks === 'ready' ? 'gotowy' : ks === 'preparing' ? 'przygotowujemy' : 'po starcie strony'}</small></p>
            </li>
          </ol>
        </div>
        <div className={p.track}>
          <div className={p.trackHead}><b>Realizacja strony</b><span className={p.l}>{STATUS_LABEL[ws.status] ?? ws.status}</span></div>
          {ws.status === 'cancelled' ? <p className={p.small}>Projekt anulowany.</p> : (
            <ol className={`${p.trail} ${p.trailBuild}`} style={{ gridTemplateColumns: `repeat(${BUILD.length},minmax(0,1fr))` }}>
              {BUILD.map((b, i) => {
                const done = i < build || ws.status === 'completed';
                const now = i === build && ws.status !== 'completed';
                return (
                  <li key={b.key} className={done ? (b.key === 'live' ? p.ok : p.done) : now ? p.now : ''} aria-current={now ? 'step' : undefined}>
                    <span className={p.node}>{done ? <Check size={13} aria-hidden="true" /> : i + 1}</span>
                    <p>{b.label}
                      {b.key === 'review' && ws.revision_rounds_limit > 0 && <small>rundy {ws.revision_rounds_used}/{ws.revision_rounds_limit}</small>}
                      {b.key === 'review' && ws.approved_at && <small>zaakceptowano</small>}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      {ks === 'ready' ? (
        <section className={p.ks} aria-labelledby="ks-title">
          <div className={p.ksSeal} aria-hidden="true"><b>Księgai<br />gotowe</b></div>
          <div style={{ minWidth: 0 }}>
            <span className={`${p.stamp} ${p.stampOk} ${fresh.ksiegai ? p.stampIn : ''}`}>Kamień milowy</span>
            <h2 id="ks-title" className={p.ksTitle}>Profil firmy gotowy w Księgai</h2>
            <p className={p.ksText}>Twoje dane firmowe zostały zapisane w Księgai. Możesz teraz przejść do faktur i zarządzać wydatkami swojej firmy.</p>
            {ksError && <p role="alert" className={p.small} style={{ margin: '8px 0 0', color: 'var(--err)' }}>{ksError}</p>}
          </div>
          <button type="button" className={p.btn} disabled={opening}
                  onClick={() => {
                    setOpening(true); setKsError('');
                    openKsiegaiInvoices({ projectId: ws.id, businessProfileId: ws.ksiegai?.business_profile_id })
                      .catch((e) => { setKsError(e instanceof Error && e.message ? e.message : 'Nie udało się otworzyć Księgai. Spróbuj ponownie.'); setOpening(false); });
                  }}>
            {opening ? 'Otwieramy Księgai…' : 'Zobacz faktury w Księgai'}<ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>
      ) : ks === 'preparing' || ks === 'failed' ? (
        <p className={p.ksWait} role="status">
          {ks === 'preparing'
            ? 'Przygotowujemy profil Twojej firmy w Księgai. Gdy będzie gotowy, przejdziesz stąd prosto do faktur.'
            : 'Profil firmy w Księgai wymaga jeszcze naszej uwagi. Zajmujemy się tym i damy znać w wiadomościach.'}
        </p>
      ) : null}

      <div className={`${p.grid3} ${p.gap16}`}>
        <a href="#materialy" className={p.quick} onClick={(e) => { e.preventDefault(); go(ob.submitted ? 'materialy' : 'start'); }}>
          <span className={p.l}>Materiały</span>
          <b>{photos ? `Zdjęcia: ${photos}` : ws.brief.no_photos ? 'Bez zdjęć, z grafikami' : 'Brak zdjęć'}{logo ? ' · logo' : ''}{docs ? ` · pliki: ${docs}` : ''}</b>
          <p>{ob.submitted ? `Start strony wysłany ${day(ws.brief_submitted_at!)}.` : 'Dodaj zdjęcia z telefonu i logo. Bez nich zostawimy grafiki poglądowe.'}</p>
          <span className={p.go}>{ob.submitted ? 'Otwórz materiały' : 'Uzupełnij'} →</span>
        </a>
        <a href="#wiadomosci" className={p.quick} onClick={(e) => { e.preventDefault(); go('wiadomosci'); }}>
          <span className={p.l}>Wiadomości{unread ? ` · nowe: ${unread}` : ''}</span>
          <b>{lastMsg ? (lastMsg.author_side === 'staff' ? 'Tovernet' : 'Ty') : 'Napisz do nas'}</b>
          <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lastMsg ? lastMsg.body : 'Pytanie, zmiana, plik. Odpowiadamy w dni robocze.'}</p>
          <span className={p.go}>{lastMsg ? `${when(lastMsg.created_at)} · otwórz` : 'Nowa wiadomość'} →</span>
        </a>
        <a href="#domena" className={p.quick} onClick={(e) => { e.preventDefault(); go('domena'); }}>
          <span className={p.l}>Domena</span>
          <b style={{ overflowWrap: 'anywhere' }}>{ws.domain || (ws.brief.domain_choice === 'have' && ws.brief.domain) || 'Do ustalenia'}</b>
          <p>{domainLine}</p>
          <span className={p.go}>Szczegóły →</span>
        </a>
      </div>

      {order && (
        <section className={`${p.card} ${p.gap16}`} aria-label="Płatności">
          <div className={p.cardHead}><b>Płatności</b><button type="button" className={p.btnGhost} onClick={() => go('konto')}>Konto i faktury</button></div>
          <ul className={p.rows}>
            {order.subscription && (
              <li>
                <span>{ws.plan?.name ?? 'Plan'}, {SUB[order.subscription.status] ?? order.subscription.status}
                  {order.subscription.current_period_end && <span className={p.muted}> · {order.subscription.cancel_at_period_end ? 'kończy się' : 'następna płatność'} {day(order.subscription.current_period_end)}</span>}
                </span>
                <span>{money(order.recurring_gross_minor)} / mies.</span>
              </li>
            )}
            <li><span>{order.invoice_number ? <InvoiceLink orderId={order.id} number={order.invoice_number} placement="panel_dashboard" /> : 'Faktura w przygotowaniu'}</span><span>{money(order.total_gross_minor)}</span></li>
          </ul>
        </section>
      )}

      <section className={`${p.card} ${p.gap16}`} aria-label="Raporty z Google" style={{ borderStyle: 'dashed' }}>
        <b>Raporty z Google</b>
        <p className={`${p.small} ${p.muted}`} style={{ margin: '4px 0 0' }}>
          {ws.status === 'completed'
            ? 'Łączymy stronę z Google Search Console. Pierwszy raport (wyświetlenia, kliknięcia, frazy) zobaczysz tutaj, gdy Google zbierze dane.'
            : 'Po publikacji zobaczysz tu, jak często Twoja strona pokazuje się w Google, na jakie frazy i ile osób w nią klika.'}
        </p>
      </section>

      {fresh.brief && <span className={p.sr} role="status">Start strony wysłany.</span>}
    </div>
  );
}
