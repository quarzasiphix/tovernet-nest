'use client';
// Static export with images.unoptimized: next/image adds nothing; the WebP files are pre-sized.
/* eslint-disable @next/next/no-img-element */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Monitor, ShieldCheck, Smartphone, X } from 'lucide-react';
import posthog from 'posthog-js';
import { evidenceHref, hostOf, localize, siteProjects, type PortfolioProject } from '@/lib/tovernet/portfolio';
import { asLocale, copyFor, type Locale } from '@/lib/site/copy';
import { siteFonts } from '../fonts';
import s from '../site.module.css';
import p from './preview.module.css';

/**
 * Immersive project preview (redesign 2026-11). Opens over any page or offer without leaving
 * it; closing returns to the exact place, focus and scroll included.
 *
 * url="route": the address becomes the project's case-study route (/pl/projekty/<slug>/), a
 * real page, so the link can be shared or reloaded; Back closes the preview.
 * url="none": the address stays as it is (personal offers keep their #<demo id>); Back still
 * closes the preview through a same-URL history entry.
 */

type Track = (event: string, props?: Record<string, unknown>) => void;
type Api = { open: (slug: string, placement: string, from?: HTMLElement | null) => void; locale: Locale };
const Ctx = createContext<Api | null>(null);
const KEY = 'tvPreview';

const siteTrack: Track = (event, props = {}) => {
  try { posthog.capture?.(`site_${event}`, props); } catch { /* analytics never breaks the page */ }
};

export function PreviewProvider({ children, locale: raw, url = 'route', track = siteTrack, onWant, wantLabel }: {
  children: ReactNode; locale: string; url?: 'route' | 'none'; track?: Track;
  /** "I want something like this": default goes to the contact form on the homepage. */
  onWant?: () => void;
  /** Replaces the label of that action (inside an offer: "back to the offer"). */
  wantLabel?: string;
}) {
  const locale = asLocale(raw);
  const projects = useMemo(() => siteProjects(), []);
  const [slug, setSlug] = useState<string | null>(null);
  const openRef = useRef<{ at: number; placement: string; seen: Set<string>; from: HTMLElement | null; via: string; then: (() => void) | null; y: number } | null>(null);
  // Our own history entry. Not read back from history.state: Next's router may rewrite that
  // object after a pushState and drop custom keys.
  const pushedRef = useRef(false);

  const finish = useCallback(() => {
    const o = openRef.current;
    if (!o) return;
    openRef.current = null;
    setSlug(null);
    track('project_preview_closed', { via: o.via, placement: o.placement, seconds: Math.round((Date.now() - o.at) / 1000), projects_seen: o.seen.size });
    // Exactly where the visitor was, whatever the browser did with the history entry.
    if (Math.abs(window.scrollY - o.y) > 1) window.scrollTo({ top: o.y, behavior: 'instant' as ScrollBehavior });
    o.then?.();
    // Back to the element that opened it, unless the follow-up action moved focus on purpose.
    requestAnimationFrame(() => {
      const a = document.activeElement;
      if (!a || a === document.body || !a.isConnected) o.from?.focus?.({ preventScroll: true });
    });
  }, [track]);

  // A reload with the marker left on the entry: drop it, so Back is a normal Back again.
  useEffect(() => {
    if (window.history.state?.[KEY]) {
      const { [KEY]: _d, ...rest } = window.history.state as Record<string, unknown>;
      window.history.replaceState(rest, '', window.location.href);
    }
    // Any Back while open leaves our entry: close.
    const onPop = () => { if (openRef.current) { pushedRef.current = false; finish(); } };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [finish]);

  const href = useCallback((x: string) => `/${locale}/projekty/${x}/`, [locale]);

  const open = useCallback((x: string, placement: string, from?: HTMLElement | null) => {
    if (openRef.current || !projects.some((pr) => pr.slug === x)) return;
    openRef.current = { at: Date.now(), placement, seen: new Set([x]), from: from ?? (document.activeElement as HTMLElement | null), via: 'back', then: null, y: window.scrollY };
    const state = { ...(window.history.state ?? {}), [KEY]: x };
    window.history.pushState(state, '', url === 'route' ? href(x) : window.location.href);
    pushedRef.current = true;
    setSlug(x);
    track('project_preview_opened', { project: x, placement, mode: url });
  }, [projects, url, href, track]);

  const go = useCallback((x: string, how: string) => {
    const o = openRef.current;
    if (!o) return;
    o.seen.add(x);
    window.history.replaceState({ ...(window.history.state ?? {}), [KEY]: x }, '', url === 'route' ? href(x) : window.location.href);
    setSlug(x);
    track('project_preview_navigated', { project: x, how });
  }, [url, href, track]);

  const close = useCallback((via: string, then?: () => void) => {
    const o = openRef.current;
    if (!o) return;
    o.via = via;
    o.then = then ?? null;
    if (pushedRef.current) window.history.back();
    else finish();
  }, [finish]);

  const api = useMemo(() => ({ open, locale }), [open, locale]);
  const want = useCallback(() => {
    track('cta_clicked', { placement: 'project_preview' });
    close('want', onWant ?? (() => {
      const target = document.getElementById('kontakt');
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); (target.querySelector('textarea') ?? target.querySelector('input'))?.focus({ preventScroll: true }); }
      else window.location.href = `/${locale}/#kontakt`;
    }));
  }, [close, onWant, locale, track]);

  const index = slug ? projects.findIndex((x) => x.slug === slug) : -1;
  return (
    <Ctx.Provider value={api}>
      {children}
      {slug && index >= 0 && (
        <Overlay
          key="overlay"
          locale={locale}
          project={projects[index]}
          index={index}
          total={projects.length}
          from={openRef.current?.from ?? null}
          onClose={close}
          onGo={(dir) => go(projects[(index + dir + projects.length) % projects.length].slug, dir > 0 ? 'next' : 'prev')}
          onWant={want}
          wantLabel={wantLabel}
          external={url === 'none'}
          onLink={(action) => track('project_link_clicked', { project: slug, action })}
        />
      )}
    </Ctx.Provider>
  );
}

export const usePreview = () => useContext(Ctx);

/**
 * A real link to the case study. With a provider, a plain click opens the preview instead;
 * a modified click (new tab, etc.) keeps the browser's behaviour.
 */
export function PreviewLink({ slug, placement, className, children, label, style }: { slug: string; placement: string; className?: string; children: ReactNode; label?: string; style?: React.CSSProperties }) {
  const api = usePreview();
  const locale = api?.locale ?? 'pl';
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!api || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    api.open(slug, placement, e.currentTarget);
  };
  return <a href={`/${locale}/projekty/${slug}/`} className={className} style={style} onClick={onClick} aria-haspopup="dialog" aria-label={label}>{children}</a>;
}

const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

function Overlay({ locale, project: pr, index, total, from, onClose, onGo, onWant, onLink, wantLabel, external = false }: {
  locale: Locale; project: PortfolioProject; index: number; total: number; from: HTMLElement | null;
  onClose: (via: string) => void; onGo: (dir: 1 | -1) => void; onWant: () => void; onLink: (action: string) => void; wantLabel?: string;
  /** Inside an offer: links that would leave the page open in a new tab instead. */
  external?: boolean;
}) {
  const c = copyFor(locale);
  const t = c.preview;
  const l = localize(pr, locale);
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<'desktop' | 'phone'>('desktop');
  const cb = useRef({ onClose, onGo });
  cb.current = { onClose, onGo };
  const full = pr.preview?.full ?? pr.shots[0];
  const phone = pr.preview?.phone;
  const pal = pr.palette ?? { bg: '#1B1C1F', fg: '#ECEBE4', accent: '#9AA6FF' };

  // Opening: grow from the clicked element; keys; scroll lock; focus.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const r = from?.getBoundingClientRect();
    if (!still && r && r.width > 0 && el.animate) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      el.animate([
        { clipPath: `inset(${r.top}px ${vw - r.right}px ${vh - r.bottom}px ${r.left}px round 14px)` },
        { clipPath: 'inset(0px 0px 0px 0px round 0px)' },
      ], { duration: 720, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    el.focus({ preventScroll: true });
    // Lock the page without moving it: keeping the scrollbar gutter stops the reflow that
    // would otherwise shift the page (and its scroll position) under the preview.
    const html = document.documentElement;
    const before = { overflow: html.style.overflow, gutter: html.style.scrollbarGutter };
    html.style.scrollbarGutter = 'stable';
    html.style.overflow = 'hidden';
    // Capture phase: an offer drawer underneath must not see these keys.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cb.current.onClose('escape'); return; }
      const inFrame = frame.current?.contains(e.target as Node);
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !inFrame && !(e.target as HTMLElement).isContentEditable) {
        e.preventDefault(); e.stopPropagation(); cb.current.onGo(e.key === 'ArrowRight' ? 1 : -1); return;
      }
      if (e.key !== 'Tab') return;
      e.stopPropagation();
      const els = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null);
      if (!els.length) return;
      const first = els[0]; const last = els[els.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => { window.removeEventListener('keydown', onKey, true); html.style.overflow = before.overflow; html.style.scrollbarGutter = before.gutter; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // The page scrolls itself slowly inside the browser frame until the visitor takes over.
  useEffect(() => {
    const f = frame.current;
    if (!f) return;
    f.scrollTop = 0;
    if (device !== 'desktop' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0; let stop = false; let startAt = 0;
    const halt = () => { stop = true; };
    const step = (time: number) => {
      if (stop) return;
      if (!startAt) startAt = time + 1400;
      if (time > startAt) {
        f.scrollTop += 0.6;
        if (f.scrollTop + f.clientHeight >= f.scrollHeight - 1) return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const opts = { passive: true } as const;
    f.addEventListener('wheel', halt, opts); f.addEventListener('pointerdown', halt, opts); f.addEventListener('touchstart', halt, opts); f.addEventListener('keydown', halt);
    return () => { cancelAnimationFrame(raf); f.removeEventListener('wheel', halt); f.removeEventListener('pointerdown', halt); f.removeEventListener('touchstart', halt); f.removeEventListener('keydown', halt); };
  }, [pr.slug, device]);

  const kind = c.kind[pr.kind];
  const status = c.status[pr.status];
  const caseHref = pr.caseStudy ? evidenceHref(pr.caseStudy, locale) : null;

  return (
    <div ref={root} className={`${s.tokens} ${siteFonts} ${p.root}`} role="dialog" aria-modal="true" aria-label={t.dialog(pr.name)} tabIndex={-1}
         style={{ '--pbg': pal.bg, '--pfg': pal.fg, '--pac': pal.accent } as React.CSSProperties}>
      <div className={p.bar}>
        <span className={p.word} aria-hidden="true">tovernet<i /></span>
        <p className={p.count} aria-live="polite">{t.of(index + 1, total)}</p>
        <div className={p.barTools}>
          <button type="button" className={p.round} onClick={() => onGo(-1)} aria-label={t.prev}><ArrowLeft size={18} aria-hidden="true" /></button>
          <button type="button" className={p.round} onClick={() => onGo(1)} aria-label={t.next}><ArrowRight size={18} aria-hidden="true" /></button>
          <button type="button" className={p.close} onClick={() => onClose('button')}><span>{t.close}</span><X size={18} aria-hidden="true" /></button>
        </div>
      </div>

      <div className={p.body} key={pr.slug}>
        <div className={p.info}>
          <p className={p.meta}><span>{kind}</span><span className={p.live}><i aria-hidden="true" />{status}</span><span>{l.category}</span></p>
          <h2 className={p.name}>{pr.name}</h2>
          <p className={p.headline}>{l.headline}</p>

          <div className={p.actions}>
            {pr.url && (
              <a className={`${s.btn} ${p.visit}`} href={pr.url} target="_blank" rel="noopener noreferrer" onClick={() => onLink('live')}>
                {t.visit}<ArrowUpRight size={17} aria-hidden="true" /><span className={s.sr}> {t.newTab}</span>
              </a>
            )}
            {caseHref && (
              <a className={`${s.btn} ${s.btnGhost} ${p.ghost}`} href={caseHref} onClick={() => onLink('case_study')}
                 {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {t.caseStudy}{external && <span className={s.sr}> {t.newTab}</span>}
              </a>
            )}
          </div>

          <dl className={p.facts}>
            <div><dt>{t.role}</dt><dd>{l.role}</dd></div>
            <div><dt>{t.built}</dt><dd><ul>{l.built.map((b) => <li key={b}>{b}</li>)}</ul></dd></div>
            <div>
              <dt>{t.verify}</dt>
              <dd>
                <ul className={p.proof}>
                  {l.evidence.map((e) => (
                    <li key={e.label}><ShieldCheck size={15} aria-hidden="true" />
                      {e.url ? <a href={evidenceHref(e.url, locale)} target="_blank" rel="noopener noreferrer" onClick={() => onLink(`evidence_${e.kind}`)}>{e.label}</a> : e.label}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <button type="button" className={p.want} onClick={onWant}>{wantLabel ?? t.want}<ArrowRight size={18} aria-hidden="true" /></button>
        </div>

        <div className={p.stage}>
          <div className={p.devices} role="group" aria-label={`${t.desktop} / ${t.phone}`}>
            <button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><Monitor size={15} aria-hidden="true" />{t.desktop}</button>
            {phone && <button type="button" aria-pressed={device === 'phone'} onClick={() => setDevice('phone')}><Smartphone size={15} aria-hidden="true" />{t.phone}</button>}
          </div>
          {device === 'desktop' ? (
            <figure className={p.browser}>
              <div className={p.chrome} aria-hidden="true"><i /><i /><i /><span>{pr.url ? hostOf(pr.url) : pr.name}</span></div>
              <div ref={frame} className={p.frame} tabIndex={0} role="region" aria-label={t.scroll}>
                <img src={full.src} alt={l.alt(full)} width={full.width} height={full.height} decoding="async" />
              </div>
              <figcaption className={s.sr}>{t.demo}</figcaption>
            </figure>
          ) : phone && (
            <figure className={p.phone}>
              <div><img src={phone.src} alt={l.alt(phone)} width={phone.width} height={phone.height} decoding="async" /></div>
            </figure>
          )}
          {device === 'desktop' && phone && (
            <div className={p.phoneFloat} aria-hidden="true"><div><img src={phone.src} alt="" width={phone.width} height={phone.height} decoding="async" loading="lazy" /></div></div>
          )}
        </div>
      </div>
    </div>
  );
}
