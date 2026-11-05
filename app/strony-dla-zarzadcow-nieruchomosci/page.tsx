import type { Metadata } from 'next';
import NichePage from '@/components/tovernet/NichePage';
import { NICHE_BY_KEY } from '@/lib/tovernet/niches';
import { nicheJsonLd } from '@/lib/tovernet/seo';

const niche = NICHE_BY_KEY['zarzadcy-nieruchomosci'];

export const metadata: Metadata = {
  title: niche.title,
  description: niche.description,
  alternates: { canonical: `https://tovernet.online${niche.path}` },
  openGraph: { title: niche.title, description: niche.description, url: `https://tovernet.online${niche.path}`, locale: 'pl_PL', type: 'website' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(nicheJsonLd(niche)) }} />
      <NichePage nicheKey="zarzadcy-nieruchomosci" />
    </>
  );
}
