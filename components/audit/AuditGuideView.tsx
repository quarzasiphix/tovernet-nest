import { ArrowRight } from 'lucide-react';
import type { AuditGuide } from '@/lib/provider-audit';
import { PROVIDER_AUDIT_MAIN_PATH, PROVIDER_AUDIT_HUB_PATH } from '@/lib/provider-audit';

type Props = {
  locale: 'pl' | 'en';
  guide: AuditGuide;
  otherSlug?: string;
};

export default function AuditGuideView({ locale, guide, otherSlug }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'TOVERNET' },
    publisher: { '@type': 'Organization', name: 'TOVERNET' },
  };
  const faqJsonLd = guide.faqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  const hubPath = PROVIDER_AUDIT_HUB_PATH[locale];
  const mainPath = PROVIDER_AUDIT_MAIN_PATH[locale];

  return (
    <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-gray-400 flex items-center gap-2 flex-wrap">
          <a href={`/${locale}${hubPath}`} className="hover:text-white transition-colors font-medium">
            {locale === 'pl' ? 'Odzyskaj kontrolę cyfrową' : 'Regain digital control'}
          </a>
          <span>/</span>
          <span className="text-white font-medium">{guide.title}</span>
        </nav>
      </div>

      <article className="py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-kennelclub-400 to-ksiegai-400 bg-clip-text text-transparent">
              {guide.title}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-10">{guide.intro}</p>

            <div className="space-y-10">
              {guide.sections.map((s, i) => (
                <section key={i}>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3">{s.heading}</h2>
                  {s.paragraphs.map((p, pi) => (
                    <p key={pi} className="text-gray-300 leading-relaxed mb-3">
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="space-y-2 mt-2">
                      {s.list.map((item, li) => (
                        <li key={li} className="flex items-start gap-2 text-gray-300">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-kennelclub-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {guide.faqs && (
              <section className="mt-12">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                  {locale === 'pl' ? 'Najczęstsze pytania' : 'Frequently asked questions'}
                </h2>
                <div className="space-y-3">
                  {guide.faqs.map((f, i) => (
                    <div key={i} className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5">
                      <p className="font-bold text-white mb-1.5">{f.q}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-14 rounded-2xl bg-white/5 border border-kennelclub-500/30 p-8 text-center magical-glow-blue">
              <p className="text-white text-lg font-semibold mb-4">{guide.ctaLabel}</p>
              <a
                href={`/${locale}${mainPath}`}
                className="inline-flex items-center gap-2 bg-tovernet-gradient text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                {locale === 'pl' ? 'Zobacz pełną usługę audytu' : 'See the full audit service'}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {otherSlug && (
              <p className="mt-8 text-center text-sm text-gray-500">
                <a
                  href={`/${locale === 'pl' ? 'en' : 'pl'}/${otherSlug}`}
                  className="hover:text-gray-300 underline"
                >
                  {locale === 'pl' ? 'Read this guide in English' : 'Przeczytaj po polsku'}
                </a>
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
