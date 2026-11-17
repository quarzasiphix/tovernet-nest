'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight } from 'lucide-react';
import { PreviewLink } from '../preview/ProjectPreview';
import s from '../site.module.css';
import w from './work.module.css';

export type WorkCard = {
  slug: string; name: string; kind: string; kindKey: string; status: string; category: string; headline: string; host: string | null;
  caseHref: string | null; shot: { src: string; alt: string; width: number; height: number }; phone: string | null;
  palette: { bg: string; accent: string };
};

/**
 * The portfolio grid with filters. Cards are real links to the case studies; a click opens the
 * preview over the page. Filtering animates with the View Transitions API where the browser
 * has it (and the visitor has not asked for reduced motion).
 */
export default function WorkGrid({ cards, filters, labels }: {
  cards: WorkCard[]; filters: { key: string; label: string }[]; labels: { view: string; caseStudy: string };
}) {
  const [f, setF] = useState('all');
  const shown = cards.filter((c) => f === 'all' || c.kindKey === f);
  const pick = (key: string) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (doc.startViewTransition && !still) doc.startViewTransition(() => flushSync(() => setF(key)));
    else setF(key);
  };

  return (
    <>
      <div className={w.filters} role="group" aria-label={filters[0]?.label}>
        {filters.map((x) => {
          const n = x.key === 'all' ? cards.length : cards.filter((c) => c.kindKey === x.key).length;
          if (n === 0) return null;
          return (
            <button key={x.key} type="button" aria-pressed={f === x.key} onClick={() => pick(x.key)}>
              {x.label}<sup>{n}</sup>
            </button>
          );
        })}
      </div>
      <ol className={w.grid}>
        {shown.map((c, i) => (
          <li key={c.slug} className={w.card} data-shape={i % 5} style={{ viewTransitionName: `w-${c.slug}` } as CSSProperties}>
            <PreviewLink slug={c.slug} placement="work_grid" className={w.plate} label={`${labels.view}: ${c.name}`}
                         style={{ '--pbg': c.palette.bg, '--pac': c.palette.accent } as CSSProperties}>
              <span className={w.shot}><img src={c.shot.src} alt={c.shot.alt} width={c.shot.width} height={c.shot.height} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" /></span>
              {c.phone && <span className={w.phone} aria-hidden="true"><span><img src={c.phone} alt="" loading="lazy" decoding="async" /></span></span>}
              <span className={w.view}>{labels.view}<ArrowUpRight size={15} aria-hidden="true" /></span>
            </PreviewLink>
            <div className={w.meta}>
              <p className={w.num}>{String(cards.indexOf(c) + 1).padStart(2, '0')}</p>
              <div>
                <h2 className={w.name}><PreviewLink slug={c.slug} placement="work_grid_title">{c.name}</PreviewLink></h2>
                <p className={w.head}>{c.headline}</p>
                <p className={w.tags}><span className={w.ok}>● {c.status}</span><span>{c.kind}</span><span>{c.category}</span></p>
              </div>
              <div className={w.links}>
                {c.caseHref && <a href={c.caseHref} className={s.link}>{labels.caseStudy}</a>}
                {c.host && <span className={w.host}>{c.host}</span>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
