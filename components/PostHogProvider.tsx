'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      disable_session_recording: false,
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      ui_host: 'https://eu.posthog.com',
      defaults: '2026-01-30',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
      session_recording: {
        sampleRate: 1,
        captureCanvas: {
          recordCanvas: true,
          canvasFps: 4,
          canvasQuality: '0.6',
        },
      },
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
