import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import {
  ArrowRight, ExternalLink, Globe2, Home, Camera, LayoutDashboard, PawPrint,
  Database, MessageSquare, Search, Languages, LifeBuoy, ShieldCheck, Wrench,
  KeyRound, AlertTriangle, Share2, RefreshCw, Users, ScrollText, FileCheck2,
} from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import BreederHero from '@/components/breeders/BreederHero';
import PanelShowcase from '@/components/breeders/PanelShowcase';
import CaseStudyPreview from '@/components/breeders/CaseStudyPreview';
import QuoteForm from '@/components/breeders/QuoteForm';
import { buildMetadata } from '@/lib/seo';
import { getArticlesByCategory } from '@/lib/poradnik';
import { getGryfinSiteContent, pickHeroPuppy, sexLabel } from '@/lib/gryfin';
import { PROVIDER_AUDIT_HUB_PATH } from '@/lib/provider-audit';

const ECOSYSTEM_ICONS = [Globe2, LayoutDashboard, Home, Database, Camera, MessageSquare, Search, Search, Languages, LifeBuoy];
const SITUATION_ICONS = [Home, Wrench, LayoutDashboard, KeyRound, AlertTriangle, Share2];

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/hodowcy',
    title: isPolish
      ? 'Strony, Panele i Wsparcie Cyfrowe Dla Hodowców | TOVERNET'
      : 'Websites, Panels and Digital Support For Dog Breeders | TOVERNET',
    description: isPolish
      ? 'Strony i panele hodowli, migracje z WordPressa, zarządzanie psami i miotami, odzyskiwanie kontroli nad domeną oraz wsparcie przy zmianie wykonawcy.'
      : 'Kennel websites and panels, migrations from WordPress, managing dogs and litters, regaining control of your domain, and support when changing a contractor.',
    keywords: isPolish
      ? ['strona dla hodowcy psów', 'panel administracyjny hodowla psów', 'migracja strony hodowli z WordPressa', 'odzyskanie kontroli nad domeną hodowli', 'system do zarządzania miotem i szczeniętami']
      : ['kennel website builder', 'dog breeder admin panel', 'kennel website migration', 'regain control of kennel domain', 'litter and puppy management system'],
  });
}

export default async function BreedersPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('breeders');

  const gryfinContent = await getGryfinSiteContent();
  const heroSource = pickHeroPuppy(gryfinContent);
  const heroDog = heroSource
    ? {
        name: heroSource.name,
        color: heroSource.color,
        sexLabel: sexLabel(heroSource.sex),
        photoUrl: heroSource.photo_url,
      }
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: locale === 'pl' ? 'Strony i systemy dla hodowców psów' : 'Websites and systems for dog breeders',
    provider: { '@type': 'Organization', name: 'TOVERNET', url: 'https://tovernet.online' },
    areaServed: 'PL',
    description: t('hero.subtitle'),
    url: `https://tovernet.online/${locale}/hodowcy`,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav locale={locale} />

      <div className="bg-kennel-cream-100 text-kennel-navy-900">
        <BreederHero
          badge={t('hero.badge')}
          title={t('hero.title')}
          titleHighlightWord={t('hero.titleHighlightWord')}
          subtitle={t('hero.subtitle')}
          ctaPrimary={t('hero.ctaPrimary')}
          ctaPrimaryHref="#capabilities"
          ctaSecondary={t('hero.ctaSecondary')}
          ctaSecondaryHref="#quote"
          flowLabel={t('hero.flowLabel')}
          mobileLivePill={t('hero.mobileLivePill')}
          mobileProofLine={t('hero.mobileProofLine')}
          mobileProofStats={t('hero.mobileProofStats')}
          statusFrom={t('hero.statusFrom')}
          statusTo={t('hero.statusTo')}
          dog={heroDog}
        />

        {/* Situation cards */}
        <section id="situation" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-5">{t('situation.title')}</h2>
              <p className="text-lg text-kennel-navy-600">{t('situation.subtitle')}</p>
            </div>
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {t.raw('situation.cards').map((card: { title: string; description: string }, i: number) => {
                const Icon = SITUATION_ICONS[i] ?? Home;
                const tintBg = ['bg-kennel-teal-50', 'bg-kennel-pink-50', 'bg-kennel-lavender-50', 'bg-kennel-yellow-50'];
                return (
                  <div key={i} className="rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-6">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${tintBg[i % tintBg.length]}`}>
                      <Icon className="h-5 w-5 text-kennel-navy-700" />
                    </div>
                    <h3 className="font-bold text-kennel-navy-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-kennel-navy-600 leading-relaxed">{card.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section id="capabilities" className="py-20 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-5">{t('capabilities.title')}</h2>
              <p className="text-lg text-kennel-navy-600">{t('capabilities.subtitle')}</p>
            </div>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              {([
                { key: 'website', icon: Globe2 },
                { key: 'panel', icon: LayoutDashboard },
                { key: 'enquiries', icon: MessageSquare },
                { key: 'documents', icon: ScrollText },
              ] as const).map(({ key, icon: Icon }) => (
                <div key={key} className="rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-6 sm:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-lg bg-kennel-teal-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4.5 w-4.5 text-kennel-teal-600" />
                    </div>
                    <h3 className="font-bold text-kennel-navy-900">{t(`capabilities.${key}.title`)}</h3>
                  </div>
                  {key !== 'website' && (
                    <p className="text-xs text-kennel-navy-500 mb-3 leading-relaxed">{t(`capabilities.${key}.note`)}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {t.raw(`capabilities.${key}.items`).map((item: string, i: number) => (
                      <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-kennel-cream-100 text-kennel-navy-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Migration */}
        <section id="migration" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-kennel-lavender-50 mb-5">
                <RefreshCw className="h-6 w-6 text-kennel-lavender-500" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-5">{t('migration.title')}</h2>
              <p className="text-lg text-kennel-navy-600">{t('migration.intro')}</p>
            </div>
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-3">
              {t.raw('migration.items').map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-white border border-kennel-navy-400/10 rounded-xl p-4">
                  <div className="mt-1 h-2 w-2 rounded-full flex-shrink-0 bg-kennel-lavender-400" />
                  <p className="text-sm text-kennel-navy-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive panel showcase */}
        <section id="panel-showcase" className="py-20 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-5">{t('panelShowcase.title')}</h2>
              <p className="text-lg text-kennel-navy-600 leading-relaxed">{t('panelShowcase.subtitle')}</p>
            </div>
            <div className="max-w-4xl mx-auto relative">
              <div className="absolute -inset-1.5 rounded-[2rem] bg-gradient-to-r from-kennel-pink-400 via-kennel-teal-400 to-kennel-lavender-400 opacity-70 blur-xl animate-pulse pointer-events-none" />
              <div className="relative">
                <PanelShowcase content={gryfinContent} />
              </div>
            </div>
          </div>
        </section>

        {/* GRYFIN YORK proof */}
        <section id="case-study" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900">{t('caseStudy.title')}</h2>
              <p className="mt-4 text-sm sm:text-base text-kennel-navy-500 max-w-2xl mx-auto">{t('proof.disclaimer')}</p>
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
                ctaPanelHref={`/${locale}/projekty/gryfin-york`}
              />
            </div>
          </div>
        </section>

        {/* Contractor oversight */}
        <section id="contractors" className="py-20 bg-kennel-navy-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/10 mb-5">
                  <Users className="h-6 w-6 text-kennel-teal-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">{t('contractors.title')}</h2>
                <p className="text-gray-300">{t('contractors.intro')}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {t.raw('contractors.providerTypes').map((item: string, i: number) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {item}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 mb-8">
                <p className="font-bold text-white mb-4">{t('contractors.helpIntro')}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {t.raw('contractors.helpItems').map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <FileCheck2 className="h-4 w-4 text-kennel-teal-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 mb-8">
                <p className="text-sm text-gray-300 leading-relaxed mb-4">{t('contractors.nekrologNote')}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <a href={`/${locale}/projekty/nekrolog-lodz`} className="inline-flex items-center gap-2 text-sm font-semibold text-kennel-teal-400 hover:opacity-80 transition-opacity">
                    {t('contractors.linkNekrologLabel')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href={`/${locale}${PROVIDER_AUDIT_HUB_PATH[locale]}`} className="inline-flex items-center gap-2 text-sm font-semibold text-kennel-teal-400 hover:opacity-80 transition-opacity">
                    {t('contractors.linkAuditLabel')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">{t('contractors.boundariesTitle')}</p>
                <p className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  {t.raw('contractors.boundariesItems').join(' ')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ownership */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 text-center mb-6">{t('ownership.title')}</h2>
              <p className="text-lg text-kennel-navy-600 text-center max-w-2xl mx-auto mb-12 leading-relaxed">{t('ownership.intro')}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {t.raw('ownership.items').map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-kennel-cream-50 border border-kennel-navy-400/10 rounded-xl p-5">
                    <div className="h-6 w-6 rounded-full bg-kennel-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-kennel-teal-500" />
                    </div>
                    <p className="text-kennel-navy-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Evidence from multiple real projects */}
        <section className="py-20 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-5">{t('evidence.title')}</h2>
              <p className="text-lg text-kennel-navy-600">{t('evidence.subtitle')}</p>
            </div>
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-5">
              {(['gryfin', 'kolorowaPasja', 'pokiu', 'nekrolog'] as const).map((key) => {
                const tintBg = { gryfin: 'bg-kennel-pink-50', kolorowaPasja: 'bg-kennel-yellow-50', pokiu: 'bg-kennel-lavender-50', nekrolog: 'bg-kennel-teal-50' }[key];
                const linkCase = t(`evidence.${key}.linkCase`);
                const linkLive = t.has(`evidence.${key}.linkLive`) ? t(`evidence.${key}.linkLive`) : null;
                return (
                  <div key={key} className="rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-6 sm:p-7 flex flex-col">
                    <span className={`self-start text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3 ${tintBg} text-kennel-navy-700`}>
                      {t(`evidence.${key}.kicker`)}
                    </span>
                    <h3 className="font-bold text-lg text-kennel-navy-900 mb-2">{t(`evidence.${key}.badge`)}</h3>
                    <p className="text-sm text-kennel-navy-600 leading-relaxed mb-5 flex-1">{t(`evidence.${key}.description`)}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                      <a href={`/${locale}${linkCase}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-tovernet-600 hover:text-tovernet-700 transition-colors">
                        {t(`evidence.${key}.linkCaseLabel`)}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                      {linkLive && (
                        <a href={linkLive} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-kennel-navy-600 hover:text-kennel-navy-900 transition-colors">
                          {t(`evidence.${key}.linkLiveLabel`)}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="max-w-2xl mx-auto text-center text-xs text-kennel-navy-400 mt-8 leading-relaxed">{t('evidence.note')}</p>
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

        {/* Flexible scope */}
        <section className="py-20 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-6">{t('flexibleScope.title')}</h2>
              <p className="text-lg text-kennel-navy-600 leading-relaxed mb-10">{t('flexibleScope.description')}</p>
              <div className="rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-6 sm:p-8 text-left mb-10">
                <p className="text-sm font-bold uppercase tracking-wide text-kennel-navy-400 mb-4">{t('flexibleScope.variesTitle')}</p>
                <div className="flex flex-wrap gap-2">
                  {t.raw('flexibleScope.variesItems').map((item: string, i: number) => (
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
                {t('flexibleScope.cta')}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20">
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
        <section id="quote" className="py-20 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-kennel-navy-900 mb-4">{t('quoteForm.title')}</h2>
              <p className="text-lg text-kennel-navy-600">{t('quoteForm.subtitle')}</p>
            </div>
            <QuoteForm content={t.raw('quoteForm')} />
          </div>
        </section>

        {/* Poradnik cross-links */}
        <section className="py-20">
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
                href={`/${locale}/projekty`}
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white text-lg px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                {t('finalCta.ctaSecondary')}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
