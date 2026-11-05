import o from './offer.module.css';

/**
 * What you buy, drawn literally: the homepage and its subpages as sheets. Start is one tall
 * page of sections; Firma fans out six sheets; Pro thirteen and a map pin. Selecting the
 * package fans the sheets (CSS only, transform and opacity). Decorative, hidden from readers.
 */
export default function PageStack({ sheets, pin = false }: { sheets: number; pin?: boolean }) {
  if (sheets <= 1) {
    return (
      <span className={`${o.stack} ${o.stackOne}`} aria-hidden="true">
        <span className={o.sheet}>
          <i className={o.bandHero} />
          {[0, 1, 2, 3, 4].map((n) => <i key={n} className={o.band} style={{ ['--n' as string]: n }} />)}
        </span>
      </span>
    );
  }
  const subs = sheets - 1;
  const shown = Math.min(subs, 6);
  return (
    <span className={o.stack} aria-hidden="true" style={{ ['--count' as string]: shown }}>
      {Array.from({ length: shown }, (_, i) => (
        <span key={i} className={`${o.sheet} ${o.sub}`} style={{ ['--i' as string]: shown - i }}>
          <i className={o.bandHero} /><i className={o.band} /><i className={o.band} />
        </span>
      ))}
      <span className={`${o.sheet} ${o.home}`}>
        <i className={o.bandHero} /><i className={o.band} /><i className={o.band} /><i className={o.band} />
      </span>
      {subs > shown && <span className={o.more}>+{subs - shown}</span>}
      {pin && (
        <svg className={o.pin} viewBox="0 0 24 32"><path d="M12 31s10-11.2 10-19A10 10 0 0 0 2 12c0 7.8 10 19 10 19Z" /><circle cx="12" cy="12" r="3.6" /></svg>
      )}
    </span>
  );
}
