import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { SELLER } from '@/lib/seller';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const pl = params.locale === 'pl';
  // Pages set their own title, description and alternates (lib/seo.ts); these are fallbacks.
  return {
    title: pl ? 'Tovernet: strony internetowe, sklepy i systemy dla firm' : 'Tovernet: websites, online stores and software for businesses',
    description: pl
      ? 'Projektujemy strony firmowe, sklepy internetowe i oprogramowanie na zamówienie. Stała cena, akceptacja przed publikacją, działające realizacje.'
      : 'We design business websites, online stores and custom software. Fixed price, approval before launch, live projects you can check.',
    authors: [{ name: 'Tovernet sp. z o.o.' }],
    openGraph: { type: 'website', locale: pl ? 'pl_PL' : 'en_US', siteName: 'Tovernet' },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  unstable_setRequestLocale(locale);


  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://tovernet.online/#organization',
    name: 'Tovernet',
    legalName: SELLER.name,
    url: 'https://tovernet.online',
    email: SELLER.email,
    telephone: SELLER.phone,
    taxID: SELLER.nip,
    address: { '@type': 'PostalAddress', streetAddress: SELLER.street, postalCode: SELLER.postal, addressLocality: SELLER.city, addressCountry: 'PL' },
    description: locale === 'pl'
      ? 'Tovernet projektuje, buduje i utrzymuje strony internetowe, sklepy i systemy dla firm.'
      : 'Tovernet designs, builds and runs websites, online stores and software for businesses.',
  };

  return (
    <>
      {/* The root layout is shared by both languages (static export): correct <html lang> here. */}
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(locale)}` }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* No messages on the client: every translated string renders on the server. Sending the
          whole catalogue used to put every page's copy (including unpublished case studies)
          into each page's HTML. */}
      <NextIntlClientProvider locale={locale} messages={{}}>
        {children}
      </NextIntlClientProvider>
    </>
  );
}
