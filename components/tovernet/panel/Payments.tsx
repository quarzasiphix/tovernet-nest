'use client';

// "Płatności": the website price and its instalments, the monthly plan, automatic card
// payments and early repayment, in words a small-business owner reads in one pass.
// Two obligations, shown apart: Strona (paid once or in instalments) and Plan (monthly,
// from publication). ksiegai docs/plans/tovernet/19-instalments.md §6.

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, CreditCard, ExternalLink } from 'lucide-react';
import { price as money } from '../studio/motion';
import { track } from '@/lib/tovernet/analytics';
import PayModal, { type ConfirmResult } from '../pay/PayModal';
import { paymentMessage } from '../pay/PaymentForm';
import { day } from './model';
import type { BillingApi, PaymentCharge, PaymentOrder } from './types';
import p from './panel.module.css';

const CHARGE: Record<PaymentCharge['status'], [string, 'ok' | 'warn' | '']> = {
  paid: ['opłacona', 'ok'], invoiced: ['do zapłaty', 'warn'], scheduled: ['zaplanowana', ''], superseded: ['spłacona wcześniej', 'ok'],
};

type Modal =
  | { kind: 'payoff'; order: PaymentOrder; secret: string | null; amount: number; count: number; error?: string }
  | { kind: 'autopay'; order: PaymentOrder; secret: string | null; error?: string };

export default function Payments({ billing, email }: { billing: BillingApi; email?: string | null }) {
  const [orders, setOrders] = useState<PaymentOrder[] | null>(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<Modal | null>(null);
  const [cancelAsk, setCancelAsk] = useState<string | null>(null);
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    try { setOrders(await billing.payments()); setError(''); }
    catch { setError('Nie udało się pobrać płatności. Odśwież stronę.'); }
  }, [billing]);
  useEffect(() => { void load(); }, [load]);

  if (error) return <p className={p.alert} role="alert">{error}</p>;
  if (!orders) return <p className={`${p.small} ${p.muted}`}>Wczytujemy płatności…</p>;
  if (!orders.length) {
    return <section className={p.card}><h2 className={p.h2}>Płatności</h2><p className={p.small}>Tu zobaczysz raty za stronę, plan miesięczny i historię płatności.</p></section>;
  }

  const openPayoff = async (o: PaymentOrder) => {
    setModal({ kind: 'payoff', order: o, secret: null, amount: o.website?.remaining_minor ?? 0, count: 0 });
    track('payoff_opened', { remaining: (o.website?.remaining_minor ?? 0) / 100 });
    try {
      const r = await billing.payoff(o.order_id);
      setModal({ kind: 'payoff', order: o, secret: r.clientSecret, amount: r.amountMinor, count: r.count });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      setModal({ kind: 'payoff', order: o, secret: null, amount: 0, count: 0,
        error: /payment_processing/.test(msg) ? 'Trwa płatność raty. Spróbuj za kilka minut.'
          : /nothing_to_repay/.test(msg) ? 'Wszystkie pozostałe raty mają już faktury. Opłać je poniżej.' : 'Nie udało się przygotować spłaty.' });
    }
  };
  const openAutopay = async (o: PaymentOrder) => {
    setModal({ kind: 'autopay', order: o, secret: null });
    track('autopay_setup_opened', {});
    try { setModal({ kind: 'autopay', order: o, secret: (await billing.autopaySetup(o.order_id)).clientSecret }); }
    catch { setModal({ kind: 'autopay', order: o, secret: null, error: 'Nie udało się przygotować zapisu karty.' }); }
  };
  const confirmPayment = async (id: string): Promise<ConfirmResult> => {
    for (let i = 0; i < 8; i++) {
      try {
        const r = await billing.confirm(id);
        if (r.paymentStatus === 'succeeded') { track('balance_repaid_early', {}); void load(); return { status: 'paid' }; }
        if (r.paymentStatus === 'requires_payment_method' || r.paymentStatus === 'canceled') return { status: 'failed', message: paymentMessage(r.error) };
      } catch { /* retry */ }
      await new Promise((res) => setTimeout(res, 1500));
    }
    void load();
    return { status: 'pending' };
  };
  const confirmSetup = async (id: string): Promise<ConfirmResult> => {
    try {
      const r = await billing.autopayConfirm(id);
      if (r.status === 'succeeded') { track('autopay_enabled', {}); void load(); return { status: 'paid' }; }
      return { status: 'failed', message: 'Bank nie potwierdził karty. Spróbuj ponownie.' };
    } catch { return { status: 'failed', message: 'Nie udało się zapisać karty. Spróbuj ponownie.' }; }
  };

  return (
    <>
      {orders.map((o) => {
        const w = o.website;
        const plan = o.plan;
        const autopay = w?.autopay ?? plan?.autopay ?? null;
        const nextW = w?.charges?.find((c) => c.status === 'invoiced' || c.status === 'scheduled');
        const nextP = plan?.charges?.slice().reverse().find((c) => c.status === 'invoiced' || c.status === 'scheduled');
        const pct = w ? Math.round((w.paid_minor / w.total_minor) * 100) : 100;
        return (
          <div key={o.order_id} style={{ display: 'grid', gap: 16 }}>
            {o.overdue.length > 0 && (
              <div className={p.alert} role="alert" style={{ display: 'grid', gap: 8 }}>
                <b><AlertTriangle size={16} aria-hidden="true" style={{ verticalAlign: '-3px', marginRight: 6 }} />Masz {o.overdue.length === 1 ? 'nieopłaconą płatność' : `${o.overdue.length} nieopłacone płatności`}</b>
                {o.overdue.map((c) => (
                  <span key={c.id}>{c.label}, {money(c.amount_minor)}, termin {day(c.due_date)}.{' '}
                    <a href={`/platnosc/#${c.share_slug}`}>Zapłać teraz</a></span>
                ))}
                <span className={p.small}>Masz pytania albo potrzebujesz innego terminu? Napisz do nas w Wiadomościach.</span>
              </div>
            )}

            <section className={p.card} aria-labelledby={`w-${o.order_id}`}>
              <h2 id={`w-${o.order_id}`} className={p.h2} style={{ marginBottom: 4 }}>Strona internetowa</h2>
              {w ? (
                <>
                  <p className={`${p.small} ${p.muted}`} style={{ margin: '0 0 14px' }}>{w.name}, płatność w {w.count} ratach bez odsetek. {w.status === 'completed' ? 'Spłacona w całości.' : ''}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
                    <Stat label="Cena strony" value={money(w.total_minor)} />
                    <Stat label="Zapłacone" value={money(w.paid_minor)} />
                    <Stat label="Zostało" value={money(w.remaining_minor)} strong />
                    {nextW && <Stat label="Następna rata" value={`${money(nextW.amount_minor)}, ${day(nextW.due_date)}`} />}
                  </div>
                  <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Spłacona część ceny strony"
                       style={{ height: 8, borderRadius: 99, background: 'var(--sheet2)', border: '1px solid var(--hair)', margin: '16px 0 6px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--stamp)', transition: 'width .6s var(--ease)' }} />
                  </div>
                  <p className={`${p.tiny} ${p.muted}`} style={{ margin: 0 }}>{pct}% ceny strony</p>

                  {w.status !== 'completed' && w.remaining_minor > 0 && (
                    <div className={p.btnRow} style={{ marginTop: 16 }}>
                      <button type="button" className={p.btnLine} onClick={() => void openPayoff(o)}>Spłać resztę teraz<ArrowRight size={16} aria-hidden="true" /></button>
                      <span className={`${p.small} ${p.muted}`}>Bez opłat. Raty, które mają już fakturę, opłacasz osobno.</span>
                    </div>
                  )}

                  <details style={{ marginTop: 16 }}>
                    <summary className={p.small} style={{ cursor: 'pointer' }}>Harmonogram i historia rat</summary>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10, fontSize: 14 }}>
                      <thead><tr className={p.muted} style={{ textAlign: 'left' }}><th style={{ padding: '6px 0' }}>Rata</th><th>Termin</th><th>Kwota</th><th>Status</th><th /></tr></thead>
                      <tbody>
                        <tr style={{ borderTop: '1px solid var(--hair)' }}>
                          <td style={{ padding: '8px 0' }}>1 z {w.count}</td><td>{o.paid_at ? day(o.paid_at) : '–'}</td>
                          <td>{money(w.total_minor - (w.charges ?? []).filter((c) => c.kind !== 'payoff').reduce((s, c) => s + c.amount_minor, 0))}</td>
                          <td><span className={p.pillOk}>opłacona</span></td><td className={`${p.tiny} ${p.muted}`}>{o.first_invoice_number}</td>
                        </tr>
                        {(w.charges ?? []).map((c) => (
                          <tr key={c.id} style={{ borderTop: '1px solid var(--hair)' }}>
                            <td style={{ padding: '8px 0' }}>{c.kind === 'payoff' ? 'Spłata reszty' : `${c.seq} z ${w.count}`}</td>
                            <td>{day(c.due_date)}</td><td>{money(c.amount_minor)}</td>
                            <td><span className={CHARGE[c.status][1] === 'ok' ? p.pillOk : CHARGE[c.status][1] === 'warn' ? p.pillWarn : p.chip}>{CHARGE[c.status][0]}</span></td>
                            <td>{c.status === 'invoiced' && c.share_slug
                              ? <a href={`/platnosc/#${c.share_slug}`} className={p.small}>Zapłać</a>
                              : <span className={`${p.tiny} ${p.muted}`}>{c.invoice_number}</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                </>
              ) : (
                <p className={p.small} style={{ margin: 0 }}>Zapłacona w całości{o.paid_at ? ` ${day(o.paid_at)}` : ''}, {money(o.first_payment_minor)}{o.first_invoice_number ? `, faktura ${o.first_invoice_number}` : ''}.</p>
              )}
            </section>

            {plan && (
              <section className={p.card} aria-labelledby={`p-${o.order_id}`}>
                <h2 id={`p-${o.order_id}`} className={p.h2} style={{ marginBottom: 4 }}>Plan {plan.name}</h2>
                <p className={p.small} style={{ margin: '0 0 12px' }}>
                  {plan.status === 'pending_start' && <>{money(plan.amount_minor)} miesięcznie. Zacznie się w dniu publikacji strony; do tego czasu nic za plan nie płacisz.</>}
                  {plan.status === 'active' && <>{money(plan.amount_minor)} miesięcznie, płatne z góry.{nextP ? ` Następna płatność: ${money(nextP.amount_minor)}, ${day(nextP.due_date)}.` : ''}</>}
                  {plan.status === 'review' && <>Plan aktywny; jedna z płatności czeka na opłacenie.</>}
                  {plan.status === 'cancelled' && <>Plan wyłączony. Opłacony okres trwa do końca.</>}
                </p>
                <p className={`${p.tiny} ${p.muted}`} style={{ margin: '0 0 12px' }}>Plan to osobna płatność niż raty za stronę. Rezygnacja z planu nie kończy rat.</p>
                {(plan.status === 'active' || plan.status === 'pending_start') && (
                  cancelAsk === o.order_id ? (
                    <div className={p.btnRow}>
                      <button type="button" className={p.btnGhost} disabled={busy === o.order_id} onClick={async () => {
                        setBusy(o.order_id);
                        try { await billing.planCancel(o.order_id); track('plan_cancelled', {}); await load(); } finally { setBusy(''); setCancelAsk(null); }
                      }}>Tak, wyłącz plan</button>
                      <button type="button" className={p.btnLine} onClick={() => setCancelAsk(null)}>Zostawiam plan</button>
                      <span className={`${p.small} ${p.muted}`}>Bez planu nie utrzymujemy strony na serwerze po końcu opłaconego okresu.</span>
                    </div>
                  ) : (
                    <button type="button" className={p.btnGhost} onClick={() => setCancelAsk(o.order_id)}>Zrezygnuj z planu</button>
                  )
                )}
              </section>
            )}

            {(w?.status === 'active' || w?.status === 'review' || plan?.status === 'active' || plan?.status === 'pending_start') && (
              <section className={p.card} aria-labelledby={`a-${o.order_id}`}>
                <h2 id={`a-${o.order_id}`} className={p.h2} style={{ marginBottom: 4 }}><CreditCard size={18} aria-hidden="true" style={{ verticalAlign: '-3px', marginRight: 8 }} />Automatyczna płatność</h2>
                {autopay ? (
                  <div className={p.btnRow}>
                    <span className={p.small}>Włączona: <b>{autopay}</b>. Kolejne płatności pobierzemy w dniu terminu; dzień wcześniej dostaniesz e-mail.</span>
                    <button type="button" className={p.btnGhost} disabled={busy === `a${o.order_id}`} onClick={async () => {
                      setBusy(`a${o.order_id}`);
                      try { await billing.autopayOff(o.order_id); track('autopay_disabled', {}); await load(); } finally { setBusy(''); }
                    }}>Wyłącz</button>
                  </div>
                ) : (
                  <div className={p.btnRow}>
                    <span className={p.small}>Nie musisz pamiętać o terminach: zapisz kartę, a raty i plan pobierzemy automatycznie. Wyłączysz to w każdej chwili. Bez tego dostaniesz e-mail z linkiem (BLIK albo karta) przed każdą płatnością.</span>
                    <button type="button" className={p.btn} onClick={() => void openAutopay(o)}>Włącz<ArrowRight size={16} aria-hidden="true" /></button>
                  </div>
                )}
              </section>
            )}
            <p className={`${p.tiny} ${p.muted}`} style={{ margin: 0 }}><ExternalLink size={12} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 4 }} />Faktury za wszystkie płatności są w zakładce Konto i w kosztach Twojej firmy w KsięgaI.</p>
          </div>
        );
      })}

      {modal && (
        <PayModal
          open
          onClose={() => setModal(null)}
          kicker={modal.order.company}
          title={modal.kind === 'payoff' ? 'Spłata pozostałych rat' : 'Automatyczna płatność kartą'}
          todayLabel={modal.kind === 'payoff' ? 'Płacisz teraz' : 'Dziś nic nie płacisz'}
          todayAmount={modal.kind === 'payoff' ? money(modal.amount) : '0 zł'}
          future={modal.kind === 'payoff'
            ? <p>Spłacasz {modal.count ? `${modal.count} ${modal.count === 1 ? 'ratę' : 'rat'}, które nie mają jeszcze faktury` : 'pozostałe raty'}. Bez dodatkowych opłat. Dostaniesz jedną fakturę na tę kwotę.</p>
            : <p>Zapisujemy kartę u Stripe. Kolejne raty i plan pobierzemy w dniu terminu. Wyłączysz to w panelu w każdej chwili.</p>}
          clientSecret={modal.secret}
          loadError={modal.error ?? null}
          kind={modal.kind === 'autopay' ? 'setup' : 'payment'}
          email={email}
          submitLabel={modal.kind === 'payoff' ? `Zapłać ${money(modal.amount)}` : 'Zapisz kartę'}
          returnUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/panel/#platnosci`}
          confirm={(id) => (modal.kind === 'payoff' ? confirmPayment(id) : confirmSetup(id))}
          success={modal.kind === 'payoff'
            ? { title: 'Strona spłacona. Dziękujemy.', text: 'Faktura jest w panelu. Kolejnych rat nie będzie.', action: { onClick: () => setModal(null), label: 'Wróć do płatności' } }
            : { title: 'Automatyczna płatność włączona', text: 'Kolejne płatności pobierzemy z tej karty w dniu terminu.', action: { onClick: () => setModal(null), label: 'Wróć do płatności' } }}
        />
      )}
    </>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ padding: '10px 12px', border: '1px solid var(--hair)', borderRadius: 10, background: 'var(--sheet2)' }}>
      <span className={`${p.tiny} ${p.muted}`} style={{ display: 'block' }}>{label}</span>
      <b style={{ fontSize: strong ? 20 : 16, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{value}</b>
    </div>
  );
}
