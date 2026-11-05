import type { Metadata } from 'next';
import OfferClient from '@/components/tovernet/OfferClient';

export const metadata: Metadata = {
  title: 'Koncept strony | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

export default function OfferPage() {
  return <OfferClient />;
}
