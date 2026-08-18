import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import {
  ArrowRight, ExternalLink, Globe2, Home, Camera, LayoutDashboard, PawPrint,
  Database, MessageSquare, Search, Languages, LifeBuoy, ShieldCheck,
} from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import BreederHero from '@/components/breeders/BreederHero';
import PanelShowcase from '@/components/breeders/PanelShowcase';
import CaseStudyPreview from '@/components/breeders/CaseStudyPreview';
import QuoteForm from '@/components/breeders/QuoteForm';
import { buildMetadata } from '@/lib/seo';
import { getArticlesByCategory } from '@/lib/poradnik';

const ECOSYSTEM_ICONS = [Globe2, LayoutDashboard, Home, Database, Camera, MessageSquare, Search, Search, Languages, LifeBuoy];

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/hodowcy',
    title: isPolish
      ? 'Strony Dla Hodowców Psów | TOVERNET'
      : 'Websites For Dog Breeders | TOVERNET',
    description: isPolish
      ? 'Kompletny system dla hodowli: strona publiczna i panel administracyjny, którym hodowca zarządza samodzielnie. Zobacz działający przykład — Gryfin York.'
      : 'A complete system for your kennel: a public website and an admin panel you manage yourself. See it running live — Gryfin York.',
    keywords: isPolish
      ? ['strona dla hodowcy psów', 'panel administracyjny hodowla psów', 'niezależna strona hodowli', 'system do zarządzania miotem i szczeniętami', 'ile kosztuje strona dla hodowli']
      : ['kennel website builder', 'dog breeder admin panel', 'independent kennel website', 'litter and puppy management system'],
  });
}

export default function BreedersPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('breeders');

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav locale={locale} />

      <div className="bg-kennel-cream-100 text-kennel-navy-900">
        <BreederHero
          badge={t('hero.badge')}
          title={t('hero.title')}
          subtitle={t('hero.subtitle')}
          ctaPrimary={t('hero.ctaPrimary')}
          ctaPrimaryHref="#case-study"
          ctaSecondary={t('hero.ctaSecondary')}
          ctaSecondaryHref="#quote"
          flowLabel={t('hero.flowLabel')}
          statusFrom={t('hero.statusFrom')}
          statusTo={t('hero.statusTo')}
        />

        {/* Proof strip */}
        <section className="py-14 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kennel-teal-50 border border-kennel-teal-300">
                  <span className="h-2 w-2 rounded-full bg-kennel-teal-500 animate-pulse" />
                  <span className="text-kennel-teal-600 text-sm font-bold">{t('proof.badge')}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {t.raw('proof.items').map((item: { value: string; label: string }, i: number) => {
                  const tintBg = ['bg-kennel-teal-50', 'bg-kennel-pink-50', 'bg-kennel-lavender-50', 'bg-kennel-yellow-50'];
                  return (
                    <div key={i} className={`rounded-2xl p-5 text-center ${tintBg[i % tintBg.length]}`}>
                      <p className="text-2xl sm:text-3xl font-black text-kennel-navy-900">{item.value}</p>
                      <p className="text-xs sm:text-sm font-semibold text-kennel-navy-600 mt-1">{item.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <a
                  href={t('proof.linkUrl')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-tovernet-600 font-semibold hover:text-tovernet-700 transition-colors"
                >
                  {t('proof.linkLabel')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Kennel-club credibility band */}
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto rounded-2xl bg-kennel-lavender-50 border border-kennel-lavender-300/40 p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <ShieldCheck className="h-9 w-9 text-kennel-lavender-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-kennel-navy-900">{t('kennelClubCredibility.title')}</p>
                <p className="text-sm text-kennel-navy-600 mt-1">{t('kennelClubCredibility.description')}</p>
              </div>
              <a
                href={`/${locale}/projekty/pokiu`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-kennel-lavender-500 hover:opacity-80 transition-opacity flex-shrink-0"
              >
                {t('kennelClubCredibility.cta')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Interactive panel showcase */}
        <section id="panel-showcase" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-5">{t('panelShowcase.title')}</h2>
              <p className="text-lg text-kennel-navy-600 leading-relaxed">{t('panelShowcase.subtitle')}</p>
            </div>
            <div className="max-w-4xl mx-auto relative">
              <div className="absolute -inset-1.5 rounded-[2rem] bg-gradient-to-r from-kennel-pink-400 via-kennel-teal-400 to-kennel-lavender-400 opacity-70 blur-xl animate-pulse pointer-events-none" />
              <div className="relative">
                <PanelShowcase />
              </div>
            </div>
          </div>
        </section>

        {/* GRYFIN YORK case study */}
        <section id="case-study" className="py-20 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900">{t('caseStudy.title')}</h2>
            </div>
            <div className="max-w-5xl mx-auto">
              <CaseStudyPreview
                publicLabel={t('caseStudy.publicLabel')}
                panelLabel={t('caseStudy.panelLabel')}
                publicItems={t.raw('caseStudy.publicItems')}
                panelItems={t.raw('caseStudy.panelItems')}
                callout={t('caseStudy.callout')}
                ctaOpenLabel={t('caseStudy.ctaOpenLabel')}
                ctaOpenHref="https://hodowlagryfinyork.pl"
                ctaPanelLabel={t('caseStudy.ctaPanelLabel')}
                ctaPanelHref="#panel-showcase"
              />
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-5">{t('ecosystem.title')}</h2>
              <p className="text-lg text-kennel-navy-600">{t('ecosystem.subtitle')}</p>
            </div>
            <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-6 sm:p-10">
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-tovernet-gradient text-white font-bold text-lg">
                  <PawPrint className="h-5 w-5" />
                  {t('ecosystem.hub')}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {t.raw('ecosystem.items').map((item: string, i: number) => {
                  const Icon = ECOSYSTEM_ICONS[i] ?? Globe2;
                  const tintBg = ['bg-kennel-teal-50', 'bg-kennel-pink-50', 'bg-kennel-lavender-50', 'bg-kennel-yellow-50'];
                  return (
                    <div key={i} className={`rounded-xl p-4 text-center ${tintBg[i % tintBg.length]}`}>
                      <Icon className="h-5 w-5 mx-auto mb-2 text-kennel-navy-700" />
                      <p className="text-xs font-semibold text-kennel-navy-700 leading-snug">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Ownership */}
        <section className="py-20 bg-kennel-navy-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">{t('ownership.title')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {t.raw('ownership.items').map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="h-6 w-6 rounded-full bg-kennel-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-kennel-teal-400" />
                    </div>
                    <p className="text-gray-200 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-6">{t('pricing.title')}</h2>
              <p className="text-lg text-kennel-navy-600 leading-relaxed mb-10">{t('pricing.description')}</p>
              <div className="rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-6 sm:p-8 text-left mb-10">
                <p className="text-sm font-bold uppercase tracking-wide text-kennel-navy-400 mb-4">{t('pricing.variesTitle')}</p>
                <div className="flex flex-wrap gap-2">
                  {t.raw('pricing.variesItems').map((item: string, i: number) => (
                    <span key={i} className="text-sm font-semibold px-3 py-1.5 rounded-full bg-kennel-lavender-50 text-kennel-lavender-500">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href="#quote"
                className="inline-flex items-center gap-2 bg-tovernet-gradient text-white text-lg px-10 py-4 rounded-xl font-semibold shadow-lg hover-lift transition-all"
              >
                {t('pricing.cta')}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-5">{t('process.title')}</h2>
              <p className="text-lg text-kennel-navy-600">{t('process.subtitle')}</p>
            </div>
            <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-5 gap-6">
              {t.raw('process.steps').map((step: { title: string; description: string }, i: number) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-kennel-teal-400 flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-kennel-teal-600">{i + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-kennel-navy-900 mb-2">{step.title}</h3>
                  <p className="text-kennel-navy-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote form */}
        <section id="quote" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-kennel-navy-900 mb-4">{t('quoteForm.title')}</h2>
              <p className="text-lg text-kennel-navy-600">{t('quoteForm.subtitle')}</p>
            </div>
            <QuoteForm content={t.raw('quoteForm')} />
          </div>
        </section>

        {/* Poradnik cross-links */}
        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm font-bold uppercase tracking-wide text-kennel-navy-400 mb-4 text-center">
                {locale === 'pl' ? 'Poczytaj więcej' : 'Read more'}
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {getArticlesByCategory(locale, 'breeders')
                  .slice(0, 3)
                  .map((a) => (
                    <a
                      key={a.slug}
                      href={`/${locale}/poradnik/${a.slug}`}
                      className="rounded-xl bg-white border border-kennel-navy-400/10 p-4 hover-lift block"
                    >
                      <p className="text-sm font-bold text-kennel-navy-900 leading-snug">{a.title}</p>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Final CTA — back to dark TOVERNET identity */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('finalCta.title')}</h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">{t('finalCta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#quote"
                className="inline-flex items-center justify-center gap-2 bg-tovernet-gradient text-white text-lg px-10 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow transition-all"
              >
                {t('finalCta.ctaPrimary')}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="https://hodowlagryfinyork.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white text-lg px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                {t('finalCta.ctaSecondary')}
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
