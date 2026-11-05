import posthog from 'posthog-js';
import type { Session } from '@supabase/supabase-js';
import { journeyEvent } from './journey';

// Tovernet's own PostHog project (NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN of this site), not
// KsięgaI's. Every funnel event is prefixed tovernet_ and carries the offer context as
// super properties, so it joins the KRS Radar entry by tovernet_krs and the outreach
// that brought the visitor (channel, campaign, A/B variant). No personal data besides
// the account e-mail on identify, which mirrors how KsięgaI identifies invited users.

export type OfferContext = {
  krs: string | null;
  niche: string;
  template: string;
  channel: string | null;
  campaign: string | null;
  abVariant: string | null;
  personalLink: boolean;
};

const loaded = () => typeof window !== 'undefined' && (posthog as unknown as { __loaded?: boolean }).__loaded;

export function setOfferContext(ctx: OfferContext) {
  if (!loaded()) return;
  posthog.register({
    tovernet_krs: ctx.krs,
    tovernet_niche: ctx.niche,
    tovernet_template: ctx.template,
    tovernet_channel: ctx.channel ?? 'link',
    tovernet_campaign: ctx.campaign,
    tovernet_ab_variant: ctx.abVariant,
    tovernet_personal_link: ctx.personalLink,
  });
}

/** `beforeNavigation`: send now with sendBeacon, for events fired right before leaving the page. */
export function track(event: string, properties: Record<string, unknown> = {}, opts: { beforeNavigation?: boolean } = {}) {
  // First-party journey log (lib/tovernet/journey.ts): active only on a personal offer view.
  journeyEvent(event, properties);
  if (!loaded()) return;
  try {
    posthog.capture(`tovernet_${event}`, properties,
      opts.beforeNavigation ? { send_instantly: true, transport: 'sendBeacon' } : undefined);
  } catch {
    // Analytics must never break the purchase path.
  }
}

export function identify(session: Session, method: string) {
  if (!loaded()) return;
  try {
    posthog.identify(session.user.id, { email: session.user.email, tovernet_customer: true });
    posthog.capture('tovernet_auth_completed', { method });
  } catch {
    // ignore
  }
}
