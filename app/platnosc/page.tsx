import type { Metadata } from 'next';
import PayLink from '@/components/tovernet/pay/PayLink';

export const metadata: Metadata = {
  title: 'Płatność | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

/** Personal pay link from a payment e-mail: /platnosc/#<slug>. No login; the link pays one charge. */
export default function PayPage() {
  return <PayLink />;
}
