// The four-stage sales journey (docs: ksiegai/docs/plans/tovernet/11-funnel.md).
// Pure helpers shared by the stages. Cart rules mirror OrderFlow.tsx exactly:
// one package, one required monthly plan, optional add-ons; an add-on that the
// chosen package includes is neither charged nor sent.
import type { DemoPackage, PublicDemo } from './api';

export type Stage = 'przywitanie' | 'koncept' | 'oferta' | 'zamowienie';

export const STAGES: { key: Stage; label: string; query: string | null }[] = [
  { key: 'przywitanie', label: 'Przywitanie', query: null },
  // Offer before the example (owner 2026-11-05, confirmed 2026-11-06): visitors are not interested
  // in the exact sample, so the offer sells a site made to their taste and the example is optional.
  // Keys and ?krok= values unchanged, so old links and analytics keep working.
  { key: 'oferta', label: 'Oferta', query: 'oferta' },
  { key: 'koncept', label: 'Przykład', query: 'koncept' },
  { key: 'zamowienie', label: 'Zamówienie', query: 'zamowienie' },
];

export function stageFromQuery(value: string | null): Stage {
  return STAGES.find((s) => s.query === value)?.key ?? 'przywitanie';
}

export type Cart = {
  pkg: string | undefined;
  plan: string | undefined;
  qty: Record<string, number>;
  /** Chosen in Zamówienie; null until the buyer picks (never preselected, 19-instalments.md §3). */
  payment?: 'full' | 'instalments' | null;
  /** Card autopay for later instalments (card payments only). */
  autopay?: boolean;
};

export function defaultCart(demo: PublicDemo): Cart {
  const packages = demo.packages.filter((p) => p.kind === 'package');
  const plans = demo.packages.filter((p) => p.kind === 'recurring');
  return {
    pkg: (packages.find((p) => p.recommended) ?? packages[1] ?? packages[0])?.key,
    plan: (plans.find((p) => p.key === 'tovernet.care.monthly') ?? plans[0])?.key,
    qty: {},
  };
}

export function cartLines(demo: PublicDemo, cart: Cart) {
  const rows: { item: DemoPackage; quantity: number }[] = [];
  const p = demo.packages.find((x) => x.kind === 'package' && x.key === cart.pkg);
  if (p) rows.push({ item: p, quantity: 1 });
  for (const a of demo.packages.filter((x) => x.kind === 'addon')) {
    if (cart.qty[a.key] && !a.included_in.includes(cart.pkg ?? '')) rows.push({ item: a, quantity: cart.qty[a.key] });
  }
  const pl = demo.packages.find((x) => x.kind === 'recurring' && x.key === cart.plan);
  if (pl) rows.push({ item: pl, quantity: 1 });
  const once = rows.filter((r) => !r.item.billing_interval).reduce((s, r) => s + r.item.gross_minor * r.quantity, 0);
  const monthly = rows.filter((r) => r.item.billing_interval).reduce((s, r) => s + r.item.gross_minor * r.quantity, 0);
  const website = p?.gross_minor ?? 0;
  // The plan starts at publication (19-instalments.md §2), so today is the one-off part only.
  // With instalments, today is the first instalment plus add-ons: see lib/tovernet/payments.ts.
  return { rows, once, monthly, website, addons: once - website, today: once };
}

/** Add-ons as tovernetCheckout.create expects them. */
export function cartAddons(demo: PublicDemo, cart: Cart) {
  return Object.entries(cart.qty)
    .filter(([k, v]) => v > 0 && !demo.packages.find((a) => a.key === k)?.included_in.includes(cart.pkg ?? ''))
    .map(([key, quantity]) => ({ key, quantity }));
}

// Catalogue taglines that claim popularity are not shown: a new firm has no customers
// to be popular with. The owner is asked to change them in the catalogue.
export function honestTagline(p: DemoPackage) {
  return p.tagline && !/najczęściej|najpopularniejsz|bestseller/i.test(p.tagline) ? p.tagline : null;
}

// Plans the offer keeps behind "Inne plany" (08-niche-strategy.md: do not promote).
export const QUIET_PLANS = ['tovernet.plan.hosting'];
