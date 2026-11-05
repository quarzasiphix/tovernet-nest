'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ExternalLink, FileText } from 'lucide-react';
import { price as money } from '../studio/motion';
import { presentName } from '@/lib/tovernet/construction';
import { track } from '@/lib/tovernet/analytics';
import PanelCompany from '../PanelCompany';
import InvoiceLink from './InvoiceLink';
import PushCard from './PushCard';
import { STATUS_LABEL, day } from './model';
import type { DocRow, Order, Overview, PanelApi, Workspace } from './types';
import type { Go } from './view';
import p from './panel.module.css';

const SUB: Record<string, [string, 'ok' | 'warn' | '']> = {
  active: ['aktywny', 'ok'], trialing: ['aktywny', 'ok'], past_due: ['zaległa płatność', 'warn'], unpaid: ['nieopłacony', 'warn'],
  canceled: ['zakończony', ''], incomplete: ['oczekuje na płatność', 'warn'], incomplete_expired: ['nieopłacony', 'warn'],
};
// Registry names arrive upper case: "SPÓŁKA Z OGRANICZONĄ" becomes "Spółka z Ograniczoną".
const legal = (x: string) => x.toLocaleLowerCase('pl').split(' ').map((w, i) => (i > 0 && w.length <= 2 ? w : w.charAt(0).toLocaleUpperCase('pl') + w.slice(1))).join(' ');
const ORDER_STATUS: Record<string, string> = { paid: 'Opłacone', payment_review: 'Sprawdzamy płatność', refunded: 'Zwrócone', cancelled: 'Anulowane' };
const AUTHORITY: Record<string, string> = {
  verified: 'umocowanie potwierdzone w KRS',
  co_signatory_required: 'czeka na akceptację drugiej osoby uprawnionej',
  poa_required: 'czeka na pełnomocnictwo',
  not_in_registry: 'czeka na pełnomocnictwo albo potwierdzenie osoby uprawnionej',
  staff_review: 'umocowanie sprawdzamy',
};

type Props = { overview: Overview; api: PanelApi; ws: Workspace | null; go: Go; standalone?: boolean };

/** Plan, payments, invoices, accepted documents, company data and every business on the account. */
export default function Account({ overview, api, ws, go, standalone = false }: Props) {
  const [docs, setDocs] = useState<DocRow[] | null>(null);
  const [error, setError] = useState('');
  const [portalBusy, setPortalBusy] = useState(false);
  useEffect(() => { api.documents().then(setDocs).catch(() => setDocs([])); }, [api]);

  const summary = ws ? overview.projects.find((x) => x.id === ws.id) : null;
  const orders = summary ? overview.orders.filter((o) => o.id === summary.order_id) : overview.orders;
  const otherOrders = summary ? overview.orders.filter((o) => o.id !== summary.order_id) : [];
  const company = (overview.companies ?? []).find((c) => !summary || c.lead_id === summary.lead_id) ?? (summary ? null : overview.companies?.[0] ?? null);
  const offers = overview.offers.filter((o) => !(overview.companies ?? []).some((c) => c.public_id && c.public_id === o.public_id) || standalone);
  const myDocs = (docs ?? []).filter((d) => orders.some((o) => o.id === d.order_id) || standalone);

  const openPortal = async () => {
    setPortalBusy(true);
    try {
      const url = await api.portal();
      track('billing_portal_opened');
      window.location.href = url;
    } catch {
      setError('Zarządzanie płatnościami jest chwilowo niedostępne. Napisz do nas: contact@tovernet.online.');
      setPortalBusy(false);
    }
  };

  const empty = standalone && !overview.orders.length && !overview.offers.length && !(overview.companies ?? []).length;

  return (
    <div>
      <div className={p.head}>
        <div>
          <span className={p.l}>{standalone ? 'Panel klienta' : 'Konto i płatności'}</span>
          <h1 className={p.h1}>{standalone ? 'Twój panel' : 'Plan, faktury i dokumenty'}</h1>
          {standalone && <p className={p.lead}>{overview.orders.length ? 'Zamówienie dotarło. Projekt pojawi się tutaj za chwilę.' : 'Gdy zamówisz stronę, jej postęp, materiały i podgląd pojawią się tutaj.'}</p>}
        </div>
      </div>
      {error && <p role="alert" className={p.alert}>{error}</p>}

      {!standalone && (
        <nav className={p.anchorNav} aria-label="Na tej stronie">
          <a href="#k-plan" onClick={(e) => { e.preventDefault(); document.getElementById('k-plan')?.scrollIntoView({ behavior: 'smooth' }); }}>Plan i płatności</a>
          <a href="#k-docs" onClick={(e) => { e.preventDefault(); document.getElementById('k-docs')?.scrollIntoView({ behavior: 'smooth' }); }}>Dokumenty</a>
          <a href="#k-firma" onClick={(e) => { e.preventDefault(); document.getElementById('k-firma')?.scrollIntoView({ behavior: 'smooth' }); }}>Dane firmy</a>
          {overview.projects.length > 1 && <a href="#k-firmy" onClick={(e) => { e.preventDefault(); document.getElementById('k-firmy')?.scrollIntoView({ behavior: 'smooth' }); }}>Twoje firmy</a>}
        </nav>
      )}

      <div className={p.stack}>
        {orders.length > 0 && (
          <section id="k-plan" className={p.section} aria-labelledby="k-plan-h">
            <h2 id="k-plan-h" className={p.h2} style={{ marginBottom: 12 }}>Plan i płatności</h2>
            <div className={p.stack}>
              {orders.map((o) => <OrderCard key={o.id} o={o} ws={ws} onPortal={() => void openPortal()} busy={portalBusy} />)}
            </div>
          </section>
        )}

        {myDocs.length > 0 && (
          <section id="k-docs" className={p.section} aria-labelledby="k-docs-h">
            <h2 id="k-docs-h" className={p.h2} style={{ marginBottom: 12 }}>Dokumenty</h2>
            <div className={p.stack}>
              {myDocs.map((r) => (
                <div key={r.order_id} className={p.card}>
                  <div className={p.cardHead}><b>Zamówienie {r.order_number}</b><span className={p.l}>{day(r.accepted_at)}</span></div>
                  <p className={p.small} style={{ margin: 0 }}>Zaakceptowane przez {r.signatory}; {AUTHORITY[r.authority_status] ?? r.authority_status}.</p>
                  {r.protected_buyer && r.work_not_before && new Date(r.work_not_before) > new Date() && (
                    <p className={p.small} style={{ margin: '4px 0 0' }}>Prace zaczniemy {day(r.work_not_before)}, po upływie terminu do odstąpienia od umowy.</p>
                  )}
                  <ul className={p.flist}>
                    {(r.documents ?? []).map((d) => (
                      <li key={d.key}>
                        {d.pdf ? <a href={d.pdf} target="_blank" rel="noreferrer" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><FileText size={14} aria-hidden="true" style={{ verticalAlign: -2, marginRight: 6 }} />{d.title}</a> : <span>{d.title}</span>}
                        <span className={`${p.tiny} ${p.muted}`}>wersja {d.version}</span>
                        <span />
                      </li>
                    ))}
                  </ul>
                  {r.spec_sha256 && <p className={`${p.tiny} ${p.muted}`} style={{ margin: '10px 0 0', overflowWrap: 'anywhere' }}>Specyfikacja zamówienia, SHA-256 {r.spec_sha256}. Pełna treść jest w potwierdzeniu zamówienia na Twoim e-mailu.</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {api.push && overview.orders.length > 0 && <PushCard push={api.push} variant="settings" />}

        {company && (
          <section id="k-firma" className={p.section} aria-labelledby="k-firma-h">
            <h2 id="k-firma-h" className={p.h2} style={{ marginBottom: 0 }}>Dane firmy</h2>
            <p className={`${p.small} ${p.muted}`} style={{ margin: '4px 0 0' }}>Z Krajowego Rejestru Sądowego. Jeśli coś się nie zgadza, napisz do nas.</p>
            <div className={company.public_id ? undefined : p.solo} style={company.public_id ? undefined : { maxWidth: 680 }}><PanelCompany company={company} /></div>
          </section>
        )}

        {(overview.projects.length > 1 || otherOrders.length > 0) && !standalone && (
          <section id="k-firmy" className={p.section} aria-labelledby="k-firmy-h">
            <h2 id="k-firmy-h" className={p.h2} style={{ marginBottom: 12 }}>Twoje firmy</h2>
            <ul className={p.rows}>
              {overview.projects.map((x) => (
                <li key={x.id}><span>{presentName(x.company_name)}{x.id === ws?.id ? <span className={p.muted}> · otwarta teraz</span> : ''}</span><span className={p.muted}>{STATUS_LABEL[x.status] ?? x.status}</span></li>
              ))}
            </ul>
            <p className={`${p.tiny} ${p.muted}`}>Między firmami przełączysz się nazwą na górnym pasku.</p>
          </section>
        )}

        {offers.length > 0 && (
          <section aria-label="Twoje oferty" className={p.stack}>
            {offers.map((o) => (
              <div key={`${o.company_name}${o.public_id}`} className={p.card} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                <span><span className={p.l}>Oferta</span><b>{presentName(o.company_name)}</b></span>
                {o.public_id && <a className={p.btnLine} href={`/oferta/#${o.public_id}`}>Wróć do konceptu i cennika<ArrowRight size={16} aria-hidden="true" /></a>}
              </div>
            ))}
          </section>
        )}

        {empty && <p className={p.card}>Nie masz jeszcze zamówień. Gdy zamówisz stronę, jej postęp pojawi się tutaj.</p>}

        {!standalone && (
          <section className={p.card} aria-label="Pomoc" style={{ borderStyle: 'dashed' }}>
            <b>Chcesz coś zmienić w zamówieniu albo planie?</b>
            <p className={`${p.small} ${p.muted}`} style={{ margin: '4px 0 10px' }}>Kartę, faktury Stripe i rezygnację z planu obsłużysz sam w panelu płatności. W innych sprawach napisz do nas.</p>
            <button type="button" className={p.btnGhost} onClick={() => go('wiadomosci', { kind: 'message', draft: 'Sprawa dotycząca zamówienia: ' })}>Napisz do nas</button>
          </section>
        )}
      </div>
    </div>
  );
}

function OrderCard({ o, ws, onPortal, busy }: { o: Order; ws: Workspace | null; onPortal: () => void; busy: boolean }) {
  const items = [...(o.items ?? [])].sort((a, b) => Number(Boolean(a.billing_interval)) - Number(Boolean(b.billing_interval)));
  const sub = o.subscription ? SUB[o.subscription.status] ?? [o.subscription.status, ''] : null;
  return (
    <div className={p.card}>
      <div className={p.cardHead}>
        <span><span className={p.l}>Zamówienie{o.paid_at ? ` · ${day(o.paid_at)}` : ''}</span><b>{legal(o.company_name)}</b></span>
        <span className={`${p.statusPill} ${o.status === 'paid' ? p.pillOk : o.status === 'payment_review' ? p.pillWarn : ''}`}><i aria-hidden="true" />{ORDER_STATUS[o.status] ?? o.status}</span>
      </div>
      <ul className={p.rows}>
        {items.map((i) => (
          <li key={i.name}><span>{i.name}{i.quantity > 1 ? ` × ${i.quantity}` : ''}</span><span>{money(i.unit_amount_minor * i.quantity)}{i.billing_interval ? ' / mies.' : ''}</span></li>
        ))}
      </ul>
      {o.invoice_number && <p className={p.small} style={{ margin: '10px 0 0' }}><InvoiceLink orderId={o.id} number={o.invoice_number} placement="panel_account" /> Kliknij, aby otworzyć ją w kosztach firmy w Księgai, bez ponownego logowania.</p>}
      {o.requires_review && <p className={`${p.small} ${p.muted}`} style={{ margin: '6px 0 0' }}>Przed rozpoczęciem prac potwierdzimy dane firmy.</p>}
      {o.subscription && sub && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--hair2)' }}>
          <span className={p.small}>
            <span className={`${p.statusPill} ${sub[1] === 'ok' ? p.pillOk : sub[1] === 'warn' ? p.pillWarn : ''}`} style={{ marginRight: 8 }}><i aria-hidden="true" />{ws?.plan?.name ?? 'Plan'} {sub[0]}</span>
            {money(o.recurring_gross_minor)} / mies.
            {o.subscription.current_period_end && (o.subscription.cancel_at_period_end ? `, kończy się ${day(o.subscription.current_period_end)}` : `, następna płatność ${day(o.subscription.current_period_end)}`)}
          </span>
          <button type="button" className={p.btnLine} onClick={onPortal} disabled={busy}>{busy ? 'Otwieramy…' : 'Karta, faktury Stripe, rezygnacja'}<ExternalLink size={15} aria-hidden="true" /></button>
        </div>
      )}
    </div>
  );
}
