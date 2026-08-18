import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { buildMetadata } from '@/lib/seo';
import { PROVIDER_AUDIT_MAIN_PATH, PROVIDER_AUDIT_HUB_PATH } from '@/lib/provider-audit';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: PROVIDER_AUDIT_HUB_PATH.pl,
    otherLocalePath: PROVIDER_AUDIT_HUB_PATH.en,
    title: isPolish
      ? 'Odzyskaj Kontrolę Cyfrową Nad Swoją Firmą | TOVERNET'
      : 'Regain Digital Control Over Your Business | TOVERNET',
    description: isPolish
      ? 'Nie masz dostępu do domeny, strony lub kont swojej firmy? Sprawdź, jak odzyskać kontrolę i zweryfikować dotychczasowego dostawcę.'
      : "Lost access to your company's domain, website, or accounts? See how to regain control and verify a vendor's work.",
    keywords: isPolish
      ? ['odzyskanie kontroli nad stroną', 'brak dostępu do domeny', 'niezależność cyfrowa firmy']
      : ['regain website control', 'no access to domain', 'digital independence for business'],
    type: 'website',
    ogImage: '/screenshots/clients/nekrolog-lodz.png',
  });
}

export default function DigitalControlHubPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  if (locale !== 'pl') notFound();
  unstable_setRequestLocale(locale);
  const t = useTranslations('providerAudit.hub');
  const mainPath = PROVIDER_AUDIT_MAIN_PATH[locale];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <SiteNav locale={locale} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 rounded-full border border-ksiegai-500/40 mb-6 bg-white/5">
              <span className="text-xs font-semibold tracking-widest uppercase text-ksiegai-300">{t('badge')}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-kennelclub-400 to-ksiegai-400 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">{t('subtitle')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={`/${locale}${mainPath}#intake`} className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white bg-tovernet-gradient hover:opacity-90 transition-opacity">
                {t('ctaPrimary')} <ArrowRight className="h-5 w-5" />
              </a>
              <a href={`/${locale}${mainPath}`} className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-colors">
                {t('ctaSecondary')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="max-w-2xl mx-auto text-center text-gray-300 leading-relaxed">{t('intro')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
            {t.raw('links').map((link: { title: string; description: string; href: string }, i: number) => (
              <a
                key={i}
                href={`/${locale}${link.href}`}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-kennelclub-500/30 transition-all"
              >
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  {link.title}
                  <ArrowRight className="h-4 w-4 text-kennelclub-400" />
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a href={`/${locale}/projekty/nekrolog-lodz`} className="inline-flex items-center gap-2 text-kennelclub-300 hover:text-white font-semibold transition-colors">
            {t('caseStudyCta')} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
