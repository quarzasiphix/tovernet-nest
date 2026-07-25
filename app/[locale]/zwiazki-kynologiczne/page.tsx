import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowRight, BookOpen, Users, FileCheck, Trophy, Receipt, History, Building2, ShieldCheck } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const FEATURE_ICONS = [BookOpen, Users, FileCheck, Trophy, Receipt, History];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return {
    title: isPolish
      ? 'System Dla Związków Kynologicznych | TOVERNET'
      : 'System For Kennel Clubs | TOVERNET',
    description: isPolish
      ? 'Rejestr psów, rodowody, rozliczenia i pełny audyt w jednym systemie multi-tenant dla biur związków kynologicznych.'
      : 'Dog registry, pedigrees, payments, and a full audit trail in one multi-tenant system for kennel club offices.',
  };
}

export default function KennelClubsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('kennelClubs');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <SiteNav locale={locale} />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-kennelclub-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kennelclub-500/10 border border-kennelclub-500/30 mb-8 magical-glow-blue">
              <Building2 className="h-4 w-4 text-kennelclub-400" />
              <span className="text-kennelclub-300 text-sm font-semibold">{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-kennelclub-400 via-blue-300 to-kennelclub-500 bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`/${locale}#contact`}
                className="inline-flex items-center justify-center gap-2 bg-kennelclub-gradient text-white text-lg px-10 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow-blue transition-all"
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

      {/* Solution / Features */}
      <section id="solution" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('solution.title')}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('solution.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.raw('solution.features').map((feature: { title: string; description: string }, i: number) => {
                const Icon = FEATURE_ICONS[i] ?? BookOpen;
                return (
                  <div key={i} className="bg-gradient-to-br from-kennelclub-900/30 to-blue-900/20 border border-kennelclub-500/20 rounded-2xl p-6 hover-lift">
                    <Icon className="h-10 w-10 text-kennelclub-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Multi-tenant + Security */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <Users className="h-10 w-10 text-kennelclub-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">{t('multiTenant.title')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('multiTenant.description')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <ShieldCheck className="h-10 w-10 text-kennelclub-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">{t('security.title')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('security.description')}</p>
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
              className="inline-flex items-center gap-2 bg-kennelclub-gradient text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow-blue transition-all"
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
