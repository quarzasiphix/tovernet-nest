'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Laptop, Minus, Plus, RefreshCcw, Smartphone, X } from 'lucide-react';
import type { DemoPackage, PublicDemo } from '@/lib/tovernet/api';
import ConceptSite from '../../ConceptSite';
import { Scaled, price } from '../motion';
import s from '../studio.module.css';
import o from './offer.module.css';
import PageStack from './PageStack';
import { PACKAGES, PKG, REVISIONS, type Journey } from './offerCopy';

/**
 * Everything one package contains, as a sheet over the offer: a dialog on desktop, a bottom
 * sheet on a phone. Esc and the scrim close it; focus moves in and back to the opener.
 */
export default function ScopeSheet({ demo, pkg, addons, journey, selected, onSelect, onClose }: {
  demo: PublicDemo; pkg: DemoPackage; addons: DemoPackage[]; journey: Journey; selected: boolean; onSelect: () => void; onClose: () => void;
}) {
  const c = PACKAGES[pkg.key];
  const [view, setView] = useState<'desktop' | 'phone'>(() => (window.matchMedia?.('(max-width: 860px)').matches ? 'phone' : 'desktop'));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !ref.current) return;
      const f = ref.current.querySelectorAll<HTMLElement>('button,a[href],[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = prev; back?.focus?.(); };
  }, [onClose]);

  const short = pkg.name.replace(/^Strona /, '');
  const extra = addons.filter((a) => !a.included_in.includes(pkg.key));
  const inPkg = addons.filter((a) => a.included_in.includes(pkg.key));

  return (
    <div className={o.sheetScrim} onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="scope-title" tabIndex={-1} className={o.scope} onClick={(e) => e.stopPropagation()}>
        <header className={o.scopeHead}>
          <div>
            <p className={s.kicker}>Pełny zakres · wykonanie strony</p>
            <h2 id="scope-title" className={o.scopeTitle}>{short} <span>{price(pkg.gross_minor)}</span></h2>
            {c && <p className={o.scopeLine}>{c.headline}</p>}
          </div>
          <button type="button" className={o.close} onClick={onClose} aria-label="Zamknij"><X size={18} /></button>
        </header>

        <div className={o.scopeBody}>
          <div className={o.scopeSide}>
            <div className={o.previewTools}>
              <div className={s.seg} data-on={view} role="group" aria-label="Podgląd">
                <span className={s.segThumb} aria-hidden="true" />
                <button type="button" aria-pressed={view === 'desktop'} onClick={() => setView('desktop')}><Laptop size={15} aria-hidden="true" />Komputer</button>
                <button type="button" aria-pressed={view === 'phone'} onClick={() => setView('phone')}><Smartphone size={15} aria-hidden="true" />Telefon</button>
              </div>
            </div>
            <div className={`${o.preview} ${view === 'phone' ? o.previewPhone : ''}`} key={view}>
              <div aria-hidden="true">
                <Scaled width={view === 'phone' ? 390 : 1280} className={o.previewPan}>
                  <ConceptSite company={demo.config.company} variant={demo.config.variant} embedded preview />
                </Scaled>
              </div>
            </div>
            <p className={o.previewNote}>Pokazany przykład to nie sztywny szablon. Kolory, układ, teksty, zdjęcia i usługi zmienisz w granicach pakietu.</p>
            {c && (
              <div className={o.pagesBox}>
                <PageStack sheets={c.sheets} pin={pkg.key === PKG.pro} />
                <p><b>Ile stron</b>{c.pages}</p>
              </div>
            )}
          </div>

          <div className={o.scopeMain}>
            <Block n={1} title="W pakiecie">
              <ul className={o.list}>{pkg.included.map((x) => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}</ul>
            </Block>
            {c && <>
              <Block n={2} title="Co robimy my">
                <ul className={o.list}>{c.weDo.map((x) => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}</ul>
              </Block>
              <Block n={3} title="Czego potrzebujemy od Ciebie">
                <ul className={`${o.list} ${o.listYou}`}>{c.youDo.map((x) => <li key={x}><span aria-hidden="true">Ty</span>{x}</li>)}</ul>
              </Block>
              <Block n={4} title={`Poprawki: ${c.rounds} ${c.rounds === 1 ? 'runda' : 'rundy'} przed publikacją`}>
                <ul className={o.plain}>{REVISIONS.map((x) => <li key={x}>{x}</li>)}</ul>
              </Block>
            </>}
            {pkg.exclusions.length > 0 && (
              <Block n={5} title="Czego pakiet nie obejmuje">
                <ul className={`${o.list} ${o.listNo}`}>{pkg.exclusions.map((x) => <li key={x}><Minus size={15} aria-hidden="true" />{x}</li>)}</ul>
                <p className={o.blockFine}>Prace spoza zakresu wyceniamy, zanim cokolwiek zrobimy.</p>
              </Block>
            )}
            {(extra.length > 0 || inPkg.length > 0) && (
              <Block n={6} title="Dodatki do tego pakietu">
                <ul className={o.priceList}>
                  {inPkg.map((a) => <li key={a.key}><span>{a.name}</span><b className={o.inPkg}>w pakiecie</b></li>)}
                  {extra.map((a) => <li key={a.key}><span><Plus size={14} aria-hidden="true" />{a.name}</span><b>{price(a.gross_minor)}</b></li>)}
                </ul>
                <p className={o.blockFine}>Dodatki wybierasz niżej, w ofercie. Bardziej złożone prace wyceniamy indywidualnie.</p>
              </Block>
            )}
            {c && journey === 'migration' && (
              <Block n={7} title="Jeśli masz już stronę">
                <p className={o.blockText}><RefreshCcw size={15} aria-hidden="true" />{c.migration}</p>
              </Block>
            )}
          </div>
        </div>

        <footer className={o.scopeFoot}>
          <span><b>{price(pkg.gross_minor)}</b> jednorazowo za wykonanie strony. Plan miesięczny wybierasz osobno.</span>
          <button type="button" className={`${s.cta} ${o.scopeCta}`} onClick={onSelect}>
            {selected ? <>Zostaję przy {short}<Check size={18} aria-hidden="true" /></> : <>Wybieram {short}<ArrowRight size={18} aria-hidden="true" /></>}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className={o.block} style={{ ['--d' as string]: `${n * 60}ms` }}>
      <h3><span>{String(n).padStart(2, '0')}</span>{title}</h3>
      {children}
    </section>
  );
}
