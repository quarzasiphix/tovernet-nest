import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import KsiegaiShowcase from '@/components/ksiegai/KsiegaiShowcase';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty/ksiegai',
    title: 'KsięgaI — Case Study | TOVERNET',
    description: isPolish
      ? 'Jak zbudowaliśmy KsięgaI — nasz własny system fakturowania, KSeF i finansów, który prowadzimy na co dzień.'
      : 'How we built KsięgaI — our own invoicing, KSeF, and finance system that we run day to day.',
    keywords: isPolish
      ? ['program do KSeF dla małej firmy', 'system do fakturowania z KSeF', 'oprogramowanie księgowe dla małej firmy', 'automatyzacja fakturowania KSeF']
      : ['KSeF invoicing software', 'small business accounting system', 'invoicing automation software'],
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
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{c('subtitle')}</p>
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

      {/* Features */}
      <section className="py-16">
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
          <a
            href={c('cta.url')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-ksiegai-gradient text-white px-8 py-4 rounded-xl font-semibold hover-lift transition-all shadow-lg"
          >
            {c('cta.label')}
            <ArrowUpRight className="h-5 w-5" />
          </a>
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
