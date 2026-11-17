'use client';

import { useEffect } from 'react';

/**
 * Scroll reveals for every [data-reveal] inside `.site`. Content is hidden only after this
 * runs (it sets data-motion on the root), so nothing stays invisible without JavaScript, and
 * never with reduced motion. One observer for the page.
 */
export default function Reveal({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const els = () => Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])'));
    if (still || typeof IntersectionObserver === 'undefined') { els().forEach((el) => { el.dataset.in = ''; }); return; }
    root.dataset.motion = '';
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      (e.target as HTMLElement).dataset.in = '';
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els().forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootId]);
  return null;
}
