import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, Search, HeartHandshake, Users, Truck,
  Database, RefreshCw, CheckCircle2, FileWarning, Languages, CircleDot,
} from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { buildMetadata } from '@/lib/seo';

const PILLAR_ICONS = [Search, HeartHandshake, Users, Truck];
const PLATFORM_ICONS = [Database, RefreshCw, CheckCircle2, FileWarning];

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty/anemalo',
    title: isPolish
      ? 'Anemalo — Europejski Ekosystem dla Zwierząt | TOVERNET'
      : 'Anemalo — A European Animal Ecosystem | TOVERNET',
    description: isPolish
      ? 'Anemalo to nasz własny produkt: platforma łącząca hodowców, fundacje, adopcje, społeczność i transport zwierząt — z jednym gatewayem API, na którym już działają nasi klienci hodowlani, i dwujęzycznym interfejsem PL/EN.'
      : "Anemalo is our own product: a platform connecting breeders, foundations, adoptions, community, and animal transport — with one API gateway our own kennel clients already run on, and a bilingual PL/EN interface.",
    keywords: isPolish
      ? ['platforma dla hodowców psów', 'system dla organizacji kynologicznych', 'transport zwierząt platforma', 'ekosystem dla zwierząt']
      : ['dog breeder platform', 'kennel club system', 'animal transport platform', 'animal ecosystem software'],
    type: 'article',
  });
}

export default function AnemaloCaseStudy({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('caseStudies');
  const c = useTranslations('caseStudies.anemalo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <SiteNav locale={locale} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <a href={`/${locale}/projekty`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </a>
      </div>

      {/* Hero */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-anemalo-500/10 border border-anemalo-500/30 mb-6 magical-glow-forest">
              <Sparkles className="h-4 w-4 text-anemalo-400" />
              <span className="text-anemalo-300 text-xs font-bold tracking-widest uppercase">{c('badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-anemalo-400 via-emerald-400 to-anemalo-500 bg-clip-text text-transparent">
                {c('title')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{c('subtitle')}</p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <a
                href={c('cta.url')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-anemalo-gradient text-white px-7 py-3.5 rounded-xl font-semibold hover-lift transition-all shadow-lg"
              >
                {c('cta.label')}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#platform"
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                {t('roleLabel')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Role */}
      <section className="py-16 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-anemalo-300">{t('roleLabel')}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{c('role.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('role.description')}</p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{c('pillars.title')}</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">{c('pillars.subtitle')}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {c.raw('pillars.items').map((item: { title: string; description: string }, i: number) => {
                const Icon = PILLAR_ICONS[i] ?? Sparkles;
                return (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <Icon className="h-8 w-8 text-anemalo-400 mb-4" />
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Platform architecture */}
      <section id="platform" className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-anemalo-300">{c('platform.eyebrow')}</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">{c('platform.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('platform.intro')}</p>
          </div>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
            {c.raw('platform.cards').map((item: { title: string; description: string }, i: number) => {
              const Icon = PLATFORM_ICONS[i] ?? Database;
              return (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <Icon className="h-8 w-8 text-anemalo-400 mb-4" />
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-anemalo-500/10 border border-anemalo-500/30 mb-6">
              <Languages className="h-4 w-4 text-anemalo-400" />
              <span className="text-xs font-semibold text-anemalo-300 tracking-wide uppercase">PL / EN</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{c('languages.title')}</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{c('languages.text')}</p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto border-t border-white/10 pt-5 mt-5">
              {c('languages.widgetNote')}
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{c('roadmap.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('roadmap.intro')}</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {c.raw('roadmap.items').map((item: { label: string; status: string }, i: number) => {
              const done = item.status === 'Gotowe' || item.status === 'Done';
              return (
                <div key={i} className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5">
                  <span className="text-gray-200 text-sm">{item.label}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                      done
                        ? 'bg-anemalo-500/15 text-anemalo-300 border border-anemalo-500/30'
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    <CircleDot className="h-3 w-3" />
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6 text-center text-anemalo-300">{t('featuresLabel')}</p>
            <ul className="space-y-4">
              {c.raw('features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3 border-b border-white/10 pb-4">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 bg-anemalo-400" />
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
            className="inline-flex items-center gap-2 bg-anemalo-gradient px-8 py-4 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {c('cta.label')}
            <ArrowUpRight className="h-5 w-5" />
          </a>
          <div className="mt-6">
            <a href={`/${locale}#contact`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              {locale === 'pl' ? 'Chcesz podobnego systemu dla swojej branży? Skontaktuj się z nami' : 'Want a system like this for your industry? Get in touch'}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
