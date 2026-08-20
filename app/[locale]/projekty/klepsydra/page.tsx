import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Printer, Search } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { buildMetadata } from '@/lib/seo';

const GOLD = 'hsl(42, 86%, 54%)';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const isPolish = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty/klepsydra',
    title: isPolish
      ? 'Klepsydra — Generator, Wydruk A4 i Model Biznesowy | Case Study TOVERNET'
      : 'Klepsydra — Generator, A4 Printout and Business Model | TOVERNET Case Study',
    description: isPolish
      ? 'Jak zbudowaliśmy Klepsydrę — darmowy generator e-klepsydry online z podglądem A4, marketowany pod marką klienta i rozwinięty w płatny produkt dla innych zakładów pogrzebowych.'
      : "How we built Klepsydra — a free online e-obituary generator with an A4 preview, marketed under the client's brand and grown into a paid product for other funeral homes.",
    keywords: isPolish
      ? ['generator e-klepsydry online', 'darmowa klepsydra pogrzebowa', 'aplikacja dla zakładu pogrzebowego', 'model biznesowy generator klepsydry']
      : ['online obituary generator', 'free e-obituary tool', 'funeral home web app', 'obituary generator business model'],
    type: 'article',
    ogImage: '/screenshots/clients/klepsydra.png',
  });
}

export default async function KlepsydraCaseStudy({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('caseStudies');
  const c = await getTranslations('caseStudies.klepsydra');

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'TOVERNET', item: `https://tovernet.online/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'pl' ? 'Projekty' : 'Projects', item: `https://tovernet.online/${locale}/projekty` },
      { '@type': 'ListItem', position: 3, name: c('title'), item: `https://tovernet.online/${locale}/projekty/klepsydra` },
    ],
  };
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c('title'),
    description: c('subtitle'),
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'TOVERNET' },
    publisher: { '@type': 'Organization', name: 'TOVERNET' },
    image: 'https://tovernet.online/screenshots/clients/klepsydra.png',
  };

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
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
            <img src="/screenshots/clients/klepsydra.png" alt={c('title')} className="w-full h-auto block" />
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

      {/* Walkthrough — the generator itself */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{c('walkthrough.title')}</h2>
            <p className="text-gray-400 leading-relaxed">{c('walkthrough.subtitle')}</p>
          </div>
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border mb-10" style={{ borderColor: 'rgba(212,168,42,0.3)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screenshots/clients/klepsydra-generator.png"
              alt={locale === 'pl' ? 'Generator klepsydry — formularz i podgląd na żywo' : 'The obituary generator — form and live preview'}
              className="w-full h-auto block"
            />
          </div>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6">
            {c.raw('walkthrough.steps').map((step: { title: string; description: string }, i: number) => (
              <div key={i}>
                <div className="w-8 h-8 rounded-full border flex items-center justify-center mb-3 text-sm font-bold" style={{ borderColor: GOLD, color: GOLD }}>
                  {i + 1}
                </div>
                <h3 className="font-bold mb-1.5">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Printable A4 result */}
      <section className="py-16 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <Printer className="h-7 w-7 mx-auto mb-4" style={{ color: GOLD }} />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{c('printResult.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('printResult.description')}</p>
          </div>
          <div className="max-w-2xl mx-auto rounded-lg overflow-hidden border bg-white" style={{ borderColor: 'rgba(212,168,42,0.3)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screenshots/clients/klepsydra-print-a4.png"
              alt={locale === 'pl' ? 'Klepsydra gotowa do druku w formacie A4' : 'The obituary ready to print in A4 format'}
              className="w-full h-auto block"
            />
          </div>
        </div>
      </section>

      {/* Business model */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{c('businessModel.title')}</h2>
            <p className="text-gray-300 leading-relaxed">{c('businessModel.intro')}</p>
          </div>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6 mb-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">{c('businessModel.free.title')}</p>
              <ul className="space-y-2.5">
                {c.raw('businessModel.free.items').map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-gray-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border p-6" style={{ borderColor: 'rgba(212,168,42,0.4)', background: 'rgba(212,168,42,0.05)' }}>
              <p className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: GOLD }}>{c('businessModel.paid.title')}</p>
              <ul className="space-y-2.5">
                {c.raw('businessModel.paid.items').map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-white text-sm">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 leading-relaxed">{c('businessModel.note')}</p>
            <a
              href={c('pricingLinkUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold flex-shrink-0"
              style={{ color: GOLD }}
            >
              {c('pricingLinkLabel')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* SEO and lead generation */}
      <section className="py-16 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <Search className="h-6 w-6" style={{ color: GOLD }} />
              <h2 className="text-2xl md:text-3xl font-bold text-center">{c('seo.title')}</h2>
            </div>
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <p className="text-4xl font-black" style={{ color: GOLD }}>{c('seo.stat.value')}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">{c('seo.stat.label')}</p>
              </div>
            </div>
            {c.raw('seo.paragraphs').map((p: string, i: number) => (
              <p key={i} className="text-gray-300 leading-relaxed mb-4">{p}</p>
            ))}
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
            <a href={`/${locale}/projekty/nekrolog-lodz`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              {locale === 'pl' ? 'Zobacz też: strona główna Nekrolog Łódź' : 'Also see: the main Nekrolog Łódź site'}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-8 text-xs text-gray-600 max-w-md mx-auto">{c('operatorLine')}</p>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
