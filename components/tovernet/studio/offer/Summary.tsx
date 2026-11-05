'use client';

import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { cartLines, type Cart } from '@/lib/tovernet/funnel';
import { termsFor } from '@/lib/tovernet/payments';
import { price, useTween } from '../motion';
import s from '../studio.module.css';
import o from './offer.module.css';
import { PKG, THIRD_PARTY, type Journey } from './offerCopy';

/** Third-party costs the selection brings with it. Never amounts: they are the provider's. */
export function thirdParty(demo: PublicDemo, cart: Cart) {
  const mail = demo.packages.find((p) => p.key === 'tovernet.addon.email');
  const lines: string[] = [];
  if ((mail && mail.included_in.includes(cart.pkg ?? '')) || (cart.qty['tovernet.addon.email'] ?? 0) > 0) lines.push(THIRD_PARTY.mail);
  if (cart.pkg === PKG.pro || (cart.qty['tovernet.addon.booking'] ?? 0) > 0) lines.push(THIRD_PARTY.tool);
  lines.push(THIRD_PARTY.domain);
  return lines;
}

/**
 * The order as four separate amounts: build (once), add-ons (once), plan (monthly) and what
 * is paid to other providers. "Płatność dziś" is the only total; the monthly amount never
 * joins it in wording.
 */
export default function Summary({ demo, cart, journey, exempt, onOrder, compact = false }: {
  demo: PublicDemo; cart: Cart; journey: Journey; exempt: boolean; onOrder: () => void; compact?: boolean;
}) {
  const { rows, monthly, today } = cartLines(demo, cart);
  const pkg = rows.find((r) => r.item.kind === 'package');
  const adds = rows.filter((r) => r.item.kind === 'addon');
  const plan = rows.find((r) => r.item.billing_interval);
  const ext = thirdParty(demo, cart);
  const terms = termsFor(demo, cart.pkg);
  // With instalments the first payment leads, like the package cards (owner 2026-11-05);
  // the full amount stays one line below. Add-ons are always paid today.
  const startToday = terms ? terms.upfront_minor + (today - (pkg?.item.gross_minor ?? 0)) : today;
  const shownToday = useTween(startToday);

  return (
    <div className={`${o.sum} ${compact ? o.sumCompact : ''}`}>
      {!compact && <p className={s.kicker}>Twój wybór</p>}
      {pkg && (
        <div className={o.sumPkg} key={pkg.item.key}>
          <span>{journey === 'migration' ? 'Przeniesienie strony' : 'Nowa strona'}</span>
          <b>{pkg.item.name}</b>
        </div>
      )}

      <dl className={o.sumGroups}>
        <div>
          <dt>Jednorazowo</dt>
          {pkg && <dd><span>Wykonanie strony</span><span>{price(pkg.item.gross_minor)}</span></dd>}
          {adds.map(({ item, quantity }) => (
            <dd key={item.key} className={o.sumIn}><span>{item.name}{quantity > 1 ? ` × ${quantity}` : ''}</span><span>{price(item.gross_minor * quantity)}</span></dd>
          ))}
        </div>
        {plan && (
          <div>
            <dt>Co miesiąc</dt>
            <dd className={o.sumIn} key={plan.item.key}><span>Plan {plan.item.name}<small>od dnia publikacji strony, osobna płatność</small></span><span>{price(plan.item.gross_minor)}</span></dd>
          </div>
        )}
        {!compact && (
          <div>
            <dt>Płatne u innych dostawców</dt>
            {ext.map((x) => <dd key={x} className={o.sumExt}><ExternalLink size={12} aria-hidden="true" /><span>{x}</span></dd>)}
          </div>
        )}
      </dl>

      <div className={o.sumTotal}>
        <span>{terms ? 'Płatność dziś, na start' : 'Płatność dziś'}</span>
        <b data-testid="pay-today" aria-live="polite">{price(shownToday)}</b>
        <small>{terms ? <>Potem {terms.count} × {price(terms.amount_minor)} co miesiąc, razem {price(pkg?.item.gross_minor ?? 0)} za stronę, bez odsetek. Albo całość dziś: {price(today)}; wybierzesz w zamówieniu. </> : null}Plan {price(monthly)} co miesiąc od publikacji strony. Bez umowy na rok, rezygnujesz w panelu. {exempt ? 'Sprzedawca zwolniony z VAT, kwoty są ostateczne.' : 'Ceny brutto, zawierają VAT.'}</small>
      </div>
      <button type="button" className={`${s.cta} ${s.full}`} onClick={onOrder}>Przejdź do zamówienia<ArrowRight size={19} aria-hidden="true" /></button>
      <p className={o.sumNote}><Check size={14} aria-hidden="true" />Stronę zobaczysz i zaakceptujesz przed publikacją</p>
    </div>
  );
}
