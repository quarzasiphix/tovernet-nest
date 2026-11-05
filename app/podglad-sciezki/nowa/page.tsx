import type { Metadata } from 'next';
import FunnelPreview from '@/components/tovernet/funnel/FunnelPreview';
import StudioJourney from '@/components/tovernet/studio/StudioJourney';

// Owner review of the redesigned journey: same fixture data, simulated network and
// review panel as /podglad-sciezki/. Not linked, not indexed, not in the sitemap.
export const metadata: Metadata = {
  title: 'Nowa ścieżka, podgląd | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <FunnelPreview journey={StudioJourney} />;
}
