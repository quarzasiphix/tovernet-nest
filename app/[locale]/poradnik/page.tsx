import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowRight, BookOpen } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { getArticlesByCategory, poradnikCategories, type PoradnikCategory } from '@/lib/poradnik';
import { buildMetadata } from '@/lib/seo';

const CATEGORY_ORDER: PoradnikCategory[] = ['breeders', 'kennel-clubs', 'animal-industry', 'finance'];

const CATEGORY_STYLES: Record<PoradnikCategory, { badgeBg: string; badgeBorder: string; badgeText: string; linkText: string }> = {
  breeders: { badgeBg: 'bg-kennel-pink-100', badgeBorder: 'border-kennel-pink-300', badgeText: 'text-kennel-pink-600', linkText: 'text-kennel-pink-600' },
  'kennel-clubs': { badgeBg: 'bg-kennel-lavender-100', badgeBorder: 'border-kennel-lavender-300', badgeText: 'text-kennel-lavender-500', linkText: 'text-kennel-lavender-500' },
  'animal-industry': { badgeBg: 'bg-kennel-teal-100', badgeBorder: 'border-kennel-teal-300', badgeText: 'text-kennel-teal-600', linkText: 'text-kennel-teal-600' },
  finance: { badgeBg: 'bg-kennel-yellow-100', badgeBorder: 'border-kennel-yellow-300', badgeText: 'text-amber-700', linkText: 'text-amber-700' },
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: 'pl' | 'en' };
}): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/poradnik',
    title: isPolish ? 'Poradnik | TOVERNET' : 'Guides | TOVERNET',
    description: isPolish
      ? 'Praktyczne artykuły o stronach, panelach i systemach dla hodowców, związków kynologicznych, firm z branży zwierzęcej i finansów.'
      : 'Practical guides on websites, panels, and systems for breeders, kennel clubs, animal-industry companies, and finance.',
    keywords: isPolish
      ? ['poradnik TOVERNET', 'strona dla hodowców psów', 'system dla związku kynologicznego', 'oprogramowanie dla branży zwierzęcej', 'automatyzacja KSeF']
      : ['TOVERNET guides', 'kennel website guide', 'kennel club software guide', 'animal industry software', 'KSeF automation'],
  });
}

export default function PoradnikIndexPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('poradnikIndex');

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

        <div className="pb-20 space-y-16">
          {CATEGORY_ORDER.map((category) => {
            const meta = poradnikCategories[category];
            const articles = getArticlesByCategory(locale, category);
            if (articles.length === 0) return null;
            const styles = CATEGORY_STYLES[category];

            return (
              <section key={category}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div>
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${styles.badgeBg} ${styles.badgeBorder} mb-3`}>
                          <span className={`text-xs font-bold ${styles.badgeText}`}>{meta.label[locale]}</span>
                        </span>
                        <p className="text-kennel-navy-600 max-w-xl">{meta.description[locale]}</p>
                      </div>
                      <a
                        href={meta.offerExternal ? meta.offerPath : `/${locale}${meta.offerPath}`}
                        target={meta.offerExternal ? '_blank' : undefined}
                        rel={meta.offerExternal ? 'noopener noreferrer' : undefined}
                        className={`inline-flex items-center gap-2 text-sm font-semibold ${styles.linkText} hover:opacity-80 transition-opacity flex-shrink-0`}
                      >
                        {locale === 'pl' ? 'Zobacz ofertę' : 'See the offer'}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {articles.map((article) => (
                        <a
                          key={article.slug}
                          href={`/${locale}/poradnik/${article.slug}`}
                          className="group rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-6 hover-lift block"
                        >
                          <h2 className="text-lg font-bold text-kennel-navy-900 mb-2 leading-snug">{article.title}</h2>
                          <p className="text-sm text-kennel-navy-600 leading-relaxed mb-4">{article.description}</p>
                          <span className={`inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${styles.linkText}`}>
                            {locale === 'pl' ? 'Czytaj' : 'Read'}
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <SiteFooter locale={locale} />
    </div>
  );
}
