import type { Metadata } from 'next';
import FoodPreview from './FoodPreview';

// Owner review of the food service concept (ksiegai/docs/plans/tovernet/18-niche-expansion.md).
// Fixture data only. Not linked, not indexed, not in the sitemap. The integrator removes it.
export const metadata: Metadata = {
  title: 'Podgląd niszy: gastronomia | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <FoodPreview />;
}
