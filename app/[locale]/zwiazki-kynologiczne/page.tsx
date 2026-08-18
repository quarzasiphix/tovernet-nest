import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowRight, BookOpen, Users, FileCheck, Trophy, Receipt, History, Building2, ShieldCheck, LayoutDashboard, FileUp, Clock3, UserPlus, Calculator, QrCode, ScanLine, KeyRound, Lock, ExternalLink } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import PokPanelDemo from '@/components/PokPanelDemo';
import { buildMetadata } from '@/lib/seo';
import { getArticlesByCategory } from '@/lib/poradnik';

const FEATURE_ICONS = [BookOpen, Users, FileCheck, Trophy, Receipt, History];
const COLLAB_ICONS = [LayoutDashboard, FileUp, Clock3, UserPlus];
const QR_ICONS = [QrCode, ScanLine, KeyRound, Lock];

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/zwiazki-kynologiczne',
    title: isPolish
      ? 'System Dla Związków Kynologicznych | TOVERNET'
      : 'System For Kennel Clubs | TOVERNET',
    description: isPolish
      ? 'Rejestr psów, rodowody, rozliczenia i pełny audyt w jednym systemie multi-tenant dla biur związków kynologicznych.'
      : 'Dog registry, pedigrees, payments, and a full audit trail in one multi-tenant system for kennel club offices.',
    keywords: isPolish
      ? ['system dla związku kynologicznego', 'elektroniczna księga rodowodowa', 'panel hodowcy online', 'weryfikacja rodowodu kodem QR', 'rejestr psów program']
      : ['kennel club software', 'electronic pedigree registry', 'breeder panel for kennel clubs', 'QR pedigree verification'],
  });
}

export default function KennelClubsPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
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

      {/* Interactive office panel demo */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('screenshots.title')}</h2>
            <p className="text-xl text-gray-300 leading-relaxed">{t('screenshots.subtitle')}</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <PokPanelDemo />
          </div>

          <div className="max-w-3xl mx-auto mt-8 text-center">
            <p className="text-gray-400 mb-4">{t('screenshots.caption')}</p>
            <a
              href={`/${locale}/projekty/pokiu`}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              {t('screenshots.linkLabel')}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Breeder collaboration */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('collaboration.title')}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('collaboration.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.raw('collaboration.items').map((item: { title: string; description: string }, i: number) => {
                const Icon = COLLAB_ICONS[i] ?? LayoutDashboard;
                return (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                    <Icon className="h-8 w-8 text-kennelclub-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* QR verification */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('qrVerification.title')}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('qrVerification.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {t.raw('qrVerification.items').map((item: { title: string; description: string }, i: number) => {
                const Icon = QR_ICONS[i] ?? QrCode;
                return (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                    <Icon className="h-8 w-8 text-kennelclub-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <p className="text-gray-400 mb-3">{t('qrVerification.proof')}</p>
              <a
                href={`/${locale}/projekty/pokiu`}
                className="inline-flex items-center gap-2 text-kennelclub-300 font-semibold hover:text-kennelclub-200 transition-colors"
              >
                {t('qrVerification.proofCta')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-tenant + Security */}
      <section className="py-20">
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

      {/* KsięgaI cross-sell banner */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-ksiegai-900/30 to-purple-900/20 border border-ksiegai-500/30 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <Calculator className="h-10 w-10 text-ksiegai-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t('ksiegaiBanner.title')}</h3>
                <p className="text-gray-300">{t('ksiegaiBanner.description')}</p>
              </div>
            </div>
            <a
              href={`/${locale}/projekty/ksiegai`}
              className="inline-flex items-center gap-2 bg-ksiegai-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
            >
              {t('ksiegaiBanner.cta')}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Poradnik cross-links */}
      <section className="py-16 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4 text-center">
              {locale === 'pl' ? 'Poczytaj więcej' : 'Read more'}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {getArticlesByCategory(locale, 'kennel-clubs').map((a) => (
                <a
                  key={a.slug}
                  href={`/${locale}/poradnik/${a.slug}`}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors block"
                >
                  <p className="text-sm font-bold text-white leading-snug">{a.title}</p>
                </a>
              ))}
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
