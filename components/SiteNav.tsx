import SiteHeader, { type NavKey } from './site/SiteHeader';

/**
 * Header for the pages not yet redesigned (dark bodies): the new site header in its ink tone.
 * Redesigned pages use components/site/SiteHeader directly.
 */
export default function SiteNav({ locale, current = null }: { locale: string; current?: NavKey }) {
  return <SiteHeader locale={locale} tone="ink" current={current} skip={false} />;
}
