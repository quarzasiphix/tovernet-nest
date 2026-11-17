'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import posthog from 'posthog-js';
import AccountLink from '@/components/tovernet/AccountLink';
import { asLocale, copyFor, localPath } from '@/lib/site/copy';
import { SELLER } from '@/lib/seller';
import { siteFonts } from './fonts';
import s from './site.module.css';

export type NavKey = 'work' | 'services' | 'pricing' | 'industries' | 'guide' | null;

/**
 * Site header for every locale page. `tone="ink"` sits on the older dark pages, `paper` on the
 * redesigned ones. Hides while scrolling down, returns on the way up. Below 1100 px the
 * links move into a full-screen menu.
 */
export default function SiteHeader({ locale: raw, tone = 'paper', current = null, skip = true }: { locale: string; tone?: 'paper' | 'ink'; current?: NavKey; skip?: boolean }) {
  const locale = asLocale(raw);
  const c = copyFor(locale).nav;
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const home = `/${locale}/`;

  const links: { key: Exclude<NavKey, null>; href: string; label: string }[] = [
    { key: 'work', href: localPath(locale, '/projekty'), label: c.work },
    { key: 'services', href: `${home}#uslugi`, label: c.services },
    { key: 'pricing', href: `${home}#cennik`, label: c.pricing },
    { key: 'industries', href: `${home}#branze`, label: c.industries },
    { key: 'guide', href: localPath(locale, '/poradnik'), label: c.guide },
  ];

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > 320 && y > last + 4);
        if (y < last - 4 || y < 320) setHidden(false);
        last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => { html.style.overflow = before; document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      {skip && <a href="#tresc" className={`${s.tokens} ${siteFonts} ${s.skip}`}>{c.skip}</a>}
      <header className={`${s.tokens} ${siteFonts} ${s.head}`} data-tone={tone} data-hidden={hidden && !open ? '' : undefined}>
        <div className={`${s.wrap} ${s.headIn}`}>
          <a href={home} className={s.word} aria-label={c.home}>tovernet<i aria-hidden="true" /></a>
          <nav aria-label={c.menu}>
            <ul className={s.nav}>
              {links.map((l) => <li key={l.key}><a href={l.href} aria-current={current === l.key ? 'page' : undefined}>{l.label}</a></li>)}
            </ul>
          </nav>
          <div className={s.tools}>
            <LangLinks locale={locale} label={c.language} />
            <AccountLink className={s.account} />
            <a href={`${home}#kontakt`} className={`${s.btn} ${s.headCta}`} onClick={() => posthog.capture?.('site_cta_clicked', { placement: 'header' })}>
              {c.cta}<ArrowRight size={16} aria-hidden="true" />
            </a>
            <button ref={btn} type="button" className={s.menuBtn} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}>
              {open ? c.close : c.menu}<span aria-hidden="true"><i /><i /></span>
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div id="site-menu" className={`${s.tokens} ${siteFonts} ${s.menu}`}>
          <nav aria-label={c.menu}>
            <ol>
              {[...links, { key: 'breeders', href: localPath(locale, '/hodowcy'), label: c.breeders }, { key: 'clubs', href: localPath(locale, '/zwiazki-kynologiczne'), label: c.clubs }]
                .map((l, i) => <li key={l.key}><a href={l.href} style={{ '--i': i } as React.CSSProperties} onClick={() => setOpen(false)}>{l.label}</a></li>)}
            </ol>
          </nav>
          <div className={s.menuFoot}>
            <LangLinks locale={locale} label={c.language} />
            <a href={SELLER.phoneHref}>{SELLER.phone}</a>
            <a href={`mailto:${SELLER.email}`}>{SELLER.email}</a>
            <AccountLink className={s.account} />
            <a href={`${home}#kontakt`} className={s.btn} onClick={() => setOpen(false)}>{c.cta}<ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * PL / EN as real links. The target is the page's declared alternate (hreflang), so a guide
 * with a different slug in the other language lands on its translation.
 */
function LangLinks({ locale, label }: { locale: 'pl' | 'en'; label: string }) {
  const [alt, setAlt] = useState<Record<string, string>>({});
  useEffect(() => {
    const out: Record<string, string> = {};
    document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]').forEach((l) => {
      try { const u = new URL(l.href); out[l.hreflang] = u.pathname + u.search; } catch { /* ignore */ }
    });
    const swap = (to: string) => window.location.pathname.replace(/^\/(pl|en)(?=\/|$)/, `/${to}`);
    setAlt({ pl: out.pl ?? swap('pl'), en: out.en ?? swap('en') });
  }, []);
  const go = (to: string) => {
    document.cookie = `NEXT_LOCALE=${to}; path=/; max-age=31536000`;
    posthog.capture?.('language_switched', { from_locale: locale, to_locale: to });
  };
  return (
    <div className={s.lang} role="group" aria-label={label}>
      {(['pl', 'en'] as const).map((l) => (
        <a key={l} href={alt[l] ?? `/${l}/`} hrefLang={l} lang={l} aria-current={l === locale ? 'true' : undefined} onClick={() => go(l)}>{l}</a>
      ))}
    </div>
  );
}
