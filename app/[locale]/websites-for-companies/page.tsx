import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import IntlOfferPage from '@/components/tovernet/IntlOfferPage';
import { SITE_URL } from '@/lib/seo';

// English offer for companies outside Poland (Dalvo / KsięgaI international companies).
// The Polish offer funnel (/strony-dla-*) stays Polish-only: it is priced in PLN, sold under
// Polish terms and personalised from KRS. Here there is no checkout: the visitor asks for a
// quote and Tovernet answers with scope and price.

const PATH = '/websites-for-companies/';
const TITLE = 'Websites for companies | Tovernet';
const DESCRIPTION =
  'A clear, fast company website built around how your customers contact you. Tell us about your business and we will reply with a scope and a quote.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/en${PATH}`,
    languages: { en: `${SITE_URL}/en${PATH}`, pl: `${SITE_URL}/strony-dla-firm/` },
  },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/en${PATH}`, locale: 'en_US', type: 'website' },
  robots: { index: true, follow: true },
};

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  if (locale !== 'en') notFound();
  unstable_setRequestLocale(locale);
  return <IntlOfferPage />;
}
