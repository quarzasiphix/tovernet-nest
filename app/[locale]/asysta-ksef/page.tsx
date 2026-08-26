import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { CheckCircle2, ShieldCheck, Sparkles, Search, Mail, Send, PhoneCall } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import KsefAssistFunnel from '@/components/ksiegai/KsefAssistFunnel';
import { buildMetadata } from '@/lib/seo';

// Polish-only content — deliberate, not a gap. KSeF and the KRS company
// register are Polish-market-specific, same as ksef.support and
// ksiegai.pl/ksef-asysta (this page's sibling funnels). English visitors
// hitting /en/asysta-ksef still see this content rather than a translated
// dictionary entry that wouldn't be actionable for them anyway.

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  return buildMetadata({
    locale,
    path: '/asysta-ksef',
    title: 'Asysta przy aktywacji KSeF — indywidualna pomoc | TOVERNET × KsięgaI',
    description:
      'Podaj NIP lub KRS swojej firmy, a pomożemy Ci krok po kroku aktywować KSeF — bez stresu, bez zgadywania. 199 zł, płatność kartą lub BLIK.',
    keywords: ['asysta KSeF', 'pomoc z KSeF', 'aktywacja KSeF', 'konfiguracja KSeF', 'token KSeF pomoc'],
    type: 'article',
  });
}

const INCLUDED_ITEMS = [
  'sprawdzimy uprawnienia do Twojej firmy',
  'przeprowadzimy Cię przez proces uwierzytelnienia',
  'skonfigurujemy dostęp do KSeF',
  'połączymy firmę z KsięgaI',
  'pobierzemy pierwsze faktury',
  'wyślemy fakturę testową i sprawdzimy UPO',
  'wytłumaczymy, jak korzystać z KSeF na co dzień',
];

const HOW_IT_WORKS = [
  { icon: Search, title: 'Sprawdzasz firmę', text: 'Podajesz NIP lub KRS — sprawdzamy dane w rejestrze KRS.' },
  { icon: Mail, title: 'Zostawiasz e-mail', text: 'Wysyłamy jeden link — otwierasz go jednym kliknięciem, bez hasła.' },
  { icon: Send, title: 'Płacisz i gotowe', text: '199 zł kartą lub BLIK. Bez zbędnych formularzy.' },
  { icon: PhoneCall, title: 'Odzywamy się do Ciebie', text: 'Umawiamy termin i razem konfigurujemy KSeF krok po kroku.' },
];

export default function KsefAsystaPage({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Asysta przy aktywacji KSeF',
    provider: { '@type': 'Organization', name: 'TOVERNET', url: 'https://tovernet.online' },
    areaServed: 'PL',
    offers: { '@type': 'Offer', price: '199', priceCurrency: 'PLN' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SiteNav locale={locale} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ksiegai-500/10 border border-ksiegai-500/30 mb-6 magical-glow">
              <Sparkles className="h-4 w-4 text-ksiegai-400" />
              <span className="text-ksiegai-300 text-xs font-bold tracking-widest uppercase">
                Asysta przy aktywacji KSeF · 199 zł
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-ksiegai-400 via-purple-400 to-ksiegai-500 bg-clip-text text-transparent">
                Nie musisz ogarniać KSeF sam
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Sprawdzimy Twoją firmę po NIP lub KRS i pomożemy krok po kroku uruchomić KSeF —
              indywidualnie, bez stresu. Zbudowane przez TOVERNET dla KsięgaI.
            </p>
          </div>
        </div>
      </section>

      {/* Content + funnel */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-bold text-white">Podczas indywidualnej rozmowy pomożemy Ci:</h2>
                <ul className="mt-4 space-y-2.5">
                  {INCLUDED_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ksiegai-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">Jak to działa</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {HOW_IT_WORKS.map((step, i) => (
                    <div key={step.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ksiegai-500/15 text-ksiegai-400">
                        <step.icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500">{i + 1}.</span>
                          <p className="text-sm font-semibold text-white">{step.title}</p>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-gray-400">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-gray-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Nie prosimy o hasła, dane logowania ani przekazanie podpisu elektronicznego.
                  Wszystkie czynności wymagające autoryzacji wykonujesz samodzielnie, a my
                  prowadzimy Cię przez proces.
                </p>
              </div>
            </div>

            <div className="lg:sticky lg:top-8">
              <KsefAssistFunnel />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
