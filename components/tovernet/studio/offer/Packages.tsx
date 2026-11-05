'use client';

import { useState, type PointerEvent } from 'react';
import { ArrowUpRight, Check, Clock3 } from 'lucide-react';
import type { DemoPackage, PublicDemo } from '@/lib/tovernet/api';
import { price } from '../motion';
import { termsFor } from '@/lib/tovernet/payments';
import s from '../studio.module.css';
import o from './offer.module.css';
import PageStack from './PageStack';
import ScopeSheet from './ScopeSheet';
import { PACKAGES, PKG, type Journey } from './offerCopy';

/** Pointer-following glow: two CSS variables, no re-render. */
export const glow = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export default function Packages({ demo, packages, addons, selected, journey, onSelect, track }: {
  demo: PublicDemo; packages: DemoPackage[]; addons: DemoPackage[]; selected: string | undefined; journey: Journey;
  onSelect: (key: string) => void; track: (e: string, p?: Record<string, unknown>) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const openPkg = packages.find((p) => p.key === open);

  return (
    <>
      <div role="radiogroup" aria-label="Pakiet" className={o.pkgs}>
        {packages.map((p) => {
          const c = PACKAGES[p.key];
          const on = selected === p.key;
          return (
            <article key={p.key} className={`${o.pkg} ${on ? o.pkgOn : ''} ${p.recommended ? o.pkgRec : ''}`} onPointerMove={glow}>
              {p.recommended && <span className={o.badge}>Polecany</span>}
              <button type="button" role="radio" aria-checked={on} className={o.pkgSelect} onClick={() => onSelect(p.key)}>
                <span className={o.pkgVisual}><PageStack sheets={c?.sheets ?? 1} pin={p.key === PKG.pro} /></span>
                <span className={o.pkgHead}>
                  <span className={o.pkgName}>{p.name.replace(/^Strona /, '')}</span>
                  <span className={o.radio} aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                </span>
                {(() => {
                  // Owner 2026-11-05: the first payment leads, the total always right under it
                  // (19-instalments.md §3 copy rules: never "strona za 149 zł" alone).
                  const t = termsFor(demo, p.key);
                  if (!t) return <span className={o.pkgPrice}>{price(p.gross_minor)}<small>za stronę</small></span>;
                  return (
                    <>
                      <span className={o.pkgPrice}>{price(t.upfront_minor)}<small>na start</small></span>
                      <span className={o.pkgRaty}>potem {t.count} × {price(t.amount_minor)} co miesiąc · razem <b>{price(p.gross_minor)}</b>, bez odsetek. Albo całość od razu.</span>
                    </>
                  );
                })()}
                <span className={o.pkgHeadline}>{c?.headline ?? p.description}</span>
                {c && <span className={o.pkgFor}>{c.forWho[journey]}</span>}
                <span className={o.pkgTop}>
                  {(c?.top ?? p.included.slice(0, 4)).map((x) => <span key={x}><Check size={14} aria-hidden="true" />{x}</span>)}
                </span>
                {c && <span className={o.pkgDays}><Clock3 size={14} aria-hidden="true" />Cel: ok. {c.days} dni roboczych od otrzymania materiałów</span>}
              </button>
              <button type="button" className={o.scopeBtn} aria-haspopup="dialog"
                      onClick={() => { setOpen(p.key); track('scope_opened', { package: p.key }); }}>
                Zobacz pełny zakres<ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </div>
      {openPkg && (
        <ScopeSheet demo={demo} pkg={openPkg} addons={addons} journey={journey} selected={selected === openPkg.key}
                    onSelect={() => { onSelect(openPkg.key); setOpen(null); }} onClose={() => setOpen(null)} />
      )}
    </>
  );
}
