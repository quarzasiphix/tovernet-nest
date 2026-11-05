'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import ConsentBanner from './ConsentBanner';
import { CONSENT_CHANGED_EVENT, readConsent, type Consent } from '@/lib/consent';

// PostHog runs from the first page view. Until the visitor accepts analytics it keeps its ids
// in memory only (nothing written to the device); accepting switches to cookie + localStorage
// so the visitor stays one person across visits; declining stops capture and recording.
// Every page is recorded, offers, checkout and the client panel included (owner's decision,
// 2026-11-05); inputs stay masked. The demo id and invite token in the URL fragment stay out
// of event URLs.
const stripFragment = (url: unknown) => (typeof url === 'string' ? url.split('#')[0] : url);

function start(accepted: boolean) {
  if (!posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      persistence: accepted ? 'localStorage+cookie' : 'memory',
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
  } else if (accepted) {
    posthog.set_config({ persistence: 'localStorage+cookie' });
  }
  // An earlier "no" is stored by PostHog itself and survives a later "yes" unless cleared.
  if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing();
  posthog.startSessionRecording();
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
    if (c?.analytics === false) stop(); else start(Boolean(c?.analytics));
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Consent>).detail;
      setConsent(next);
      if (next.analytics) start(true); else stop();
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
    };
  }, []);

  return (
    <PHProvider client={posthog}>
      {children}
      <ConsentBanner initiallyOpen={consent === null} />
    </PHProvider>
  );
}
