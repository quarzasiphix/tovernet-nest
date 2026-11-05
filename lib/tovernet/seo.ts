import type { Niche } from './niches';

// Structured data for a niche landing page: the service and its FAQ.
export function nicheJsonLd(niche: Niche) {
  const url = `https://tovernet.online${niche.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: niche.title.replace(/ \| Tovernet$/, ''),
        description: niche.description,
        serviceType: 'Projektowanie stron internetowych',
        areaServed: { '@type': 'Country', name: 'Polska' },
        provider: { '@type': 'Organization', name: 'Tovernet sp. z o.o.', url: 'https://tovernet.online' },
        url,
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: niche.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };
}
