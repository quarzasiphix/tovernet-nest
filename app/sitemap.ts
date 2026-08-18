import type { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { getArticlesForLocale, getOtherLocaleSlug } from '@/lib/poradnik';
import { auditGuides, getOtherLocaleGuideSlug, PROVIDER_AUDIT_MAIN_PATH, PROVIDER_AUDIT_HUB_PATH } from '@/lib/provider-audit';
import { SITE_URL } from '@/lib/seo';

type StaticRoute = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] };

const STATIC_ROUTES: StaticRoute[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/hodowcy', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/zwiazki-kynologiczne', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projekty', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/projekty/gryfin-york', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/projekty/ksiegai', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/projekty/kolorowa-pasja', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/projekty/pokiu', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/projekty/klepsydra', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/projekty/nekrolog-lodz', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/poradnik', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/polityka-prywatnosci', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/regulamin', priority: 0.3, changeFrequency: 'yearly' },
];

function alternatesFor(pathByLocale: Record<'pl' | 'en', string>) {
  return {
    languages: {
      pl: `${SITE_URL}/pl${pathByLocale.pl}`,
      en: `${SITE_URL}/en${pathByLocale.en}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: alternatesFor({ pl: route.path, en: route.path }),
      });
    }
  }

  // Provider-audit main service page + SEO hub — per-locale-distinct paths,
  // same pattern as poradnik articles below.
  entries.push({
    url: `${SITE_URL}/pl${PROVIDER_AUDIT_MAIN_PATH.pl}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
    alternates: alternatesFor({ pl: PROVIDER_AUDIT_MAIN_PATH.pl, en: PROVIDER_AUDIT_MAIN_PATH.en }),
  });
  entries.push({
    url: `${SITE_URL}/en${PROVIDER_AUDIT_MAIN_PATH.en}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
    alternates: alternatesFor({ pl: PROVIDER_AUDIT_MAIN_PATH.pl, en: PROVIDER_AUDIT_MAIN_PATH.en }),
  });
  entries.push({
    url: `${SITE_URL}/pl${PROVIDER_AUDIT_HUB_PATH.pl}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
    alternates: alternatesFor({ pl: PROVIDER_AUDIT_HUB_PATH.pl, en: PROVIDER_AUDIT_HUB_PATH.en }),
  });
  entries.push({
    url: `${SITE_URL}/en${PROVIDER_AUDIT_HUB_PATH.en}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
    alternates: alternatesFor({ pl: PROVIDER_AUDIT_HUB_PATH.pl, en: PROVIDER_AUDIT_HUB_PATH.en }),
  });

  for (const guide of auditGuides) {
    const otherSlug = getOtherLocaleGuideSlug(guide.locale, guide.key);
    const pathByLocale =
      guide.locale === 'pl'
        ? { pl: `/${guide.slug}`, en: otherSlug ? `/${otherSlug}` : `/${guide.slug}` }
        : { pl: otherSlug ? `/${otherSlug}` : `/${guide.slug}`, en: `/${guide.slug}` };

    entries.push({
      url: `${SITE_URL}/${guide.locale}/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: alternatesFor(pathByLocale),
    });
  }

  for (const locale of locales) {
    for (const article of getArticlesForLocale(locale)) {
      const otherSlug = getOtherLocaleSlug(locale, article.key) ?? article.slug;
      const pathByLocale =
        locale === 'pl'
          ? { pl: `/poradnik/${article.slug}`, en: `/poradnik/${otherSlug}` }
          : { pl: `/poradnik/${otherSlug}`, en: `/poradnik/${article.slug}` };

      entries.push({
        url: `${SITE_URL}/${locale}/poradnik/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: alternatesFor(pathByLocale),
      });
    }
  }

  return entries;
}
