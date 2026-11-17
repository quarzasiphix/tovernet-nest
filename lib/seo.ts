import type { Metadata } from 'next';

export const SITE_URL = 'https://tovernet.online';
export const SITE_NAME = 'TOVERNET';
export const DEFAULT_OG_IMAGE = '/portfolio/nekrolog-lodz.webp';

export type Locale = 'pl' | 'en';

type PageSeoInput = {
  locale: Locale;
  /** Path with no locale prefix, e.g. '/hodowcy' or '/poradnik/some-slug'. Empty string for the homepage. */
  path: string;
  /** The other locale's equivalent path, if different from `path` (e.g. poradnik articles have per-locale slugs). */
  otherLocalePath?: string;
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  type?: 'website' | 'article';
  /** Prepared but unpublished pages: noindex, nofollow, and no alternates to advertise them. */
  noindex?: boolean;
};

export function buildMetadata(input: PageSeoInput): Metadata {
  const { locale, path, otherLocalePath, title, description, keywords, ogImage, type = 'website', noindex = false } = input;
  const otherLocale: Locale = locale === 'pl' ? 'en' : 'pl';
  const otherPath = otherLocalePath ?? path;
  const currentUrl = `${SITE_URL}/${locale}${path}`;
  const otherUrl = `${SITE_URL}/${otherLocale}${otherPath}`;
  const defaultLocalePath = locale === 'pl' ? path : otherPath;
  const image = ogImage ?? DEFAULT_OG_IMAGE;
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  const languages: Record<string, string> = {
    'x-default': `${SITE_URL}/pl${defaultLocalePath}`,
    [locale]: currentUrl,
    [otherLocale]: otherUrl,
  };

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: currentUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      type,
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      url: currentUrl,
      siteName: SITE_NAME,
      images: [{ url: absoluteImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImage],
    },
    robots: noindex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : { index: true, follow: true },
  };
}
