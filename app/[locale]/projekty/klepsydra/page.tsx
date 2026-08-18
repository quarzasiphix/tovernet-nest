import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { buildMetadata } from '@/lib/seo';

const GOLD = 'hsl(42, 86%, 54%)';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty/klepsydra',
    title: 'Klepsydra — Case Study | TOVERNET',
    description: isPolish
      ? 'Jak zbudowaliśmy Klepsydrę — darmowy generator e-klepsydry online marketowany pod marką klienta, Nekrolog Łódź.'
      : 'How we built Klepsydra — a free online e-obituary generator marketed under the client\'s brand, Nekrolog Łódź.',
    keywords: isPolish
      ? ['generator e-klepsydry online', 'darmowa klepsydra pogrzebowa', 'aplikacja dla zakładu pogrzebowego']
      : ['online obituary generator', 'free e-obituary tool', 'funeral home web app'],
    type: 'article',
    ogImage: '/screenshots/clients/klepsydra.png',
  });
}

export default function KlepsydraCaseStudy({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('caseStudies');
  const c = useTranslations('caseStudies.klepsydra');

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      <SiteNav locale={locale} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <a href={`/${locale}/projekty`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </a>
      </div>

      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 rounded-full border mb-6" style={{ borderColor: GOLD, color: GOLD }}>
              <span className="text-xs font-semibold tracking-widest uppercase">{c('badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: GOLD }}>{c('title')}</h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{c('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Screenshot */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(212,168,42,0.3)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screenshots/clients/klepsydra.png" alt={c('title')} className="w-full h-auto block" />
          </div>
        </div>
      </section>

      {/* Role */}
      <section className="py-16 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>{t('roleLabel')}</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{c('role.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('role.description')}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6 text-center" style={{ color: GOLD }}>{t('featuresLabel')}</p>
            <ul className="space-y-4">
              {c.raw('features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3 border-b border-white/10 pb-4">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href={c('cta.url')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-black hover:opacity-90 transition-opacity"
            style={{ background: GOLD }}
          >
            {c('cta.label')}
            <ArrowUpRight className="h-5 w-5" />
          </a>
          <div className="mt-6">
            <a href={`/${locale}/projekty/nekrolog-lodz`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              {locale === 'pl' ? 'Zobacz też: strona główna Nekrolog Łódź' : 'Also see: the main Nekrolog Łódź site'}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
