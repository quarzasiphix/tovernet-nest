'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PreviewLink } from '../preview/ProjectPreview';
import h from './home.module.css';

export type PlateSlide = { slug: string; name: string; meta: string; host: string; full: { src: string; alt: string; width: number; height: number }; phone?: { src: string } };

const DUR = 7000;
/** Frame aspect 16:10.6; the page scrolls down by the part that does not fit, capped at 62%. */
const travel = (w: number, hgt: number) => `-${Math.min(62, Math.max(0, (1 - (10.6 / 16) * (w / hgt)) * 100)).toFixed(1)}%`;

/**
 * Hero plate: real projects, one after another, each page scrolling slowly in a browser frame.
 * Click opens the immersive preview. Pauses on hover and focus; with reduced motion it stays
 * still and changes only from the controls.
 */
export default function LivePlate({ slides, labels }: { slides: PlateSlide[]; labels: { live: string; open: string } }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  useEffect(() => { setStill(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false); }, []);
  useEffect(() => {
    if (paused || still) return;
    const t = setTimeout(() => setI((x) => (x + 1) % slides.length), DUR);
    return () => clearTimeout(t);
  }, [i, paused, still, slides.length]);
  const cur = slides[i];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <PreviewLink slug={cur.slug} placement="hero_plate" className={h.plate} label={`${labels.open}: ${cur.name}`}>
        <div className={h.plateFrame}>
          <div className={h.plateChrome} aria-hidden="true"><i /><i /><i /><span>{cur.host}</span></div>
          <div className={h.plateView}>
            {slides.map((sl, k) => (
              <div key={sl.slug} className={h.slide} data-on={k === i ? '' : undefined} aria-hidden={k !== i}
                   style={{ '--travel': travel(sl.full.width, sl.full.height) } as CSSProperties}>
                <img src={sl.full.src} alt={k === i ? sl.full.alt : ''} width={sl.full.width} height={sl.full.height}
                     loading={k === 0 ? 'eager' : 'lazy'} fetchPriority={k === 0 ? 'high' : 'low'} decoding="async" />
              </div>
            ))}
            <span className={h.livePill}><i aria-hidden="true" />{labels.live}</span>
            <div className={h.plateCap}>
              <span><b>{cur.name}</b><small>{cur.meta}</small></span>
              <span className={h.plateOpen}>{labels.open}<ArrowUpRight size={15} aria-hidden="true" /></span>
            </div>
          </div>
        </div>
        <div className={h.platePhone} aria-hidden="true">
          <div>{slides.map((sl, k) => sl.phone && <img key={sl.slug} src={sl.phone.src} alt="" data-on={k === i ? '' : undefined} loading="lazy" decoding="async" />)}</div>
        </div>
      </PreviewLink>
      <div className={h.dots} role="group" aria-label={labels.live} data-paused={paused || still ? '' : undefined} style={{ '--dur': `${DUR}ms` } as CSSProperties}>
        {slides.map((sl, k) => (
          <button key={sl.slug} type="button" aria-current={k === i ? 'true' : undefined} onClick={() => setI(k)} aria-label={sl.name}>
            <span>{sl.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
