import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowRight, BookOpen } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { getArticlesForLocale } from '@/lib/poradnik';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: 'pl' | 'en' };
}): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/poradnik',
    title: isPolish ? 'Poradnik dla Hodowców Psów | TOVERNET' : 'Guides for Dog Breeders | TOVERNET',
    description: isPolish
      ? 'Praktyczne artykuły o stronach dla hodowli, panelach administracyjnych i niezależności od portali i social mediów.'
      : 'Practical guides on kennel websites, admin panels, and independence from platforms and social media.',
    keywords: isPolish
      ? ['poradnik dla hodowców psów', 'strona dla hodowli psów', 'panel dla hodowcy']
      : ['dog breeder guides', 'kennel website guide', 'breeder admin panel guide'],
  });
}

export default function PoradnikIndexPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('poradnikIndex');
  const articles = getArticlesForLocale(locale);

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav locale={locale} />

      <div className="bg-kennel-cream-100 text-kennel-navy-900">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kennel-teal-50 border border-kennel-teal-300 mb-6">
                <BookOpen className="h-4 w-4 text-kennel-teal-600" />
                <span className="text-kennel-teal-600 text-sm font-bold">{locale === 'pl' ? 'Poradnik' : 'Guides'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-kennel-navy-900 mb-6">{t('title')}</h1>
              <p className="text-lg text-kennel-navy-600 leading-relaxed">{t('subtitle')}</p>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
              {articles.map((article) => (
                <a
                  key={article.slug}
                  href={`/${locale}/poradnik/${article.slug}`}
                  className="group rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-6 hover-lift block"
                >
                  <h2 className="text-lg font-bold text-kennel-navy-900 mb-2 leading-snug">{article.title}</h2>
                  <p className="text-sm text-kennel-navy-600 leading-relaxed mb-4">{article.description}</p>
                  <span className="inline-flex items-center gap-2 text-kennel-pink-600 text-sm font-semibold group-hover:gap-3 transition-all">
                    {locale === 'pl' ? 'Czytaj' : 'Read'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      <SiteFooter locale={locale} />
    </div>
  );
}
