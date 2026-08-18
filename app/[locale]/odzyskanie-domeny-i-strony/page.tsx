import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import AuditGuideView from '@/components/audit/AuditGuideView';
import { getAuditGuide, getOtherLocaleGuideSlug } from '@/lib/provider-audit';
import { buildMetadata } from '@/lib/seo';

const SLUG = 'odzyskanie-domeny-i-strony';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const guide = getAuditGuide(locale, SLUG);
  if (!guide) return {};
  const otherSlug = getOtherLocaleGuideSlug(locale, guide.key);
  return buildMetadata({
    locale,
    path: `/${SLUG}`,
    otherLocalePath: otherSlug ? `/${otherSlug}` : undefined,
    title: `${guide.title} | TOVERNET`,
    description: guide.description,
    keywords: guide.keywords,
    type: 'article',
    ogImage: '/screenshots/clients/nekrolog-lodz.png',
  });
}

export default function Page({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const guide = getAuditGuide(locale, SLUG);
  if (!guide) notFound();
  const otherSlug = getOtherLocaleGuideSlug(locale, guide.key);
  return (
    <div className="min-h-screen">
      <SiteNav locale={locale} />
      <AuditGuideView locale={locale} guide={guide} otherSlug={otherSlug} />
      <SiteFooter locale={locale} />
    </div>
  );
}
