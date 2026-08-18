import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowRight, Sparkles, Calculator, PawPrint, Flower2, Hourglass, PanelsTopLeft, Database } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { buildMetadata } from '@/lib/seo';

type ProjectItem = { name: string; badge: string; description: string; cta?: string; url?: string; slug?: string };

const OWN_BRAND_ICONS = [Calculator, PawPrint];
const OWN_BRAND_GLOWS = ['magical-glow', 'magical-glow-green'];
const OWN_BRAND_ACCENTS = ['text-ksiegai-400', 'text-globalpet-400'];

const CLIENT_ICONS = [Flower2, Hourglass, PanelsTopLeft, PawPrint, Database];

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty',
    title: isPolish
      ? 'Nasze Projekty | TOVERNET'
      : 'Our Projects | TOVERNET',
    description: isPolish
      ? 'Nasze własne marki (KsięgaI, Global Pet) i realizacje dla klientów (Nekrolog Łódź, Gryfin York, POK CRM i inne) — systemy, które TOVERNET projektuje, buduje i utrzymuje.'
      : 'Our own brands (KsięgaI, Global Pet) and client work (Nekrolog Łódź, Gryfin York, POK CRM, and more) — systems TOVERNET designs, builds, and maintains.',
    keywords: isPolish
      ? ['portfolio TOVERNET', 'realizacje dla klientów', 'systemy dla branży zwierzęcej', 'przykłady stron dla hodowli']
      : ['TOVERNET portfolio', 'client case studies', 'animal industry systems'],
  });
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

      {/* Own brands */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('ownBrands.title')}</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('ownBrands.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {t.raw('ownBrands.items').map((item: ProjectItem, i: number) => {
                const Icon = OWN_BRAND_ICONS[i] ?? Sparkles;
                return (
                  <div key={i} className={`group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover-lift ${OWN_BRAND_GLOWS[i] ?? ''} overflow-hidden`}>
                    <Icon className={`h-10 w-10 mb-4 ${OWN_BRAND_ACCENTS[i] ?? 'text-tovernet-400'}`} />
                    <h3 className="text-2xl font-bold text-white mb-3">{item.name}</h3>
                    <div className="inline-block px-3 py-1 bg-white/10 border border-white/10 rounded-full mb-4">
                      <span className="text-gray-300 text-sm font-semibold">{item.badge}</span>
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed">{item.description}</p>
                    {item.url && (
                      <a
                        href={item.url.startsWith('http') ? item.url : `/${locale}${item.url}`}
                        target={item.url.startsWith('http') ? '_blank' : undefined}
                        rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                      >
                        {item.cta}
                        <ArrowRight className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Client projects */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('clientProjects.title')}</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('clientProjects.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.raw('clientProjects.items').map((item: ProjectItem, i: number) => {
                const Icon = CLIENT_ICONS[i] ?? PanelsTopLeft;
                return (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover-lift flex flex-col">
                    <Icon className="h-8 w-8 text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                    <div className="inline-block px-3 py-1 bg-white/10 border border-white/10 rounded-full mb-3 self-start">
                      <span className="text-gray-400 text-xs font-semibold">{item.badge}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-1">{item.description}</p>
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                      {item.slug && (
                        <a
                          href={`/${locale}/projekty/${item.slug}`}
                          className="inline-flex items-center gap-2 text-sm text-white font-semibold hover:text-tovernet-300 transition-colors"
                        >
                          {t('clientProjects.caseStudyLabel')}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {item.cta} ↗
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
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
