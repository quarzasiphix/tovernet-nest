import type { ReactNode } from 'react';
import { PreviewProvider } from './preview/ProjectPreview';
import { StartProvider } from './start/StartFlow';
import SiteHeader, { type NavKey } from './SiteHeader';
import SiteFoot from './SiteFoot';
import Reveal from './Reveal';
import { siteFonts } from './fonts';
import s from './site.module.css';

/** Frame for the redesigned pages: tokens and fonts, header, main, footer, previews, reveals. */
export default function SitePage({ locale, current = null, footCall = true, children }: { locale: string; current?: NavKey; footCall?: boolean; children: ReactNode }) {
  return (
    <div id="site" className={`${s.site} ${siteFonts}`} lang={locale}>
      <StartProvider locale={locale}>
      <PreviewProvider locale={locale}>
        <SiteHeader locale={locale} current={current} />
        <main id="tresc" tabIndex={-1} style={{ outline: 'none' }}>{children}</main>
        <SiteFoot locale={locale} call={footCall} />
      </PreviewProvider>
      </StartProvider>
      <Reveal rootId="site" />
    </div>
  );
}
