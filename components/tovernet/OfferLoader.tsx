import { brandFonts } from '@/lib/tovernet/brand';
import b from './brand.module.css';
import s from './loader.module.css';

/**
 * Shown from the first paint of a personal link until the offer, the session and the
 * invite are known, so the visitor never sees the generic page or a screen that changes.
 */
export default function OfferLoader({ className = '' }: { className?: string }) {
  return (
    <div lang="pl" role="status" aria-live="polite" className={`${brandFonts} ${b.tv} ${s.loader} ${className}`}>
      <span className={`${b.word} ${s.word}`}>tovernet</span>
      <div className={s.center}>
        <div className={s.sheet} aria-hidden="true"><i /><i /><i /><i /></div>
        <p className={s.text}>Przygotowujemy koncept dla Twojej firmy</p>
        <span className={s.bar} aria-hidden="true" />
      </div>
    </div>
  );
}

/** Runs during HTML parsing, before the generic page paints: an offer link hides it at once. */
export const OFFER_PRELOAD_SCRIPT =
  "try{if(/^#[0-9a-f]{36}/.test(location.hash))document.documentElement.classList.add('tv-offer')}catch(e){}";
