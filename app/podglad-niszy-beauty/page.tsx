import type { Metadata } from 'next';
import BeautyPreview from './Preview';

// Review page for the beauty concept (ksiegai/docs/plans/tovernet/18-niche-expansion.md).
// Fixture companies only. Not linked, not indexed, not in the sitemap. The integrator
// removes it once the concept is registered in ConceptSite.
export const metadata: Metadata = {
  title: 'Podgląd niszy: beauty | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <BeautyPreview />;
}
