import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import SitePage from '@/components/site/SitePage';
import WorkGrid, { type WorkCard } from '@/components/site/work/WorkGrid';
import ContactForm from '@/components/ContactForm';
import { Lines, SectionHead } from '@/components/site/Text';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import { SELLER } from '@/lib/seller';
import { asLocale, copyFor } from '@/lib/site/copy';
import { evidenceHref, hostOf, localize, siteProjects } from '@/lib/tovernet/portfolio';
import s from '@/components/site/site.module.css';
import w from '@/components/site/work/work.module.css';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  const pl = locale === 'pl';
  return buildMetadata({
    locale,
    path: '/projekty',
    title: pl ? 'Realizacje: strony i systemy, które działają | Tovernet' : 'Work: websites and systems that run | Tovernet',
    description: pl
      ? 'Strony klientów (Nekrolog Łódź, Gryfin York, Kolorowa Pasja), system związku kynologicznego POKIU, generator Klepsydra i nasz program Księgai. Każdy projekt działa i sprawdzisz go sam.'
      : 'Client websites (Nekrolog Łódź, Gryfin York, Kolorowa Pasja), the POKIU kennel club system, the Klepsydra generator and our own Księgai software. Every project is live and checkable.',
    keywords: pl
      ? ['portfolio stron internetowych', 'realizacje Tovernet', 'przykłady stron dla firm', 'system dla związku kynologicznego', 'strona dla hodowli psów']
      : ['web studio portfolio', 'Tovernet work', 'business website examples', 'kennel club software'],
    ogImage: '/portfolio/gryfin-york.webp',
  });
}

export default function ProjectsPage({ params: { locale: raw } }: { params: { locale: string } }) {
  unstable_setRequestLocale(raw);
  const locale = asLocale(raw);
  const c = copyFor(locale);
  const projects = siteProjects();

  const cards: WorkCard[] = projects.map((p) => {
    const l = localize(p, locale);
    const shot = p.shots[0];
    return {
      slug: p.slug, name: p.name, kind: c.kind[p.kind], kindKey: p.kind, status: c.status[p.status], category: l.category, headline: l.headline,
      host: p.url ? hostOf(p.url) : null, caseHref: p.caseStudy ? evidenceHref(p.caseStudy, locale) : null,
      shot: { src: shot.src, alt: l.alt(shot), width: shot.width, height: shot.height }, phone: p.preview?.phone?.src ?? null,
      palette: { bg: p.palette?.bg ?? '#1B1C1F', accent: p.palette?.accent ?? '#9AA6FF' },
    };
  });
  const f = c.projects.filters;

  // Only listed, finished work goes into structured data.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'pl' ? 'Realizacje Tovernet' : 'Tovernet work',
    url: `${SITE_URL}/${locale}/projekty/`,
    publisher: { '@type': 'Organization', name: SELLER.name, url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem', position: i + 1, name: p.name,
        url: p.caseStudy ? `${SITE_URL}/${locale}${p.caseStudy}/` : p.url,
      })),
    },
  };

  return (
    <SitePage locale={locale} current="work" footCall={false}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className={w.hero}>
        <div className={s.wrap}>
          <SectionHead num="02" label={c.projects.label} aside={c.work.count(projects.length)} />
          <div className={w.heroGrid}>
            <Lines lines={c.projects.title} as="h1" className={s.display} split />
            <p className={s.lead} data-reveal="">{c.projects.lead}</p>
          </div>
        </div>
      </section>
      <section aria-label={c.projects.label}>
        <div className={s.wrap}>
          <WorkGrid
            cards={cards}
            filters={[{ key: 'all', label: f.all }, { key: 'client_site', label: f.client_site }, { key: 'client_system', label: f.client_system }, { key: 'own_product', label: f.own_product }]}
            labels={{ view: c.work.preview, caseStudy: c.work.caseStudy }}
          />
        </div>
      </section>
      <section id="kontakt" className={`${w.cta} ${s.ink}`} aria-label={c.contact.label}>
        <div className={`${s.wrap} ${w.ctaGrid}`}>
          <div>
            <Lines lines={c.projects.cta} className={s.h2} split />
            <p className={s.lead} style={{ marginTop: 20 }}>{c.projects.ctaLead}</p>
            <p className={s.lead} style={{ marginTop: 28 }}>{c.contact.phone}<br /><a href={SELLER.phoneHref} className={s.link} style={{ fontSize: 28 }}>{SELLER.phone}</a></p>
          </div>
          <ContactForm copy={c.contact.form} source="tovernet-nest:projekty-contact" />
        </div>
      </section>
    </SitePage>
  );
}
