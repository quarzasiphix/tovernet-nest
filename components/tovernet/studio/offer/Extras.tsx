'use client';

import { useState } from 'react';
import { ChevronDown, MessageSquare, Minus, Plus } from 'lucide-react';
import type { DemoPackage } from '@/lib/tovernet/api';
import type { Cart } from '@/lib/tovernet/funnel';
import { price } from '../motion';
import s from '../studio.module.css';
import o from './offer.module.css';
import { ADDONS, PKG, QUOTED } from './offerCopy';

const lc = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

/**
 * Add-ons in two kinds: fixed-price items that go into the order, and services with
 * variable scope that are quoted first. Anything the package includes is marked, never charged.
 */
export default function Extras({ addons, cart, setCart, onAsk, track }: {
  addons: DemoPackage[]; cart: Cart; setCart: (c: Cart) => void; onAsk: (text: string) => void;
  track: (e: string, p?: Record<string, unknown>) => void;
}) {
  const [group, setGroup] = useState<string | null>(null);
  const isPro = cart.pkg === PKG.pro;

  return (
    <>
      <div className={o.addons}>
        {addons.map((a) => {
          const included = a.included_in.includes(cart.pkg ?? '');
          const value = cart.qty[a.key] ?? 0;
          const on = included || value > 0;
          const d = ADDONS[a.key];
          const set = (n: number) => setCart({ ...cart, qty: { ...cart.qty, [a.key]: n } });
          return (
            <div key={a.key} className={`${o.addon} ${on ? o.addonOn : ''} ${included ? o.addonIn : ''}`}>
              <label className={o.addonLabel}>
                <input type="checkbox" className={s.sr} disabled={included} checked={on}
                       onChange={(e) => { set(e.target.checked ? 1 : 0); track('addon_changed', { addon: a.key, selected: e.target.checked }); }} />
                <span className={o.switch} aria-hidden="true" />
                <span className={o.addonText}>
                  <b>{a.name}</b>
                  <small>{d?.get ?? a.description}</small>
                  {d && !included && (
                    <span className={o.addonMeta}>
                      <span>Jednorazowo</span>
                      <span>Od Ciebie: {lc(d.you)}</span>
                      {d.outside && <span>Poza ceną: {lc(d.outside)}</span>}
                    </span>
                  )}
                </span>
              </label>
              <span className={o.addonEnd}>
                {a.max_quantity > 1 && value > 0 && (
                  <span className={o.qty}>
                    <button type="button" aria-label={`Mniej: ${a.name}`} onClick={() => set(Math.max(0, value - 1))}><Minus size={14} /></button>
                    <span aria-live="polite">{value}</span>
                    <button type="button" aria-label={`Więcej: ${a.name}`} onClick={() => set(Math.min(a.max_quantity, value + 1))}><Plus size={14} /></button>
                  </span>
                )}
                <span className={o.addonPrice}>{included ? 'w pakiecie' : price(a.gross_minor * Math.max(1, value))}</span>
              </span>
            </div>
          );
        })}
      </div>

      <h3 className={o.quotedTitle}>Na wycenę</h3>
      <p className={o.quotedSub}>Zakres tych prac zależy od sytuacji, więc najpierw ją poznajemy, potem podajemy cenę. Nic nie robimy bez Twojej zgody na wycenę.</p>
      <div className={o.quoted}>
        {QUOTED.map((g) => {
          const openG = group === g.group;
          return (
            <div key={g.group} className={o.qGroup} data-open={openG || undefined}>
              <button type="button" aria-expanded={openG} className={o.qHead} onClick={() => setGroup(openG ? null : g.group)}>
                <span>{g.group}<small>{g.items.length} {g.items.length < 5 ? 'usługi' : 'usług'}</small></span><ChevronDown size={18} aria-hidden="true" />
              </button>
              <div className={o.planBody} data-open={openG || undefined}>
                <div>
                  <ul className={o.qList}>
                    {g.items.map((it) => (
                      <li key={it.name}>
                        <span><b>{it.name}</b><small>{it.note}</small></span>
                        {it.inPro && isPro
                          ? <em className={o.inPkg}>{it.name.startsWith('Założenie') ? 'w pakiecie Pro' : 'jako integracja w Pro'}</em>
                          : <button type="button" className={o.askBtn} onClick={() => { onAsk(`Proszę o wycenę: ${it.name}.`); track('quote_requested', { item: it.name }); }}><MessageSquare size={14} aria-hidden="true" />Zapytaj</button>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
