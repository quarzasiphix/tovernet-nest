import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import PanelShowcase from '@/components/breeders/PanelShowcase';
import { buildMetadata } from '@/lib/seo';
import { getGryfinSiteContent } from '@/lib/gryfin';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty/gryfin-york',
    title: isPolish
      ? 'Gryfin York — Migracja i System Hodowli | Case Study TOVERNET'
      : 'Gryfin York — Migration and Kennel System | TOVERNET Case Study',
    description: isPolish
      ? 'Jak pomogliśmy hodowli Gryfin York przejść ze starego WordPressa i zależności od wcześniejszych wykonawców do własnej strony połączonej z panelem hodowli.'
      : 'How we helped the Gryfin York kennel move from an old WordPress site and dependence on previous contractors to its own website connected to a kennel panel.',
    keywords: isPolish
      ? ['hodowla Yorkshire Terrier strona i panel', 'migracja strony hodowli z WordPressa', 'panel administracyjny hodowla przykład']
      : ['Yorkshire Terrier kennel website example', 'kennel website WordPress migration', 'breeder admin panel example'],
    type: 'article',
    ogImage: '/screenshots/clients/gryfin-york.png',
  });
}

export default async function GryfinYorkCaseStudy({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('caseStudies');
  const c = await getTranslations('caseStudies.gryfinYork');
  const b = await getTranslations('breeders');

  const gryfinContent = await getGryfinSiteContent();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'TOVERNET', item: `https://tovernet.online/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'pl' ? 'Projekty' : 'Projects', item: `https://tovernet.online/${locale}/projekty` },
      { '@type': 'ListItem', position: 3, name: c('title'), item: `https://tovernet.online/${locale}/projekty/gryfin-york` },
    ],
  };
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c('title'),
    description: c('subtitle'),
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'TOVERNET' },
    publisher: { '@type': 'Organization', name: 'TOVERNET' },
    about: { '@type': 'Organization', name: 'Gryfin York' },
    image: `https://tovernet.online/screenshots/clients/gryfin-york.png`,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <SiteNav locale={locale} />

      <div className="bg-kennel-cream-100 text-kennel-navy-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <a href={`/${locale}/projekty`} className="inline-flex items-center gap-2 text-sm text-kennel-navy-600 hover:text-kennel-navy-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </a>
        </div>

        {/* Hero */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kennel-pink-100 border border-kennel-pink-300 mb-6">
                <span className="text-kennel-pink-600 text-xs font-bold tracking-widest uppercase">{c('badge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-kennel-navy-900">{c('title')}</h1>
              <p className="text-lg md:text-xl leading-relaxed text-kennel-navy-600">{c('subtitle')}</p>
            </div>
          </div>
        </section>

        {/* Screenshot */}
        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border kennel-card-shadow" style={{ borderColor: '#f0e6d2' }}>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b" style={{ borderColor: '#f0e6d2' }}>
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
                <span className="ml-3 text-xs font-mono text-kennel-navy-400">hodowlagryfinyork.pl</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/screenshots/clients/gryfin-york.png" alt={locale === 'pl' ? 'Strona publiczna hodowli Gryfin York' : 'The Gryfin York public website'} className="w-full h-auto block" />
            </div>
          </div>
        </section>

        {/* About the client */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-kennel-navy-900">{c('about.title')}</h2>
              {c.raw('about.paragraphs').map((p: string, i: number) => (
                <p key={i} className="text-kennel-navy-700 leading-relaxed mb-4">{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Starting situation */}
        <section className="py-16 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-bold tracking-widest uppercase mb-3 text-kennel-pink-600">
                {locale === 'pl' ? 'Zanim zaczęliśmy' : 'Before we started'}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-kennel-navy-900">{c('startingSituation.title')}</h2>
              {c.raw('startingSituation.paragraphs').map((p: string, i: number) => (
                <p key={i} className="text-kennel-navy-700 leading-relaxed mb-4">{p}</p>
              ))}
              <ul className="space-y-3 mt-6">
                {c.raw('startingSituation.list').map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl p-4 bg-white border border-kennel-navy-400/10">
                    <span className="mt-1 h-2 w-2 rounded-full flex-shrink-0 bg-kennel-pink-400" />
                    <span className="text-kennel-navy-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Migration and recovery work */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-kennel-navy-900">{c('migrationWork.title')}</h2>
              <p className="text-kennel-navy-600 leading-relaxed mb-6">{c('migrationWork.intro')}</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {c.raw('migrationWork.items').map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 rounded-xl p-4 bg-white border border-kennel-navy-400/10 kennel-card-shadow">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-kennel-teal-500" />
                    <span className="text-sm text-kennel-navy-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Design decision */}
        <section className="py-16 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-kennel-navy-900">{c('designDecision.title')}</h2>
              {c.raw('designDecision.paragraphs').map((p: string, i: number) => (
                <p key={i} className="text-kennel-navy-700 leading-relaxed mb-4">{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Delivered system */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-kennel-navy-900">{c('deliveredSystem.title')}</h2>
              <p className="text-kennel-navy-600 leading-relaxed mb-6">{c('deliveredSystem.intro')}</p>
              <div className="flex flex-wrap gap-2">
                {c.raw('deliveredSystem.items').map((item: string, i: number) => (
                  <span key={i} className="text-sm font-semibold px-3 py-1.5 rounded-full bg-kennel-teal-50 text-kennel-teal-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Panel -> website + real scale */}
        <section className="py-16 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-xs font-bold tracking-widest uppercase mb-3 text-kennel-pink-600">{c('panelToWebsite.title')}</p>
              <h2 className="text-2xl md:text-4xl font-bold text-kennel-navy-900 mb-4">{b('panelShowcase.title')}</h2>
              <p className="text-kennel-navy-600 leading-relaxed max-w-2xl mx-auto">{c('panelToWebsite.description')}</p>
            </div>
            <div className="max-w-4xl mx-auto mb-12">
              <PanelShowcase content={gryfinContent} />
            </div>

            <p className="text-xs font-bold uppercase tracking-wide text-kennel-navy-400 mb-4 text-center">{c('realScaleTitle')}</p>
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
              {b.raw('proof.items').map((item: { value: string; label: string }, i: number) => {
                const tintBg = ['bg-kennel-teal-50', 'bg-kennel-pink-50', 'bg-kennel-lavender-50', 'bg-kennel-yellow-50'];
                return (
                  <div key={i} className={`rounded-2xl p-5 text-center ${tintBg[i % tintBg.length]}`}>
                    <p className="text-2xl sm:text-3xl font-black text-kennel-navy-900">{item.value}</p>
                    <p className="text-xs sm:text-sm font-semibold text-kennel-navy-600 mt-1">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Result */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-kennel-navy-900 text-center">{c('result.title')}</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {c.raw('result.items').map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 rounded-xl p-4 bg-white border border-kennel-navy-400/10 kennel-card-shadow">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-kennel-teal-500" />
                    <span className="text-sm text-kennel-navy-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Our ongoing role */}
        <section className="py-16 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs font-bold tracking-widest uppercase mb-3 text-kennel-pink-600">{t('roleLabel')}</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-kennel-navy-900">{c('role.title')}</h2>
              <p className="text-kennel-navy-600 leading-relaxed">{c('role.description')}</p>
            </div>
          </div>
        </section>

        {/* CTA + links */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <a
              href={c('cta.url')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-tovernet-gradient text-white px-8 py-4 rounded-xl font-semibold hover-lift transition-all shadow-lg"
            >
              {c('cta.label')}
              <ArrowUpRight className="h-5 w-5" />
            </a>
            <div className="mt-8 flex flex-col items-center gap-3">
              <a href={`/${locale}${c('linksSection.breederOfferUrl')}`} className="inline-flex items-center gap-2 text-sm font-semibold text-kennel-navy-900 hover:opacity-80 transition-opacity">
                {c('linksSection.breederOfferLabel')}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href={`/${locale}${c('linksSection.pokiuUrl')}`} className="inline-flex items-center gap-2 text-sm text-kennel-navy-600 hover:text-kennel-navy-900 transition-colors">
                {c('linksSection.pokiuLabel')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter locale={locale} />
    </div>
  );
}
