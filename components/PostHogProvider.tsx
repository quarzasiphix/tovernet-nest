'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import ConsentBanner from './ConsentBanner';
import { CONSENT_CHANGED_EVENT, isPrivatePath, readConsent, type Consent } from '@/lib/consent';

// PostHog starts only after analytics consent (lib/consent.ts). Personal offers, checkout
// and the client panel show company data: never recorded, and the demo id in the URL
// fragment stays out of analytics. Niche pages opened with a demo id also stop recording
// in usePersonalOffer.
const stripFragment = (url: unknown) => (typeof url === 'string' ? url.split('#')[0] : url);

function start() {
  if (posthog.__loaded) {
    posthog.opt_in_capturing();
    return;
  }
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    disable_session_recording: isPrivatePath(),
    before_send: (event) => {
      if (event?.properties) {
        event.properties.$current_url = stripFragment(event.properties.$current_url);
        event.properties.$referrer = stripFragment(event.properties.$referrer);
      }
      return event;
    },
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
    session_recording: {
      sampleRate: 1,
      captureCanvas: { recordCanvas: true, canvasFps: 4, canvasQuality: '0.6' },
    },
  });
}

function stop() {
  if (!posthog.__loaded) return;
  posthog.stopSessionRecording();
  posthog.opt_out_capturing();
  posthog.reset();
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    if (c?.analytics) start();
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Consent>).detail;
      setConsent(next);
      if (next.analytics) start(); else stop();
    };
    // Client-side navigation into a private page must stop a running recording.
    const guard = () => { if (posthog.__loaded && isPrivatePath()) posthog.stopSessionRecording(); };
    const push = history.pushState;
    history.pushState = function (...args) { const r = push.apply(this, args); guard(); return r; };
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    window.addEventListener('hashchange', guard);
    window.addEventListener('popstate', guard);
    return () => {
      history.pushState = push;
      window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
      window.removeEventListener('hashchange', guard);
      window.removeEventListener('popstate', guard);
    };
  }, []);

  return (
    <PHProvider client={posthog}>
      {children}
      <ConsentBanner initiallyOpen={consent === null} />
    </PHProvider>
  );
}
