import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
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
    title: 'Gryfin York — Case Study | TOVERNET',
    description: isPolish
      ? 'Jak zbudowaliśmy stronę publiczną i panel administracyjny dla hodowli Yorkshire Terrierów Gryfin York.'
      : 'How we built the public site and admin panel for the Gryfin York Yorkshire Terrier kennel.',
    keywords: isPolish
      ? ['hodowla Yorkshire Terrier strona i panel', 'przykład strony dla hodowli psów', 'panel administracyjny hodowla przykład']
      : ['Yorkshire Terrier kennel website example', 'dog breeder website example', 'breeder admin panel example'],
    type: 'article',
    ogImage: '/screenshots/clients/gryfin-york.png',
  });
}

export default async function GryfinYorkCaseStudy({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('caseStudies');
  const c = await getTranslations('caseStudies.gryfinYork');
  const b = await getTranslations('breeders');

  const gryfinContent = await getGryfinSiteContent();

  return (
    <div className="min-h-screen bg-slate-950">
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
              <img src="/screenshots/clients/gryfin-york.png" alt={c('title')} className="w-full h-auto block" />
            </div>
          </div>
        </section>

        {/* Proof strip */}
        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Role */}
        <section className="py-16 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs font-bold tracking-widest uppercase mb-3 text-kennel-pink-600">{t('roleLabel')}</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-kennel-navy-900">{c('role.title')}</h2>
              <p className="text-kennel-navy-600 leading-relaxed">{c('role.description')}</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-bold tracking-widest uppercase mb-6 text-center text-kennel-pink-600">{t('featuresLabel')}</p>
              <ul className="space-y-4">
                {c.raw('features').map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl p-4 bg-white border border-kennel-navy-400/10 kennel-card-shadow">
                    <span className="mt-1 h-2 w-2 rounded-full flex-shrink-0 bg-kennel-teal-500" />
                    <span className="text-kennel-navy-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Try the real panel */}
        <section className="py-16 bg-kennel-cream-50 border-y border-kennel-navy-400/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold text-kennel-navy-900 mb-4">{b('panelShowcase.title')}</h2>
              <p className="text-kennel-navy-600 leading-relaxed">{b('panelShowcase.subtitle')}</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <PanelShowcase content={gryfinContent} />
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
              className="inline-flex items-center gap-2 bg-tovernet-gradient text-white px-8 py-4 rounded-xl font-semibold hover-lift transition-all shadow-lg"
            >
              {c('cta.label')}
              <ArrowUpRight className="h-5 w-5" />
            </a>
            <div className="mt-6">
              <a href={`/${locale}/hodowcy`} className="inline-flex items-center gap-2 text-sm text-kennel-navy-600 hover:text-kennel-navy-900 transition-colors">
                {locale === 'pl' ? 'Prowadzisz hodowlę? Zobacz naszą ofertę dla hodowców' : 'Run a kennel? See our breeder offer'}
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
