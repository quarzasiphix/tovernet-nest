import type { Metadata } from 'next';
import FunnelPreview from '@/components/tovernet/funnel/FunnelPreview';

// Owner review of the proposed sales journey (ksiegai/docs/plans/tovernet/11-funnel.md).
// Fixture data only. Not linked, not indexed, not in the sitemap.
export const metadata: Metadata = {
  title: 'Podgląd ścieżki | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <FunnelPreview />;
}
