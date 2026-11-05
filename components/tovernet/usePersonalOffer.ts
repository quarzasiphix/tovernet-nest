'use client';

import { useEffect, useState } from 'react';
import { readInviteToken, saveInviteToken } from '@/lib/tovernet/invite';
import { publicAction, type PublicDemo } from '@/lib/tovernet/api';
import { setOfferContext, track as trackAnalytics } from '@/lib/tovernet/analytics';
import { startJourney } from '@/lib/tovernet/journey';

export type OfferStatus = 'none' | 'loading' | 'ready' | 'missing' | 'error';

// Reads a personal offer from the URL: #<demo id> (view) or #<demo id>.<invite token>
// (personal link; the token leaves the address bar at once and is kept in this browser,
// see lib/tovernet/invite.ts). ?t= is the letter or e-mail tracking code, for attribution only.
// Without a fragment the page stays the generic SEO landing page.
export function usePersonalOffer() {
  const [status, setStatus] = useState<OfferStatus>('none');
  const [demo, setDemo] = useState<PublicDemo | null>(null);
  const [ids, setIds] = useState<{ publicId: string; trackingCode: string | null }>({ publicId: '', trackingCode: null });
  // Opened from a personal e-mail link (token kept in this browser), so we know the e-mail.
  const [personalLink, setPersonalLink] = useState(false);

  useEffect(() => {
    const [hashId, inviteToken] = window.location.hash.slice(1).split('.');
    const publicId = /^[0-9a-f]{36}$/.test(hashId ?? '') ? hashId : '';
    if (!publicId) return;
    if (inviteToken) {
      saveInviteToken(publicId, inviteToken);
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${publicId}`);
    }
    const trackingCode = new URLSearchParams(window.location.search).get('t');
    setIds({ publicId, trackingCode });
    setPersonalLink(Boolean(inviteToken || readInviteToken(publicId)));
    setStatus('loading');

    publicAction<{ demo: PublicDemo | null }>('tovernetDemo.get', { publicId, trackingCode })
      .then(({ demo: d }) => {
        setDemo(d);
        setStatus(d ? 'ready' : 'missing');
        if (!d) { trackAnalytics('offer_unavailable'); return; }
        startJourney(d.public_id, trackingCode, {
          personal_link: Boolean(inviteToken || readInviteToken(publicId)),
          channel: d.attribution?.channel ?? null, campaign: d.attribution?.campaign ?? null, ab: d.attribution?.variant ?? null,
          template: d.config.variant,
        });
        void publicAction('tovernetDemo.track', { publicId, eventType: 'demo_viewed', trackingCode }).catch(() => undefined);
        setOfferContext({
          krs: d.config.company.krs,
          niche: d.niche_key,
          template: d.config.variant,
          channel: d.attribution?.channel ?? null,
          campaign: d.attribution?.campaign ?? null,
          abVariant: d.attribution?.variant ?? null,
          personalLink: Boolean(inviteToken || readInviteToken(publicId)),
        });
        trackAnalytics('offer_viewed', { purchasable: d.packages.some((p) => p.kind === 'package'), page: window.location.pathname });
      })
      .catch(() => { setStatus('error'); trackAnalytics('offer_load_failed'); });
  }, []);

  useEffect(() => {
    if (status !== 'ready') return;
    const el = document.getElementById('cennik');
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { trackAnalytics('pricing_viewed'); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [status]);

  const track = (eventType: string, placement?: string) =>
    publicAction('tovernetDemo.track', { publicId: ids.publicId, eventType, trackingCode: ids.trackingCode, placement }).catch(() => undefined);

  return { status, demo, track, personalLink };
}
