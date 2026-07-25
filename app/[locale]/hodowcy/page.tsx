import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowRight, PawPrint, Camera, LayoutDashboard, MapPin, Search, Globe2, LifeBuoy } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const EXTRA_ICONS = [MapPin, Search, Globe2, LifeBuoy];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return {
    title: isPolish
      ? 'Strony Dla Hodowców Psów | TOVERNET'
      : 'Websites For Dog Breeders | TOVERNET',
    description: isPolish
      ? 'Własna strona i panel administracyjny dla Twojej hodowli psów — na zawsze Twoje. Wizytówka Google i lokalne SEO w cenie. Bezpłatna wycena.'
      : 'A website and admin panel for your kennel — yours forever. Google Business Profile and local SEO included. Free quote.',
  };
}

export default function BreedersPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('breeders');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950">
      <SiteNav locale={locale} />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-breeder-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-breeder-500/10 border border-breeder-500/30 mb-8 magical-glow-amber">
              <PawPrint className="h-4 w-4 text-breeder-400" />
              <span className="text-breeder-300 text-sm font-semibold">{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-breeder-400 via-amber-300 to-breeder-500 bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`/${locale}#contact`}
                className="inline-flex items-center justify-center gap-2 bg-breeder-gradient text-white text-lg px-10 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow-amber transition-all"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#solution"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white text-lg px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                {t('hero.ctaSecondary')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('problem.title')}</h2>
            <p className="text-xl text-gray-300 leading-relaxed">{t('problem.description')}</p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('solution.title')}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('solution.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-breeder-900/30 to-amber-900/20 border border-breeder-500/20 rounded-2xl p-8 hover-lift">
                <Camera className="h-12 w-12 text-breeder-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('solution.public.title')}</h3>
                <p className="text-gray-300 mb-4">{t('solution.public.description')}</p>
                <ul className="space-y-2 text-gray-400">
                  {t.raw('solution.public.features').map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-breeder-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-breeder-900/30 to-amber-900/20 border border-breeder-500/20 rounded-2xl p-8 hover-lift">
                <LayoutDashboard className="h-12 w-12 text-breeder-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('solution.panel.title')}</h3>
                <p className="text-gray-300 mb-4">{t('solution.panel.description')}</p>
                <ul className="space-y-2 text-gray-400">
                  {t.raw('solution.panel.features').map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-breeder-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extra services */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('extra.title')}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('extra.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.raw('extra.items').map((item: { title: string; description: string }, i: number) => {
                const Icon = EXTRA_ICONS[i] ?? MapPin;
                return (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                    <Icon className="h-8 w-8 text-breeder-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
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
              className="inline-flex items-center gap-2 bg-breeder-gradient text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow-amber transition-all"
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
