'use client';

import { useEffect, useState } from 'react';
import BeautySite from '@/components/tovernet/niches/BeautySite';

// ?v=beauty_hair|beauty_salon|beauty_spa  ?c=long (long name, no city)  ?m=mini (panel miniature)
const SAMPLES = {
  short: { display_name: 'STUDIO MALWA', legal_name: 'STUDIO MALWA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', city: 'KRAKÓW', krs: null },
  long: { display_name: 'PRACOWNIA URODY I STYLIZACJI DŁONI MAGDALENA WIŚNIEWSKA-KOWALCZYK', legal_name: 'PRACOWNIA URODY I STYLIZACJI DŁONI MAGDALENA WIŚNIEWSKA-KOWALCZYK SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', city: null, krs: '0000000001' },
};
const VARIANTS = ['beauty_hair', 'beauty_salon', 'beauty_spa'];

export default function BeautyPreview() {
  const [q, setQ] = useState<{ v: string; c: 'short' | 'long'; m: boolean } | null>(null);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQ({ v: VARIANTS.includes(p.get('v') ?? '') ? p.get('v')! : 'beauty_hair', c: p.get('c') === 'long' ? 'long' : 'short', m: p.get('m') === 'mini' });
  }, []);
  if (!q) return null;
  const company = SAMPLES[q.c];

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '8px 12px', font: '13px system-ui', borderBottom: '1px solid #ddd' }}>
        {VARIANTS.map((v) => (['short', 'long'] as const).map((c) => (
          <a key={v + c} href={`?v=${v}&c=${c}${q.m ? '&m=mini' : ''}`} style={{ fontWeight: q.v === v && q.c === c ? 700 : 400 }}>{v.replace('beauty_', '')}/{c}</a>
        )))}
        <a href={`?v=${q.v}&c=${q.c}${q.m ? '' : '&m=mini'}`}>{q.m ? 'pełna strona' : 'miniatura'}</a>
      </nav>
      {q.m ? (
        <div style={{ display: 'grid', gap: 24, padding: 24, gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          {(['short', 'long'] as const).map((c) => (
            // Same box as PanelCompany's miniature: 250% wide, scaled to 0.4, inert.
            <div key={c} style={{ position: 'relative', overflow: 'hidden', minHeight: 300, border: '1px solid #000' }}>
              <div aria-hidden="true" ref={(el) => el?.setAttribute('inert', '')} style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
                <BeautySite company={SAMPLES[c]} variant={q.v} embedded preview />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <BeautySite company={company} variant={q.v} />
      )}
    </main>
  );
}
