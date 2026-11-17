'use client';

import { openConsentSettings } from '@/lib/consent';

export default function CookieSettings({ label }: { label: string }) {
  return <button type="button" onClick={openConsentSettings}>{label}</button>;
}
