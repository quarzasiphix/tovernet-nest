import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ArrowUpRight, ShieldCheck, Link2, FileCheck2, ScrollText, QrCode, AlertTriangle, Lock } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { buildMetadata } from '@/lib/seo';

const GOLD = '#C9A34E';
const GOLD_SOFT = '#E0C98A';
const ECRU = '#F7F1E6';
const INK = '#1F2430';
const HERO_GRADIENT = 'linear-gradient(135deg, #0B162C 0%, #14213D 55%, #1a2d54 100%)';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty/pokiu',
    title: 'POKIU — Case Study | TOVERNET',
    description: isPolish
      ? 'Jak zbudowaliśmy system rejestru psów, panelu hodowców i publicznej weryfikacji dokumentów kodem QR dla POKIU.'
      : 'How we built the dog registry, breeder portal, and public QR document verification system for POKIU.',
    keywords: isPolish
      ? ['system dla związku kynologicznego przykład', 'weryfikacja rodowodu kodem QR', 'panel hodowcy online przykład']
      : ['kennel club software example', 'QR pedigree verification example', 'breeder portal example'],
    type: 'article',
    ogImage: '/screenshots/pok/dashboard.png',
  });
}

const SCREENSHOTS = [
  { src: '/screenshots/pok/dashboard.png', pl: 'Pulpit biura', en: 'Office dashboard' },
  { src: '/screenshots/pok/dogs.png', pl: 'Księga rodowodowa', en: 'Pedigree registry' },
  { src: '/screenshots/pok/people.png', pl: 'Kartoteka hodowcy', en: 'Breeder record' },
  { src: '/screenshots/pok/requests.png', pl: 'Wnioski hodowców', en: 'Breeder requests' },
];

export default function PokiuCaseStudy({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('caseStudies');
  const c = useTranslations('caseStudies.pokiu');
  const isPolish = locale === 'pl';

  return (
    <div className="min-h-screen font-serif" style={{ background: ECRU, color: INK }}>
      <SiteNav locale={locale} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <a href={`/${locale}/projekty`} className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </a>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden text-white mt-8 mx-4 sm:mx-6 lg:mx-8 rounded-3xl" style={{ background: HERO_GRADIENT }}>
        <div className="container mx-auto px-6 sm:px-10 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 rounded-full border mb-6" style={{ borderColor: GOLD, color: GOLD_SOFT }}>
              <span className="text-xs font-semibold tracking-widest uppercase">{c('badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: GOLD }}>{c('title')}</h1>
            <p className="text-lg md:text-xl leading-relaxed" style={{ color: ECRU }}>{c('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Role */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>{t('roleLabel')}</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{c('role.title')}</h2>
            <p className="opacity-80 leading-relaxed">{c('role.description')}</p>
          </div>
        </div>
      </section>

      {/* Architecture: three domains */}
      <section className="py-16" style={{ background: 'rgba(31,36,48,0.04)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">{c('architecture.title')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {c.raw('architecture.items').map((item: { domain: string; description: string }, i: number) => (
                <div key={i} className="rounded-2xl p-6 bg-white border" style={{ borderColor: 'rgba(201,163,78,0.4)' }}>
                  <p className="font-mono text-sm font-bold mb-3" style={{ color: GOLD }}>{item.domain}</p>
                  <p className="opacity-80 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security / QR verification */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto rounded-2xl p-8 md:p-10 text-white" style={{ background: HERO_GRADIENT }}>
            <ShieldCheck className="h-10 w-10 mb-4" style={{ color: GOLD }} />
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: GOLD }}>{c('security.title')}</h2>
            <p className="leading-relaxed" style={{ color: ECRU }}>{c('security.description')}</p>
          </div>
        </div>
      </section>

      {/* Provenance chain */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: GOLD }}>
              {isPolish ? 'Łańcuch Pochodzenia' : 'Chain of Provenance'}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">{c('provenance.title')}</h2>
            <p className="opacity-80 leading-relaxed max-w-2xl mx-auto">{c('provenance.intro')}</p>
          </div>

          {/* Timeline */}
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {c.raw('provenance.timeline').map((step: { title: string; description: string }, i: number) => {
              const Icon = [ScrollText, FileCheck2, Link2, QrCode][i] ?? ScrollText;
              return (
                <div key={i} className="relative rounded-2xl p-5 bg-white border" style={{ borderColor: 'rgba(201,163,78,0.35)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: GOLD }}>
                      {i + 1}
                    </span>
                    <Icon className="h-5 w-5" style={{ color: GOLD }} />
                  </div>
                  <p className="font-bold text-sm mb-1.5">{step.title}</p>
                  <p className="text-xs opacity-75 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* Quotes */}
          <div className="max-w-3xl mx-auto space-y-4 mb-12">
            <div className="rounded-2xl p-6 text-white" style={{ background: HERO_GRADIENT }}>
              <p className="italic leading-relaxed" style={{ color: GOLD_SOFT }}>&bdquo;{c('provenance.exampleQuote')}&rdquo;</p>
            </div>
            <p className="text-center opacity-80 leading-relaxed">{c('provenance.buyerQuote')}</p>
          </div>

          {/* 4 layers */}
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6 text-center" style={{ color: GOLD }}>{c('provenance.layersTitle')}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {c.raw('provenance.layers').map((layer: { title: string; description: string }, i: number) => (
                <div key={i} className="rounded-2xl p-5 bg-white border" style={{ borderColor: 'rgba(201,163,78,0.35)' }}>
                  <p className="font-bold text-sm mb-1.5" style={{ color: GOLD }}>{layer.title}</p>
                  <p className="text-xs opacity-75 leading-relaxed">{layer.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimers */}
          <div className="max-w-3xl mx-auto rounded-2xl p-6 border" style={{ borderColor: 'rgba(201,163,78,0.4)', background: 'rgba(201,163,78,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5" style={{ color: GOLD }} />
              <p className="font-bold text-sm">{c('provenance.disclaimerTitle')}</p>
            </div>
            <ul className="space-y-2">
              {c.raw('provenance.disclaimers').map((d: string, i: number) => (
                <li key={i} className="text-xs opacity-80 leading-relaxed">{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tovernet / KsięgaI credibility */}
      <section className="py-16" style={{ background: 'rgba(31,36,48,0.04)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-8 w-8" style={{ color: GOLD }} />
              <h2 className="text-2xl md:text-3xl font-bold">{c('credibility.title')}</h2>
            </div>
            <p className="opacity-80 leading-relaxed mb-8">{c('credibility.description')}</p>

            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: GOLD }}>{c('credibility.connectionTitle')}</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {c.raw('credibility.connections').map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2 bg-white rounded-xl p-3 border" style={{ borderColor: 'rgba(201,163,78,0.3)' }}>
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  <span className="text-sm opacity-80">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-sm opacity-70 italic leading-relaxed border-t pt-6" style={{ borderColor: 'rgba(201,163,78,0.3)' }}>
              {c('credibility.positioning')}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16" style={{ background: 'rgba(31,36,48,0.04)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6 text-center" style={{ color: GOLD }}>{t('featuresLabel')}</p>
            <ul className="space-y-4">
              {c.raw('features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border" style={{ borderColor: 'rgba(201,163,78,0.3)' }}>
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  <span className="opacity-80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-widest uppercase mb-6 text-center" style={{ color: GOLD }}>
            {isPolish ? 'Prawdziwy Interfejs' : 'The Real Interface'}
          </p>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-10">
            {SCREENSHOTS.map((shot, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border bg-white shadow-lg" style={{ borderColor: 'rgba(201,163,78,0.4)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shot.src} alt={isPolish ? shot.pl : shot.en} className="w-full h-auto block" />
                <p className="p-4 text-base font-semibold opacity-80">{isPolish ? shot.pl : shot.en}</p>
              </div>
            ))}
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: HERO_GRADIENT }}
          >
            {c('cta.label')}
            <ArrowUpRight className="h-5 w-5" />
          </a>
          <div className="mt-6">
            <a href={`/${locale}/zwiazki-kynologiczne`} className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
              {isPolish ? 'Prowadzisz związek kynologiczny? Zobacz naszą ofertę' : 'Run a kennel club? See our offer'}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
