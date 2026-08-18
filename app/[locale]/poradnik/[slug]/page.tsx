import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import PoradnikArticleView from '@/components/poradnik/PoradnikArticleView';
import { getArticle, getArticlesForLocale, getOtherLocaleSlug } from '@/lib/poradnik';
import { buildMetadata } from '@/lib/seo';
import { locales } from '@/i18n';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getArticlesForLocale(locale).map((article) => ({ locale, slug: article.slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: 'pl' | 'en'; slug: string };
}): Promise<Metadata> {
  const article = getArticle(locale, slug);
  if (!article) return {};

  const otherSlug = getOtherLocaleSlug(locale, article.key);

  return buildMetadata({
    locale,
    path: `/poradnik/${article.slug}`,
    otherLocalePath: otherSlug ? `/poradnik/${otherSlug}` : undefined,
    title: `${article.title} | TOVERNET`,
    description: article.description,
    keywords: article.keywords,
    type: 'article',
    ogImage: article.category === 'kennel-clubs' ? '/screenshots/pok/dashboard.png' : undefined,
  });
}

export default function PoradnikArticlePage({
  params: { locale, slug },
}: {
  params: { locale: 'pl' | 'en'; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const article = getArticle(locale, slug);
  if (!article) notFound();

  const otherSlug = getOtherLocaleSlug(locale, article.key);

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav locale={locale} />
      <PoradnikArticleView locale={locale} article={article} otherSlug={otherSlug} />
      <SiteFooter locale={locale} />
    </div>
  );
}
