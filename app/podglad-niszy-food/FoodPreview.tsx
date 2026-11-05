'use client';

import { useEffect, useState } from 'react';
import FoodSite from '@/components/tovernet/niches/FoodSite';

// ?v=food_restaurant|food_cafe|food_catering  ?s=long (long name, null city)  ?mini=1 (panel miniature)
const SAMPLES = {
  short: { legal_name: 'Przykładowa Kuchnia sp. z o.o.', display_name: 'PRZYKŁADOWA KUCHNIA', city: 'KRAKÓW', krs: '0001234567' },
  long: { legal_name: 'Przykładowa Gospoda Regionalna i Catering Okolicznościowy Południe spółka z ograniczoną odpowiedzialnością spółka komandytowa', display_name: 'PRZYKŁADOWA GOSPODA REGIONALNA I CATERING OKOLICZNOŚCIOWY POŁUDNIE', city: null, krs: null },
};
const VARIANTS = ['food_restaurant', 'food_cafe', 'food_catering'];

export default function FoodPreview() {
  const [q, setQ] = useState<{ v: string; s: 'short' | 'long'; mini: boolean } | null>(null);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQ({ v: p.get('v') ?? 'food_restaurant', s: p.get('s') === 'long' ? 'long' : 'short', mini: p.get('mini') === '1' });
  }, []);
  if (!q) return null;
  const company = SAMPLES[q.s];

  return (
    <main style={{ background: '#E9E6DF', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '10px 12px', font: '13px system-ui', background: '#111', color: '#fff' }}>
        {VARIANTS.map((v) => <a key={v} style={{ color: v === q.v ? '#ffcf5a' : '#fff' }} href={`?v=${v}&s=${q.s}${q.mini ? '&mini=1' : ''}`}>{v}</a>)}
        <a style={{ color: '#9cf' }} href={`?v=${q.v}&s=${q.s === 'long' ? 'short' : 'long'}${q.mini ? '&mini=1' : ''}`}>sample: {q.s}</a>
        <a style={{ color: '#9cf' }} href={`?v=${q.v}&s=${q.s}${q.mini ? '' : '&mini=1'}`}>{q.mini ? 'full page' : 'miniature'}</a>
      </nav>
      {q.mini ? (
        <div style={{ padding: 24 }}>
          {/* Same frame as PanelCompany: 250% wide, scaled to 0.4, clipped. */}
          <div style={{ position: 'relative', overflow: 'hidden', width: 420, height: 300, border: '1px solid #111', background: '#D9DAD6' }}>
            <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
              <FoodSite company={company} variant={q.v} embedded preview />
            </div>
          </div>
        </div>
      ) : (
        <FoodSite company={company} variant={q.v} />
      )}
    </main>
  );
}
