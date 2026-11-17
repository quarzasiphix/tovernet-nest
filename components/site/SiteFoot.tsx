import { ArrowRight } from 'lucide-react';
import { NICHES } from '@/lib/tovernet/niches';
import { SELLER, SELLER_BLOCK } from '@/lib/seller';
import { asLocale, copyFor, localPath } from '@/lib/site/copy';
import { siteFonts } from './fonts';
import { Lines } from './Text';
import CookieSettings from './CookieSettings';
import s from './site.module.css';

/** Site footer: the call to talk, the map of the site, the seller block (art. 206 KSH) and a wordmark. */
export default function SiteFoot({ locale: raw, call = true }: { locale: string; call?: boolean }) {
  const locale = asLocale(raw);
  const c = copyFor(locale);
  const f = c.footer;
  const home = `/${locale}/`;
  return (
    <footer className={`${s.tokens} ${siteFonts} ${s.foot}`}>
      <div className={s.wrap}>
        {call && (
          <div className={s.footCall}>
            <div>
              <Lines lines={f.call} className={s.h2} />
              <p className={s.lead}>{f.callLead}</p>
            </div>
            <a href={`${home}#kontakt`} className={s.btn}>{c.nav.cta}<ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        )}
        <div className={s.footCols}>
          <div>
            <h2>{f.contact}</h2>
            <a href={SELLER.phoneHref} className={s.footPhone}>{SELLER.phone}</a>
            <p className={s.footSmall}><a href={`mailto:${SELLER.email}`} style={{ color: 'inherit' }}>{SELLER.email}</a></p>
            <p className={s.footSmall} style={{ marginTop: 14, maxWidth: '24em' }}>{f.tagline}</p>
          </div>
          <div>
            <h2>{f.studio}</h2>
            <ul>
              <li><a href={localPath(locale, '/projekty')}>{c.nav.work}</a></li>
              <li><a href={`${home}#uslugi`}>{c.nav.services}</a></li>
              <li><a href={`${home}#cennik`}>{c.nav.pricing}</a></li>
              <li><a href={localPath(locale, '/poradnik')}>{c.nav.guide}</a></li>
            </ul>
          </div>
          <div>
            <h2>{f.industries}</h2>
            <ul>
              <li><a href={localPath(locale, '/hodowcy')}>{c.nav.breeders}</a></li>
              <li><a href={localPath(locale, '/zwiazki-kynologiczne')}>{c.nav.clubs}</a></li>
              <li><a href={localPath(locale, '/audyt-dostawcy-uslug-cyfrowych')}>{c.nav.audit}</a></li>
              <li><a href="/strony-dla-firm/" lang="pl">{f.niches}</a></li>
            </ul>
          </div>
          <div>
            <h2>{f.niches}</h2>
            <ul>
              {NICHES.slice(0, 6).map((n) => <li key={n.key}><a href={n.path} lang="pl">{n.label}</a></li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className={s.wrap} aria-hidden="true"><span className={s.footGiant}>tovernet</span></div>
      <div className={`${s.wrap} ${s.footLegal}`}>
        <p>{SELLER_BLOCK}</p>
        <p className={s.footLegalLinks}>
          <span>© {new Date().getFullYear()} {SELLER.name}. {f.rights}</span>
          <a href={localPath(locale, '/regulamin')}>{f.legal.terms}</a>
          <a href={localPath(locale, '/polityka-prywatnosci')}>{f.legal.privacy}</a>
          <a href={localPath(locale, '/umowa-powierzenia')}>{f.legal.dpa}</a>
          <a href={`mailto:${SELLER.email}`}>{f.legal.report}</a>
          <CookieSettings label={f.legal.cookies} />
        </p>
      </div>
    </footer>
  );
}
