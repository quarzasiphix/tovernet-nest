import type { Metadata } from 'next';
import PanelPreview from '@/components/tovernet/panel/PanelPreview';

// Owner review of the redesigned client panel (ksiegai/docs/plans/tovernet/17-client-panel.md).
// Fixture data only. Not linked, not indexed, not in the sitemap.
export const metadata: Metadata = {
  title: 'Podgląd panelu | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <PanelPreview />;
}
