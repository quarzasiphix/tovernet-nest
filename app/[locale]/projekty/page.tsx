import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowRight, Sparkles, Calculator, PawPrint, Flower2, Hourglass, PanelsTopLeft, Database } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const ITEM_ICONS = [Calculator, PawPrint, Flower2, Hourglass];
const ITEM_GLOWS = ['magical-glow', 'magical-glow-green', 'magical-glow-amber', 'magical-glow-blue'];
const ITEM_ACCENTS = ['text-ksiegai-400', 'text-globalpet-400', 'text-gray-300', 'text-gray-300'];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return {
    title: isPolish
      ? 'Nasze Projekty | TOVERNET'
      : 'Our Projects | TOVERNET',
    description: isPolish
      ? 'KsięgaI, Global Pet, Nekrolog Łódź i Klepsydra — systemy, które TOVERNET sam projektuje, buduje i prowadzi na produkcji.'
      : "KsięgaI, Global Pet, Nekrolog Łódź, and Klepsydra — systems TOVERNET designs, builds, and runs in production.",
  };
}

export default function ProjectsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('projectsPage');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SiteNav locale={locale} />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tovernet-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tovernet-500/10 border border-tovernet-500/30 mb-8 magical-glow">
              <Sparkles className="h-4 w-4 text-tovernet-400" />
              <span className="text-tovernet-300 text-sm font-semibold">{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-tovernet-400 via-ksiegai-400 to-tovernet-500 bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Project cards */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {t.raw('items').map((item: { name: string; badge: string; description: string; cta: string; url: string }, i: number) => {
              const Icon = ITEM_ICONS[i] ?? Sparkles;
              return (
                <div key={i} className={`group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover-lift ${ITEM_GLOWS[i] ?? ''} overflow-hidden`}>
                  <Icon className={`h-10 w-10 mb-4 ${ITEM_ACCENTS[i] ?? 'text-tovernet-400'}`} />
                  <h3 className="text-2xl font-bold text-white mb-3">{item.name}</h3>
                  <div className="inline-block px-3 py-1 bg-white/10 border border-white/10 rounded-full mb-4">
                    <span className="text-gray-300 text-sm font-semibold">{item.badge}</span>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">{item.description}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                  >
                    {item.cta}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case studies behind the breeder / kennel club offer */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('caseStudies.title')}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('caseStudies.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-breeder-900/30 to-amber-900/20 border border-breeder-500/20 rounded-2xl p-8">
                <PanelsTopLeft className="h-10 w-10 text-breeder-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{t('caseStudies.gryfin.name')}</h3>
                <p className="text-gray-300">{t('caseStudies.gryfin.description')}</p>
              </div>
              <div className="bg-gradient-to-br from-kennelclub-900/30 to-blue-900/20 border border-kennelclub-500/20 rounded-2xl p-8">
                <Database className="h-10 w-10 text-kennelclub-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{t('caseStudies.pok.name')}</h3>
                <p className="text-gray-300">{t('caseStudies.pok.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('cta.title')}</h2>
            <p className="text-xl text-gray-300 mb-12">{t('cta.subtitle')}</p>
            <a
              href={`/${locale}#contact`}
              className="inline-flex items-center gap-2 bg-tovernet-gradient text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow transition-all"
            >
              {t('cta.button')}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
