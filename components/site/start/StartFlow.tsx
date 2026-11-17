'use client';

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Building2, Check, Mail, X } from 'lucide-react';
import posthog from 'posthog-js';
import { publicAction } from '@/lib/tovernet/api';
import { PRICES, asLocale, copyFor, price, type Locale } from '@/lib/site/copy';
import { SELLER } from '@/lib/seller';
import { siteFonts } from '../fonts';
import s from '../site.module.css';
import f from './start.module.css';

/**
 * Self-start (ksiegai docs/plans/tovernet/28-self-start-onboarding.md): package -> NIP/KRS ->
 * e-mail -> the personal offer link arrives by e-mail. That link opens the account with one
 * click and lands on the offer with the package chosen. Same idea as Księgai's KSeF assist.
 * The link is never shown here: only the owner of the address can open it.
 */

export type Pkg = 'start' | 'firma' | 'pro';
type Company = { found: boolean; kind?: 'krs' | 'other'; name?: string; city?: string | null; krs?: string | null; nip?: string | null };
type Api = { open: (o: { pkg?: Pkg | null; placement: string }, from?: HTMLElement | null) => void };

const Ctx = createContext<Api | null>(null);
const NAMES: Record<Pkg, string> = { start: 'Start', firma: 'Firma', pro: 'Pro' };
const ev = (e: string, p: Record<string, unknown> = {}) => { try { posthog.capture?.(`site_start_${e}`, p); } catch { /* never break the flow */ } };

export function StartProvider({ children, locale: raw, page }: { children: ReactNode; locale: string; page?: string }) {
  const locale = asLocale(raw);
  const [state, setState] = useState<{ pkg: Pkg; placement: string } | null>(null);
  const fromRef = useRef<HTMLElement | null>(null);
  const pushed = useRef(false);

  const finish = useCallback(() => {
    setState(null);
    pushed.current = false;
    requestAnimationFrame(() => fromRef.current?.focus?.({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const onPop = () => { if (pushed.current) finish(); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [finish]);

  const open = useCallback((o: { pkg?: Pkg | null; placement: string }, from?: HTMLElement | null) => {
    fromRef.current = from ?? (document.activeElement as HTMLElement | null);
    // Same URL, new entry: the phone's Back button closes the sheet instead of leaving the page.
    window.history.pushState({ ...(window.history.state ?? {}), tvStart: true }, '', window.location.href);
    pushed.current = true;
    setState({ pkg: o.pkg ?? 'firma', placement: o.placement });
    ev('opened', { package: o.pkg ?? null, placement: o.placement, page: page ?? null });
  }, [page]);

  const close = useCallback(() => {
    if (pushed.current) window.history.back();
    else finish();
  }, [finish]);

  const api = useMemo(() => ({ open }), [open]);
  return (
    <Ctx.Provider value={api}>
      {children}
      {state && <Sheet locale={locale} initial={state.pkg} placement={state.placement} page={page} onClose={close} />}
    </Ctx.Provider>
  );
}

export const useStart = () => useContext(Ctx);

/** A button that opens the flow with a package. Renders nothing outside a provider. */
export function StartButton({ pkg, placement, className, style, children }: { pkg?: Pkg | null; placement: string; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const api = useStart();
  if (!api) return null;
  return <button type="button" className={className} style={style} aria-haspopup="dialog" onClick={(e) => api.open({ pkg, placement }, e.currentTarget)}>{children}</button>;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';

function Sheet({ locale, initial, placement, page, onClose }: { locale: Locale; initial: Pkg; placement: string; page?: string; onClose: () => void }) {
  const c = copyFor(locale).start;
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const [pkg, setPkg] = useState<Pkg>(initial);
  const [step, setStep] = useState<'company' | 'email' | 'done'>('company');
  const [query, setQuery] = useState('');
  const [company, setCompany] = useState<Company | null>(null);
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'sent' | 'manual'>('sent');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const el = panel.current;
    el?.querySelector<HTMLInputElement>('input')?.focus();
    const html = document.documentElement;
    const before = { o: html.style.overflow, g: html.style.scrollbarGutter };
    html.style.scrollbarGutter = 'stable';
    html.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeRef.current(); return; }
      if (e.key !== 'Tab' || !el) return;
      const els = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null);
      if (!els.length) return;
      const first = els[0]; const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); html.style.overflow = before.o; html.style.scrollbarGutter = before.g; };
  }, []);

  // Focus the first field of each step.
  useEffect(() => { panel.current?.querySelector<HTMLElement>('input, [data-focus]')?.focus({ preventScroll: true }); }, [step]);

  const lookup = async (e: FormEvent) => {
    e.preventDefault();
    const digits = query.replace(/\D/g, '');
    if (digits.length !== 10) { setError(c.invalid); return; }
    setBusy(true); setError('');
    try {
      const r = await publicAction<Company>('tovernetStart.lookup', { query: digits });
      if (!r.found) { setError(c.notFound); ev('not_found'); return; }
      setCompany(r); setStep('email');
      ev('company_found', { kind: r.kind, package: pkg });
    } catch {
      setError(c.failed); ev('failed', { step: 'lookup' });
    } finally { setBusy(false); }
  };

  const request = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError(c.emailField); return; }
    setBusy(true); setError('');
    try {
      const r = await publicAction<{ ok: boolean; mode: 'sent' | 'manual' }>('tovernetStart.request', {
        query: query.replace(/\D/g, ''), email: email.trim(), package: pkg, page: page ?? placement,
      });
      setMode(r.mode); setStep('done');
      ev('requested', { mode: r.mode, package: pkg, kind: company?.kind ?? null });
    } catch (x) {
      const msg = x instanceof Error ? x.message : '';
      setError(/rate|429|za dużo/i.test(msg) ? c.rateLimited : c.failed);
      ev('failed', { step: 'request', reason: /rate/i.test(msg) ? 'rate_limited' : 'error' });
    } finally { setBusy(false); }
  };

  const stepIndex = step === 'company' ? 0 : step === 'email' ? 1 : 2;
  const prices = { start: PRICES.start, firma: PRICES.firma, pro: PRICES.pro };

  return (
    <div className={`${s.tokens} ${siteFonts} ${f.scrim}`} onClick={onClose}>
      <div ref={panel} className={f.panel} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} onClick={(e) => e.stopPropagation()}>
        <header className={f.head}>
          <p className={s.label}>{c.dialog}</p>
          <button type="button" className={f.close} onClick={onClose} aria-label={c.close}><X size={18} aria-hidden="true" /></button>
        </header>

        <ol className={f.steps} aria-label={c.dialog}>
          {c.steps.map((t, i) => (
            <li key={t} data-state={i < stepIndex ? 'done' : i === stepIndex ? 'now' : 'next'} aria-current={i === stepIndex ? 'step' : undefined}>
              <span>{i < stepIndex ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : i + 1}</span>{t}
            </li>
          ))}
        </ol>

        {step !== 'done' && (
          <fieldset className={f.pkgs}>
            <legend className={s.label}>{c.pkgLabel}</legend>
            {(['start', 'firma', 'pro'] as Pkg[]).map((k) => (
              <label key={k} className={f.pkg}>
                <input type="radio" name={`${id}-pkg`} checked={pkg === k} onChange={() => setPkg(k)} />
                <span><b>{NAMES[k]}</b><small>{price(prices[k], locale)}</small></span>
              </label>
            ))}
          </fieldset>
        )}

        <div className={f.body} key={step}>
          {step === 'company' && (
            <form onSubmit={lookup} noValidate>
              <h2 id={`${id}-t`} className={f.title}>{c.companyTitle}</h2>
              <p className={f.lead}>{c.companyLead}</p>
              <label className={f.field}>
                <span>{c.companyField}</span>
                <input inputMode="numeric" autoComplete="off" value={query} placeholder={c.companyPlaceholder} maxLength={16}
                       onChange={(e) => { setQuery(e.target.value); setError(''); }} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : undefined} />
              </label>
              {error && <p id={`${id}-e`} role="alert" className={f.err}>{error}</p>}
              <button type="submit" className={f.go} disabled={busy}>{busy ? c.looking : c.next}<ArrowRight size={18} aria-hidden="true" /></button>
            </form>
          )}

          {step === 'email' && company && (
            <form onSubmit={request} noValidate>
              <div className={f.company}>
                <Building2 size={20} aria-hidden="true" />
                <span>
                  <b>{company.name}</b>
                  <small>{[company.city, company.krs ? `KRS ${company.krs}` : null, company.nip ? `NIP ${company.nip}` : null, company.kind === 'other' ? c.other : null].filter(Boolean).join(' · ')}</small>
                </span>
                <button type="button" className={f.change} onClick={() => { setStep('company'); setError(''); }}>{c.change}</button>
              </div>
              <h2 id={`${id}-t`} className={f.title}>{c.emailTitle}</h2>
              <p className={f.lead}>{company.kind === 'other' ? c.otherLead : c.emailLead}</p>
              <label className={f.field}>
                <span>{c.emailField}</span>
                <input type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                       aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : `${id}-p`} />
              </label>
              {error && <p id={`${id}-e`} role="alert" className={f.err}>{error}</p>}
              <button type="submit" className={f.go} disabled={busy}>{busy ? c.sending : c.send}<Mail size={18} aria-hidden="true" /></button>
              <p id={`${id}-p`} className={f.fine}>{c.privacy}</p>
              <button type="button" className={f.back} onClick={() => setStep('company')}><ArrowLeft size={14} aria-hidden="true" />{c.back}</button>
            </form>
          )}

          {step === 'done' && (
            <div className={f.done} role="status">
              <span className={f.tick}><Check size={26} strokeWidth={2.5} aria-hidden="true" /></span>
              <h2 id={`${id}-t`} className={f.title} tabIndex={-1} data-focus="">{mode === 'sent' ? c.sentTitle : c.manualTitle}</h2>
              <p className={f.lead}>{mode === 'sent' ? c.sentLead(email.trim()) : c.manualLead(email.trim())}</p>
              {mode === 'sent' && (
                <>
                  <ol className={f.next}>{c.sentSteps.map((x, i) => <li key={x}><span>{i + 1}</span>{x}</li>)}</ol>
                  <p className={f.fine}>{c.sentSpam}</p>
                </>
              )}
              <p className={f.fine}><a href={SELLER.phoneHref}>{SELLER.phone}</a> · <a href={`mailto:${SELLER.email}`}>{SELLER.email}</a></p>
              <button type="button" className={f.go} onClick={onClose}>{c.close}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
