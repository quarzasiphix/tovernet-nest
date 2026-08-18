import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import {
  ArrowRight, ArrowUpRight, FileCheck2, Receipt, ServerCog, KeyRound,
  FileText, Link2, ScrollText, Archive, ShieldCheck,
} from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import AuditIntakeForm from '@/components/audit/AuditIntakeForm';
import { buildMetadata } from '@/lib/seo';
import { PROVIDER_AUDIT_MAIN_PATH, PROVIDER_AUDIT_HUB_PATH } from '@/lib/provider-audit';

const VERIFY_ICONS = [FileCheck2, Receipt, ServerCog, KeyRound, FileText, Link2, ScrollText, Archive];

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: PROVIDER_AUDIT_MAIN_PATH.en,
    otherLocalePath: PROVIDER_AUDIT_MAIN_PATH.pl,
    title: isPolish
      ? 'Niezależny Audyt Dostawców Cyfrowych | TOVERNET'
      : 'Independent Digital Provider Audit | TOVERNET',
    description: isPolish
      ? 'Niezależna weryfikacja agencji SEO, software house’ów i dostawców IT — audyt techniczny, kontrola faktur, mapa dostępów, wsparcie w sporach z wykonawcami.'
      : 'Independent verification of SEO agencies, software houses, and IT vendors — technical audits, invoice checks, access mapping, vendor dispute support.',
    keywords: isPolish
      ? ['audyt dostawcy IT', 'weryfikacja agencji SEO', 'audyt umowy z wykonawcą', 'odzyskanie kontroli nad stroną']
      : ['digital provider audit', 'SEO agency verification', 'IT vendor audit', 'website vendor dispute support'],
    type: 'website',
    ogImage: '/screenshots/clients/nekrolog-lodz.png',
  });
}

export default function ProviderAuditPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  if (locale !== 'en') notFound();
  unstable_setRequestLocale(locale);
  const t = useTranslations('providerAudit.main');
  const hubPath = PROVIDER_AUDIT_HUB_PATH[locale];
  const mainPath = PROVIDER_AUDIT_MAIN_PATH[locale];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Independent digital provider audit',
    provider: { '@type': 'Organization', name: 'TOVERNET', url: 'https://tovernet.online' },
    areaServed: 'PL',
    description: t('subtitle'),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'TOVERNET', item: `https://tovernet.online/${locale}` },
      { '@type': 'ListItem', position: 2, name: t('title'), item: `https://tovernet.online/${locale}${mainPath}` },
    ],
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.raw('faq').map((f: { q: string; a: string }) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const matrix = t.raw('deliverables.matrixExample') as { headers: string[]; rows: string[][] };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SiteNav locale={locale} />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 rounded-full border border-kennelclub-500/40 mb-6 bg-white/5">
              <span className="text-xs font-semibold tracking-widest uppercase text-kennelclub-300">{t('badge')}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-kennelclub-400 to-ksiegai-400 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">{t('subtitle')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#intake" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white bg-tovernet-gradient hover:opacity-90 transition-opacity">
                {t('ctaPrimary')} <ArrowRight className="h-5 w-5" />
              </a>
              <a href="#verify" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-colors">
                {t('ctaSecondary')}
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">{t('trustLine')}</p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('problem.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{t('problem.text')}</p>
          </div>
        </div>
      </section>

      {/* Verify cards */}
      <section id="verify" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{t('verify.title')}</h2>
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.raw('verify.cards').map((card: { title: string; description: string }, i: number) => {
              const Icon = VERIFY_ICONS[i] ?? FileCheck2;
              return (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <Icon className="h-8 w-8 text-kennelclub-400 mb-4" />
                  <h3 className="text-white font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Providers covered */}
      <section className="py-16 border-t border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-8">{t('providersCovered.title')}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {t.raw('providersCovered.items').map((item: string, i: number) => (
                <span key={i} className="px-4 py-2 rounded-full text-sm font-semibold border border-kennelclub-500/30 bg-kennelclub-500/10 text-kennelclub-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{t('process.title')}</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {t.raw('process.steps').map((step: { title: string; description: string }, i: number) => (
              <div key={i} className="flex items-start gap-5 bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-tovernet-gradient flex items-center justify-center font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-20 border-t border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t('deliverables.title')}</h2>
            <ul className="space-y-3 mb-12 max-w-xl mx-auto">
              {t.raw('deliverables.items').map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-kennelclub-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-center text-sm text-gray-500 mb-4 max-w-xl mx-auto">{t('deliverables.matrixNote')}</p>
            <div className="overflow-x-auto">
              <table className="w-full max-w-3xl mx-auto text-sm border-collapse">
                <thead>
                  <tr>
                    {matrix.headers.map((h, i) => (
                      <th key={i} className="text-left font-bold text-white border-b border-white/20 py-3 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-white/10">
                      {row.map((cell, ci) => (
                        <td key={ci} className="py-3 px-4 text-gray-300">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{t('formats.title')}</h2>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6 mb-8">
            {t.raw('formats.items').map((item: { title: string; description: string }, i: number) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-ksiegai-500/30 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto">{t('formats.noPricing')}</p>
        </div>
      </section>

      {/* Nekrolog case study proof */}
      <section className="py-20 border-t border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center rounded-2xl bg-kennelclub-500/10 border border-kennelclub-500/30 p-8 magical-glow-blue">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{t('caseStudy.title')}</h2>
            <p className="text-gray-300 leading-relaxed mb-6">{t('caseStudy.text')}</p>
            <a href={`/${locale}/projekty/nekrolog-lodz`} className="inline-flex items-center gap-2 text-kennelclub-300 hover:text-white font-semibold transition-colors">
              {t('caseStudy.cta')} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Legal boundary */}
      <section className="py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-4 border-t border-white/10 pt-8">
            <p className="text-gray-500 text-xs leading-relaxed text-center">{t('legalBoundary.line1')}</p>
            <p className="text-gray-500 text-xs leading-relaxed text-center">{t('legalBoundary.line2')}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {t.raw('faq').map((f: { q: string; a: string }, i: number) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-5">
                  <p className="font-bold text-white mb-1.5">{f.q}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intake */}
      <section id="intake" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AuditIntakeForm content={t.raw('intake')} />
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
        <a href={`/${locale}${hubPath}`} className="text-sm text-gray-500 hover:text-gray-300 underline">
          Also see: Regain digital control
        </a>
      </div>

      <SiteFooter locale={locale} />
    </div>
  );
}
