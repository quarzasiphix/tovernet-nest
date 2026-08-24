'use client';

import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import posthog from 'posthog-js';

const PARTS = ['+48', '690', '975', '231'];

export default function PhoneCTA() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <span className="inline-flex items-center gap-2 text-white font-bold text-2xl sm:text-3xl">
        <Phone className="h-6 w-6 text-tovernet-400" />
        &nbsp;
      </span>
    );
  }

  const number = PARTS.join(' ');
  const dial = `+48${PARTS.slice(1).join('')}`;

  return (
    <a
      href={`tel:${dial}`}
      onClick={() => posthog.capture('footer_phone_clicked')}
      rel="nofollow noindex"
      className="inline-flex items-center gap-2 text-white font-bold text-2xl sm:text-3xl hover:text-tovernet-400 transition-colors"
    >
      <Phone className="h-6 w-6 text-tovernet-400" />
      {number}
    </a>
  );
}
