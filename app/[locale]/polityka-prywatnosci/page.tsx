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
    path: '/polityka-prywatnosci',
    title: isPolish ? 'Polityka Prywatności | TOVERNET' : 'Privacy Policy | TOVERNET',
    description: isPolish
      ? 'Jakie dane zbieramy na tovernet.online, w jakim celu i jakie prawa Ci przysługują.'
      : 'What data we collect on tovernet.online, for what purpose, and what rights you have.',
  });
}

export default function PrivacyPolicyPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const page = legalContent[locale].privacy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SiteNav locale={locale} />
      <LegalPageView page={page} />
      <SiteFooter locale={locale} />
    </div>
  );
}
