import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, ShieldCheck, KeyRound, RefreshCw, Send,
  AlertTriangle, Users, Bot, Landmark, GitBranch, History, Wrench, Lock, Building2, CheckCircle2,
} from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import KsiegaiShowcase from '@/components/ksiegai/KsiegaiShowcase';
import { buildMetadata } from '@/lib/seo';

const KSEF_ICONS = [KeyRound, ShieldCheck, RefreshCw, Send];

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty/ksiegai',
    title: isPolish
      ? 'KsięgaI — Architektura Systemu | TOVERNET'
      : "KsięgaI — System Architecture | TOVERNET",
    description: isPolish
      ? 'Jak zbudowaliśmy KsięgaI: produkcyjne połączenie z KSeF, wielofirmowy system uprawnień, bezpieczny dostęp dla agentów AI i uzgadnianie banku — problemy i decyzje architektoniczne, nie lista funkcji.'
      : 'How we built KsięgaI: a production KSeF connection, a multi-company permission system, secure AI-agent access, and bank reconciliation — the problems and architectural decisions, not a feature list.',
    keywords: isPolish
      ? ['program do KSeF dla małej firmy', 'system do fakturowania z KSeF', 'oprogramowanie księgowe dla małej firmy', 'automatyzacja fakturowania KSeF', 'integracja KSeF dla programistów', 'MCP dla księgowości']
      : ['KSeF invoicing software', 'small business accounting system', 'invoicing automation software', 'KSeF integration architecture', 'MCP accounting AI agent'],
    type: 'article',
  });
}

export default function KsiegaiCaseStudy({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('caseStudies');
  const c = useTranslations('caseStudies.ksiegai');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ksiegai-500/10 border border-ksiegai-500/30 mb-6 magical-glow">
              <Sparkles className="h-4 w-4 text-ksiegai-400" />
              <span className="text-ksiegai-300 text-xs font-bold tracking-widest uppercase">{c('badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-ksiegai-400 via-purple-400 to-ksiegai-500 bg-clip-text text-transparent">
                {c('title')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">{c('subtitle')}</p>
            <p className="text-gray-400 leading-relaxed">{c('description')}</p>

            <div className="grid sm:grid-cols-2 gap-3 mt-10 mb-10">
              {c.raw('proofBadges').map((badge: string, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 text-ksiegai-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-200">{badge}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={c('cta.url')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-ksiegai-gradient text-white px-7 py-3.5 rounded-xl font-semibold hover-lift transition-all shadow-lg"
              >
                {c('cta.label')}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                {c('ctaSecondary')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <KsiegaiShowcase />
          </div>
        </div>
      </section>

      {/* Role */}
      <section className="py-16 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold tracking-widest uppercase mb-3 text-ksiegai-400">{t('roleLabel')}</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">{c('role.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('role.description')}</p>
          </div>
        </div>
      </section>

      {/* Problem: it doesn't end at issuing the invoice */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{c('problem.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('problem.description')}</p>
          </div>
          <div className="max-w-5xl mx-auto flex flex-wrap items-stretch justify-center gap-2">
            {c.raw('problem.workflow').map((step: string, i: number, arr: string[]) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 max-w-[180px]">
                  <span className="text-xs font-bold text-ksiegai-400 block mb-1">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-gray-200 leading-snug">{step}</span>
                </div>
                {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-gray-600 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KSeF architecture */}
      <section id="architecture" className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{c('ksefArchitecture.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('ksefArchitecture.intro')}</p>
          </div>

          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6 mb-14">
            {c.raw('ksefArchitecture.cards').map((card: { title: string; description: string }, i: number) => {
              const Icon = KSEF_ICONS[i] ?? ShieldCheck;
              return (
                <div key={i} className="bg-gradient-to-br from-ksiegai-900/30 to-purple-900/20 border border-ksiegai-500/20 rounded-2xl p-6">
                  <Icon className="h-8 w-8 text-ksiegai-400 mb-3" />
                  <h3 className="text-white font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl p-6 md:p-8 bg-ksiegai-gradient mb-8">
            <p className="text-white text-lg leading-relaxed italic">&ldquo;{c('ksefArchitecture.auditQuote')}&rdquo;</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase mb-4 text-center text-ksiegai-400">
              {c('ksefArchitecture.auditFindingsTitle')}
            </p>
            <ul className="space-y-3 mb-8">
              {c.raw('ksefArchitecture.auditFindings').map((finding: string, i: number) => (
                <li key={i} className="flex items-start gap-3 rounded-xl p-4 bg-white/5 border border-white/10">
                  <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm leading-relaxed">{finding}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-xl p-5 border border-ksiegai-500/30 bg-ksiegai-500/5">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-ksiegai-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">{c('ksefArchitecture.leakFix')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Permissions */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{c('permissions.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('permissions.intro')}</p>
          </div>

          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {c.raw('permissions.roles').map((r: { role: string; sees: string; canDo: string }, i: number) => {
              const Icon = [Building2, Landmark, Users, Bot][i] ?? Users;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <Icon className="h-7 w-7 text-ksiegai-400 mb-3" />
                  <h3 className="text-white font-bold mb-3">{r.role}</h3>
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{locale === 'pl' ? 'Widzi' : 'Sees'}</p>
                  <p className="text-sm text-gray-300 mb-3">{r.sees}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{locale === 'pl' ? 'Może' : 'Can do'}</p>
                  <p className="text-sm text-gray-300">{r.canDo}</p>
                </div>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-white font-semibold leading-relaxed mb-4">{c('permissions.mainSentence')}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{c('permissions.isolationNote')}</p>
          </div>
        </div>
      </section>

      {/* MCP / AI */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Bot className="h-10 w-10 text-ksiegai-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{c('mcp.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('mcp.intro')}</p>
          </div>

          <div className="max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-4 text-center text-ksiegai-400">{c('mcp.exampleTitle')}</p>
            <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-ksiegai-900/40 to-purple-900/30 border border-ksiegai-500/30">
              <p className="text-gray-200 leading-relaxed">{c('mcp.example')}</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-4 text-center text-ksiegai-400">{c('mcp.examplesTitle')}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {c.raw('mcp.examples').map((ex: string, i: number) => (
                <div key={i} className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-ksiegai-400 font-mono text-xs mt-0.5">&gt;</span>
                  <span className="text-sm text-gray-300 italic">&ldquo;{ex}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <p className="text-sm text-gray-400 leading-relaxed">{c('mcp.safetyNote')}</p>
            <p className="text-white font-semibold leading-relaxed">{c('mcp.closingSentence')}</p>
          </div>
        </div>
      </section>

      {/* Banking */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Landmark className="h-10 w-10 text-ksiegai-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{c('banking.title')}</h2>
          </div>

          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-3 mb-10">
            {c.raw('banking.items').map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 bg-ksiegai-400" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl p-6 md:p-8 border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-white font-bold">{c('banking.mismatchTitle')}</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{c('banking.mismatchNote')}</p>
          </div>
        </div>
      </section>

      {/* Accounting as controlled state machine */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{c('accounting.title')}</h2>
            <p className="text-xl text-gray-300 leading-relaxed">{c('accounting.intro')}</p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-4 text-center text-ksiegai-400">{c('accounting.modulesTitle')}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {c.raw('accounting.modules').map((m: string, i: number) => (
                <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  {m}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed text-center max-w-2xl mx-auto">{c('accounting.queueNote')}</p>
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl p-6 md:p-8 bg-gradient-to-br from-ksiegai-900/40 to-purple-900/30 border border-ksiegai-500/30">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="h-6 w-6 text-ksiegai-400" />
              <h3 className="text-lg font-bold text-white">{c('accounting.branches.title')}</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-5">{c('accounting.branches.description')}</p>
            <p className="text-xs font-bold tracking-widest uppercase mb-3 text-ksiegai-300">{c('accounting.branches.usesTitle')}</p>
            <ul className="space-y-2 mb-5">
              {c.raw('accounting.branches.uses').map((u: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <ArrowRight className="h-4 w-4 text-ksiegai-400 flex-shrink-0 mt-0.5" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 italic border-t border-white/10 pt-4">{c('accounting.branches.status')}</p>
          </div>
        </div>
      </section>

      {/* Event log */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <History className="h-10 w-10 text-ksiegai-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{c('eventLog.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('eventLog.description')}</p>
          </div>

          <div className="max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-4 text-center text-ksiegai-400">{c('eventLog.examplesTitle')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {c.raw('eventLog.examples').map((e: string, i: number) => (
                <span key={i} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                  {e}
                </span>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">{c('eventLog.supports')}</p>
            <p className="text-white font-semibold">{c('eventLog.aiNote')}</p>
          </div>
        </div>
      </section>

      {/* Migration */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <Wrench className="h-10 w-10 text-ksiegai-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{c('migration.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('migration.description')}</p>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-4 text-center text-ksiegai-400">{c('migration.findingsTitle')}</p>
            <ul className="space-y-3">
              {c.raw('migration.findings').map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-3 rounded-xl p-4 bg-white/5 border border-white/10">
                  <ShieldCheck className="h-4 w-4 text-ksiegai-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="max-w-2xl mx-auto text-sm text-gray-400 leading-relaxed text-center">{c('migration.closing')}</p>
        </div>
      </section>

      {/* Security philosophy */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <Lock className="h-10 w-10 text-ksiegai-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{c('security.title')}</h2>
            <p className="text-lg text-gray-300 leading-relaxed italic">{c('security.philosophy')}</p>
          </div>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3">
            {c.raw('security.points').map((p: string, i: number) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <ShieldCheck className="h-4 w-4 text-ksiegai-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built by operating our own companies */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">{c('builtByOperating.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('builtByOperating.description')}</p>
          </div>
        </div>
      </section>

      {/* Story line */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="max-w-3xl mx-auto text-center text-xl md:text-2xl font-semibold text-white leading-relaxed">
            {c('storyLine')}
          </p>
        </div>
      </section>

      {/* Features recap */}
      <section className="py-16 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase mb-6 text-center text-ksiegai-400">{t('featuresLabel')}</p>
            <ul className="space-y-4">
              {c.raw('features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3 rounded-xl p-4 bg-white/5 border border-white/10">
                  <span className="mt-1 h-2 w-2 rounded-full flex-shrink-0 bg-ksiegai-400" />
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
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <a
              href={c('cta.url')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ksiegai-gradient text-white px-8 py-4 rounded-xl font-semibold hover-lift transition-all shadow-lg"
            >
              {c('cta.label')}
              <ArrowUpRight className="h-5 w-5" />
            </a>
            <a
              href="https://ksef.support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              {locale === 'pl' ? 'Dowiedz się, czym jest KSeF' : 'Learn what KSeF is'}
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-6">
            <a href={`/${locale}#solutions`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              {locale === 'pl' ? 'Zobacz pozostałe rozwiązania TOVERNET' : 'See other TOVERNET solutions'}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
