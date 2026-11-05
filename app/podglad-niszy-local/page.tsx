import type { Metadata } from 'next';
import LocalSite from '@/components/tovernet/niches/LocalSite';
import { LOCAL_VARIANTS } from '@/lib/tovernet/niches/local';

// Owner and integrator review of the local-services concept (cleaning, gardens, auto repair,
// detailing). Fixture companies only. Not linked, not indexed, not in the sitemap. The
// integrator removes this page once the niche is wired into ConceptSite.
export const metadata: Metadata = {
  title: 'Podgląd: usługi lokalne | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const SAMPLES = {
  short: { local_cleaning: ['Lśniąco', 'Warszawa'], local_garden: ['Zielony Kąt', 'Poznań'], local_auto: ['Moto Serwis Nowak', 'Gdańsk'], local_detailing: ['Połysk Studio', 'Katowice'] },
  long: 'PRZEDSIĘBIORSTWO USŁUGOWE ŻÓŁTY HORYZONT POŁUDNIE ZAKŁAD NUMER DWA',
} as const;

const LABEL: Record<string, string> = { local_cleaning: 'Sprzątanie', local_garden: 'Ogrody', local_auto: 'Warsztat', local_detailing: 'Detailing' };

export default function Page() {
  return (
    <main style={{ background: '#CFCFCA', padding: '24px 0 80px', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: '0 16px 24px', maxWidth: 1440, margin: '0 auto' }}>
        {LOCAL_VARIANTS.map((v) => (
          <span key={v} style={{ display: 'flex', gap: 8 }}>
            <a href={`#${v}`}>{LABEL[v]}</a>
            <a href={`#${v}-dlugi`}>(długa nazwa)</a>
            <a href={`#${v}-mini`}>(miniatura)</a>
          </span>
        ))}
      </nav>
      {LOCAL_VARIANTS.map((v) => {
        const [display, city] = SAMPLES.short[v];
        return (
          <div key={v}>
            <section id={v} style={{ maxWidth: 1440, margin: '0 auto 40px' }}>
              <LocalSite variant={v} company={{ display_name: display, legal_name: `${display} sp. z o.o.`, city, krs: '0001234567' }} />
            </section>
            <section id={`${v}-dlugi`} style={{ maxWidth: 1440, margin: '0 auto 40px' }}>
              <LocalSite variant={v} company={{ display_name: SAMPLES.long, legal_name: `${SAMPLES.long} SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ`, city: null, krs: null }} />
            </section>
            <section id={`${v}-mini`} style={{ maxWidth: 1440, margin: '0 auto 60px', padding: '0 16px' }}>
              <div style={{ position: 'relative', width: 420, height: 300, overflow: 'hidden', border: '1px solid #111', background: '#D9DAD6' }}>
                <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
                  <LocalSite variant={v} embedded preview company={{ display_name: display, legal_name: `${display} sp. z o.o.`, city, krs: null }} />
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </main>
  );
}
