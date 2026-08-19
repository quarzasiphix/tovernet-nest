import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import {
  ArrowRight, PawPrint, Building2, Truck, Calculator, Receipt, Plane, FileCheck, Users, ClipboardList, Sparkles,
} from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import BreederHomeCard from '@/components/breeders/BreederHomeCard';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '',
    title: isPolish
      ? 'Strony i Systemy Dla Branży Zwierzęcej | TOVERNET'
      : 'Websites and Systems for the Animal Industry | TOVERNET',
    description: isPolish
      ? 'Strony internetowe, panele klientów i dedykowane systemy dla hodowców, organizacji kynologicznych i firm z branży zwierzęcej. Znamy tę branżę — sami w niej działamy.'
      : 'Websites, client portals, and dedicated systems for breeders, kennel clubs, and animal-industry companies. We know this industry — we operate in it ourselves.',
    keywords: isPolish
      ? ['strony i systemy dla branży zwierzęcej', 'oprogramowanie dla hodowców psów', 'panel administracyjny hodowla', 'systemy dla związków kynologicznych']
      : ['websites for the animal industry', 'dog breeder software', 'kennel admin panel', 'kennel club systems'],
  });
}

const WHY_WE_KNOW_ICONS = [FileCheck, Users, Plane, ClipboardList];

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SiteNav locale={locale} />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tovernet-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tovernet-500/10 border border-tovernet-500/30 mb-6 magical-glow">
              <Sparkles className="h-4 w-4 text-tovernet-400" />
              <span className="text-tovernet-300 text-sm font-semibold">{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-tovernet-400 via-ksiegai-400 to-tovernet-500 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="#solutions"
                className="inline-flex items-center justify-center gap-2 bg-tovernet-gradient text-white text-lg px-10 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow transition-all"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white text-lg px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                {t('hero.ctaSecondary')}
              </a>
            </div>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              {t('hero.tagline')}
            </p>
          </div>
        </div>
      </section>

      {/* Four paths */}
      <section id="solutions" className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('paths.title')}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('paths.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <BreederHomeCard
                href={`/${locale}/hodowcy`}
                title={t('paths.breeders.title')}
                description={t('paths.breeders.description')}
                cta={t('paths.breeders.cta')}
              />

              <a
                href={`/${locale}/zwiazki-kynologiczne`}
                className="group relative bg-gradient-to-br from-kennelclub-900/30 to-blue-900/20 border border-kennelclub-500/20 rounded-2xl p-8 hover-lift magical-glow-blue overflow-hidden block"
              >
                <Building2 className="h-10 w-10 text-kennelclub-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">{t('paths.kennelClubs.title')}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{t('paths.kennelClubs.description')}</p>
                <span className="inline-flex items-center gap-2 text-kennelclub-400 font-semibold group-hover:gap-3 transition-all">
                  {t('paths.kennelClubs.cta')}
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>

              <a
                href={`/${locale}#contact`}
                className="group relative bg-gradient-to-br from-globalpet-900/30 to-green-900/20 border border-globalpet-500/20 rounded-2xl p-8 hover-lift magical-glow-green overflow-hidden block"
              >
                <Truck className="h-10 w-10 text-globalpet-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">{t('paths.animalIndustry.title')}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{t('paths.animalIndustry.description')}</p>
                <span className="inline-flex items-center gap-2 text-globalpet-400 font-semibold group-hover:gap-3 transition-all">
                  {t('paths.animalIndustry.cta')}
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>

              <a
                href={`/${locale}/projekty/ksiegai`}
                className="group relative bg-gradient-to-br from-ksiegai-900/30 to-purple-900/20 border border-ksiegai-500/20 rounded-2xl p-8 hover-lift magical-glow overflow-hidden block"
              >
                <Calculator className="h-10 w-10 text-ksiegai-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">{t('paths.finance.title')}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{t('paths.finance.description')}</p>
                <span className="inline-flex items-center gap-2 text-ksiegai-400 font-semibold group-hover:gap-3 transition-all">
                  {t('paths.finance.cta')}
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why we know this industry */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('whyWeKnow.title')}</h2>
            <p className="text-xl text-gray-300 leading-relaxed">{t('whyWeKnow.description')}</p>
          </div>
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.raw('whyWeKnow.items').map((item: { title: string; description: string }, i: number) => {
              const Icon = WHY_WE_KNOW_ICONS[i] ?? FileCheck;
              return (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                  <Icon className="h-8 w-8 text-tovernet-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client work */}
      <section id="projects" className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('projectsShowcase.clientWork.title')}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('projectsShowcase.clientWork.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {t.raw('projectsShowcase.clientWork.featured').map((item: { name: string; badge: string; description: string; cta: string; url: string }, i: number) => (
                <a
                  key={i}
                  href={`/${locale}${item.url}`}
                  className={`group relative rounded-3xl p-8 hover-lift overflow-hidden block border ${
                    i === 0
                      ? 'bg-gradient-to-br from-kennelclub-900/40 to-blue-900/30 border-kennelclub-500/30 magical-glow-blue'
                      : 'bg-gradient-to-br from-breeder-900/40 to-amber-900/20 border-breeder-500/30 magical-glow-amber'
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 ${i === 0 ? 'bg-kennelclub-500/10' : 'bg-breeder-500/10'}`}></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-3">{item.name}</h3>
                    <div className={`inline-block px-3 py-1 border rounded-full mb-4 ${i === 0 ? 'bg-kennelclub-500/20 border-kennelclub-400/30' : 'bg-breeder-500/20 border-breeder-400/30'}`}>
                      <span className={`text-sm font-semibold ${i === 0 ? 'text-kennelclub-300' : 'text-breeder-300'}`}>{item.badge}</span>
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed">{item.description}</p>
                    <span className={`inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all ${i === 0 ? 'text-kennelclub-400' : 'text-breeder-400'}`}>
                      {item.cta}
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-400 mb-4">{t('projectsShowcase.clientWork.secondaryLabel')}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {t.raw('projectsShowcase.clientWork.secondary').map((item: { name: string; url: string }, i: number) => (
                  <a
                    key={i}
                    href={`/${locale}${item.url}`}
                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <a
                href={`/${locale}/projekty`}
                className="inline-flex items-center gap-2 text-tovernet-300 font-semibold hover:text-tovernet-200 transition-colors"
              >
                {t('projectsShowcase.clientWork.allCta')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="max-w-4xl mx-auto mt-14 pt-10 border-t border-white/10 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">{t('projectsShowcase.industriesKnown.title')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {t.raw('projectsShowcase.industriesKnown.tags').map((tag: string, i: number) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOVERNET products */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('verticals.title')}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t('verticals.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* KsięgaI */}
              <div className="group relative bg-gradient-to-br from-ksiegai-900/40 to-purple-900/40 border border-ksiegai-500/30 rounded-3xl p-10 hover-lift magical-glow overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ksiegai-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Calculator className="h-10 w-10 text-ksiegai-400" />
                    <Receipt className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {t('verticals.ksiegai.title')}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-ksiegai-500/20 border border-ksiegai-400/30 rounded-full mb-6">
                    <span className="text-ksiegai-300 text-sm font-semibold">{t('verticals.ksiegai.badge')}</span>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    {t('verticals.ksiegai.description')}
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-400">
                    {t.raw('verticals.ksiegai.features').map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="h-5 w-5 text-ksiegai-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`/${locale}/projekty/ksiegai`}
                    className="inline-flex items-center gap-2 bg-ksiegai-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t('verticals.ksiegai.cta')}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* GlobalPet Transport */}
              <div className="group relative bg-gradient-to-br from-globalpet-900/40 to-green-900/40 border border-globalpet-500/30 rounded-3xl p-10 hover-lift magical-glow-green overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-globalpet-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <PawPrint className="h-10 w-10 text-globalpet-400" />
                    <Plane className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {t('verticals.globalPet.title')}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-globalpet-500/20 border border-globalpet-400/30 rounded-full mb-6">
                    <span className="text-globalpet-300 text-sm font-semibold">{t('verticals.globalPet.badge')}</span>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    {t('verticals.globalPet.description')}
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-400">
                    {t.raw('verticals.globalPet.features').map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="h-5 w-5 text-globalpet-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://globalpet.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-globalpet-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t('verticals.globalPet.cta')}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Model */}
      <section id="engagement" className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('engagement.title')}
              </h2>
              <p className="text-xl text-gray-300">
                {t('engagement.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {t.raw('engagement.steps').map((step: { title: string; description: string }, i: number) => (
                <div key={i} className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-tovernet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-tovernet-400">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              {t('contact.subtitle')}
            </p>
            <a
              href="mailto:contact@tovernet.online"
              className="inline-flex items-center gap-2 bg-tovernet-gradient text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow transition-all"
            >
              {t('contact.cta')}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
