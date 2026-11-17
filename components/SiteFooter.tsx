import SiteFoot from './site/SiteFoot';

/** Footer for every locale page: the redesigned site footer (components/site/SiteFoot). */
export default function SiteFooter({ locale }: { locale: string }) {
  return <SiteFoot locale={locale} />;
}
