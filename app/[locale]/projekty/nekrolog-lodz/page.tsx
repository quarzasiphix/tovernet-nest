import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Compass, ServerCog, FileSignature, Headset,
  Unlock, LogOut, SearchCheck, ShieldQuestion, Scale,
} from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { buildMetadata } from '@/lib/seo';

const GOLD = 'hsl(43, 85%, 55%)';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty/nekrolog-lodz',
    title: isPolish
      ? 'Nekrolog Łódź — Case Study | TOVERNET'
      : 'Nekrolog Łódź — Case Study | TOVERNET',
    description: isPolish
      ? 'Jak zbudowaliśmy i utrzymujemy stronę zakładu pogrzebowego Nekrolog Łódź — pełna oferta usług, SEO lokalne, kontakt 24/7.'
      : 'How we built and maintain the Nekrolog Łódź funeral home website — full service catalog, local SEO, 24/7 contact.',
    keywords: isPolish
      ? ['strona zakładu pogrzebowego', 'lokalne SEO zakład pogrzebowy', 'strona internetowa dla firmy pogrzebowej']
      : ['funeral home website', 'local SEO funeral home', 'funeral business web design'],
    type: 'article',
    ogImage: '/screenshots/clients/nekrolog-lodz.png',
  });
}

export default function NekrologLodzCaseStudy({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('caseStudies');
  const c = useTranslations('caseStudies.nekrologLodz');

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      <SiteNav locale={locale} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <a href={`/${locale}/projekty`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </a>
      </div>

      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 rounded-full border mb-6" style={{ borderColor: GOLD, color: GOLD }}>
              <span className="text-xs font-semibold tracking-widest uppercase">{c('badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: GOLD }}>{c('title')}</h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{c('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Screenshot */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(212,168,42,0.3)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screenshots/clients/nekrolog-lodz.png" alt={c('title')} className="w-full h-auto block" />
          </div>
        </div>
      </section>

      {/* Role */}
      <section className="py-16 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>{t('roleLabel')}</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{c('role.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('role.description')}</p>
          </div>
        </div>
      </section>

      {/* Ongoing operational relationship — TOVERNET's own navy/blue identity,
          deliberately distinct from the client-brand gold/serif above it */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14 rounded-2xl bg-kennelclub-500/10 border border-kennelclub-500/30 p-8 magical-glow-blue">
            <p className="text-white leading-relaxed text-lg">{c('positioning.text')}</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">{c('responsibilities.title')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {c.raw('responsibilities.items').map((item: { title: string; description: string }, i: number) => {
                const Icon = [Compass, ServerCog, FileSignature, Headset][i] ?? Compass;
                return (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <Icon className="h-8 w-8 text-kennelclub-400 mb-4" />
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">{c('responsibilities.contactPoint')}</p>
          </div>
        </div>
      </section>

      {/* Digital independence */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-kennelclub-300">{c('independence.eyebrow')}</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">{c('independence.title')}</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{c('independence.intro')}</p>
            <p className="text-gray-300 leading-relaxed">{c('independence.continuation')}</p>
          </div>

          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {c.raw('independence.cards').map((item: { title: string; description: string }, i: number) => {
              const Icon = [Unlock, LogOut, SearchCheck, ShieldQuestion][i] ?? Unlock;
              return (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <Icon className="h-8 w-8 text-kennelclub-400 mb-4" />
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Before / after */}
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6 mb-16">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">{c('independence.before.title')}</p>
              <ul className="space-y-2.5">
                {c.raw('independence.before.items').map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-kennelclub-500/30 bg-kennelclub-500/5 p-6 magical-glow-blue">
              <p className="text-sm font-bold text-kennelclub-300 uppercase tracking-wide mb-4">{c('independence.after.title')}</p>
              <ul className="space-y-2.5">
                {c.raw('independence.after.items').map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-white text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-kennelclub-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dispute support subsection */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <Scale className="h-7 w-7 text-kennelclub-400" />
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">{c('disputeSupport.title')}</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-center mb-6">{c('disputeSupport.text')}</p>
            <p className="text-gray-500 text-xs leading-relaxed text-center max-w-xl mx-auto border-t border-white/10 pt-5">
              {c('disputeSupport.disclaimer')}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6 text-center" style={{ color: GOLD }}>{t('featuresLabel')}</p>
            <ul className="space-y-4">
              {c.raw('features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3 border-b border-white/10 pb-4">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-black hover:opacity-90 transition-opacity"
            style={{ background: GOLD }}
          >
            {c('cta.label')}
            <ArrowUpRight className="h-5 w-5" />
          </a>
          <div className="mt-6">
            <a href={`/${locale}#contact`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              {locale === 'pl' ? 'Chcesz podobnej strony dla swojej firmy? Skontaktuj się z nami' : 'Want a site like this for your business? Get in touch'}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
