import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import LegalPageView from '@/components/legal/LegalPageView';
import { legalContent } from '@/lib/legal';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/regulamin',
    title: isPolish ? 'Regulamin | TOVERNET' : 'Terms of Use | TOVERNET',
    description: isPolish
      ? 'Zasady korzystania ze strony tovernet.online.'
      : 'Terms governing the use of tovernet.online.',
  });
}

export default function TermsPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const page = legalContent[locale].terms;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SiteNav locale={locale} />
      <LegalPageView page={page} />
      <SiteFooter locale={locale} />
    </div>
  );
}
