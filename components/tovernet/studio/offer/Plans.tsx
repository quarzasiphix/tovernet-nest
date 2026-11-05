'use client';

import { useState } from 'react';
import { AlertTriangle, Check, ChevronDown, Minus, Sparkles } from 'lucide-react';
import type { DemoPackage } from '@/lib/tovernet/api';
import { honestTagline } from '@/lib/tovernet/funnel';
import { price } from '../motion';
import o from './offer.module.css';
import { glow } from './Packages';
import { OVERLAPS_PRO, PKG, PLAN, PLANS, REASONS, RECOMMENDED } from './offerCopy';

/**
 * Monthly plans. The package decides which three come first and why; every plan in the
 * catalogue stays one tap away and selectable. The selected plan is always visible.
 */
export default function Plans({ plans, pkgKey, pkgName, selected, onSelect, track }: {
  plans: DemoPackage[]; pkgKey: string | undefined; pkgName: string; selected: string | undefined;
  onSelect: (key: string) => void; track: (e: string, p?: Record<string, unknown>) => void;
}) {
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const order = plans.map((p) => p.key);
  const rec = (RECOMMENDED[pkgKey ?? ''] ?? order).filter((k) => order.includes(k));
  const visible = plans
    .filter((p) => all || rec.includes(p.key) || p.key === selected)
    .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  const hidden = plans.length - visible.length;
  const overlap = pkgKey === PKG.pro && OVERLAPS_PRO.includes(selected ?? '');
  const care = plans.find((p) => p.key === PLAN.care);

  return (
    <>
      <div role="radiogroup" aria-label="Plan miesięczny" className={o.plans} style={{ ['--cols' as string]: Math.min(visible.length, 3) }}>
        {visible.map((p) => {
          const on = p.key === selected;
          const copy = PLANS[p.key];
          const reason = rec.includes(p.key) ? REASONS[pkgKey ?? '']?.[p.key] : null;
          const expanded = open === p.key;
          return (
            <article key={p.key} className={`${o.plan} ${on ? o.planOn : ''}`} onPointerMove={glow}>
              <button type="button" role="radio" aria-checked={on} className={o.planSelect}
                      onClick={() => { onSelect(p.key); track('plan_selected', { plan: p.key, price_minor: p.gross_minor, recommended: rec.includes(p.key) }); }}>
                <span className={o.planHead}>
                  <span className={o.planName}>{p.name}</span>
                  <span className={o.radio} aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                </span>
                <span className={o.planPrice}>{price(p.gross_minor)}<small> / mies.</small></span>
                <span className={o.planLine}>{copy?.headline ?? honestTagline(p) ?? p.description}</span>
                {reason && <span className={o.reason}><Sparkles size={13} aria-hidden="true" /><span><b>Przy pakiecie {pkgName}:</b> {reason}</span></span>}
              </button>
              <button type="button" className={o.more2} aria-expanded={expanded} onClick={() => setOpen(expanded ? null : p.key)}>
                Co obejmuje<ChevronDown size={16} aria-hidden="true" />
              </button>
              <div className={o.planBody} data-open={expanded || undefined}>
                <div>
                  <ul className={o.list}>{p.included.map((x) => <li key={x}><Check size={14} aria-hidden="true" />{x}</li>)}</ul>
                  {copy?.boundary && <p className={o.boundary}>{copy.boundary}</p>}
                  {p.exclusions.length > 0 && <ul className={`${o.list} ${o.listNo}`}>{p.exclusions.map((x) => <li key={x}><Minus size={14} aria-hidden="true" />{x}</li>)}</ul>}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {overlap && care && (
        <div className={o.overlap} role="note">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <b>Nie płać dwa razy za to samo.</b>
            <p>Pro ma w cenie 3 miesiące pracy nad widocznością. Z tym planem od pierwszego dnia płacisz też za pracę, którą pakiet już obejmuje. Na start wybierz Opiekę, a wyższy plan włącz po tych 3 miesiącach.</p>
            <button type="button" className={o.inlineBtn} onClick={() => { onSelect(care.key); track('plan_overlap_resolved', { from: selected }); }}>Wybierz Opiekę za {price(care.gross_minor)} / mies.</button>
          </div>
        </div>
      )}

      {hidden > 0 && (
        <button type="button" className={o.allPlans} onClick={() => { setAll(true); track('all_plans_shown', { package: pkgKey }); }}>
          Zobacz wszystkie plany <span>+{hidden}</span>
        </button>
      )}
      {all && rec.length < plans.length && (
        <button type="button" className={o.allPlans} onClick={() => setAll(false)}>Pokaż tylko polecane</button>
      )}
    </>
  );
}
