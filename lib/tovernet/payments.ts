// Payment options and amounts for the offer and checkout (ksiegai docs/plans/tovernet/19-instalments.md).
// The server prices every order; these helpers only mirror the rules for display:
//   full:        today = website + add-ons
//   instalments: today = first instalment + add-ons, then count x amount monthly
// The monthly plan is never part of today's payment: it starts at publication.
import type { PublicDemo } from './api';
import type { Cart } from './funnel';

export type InstalmentTerms = { package: string; upfront_minor: number; count: number; amount_minor: number };
export type PaymentOption = 'full' | 'instalments';

/** Instalments are shown only when the site flag is on and the server sent terms. */
export const INSTALMENTS_ENABLED = process.env.NEXT_PUBLIC_TOVERNET_INSTALMENTS === 'true';
export const INSTALMENTS_MARKETING = process.env.NEXT_PUBLIC_TOVERNET_INSTALMENTS_MARKETING === 'true';

export function termsFor(demo: PublicDemo, pkg: string | undefined): InstalmentTerms | null {
  if (!INSTALMENTS_ENABLED || !pkg) return null;
  return (demo.instalments ?? []).find((t) => t.package === pkg) ?? null;
}

/**
 * Public niche pages have no demo, so no terms from the server: this mirrors Strona Start in
 * tovernet.instalment_terms (149 zł + 9 × 149 zł = 1 490 zł). Change it together with the
 * catalogue. Shown only with NEXT_PUBLIC_TOVERNET_INSTALMENTS_MARKETING=true.
 */
export const MARKETING_START = { upfront: 14900, total: 149000 } as const;

/** Cheapest first payment and that package's total, for "Zacznij od 149 zł · razem od 1 490 zł". */
export function cheapestStart(demo: PublicDemo): { upfront: number; total: number } | null {
  if (!INSTALMENTS_ENABLED) return null;
  const t = [...(demo.instalments ?? [])].sort((a, b) => a.upfront_minor - b.upfront_minor)[0];
  return t ? { upfront: t.upfront_minor, total: t.upfront_minor + t.count * t.amount_minor } : null;
}

/**
 * First payment for the package this concept recommends (else the cheapest), for the
 * "od 299 zł" line on the welcome screen and the concept dock. Null without instalments.
 */
export function recommendedStart(demo: PublicDemo): { upfront: number; total: number } | null {
  const pkg = (demo.packages.find((p) => p.recommended && p.kind === 'package') ?? null)?.key;
  const t = termsFor(demo, pkg);
  return t ? { upfront: t.upfront_minor, total: t.upfront_minor + t.count * t.amount_minor } : cheapestStart(demo);
}

/** Day of month, capped at 28 like the server's billing day. */
export const billingDay = (d = new Date()) => Math.min(d.getDate(), 28);

/** The n-th monthly due date after today on the billing day (same rule as billing.month_due). */
export function dueDate(n: number, from = new Date()) {
  return new Date(from.getFullYear(), from.getMonth() + n, billingDay(from));
}

export const plDate = (d: Date | string) =>
  (typeof d === 'string' ? new Date(`${d.slice(0, 10)}T12:00:00`) : d)
    .toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

export const shortDate = (d: Date | string) =>
  (typeof d === 'string' ? new Date(`${d.slice(0, 10)}T12:00:00`) : d)
    .toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });

export type Money = {
  option: PaymentOption | null;
  website: number;       // package price
  addons: number;        // add-ons, always paid today
  today: number;         // what the pay button charges
  terms: InstalmentTerms | null;
  later: number;         // instalments still to pay after today
  monthly: number;       // plan, from publication
};

export function money(demo: PublicDemo, cart: Cart, website: number, addons: number, monthly: number): Money {
  const terms = termsFor(demo, cart.pkg);
  const option: PaymentOption | null = terms ? cart.payment ?? null : 'full';
  const instalments = option === 'instalments' && terms;
  return {
    option,
    website,
    addons,
    today: instalments ? terms.upfront_minor + addons : website + addons,
    terms,
    later: instalments ? terms.count * terms.amount_minor : 0,
    monthly,
  };
}
