import { poradnikCtas, type PoradnikArticle } from '@/lib/poradnik';

type Props = {
  locale: 'pl' | 'en';
  article: PoradnikArticle;
  otherSlug?: string;
};

export default function PoradnikArticleView({ locale, article, otherSlug }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'TOVERNET' },
    publisher: { '@type': 'Organization', name: 'TOVERNET' },
  };
  const faqJsonLd = article.faqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <div className="bg-kennel-cream-100 text-kennel-navy-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-kennel-navy-600 flex items-center gap-2 flex-wrap">
          <a href={`/${locale}/poradnik`} className="hover:text-kennel-navy-900 transition-colors font-medium">
            {locale === 'pl' ? 'Poradnik' : 'Guides'}
          </a>
          <span>/</span>
          <span className="text-kennel-navy-900 font-medium">{article.title}</span>
        </nav>
      </div>

      <article className="py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-kennel-navy-900 mb-6 leading-tight">{article.title}</h1>
            <p className="text-lg text-kennel-navy-600 leading-relaxed mb-10">{article.intro}</p>

            <div className="space-y-10">
              {article.sections.map((s, i) => (
                <section key={i}>
                  <h2 className="text-xl md:text-2xl font-bold text-kennel-navy-900 mb-3">{s.heading}</h2>
                  {s.paragraphs.map((p, pi) => (
                    <p key={pi} className="text-kennel-navy-700 leading-relaxed mb-3">
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="space-y-2 mt-2">
                      {s.list.map((item, li) => (
                        <li key={li} className="flex items-start gap-2 text-kennel-navy-700">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-kennel-teal-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {article.faqs && (
              <section className="mt-12">
                <h2 className="text-xl md:text-2xl font-bold text-kennel-navy-900 mb-4">
                  {locale === 'pl' ? 'Najczęstsze pytania' : 'Frequently asked questions'}
                </h2>
                <div className="space-y-3">
                  {article.faqs.map((f, i) => (
                    <div key={i} className="rounded-xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-5">
                      <p className="font-bold text-kennel-navy-900 mb-1.5">{f.q}</p>
                      <p className="text-kennel-navy-600 text-sm leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {article.externalResource && (
              <section className="mt-10">
                <a
                  href={article.externalResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-5 hover-lift"
                >
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-kennel-yellow-500 mb-1">
                      {locale === 'pl' ? 'Poczytaj więcej' : 'Read more'}
                    </p>
                    <p className="font-bold text-kennel-navy-900 mb-1">{article.externalResource.label}</p>
                    <p className="text-kennel-navy-600 text-sm leading-relaxed">{article.externalResource.description}</p>
                  </div>
                </a>
              </section>
            )}

            {(() => {
              const cta = poradnikCtas[article.category];
              return (
                <div className="mt-14 rounded-2xl bg-tovernet-gradient p-8 text-center">
                  <p className="text-white text-lg font-semibold mb-4">{cta.message[locale]}</p>
                  <a
                    href={`/${locale}${cta.offerPath}`}
                    className="inline-flex items-center gap-2 bg-white text-tovernet-700 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  >
                    {cta.label[locale]}
                  </a>
                </div>
              );
            })()}

            {otherSlug && (
              <p className="mt-8 text-center text-sm text-kennel-navy-400">
                <a
                  href={`/${locale === 'pl' ? 'en' : 'pl'}/poradnik/${otherSlug}`}
                  className="hover:text-kennel-navy-700 underline"
                >
                  {locale === 'pl' ? 'Read this article in English' : 'Przeczytaj po polsku'}
                </a>
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
