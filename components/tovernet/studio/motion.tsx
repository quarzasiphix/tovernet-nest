'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Stagger delay for entrance and reveal animations. */
export const delay = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties);

// Prices group from 1,000 ("3 089 zł"). pl-PL's default groups only from 10,000.
const fmt = new Intl.NumberFormat('pl-PL', {
  style: 'currency', currency: 'PLN', maximumFractionDigits: 2, minimumFractionDigits: 0, useGrouping: 'always',
} as Intl.NumberFormatOptions);
export const price = (minor: number) => fmt.format(minor / 100);

/** Animates a number towards `value` (amounts in the summary). Instant with reduced motion. */
export function useTween(value: number, ms = 650) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reduced()) { from.current = value; setShown(value); return; }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const cur = a + (value - a) * (1 - Math.pow(1 - p, 3));
      from.current = cur;
      setShown(cur);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return Math.round(shown / 100) * 100;
}

/**
 * Renders `children` at a fixed design width and scales it to the parent's width, so a
 * concept miniature shows its real desktop or phone layout. Inert: never focusable.
 */
export function Scaled({ width, className, children }: { width: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    el.setAttribute('inert', '');
    const set = () => el.style.setProperty('--k', String(parent.clientWidth / width));
    set();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(set);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [width]);
  return <div ref={ref} className={className} style={{ width }}>{children}</div>;
}
