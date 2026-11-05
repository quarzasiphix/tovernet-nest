'use client';

// Checkout overlay: today's payment and what follows on one side, Stripe's form on the other,
// then a calm confirmation. Used by the order checkout, early repayment and autopay setup.
// Esc and the close button leave it; focus stays inside while it is open.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Clock, X } from 'lucide-react';
import PaymentForm from './PaymentForm';
import p from './pay.module.css';

export type ConfirmResult = { status: 'paid' } | { status: 'pending' } | { status: 'failed'; message: string };

export type PayModalProps = {
  open: boolean;
  onClose: () => void;
  kicker: string;
  title: string;
  todayLabel?: string;
  todayAmount: string;
  lines?: { label: string; sub?: string; amount: string }[];
  future?: ReactNode;
  note?: ReactNode;
  clientSecret: string | null;
  loadError?: string | null;
  kind?: 'payment' | 'setup';
  submitLabel: string;
  returnUrl: string;
  confirm: (intentId: string, status: string) => Promise<ConfirmResult>;
  onMethod?: (type: string) => void;
  email?: string | null;
  success: { title: string; text: string; action?: { href?: string; onClick?: () => void; label: string } };
};

export default function PayModal(m: PayModalProps) {
  const [phase, setPhase] = useState<'form' | 'confirming' | 'pending' | 'paid'>('form');
  const [failure, setFailure] = useState('');
  const [formKey, setFormKey] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!m.open) return;
    opener.current = document.activeElement;
    setPhase('form'); setFailure('');
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => dialog.current?.querySelector<HTMLElement>('button, [href], input')?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [m.open]);

  useEffect(() => {
    if (!m.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'confirming') m.onClose();
      if (e.key !== 'Tab' || !dialog.current) return;
      const items = Array.from(dialog.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), iframe'));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [m, phase]);

  if (!m.open) return null;

  const done = async (id: string, status: string) => {
    setPhase('confirming');
    const r = await m.confirm(id, status);
    if (r.status === 'paid') setPhase('paid');
    else if (r.status === 'pending') setPhase('pending');
    else { setFailure(r.message); setPhase('form'); setFormKey((k) => k + 1); }
  };

  return (
    <div className={`${p.theme} ${p.overlay}`} role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && phase === 'form') m.onClose(); }}>
      <div ref={dialog} className={p.dialog} role="dialog" aria-modal="true" aria-labelledby="pay-title">
        {phase !== 'confirming' && (
          <button type="button" className={p.close} onClick={m.onClose} aria-label="Zamknij"><X size={18} aria-hidden="true" /></button>
        )}
        <div className={p.side}>
          <p className={p.kicker}>{m.kicker}</p>
          <h2 id="pay-title" className={p.title}>{m.title}</h2>
          <p className={p.todayLabel}>{m.todayLabel ?? 'Płacisz teraz'}</p>
          <p className={p.today}>{m.todayAmount}</p>
          {m.lines && m.lines.length > 0 && (
            <ul className={p.lines}>
              {m.lines.map((l) => <li key={l.label}><span>{l.label}{l.sub && <small>{l.sub}</small>}</span><span>{l.amount}</span></li>)}
            </ul>
          )}
          {m.future && <div className={p.future}>{m.future}</div>}
          {m.note && <p className={p.note}>{m.note}</p>}
        </div>
        <div className={p.main} aria-live="polite">
          {phase === 'form' && (
            <>
              {failure && <p className={p.error} role="alert" style={{ marginBottom: 16 }}>{failure}</p>}
              {m.loadError
                ? <p className={p.error} role="alert">{m.loadError}</p>
                : m.clientSecret
                  ? <PaymentForm key={formKey} clientSecret={m.clientSecret} kind={m.kind} submitLabel={m.submitLabel}
                                 returnUrl={m.returnUrl} onDone={(id, st) => void done(id, st)} onMethod={m.onMethod} email={m.email} />
                  : <div className={p.status}><span className={p.spin} aria-hidden="true" /><p>Przygotowujemy bezpieczną płatność…</p></div>}
            </>
          )}
          {phase === 'confirming' && (
            <div className={p.status} role="status">
              <span className={p.pulse}><span className={p.spin} aria-hidden="true" /></span>
              <h2>Potwierdzamy płatność</h2>
              <p>To trwa zwykle kilka sekund. Nie zamykaj tego okna.</p>
            </div>
          )}
          {phase === 'pending' && (
            <div className={p.status} role="status">
              <span className={p.pulse}><Clock size={30} aria-hidden="true" /></span>
              <h2>Płatność w drodze</h2>
              <p>Bank jeszcze ją potwierdza. Gdy dotrze, wyślemy e-mail, a w panelu klienta zobaczysz ją jako opłaconą. Nie płać drugi raz.</p>
              {m.success.action && <Action {...m.success.action} />}
            </div>
          )}
          {phase === 'paid' && (
            <div className={p.status} role="status">
              <svg className={p.ring} viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="44" /><path d="M30 49 l12 12 l24 -26" /></svg>
              <h2>{m.success.title}</h2>
              <p>{m.success.text}</p>
              {m.success.action && <Action {...m.success.action} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Action({ href, onClick, label }: { href?: string; onClick?: () => void; label: string }) {
  return href
    ? <a className={p.btn} href={href} style={{ maxWidth: 320, textDecoration: 'none' }}>{label}<ArrowRight size={18} aria-hidden="true" /></a>
    : <button type="button" className={p.btn} style={{ maxWidth: 320 }} onClick={onClick}>{label}<ArrowRight size={18} aria-hidden="true" /></button>;
}
