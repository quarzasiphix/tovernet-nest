import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import SitePage from '@/components/site/SitePage';
import Home from '@/components/site/home/Home';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import { SELLER } from '@/lib/seller';
import { PRICES } from '@/lib/site/copy';
import { siteProjects } from '@/lib/tovernet/portfolio';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const pl = locale === 'pl';
  return buildMetadata({
    locale,
    path: '',
    title: pl
      ? 'Tovernet: strony internetowe, sklepy i systemy dla firm'
      : 'Tovernet: websites, online stores and software for businesses',
    description: pl
      ? 'Projektujemy strony firmowe, sklepy internetowe i systemy na zamówienie. Strona od 1 490 zł, stała cena, akceptacja przed publikacją. Zobacz działające realizacje.'
      : 'We design business websites, online stores and custom software. Websites from PLN 1,490, fixed price, approval before launch. See live projects.',
    keywords: pl
      ? ['strony internetowe dla firm', 'sklep internetowy', 'oprogramowanie na zamówienie', 'system dla firmy', 'integracja KSeF', 'studio stron internetowych']
      : ['business websites Poland', 'online store development', 'custom software', 'KSeF integration', 'web studio Poland'],
    ogImage: '/portfolio/nekrolog-lodz.webp',
  });
}

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const pl = locale === 'pl';
  // ProfessionalService with the website offer and the public portfolio (only listed work).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#org`,
    name: 'Tovernet',
    legalName: SELLER.name,
    url: `${SITE_URL}/${locale}/`,
    email: SELLER.email,
    telephone: SELLER.phone,
    taxID: SELLER.nip,
    address: { '@type': 'PostalAddress', streetAddress: SELLER.street, postalCode: SELLER.postal, addressLocality: SELLER.city, addressCountry: 'PL' },
    areaServed: 'PL',
    knowsLanguage: ['pl', 'en'],
    makesOffer: [
      { '@type': 'Offer', name: pl ? 'Strona internetowa Start' : 'Website: Start', price: PRICES.start / 100, priceCurrency: 'PLN' },
      { '@type': 'Offer', name: pl ? 'Strona internetowa Firma' : 'Website: Firma', price: PRICES.firma / 100, priceCurrency: 'PLN' },
      { '@type': 'Offer', name: pl ? 'Strona internetowa Pro' : 'Website: Pro', price: PRICES.pro / 100, priceCurrency: 'PLN' },
    ],
    subjectOf: siteProjects().map((p) => ({ '@type': 'CreativeWork', name: p.name, url: p.caseStudy ? `${SITE_URL}/${locale}${p.caseStudy}/` : p.url })),
  };
  return (
    <SitePage locale={locale} footCall={false}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Home locale={locale} />
    </SitePage>
  );
}
