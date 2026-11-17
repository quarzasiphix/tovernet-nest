'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PreviewLink } from '../preview/ProjectPreview';
import h from './home.module.css';

export type IndexRow = { slug: string; num: string; name: string; category: string; kind: string; shot: { src: string; alt: string } };

/**
 * Project list where a screenshot follows the pointer (fine pointers only). Rows are real
 * links to the case studies; a click opens the preview. On touch screens each row shows its
 * thumbnail instead.
 */
export default function ProjectIndex({ rows, placement }: { rows: IndexRow[]; placement: string }) {
  const follow = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<string | null>(null);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setFine(Boolean(mq?.matches) && !still);
  }, []);

  useEffect(() => {
    if (!fine) return;
    const el = follow.current;
    if (!el) return;
    let x = 0; let y = 0; let tx = 0; let ty = 0; let raf = 0;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      x += (tx - x) * 0.16; y += (ty - y) * 0.16;
      el.style.transform = `translate3d(${x + 28}px, ${y - 110}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [fine]);

  return (
    <>
      <ol className={h.rows}>
        {rows.map((r) => (
          <li key={r.slug} className={h.row} onPointerEnter={() => setOn(r.slug)} onPointerLeave={() => setOn((v) => (v === r.slug ? null : v))}>
            <PreviewLink slug={r.slug} placement={placement} className={h.rowLink}>
              <span className={h.rowThumb} aria-hidden="true"><img src={r.shot.src} alt="" loading="lazy" decoding="async" /></span>
              <span className={h.rowNum}>{r.num}</span>
              <span className={h.rowName}>{r.name}</span>
              <span className={h.rowCat}>{r.category}</span>
              <span className={h.rowKind}>{r.kind} <ArrowUpRight size={14} aria-hidden="true" style={{ verticalAlign: '-2px' }} /></span>
            </PreviewLink>
          </li>
        ))}
      </ol>
      {fine && (
        <div ref={follow} className={h.follow} data-on={on ? '' : undefined} aria-hidden="true" style={{ transform: 'translate3d(-999px,-999px,0)' }}>
          {rows.map((r) => <img key={r.slug} src={r.shot.src} alt="" data-on={on === r.slug ? '' : undefined} loading="lazy" decoding="async" />)}
        </div>
      )}
    </>
  );
}
