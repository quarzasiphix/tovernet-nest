import type { Metadata } from 'next';
import ProfessionalSite from '@/components/tovernet/niches/ProfessionalSite';

// Owner and integrator review of the professional services concept (accounting offices,
// estate agents, property managers). Fixture companies only. Not linked, not indexed, not in
// the sitemap. The integrator removes this page once the niche is wired into ConceptSite.
export const metadata: Metadata = {
  title: 'Podgląd niszy: usługi profesjonalne | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const VARIANTS: { key: string; label: string; companies: { display_name: string; legal_name: string; city: string | null; krs: string | null }[] }[] = [
  {
    key: 'pro_accounting', label: 'Biuro rachunkowe (69.20)',
    companies: [
      { display_name: 'PRZYKŁADOWE BIURO RACHUNKOWE', legal_name: 'PRZYKŁADOWE BIURO RACHUNKOWE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', city: 'ŁÓDŹ', krs: '0000000001' },
      { display_name: 'KANCELARIA PODATKOWA I BIURO RACHUNKOWE PRZYKŁADOWSKA WIŚNIEWSKA I WSPÓLNICY KADRY PŁACE DORADZTWO', legal_name: 'KANCELARIA PODATKOWA I BIURO RACHUNKOWE PRZYKŁADOWSKA WIŚNIEWSKA I WSPÓLNICY KADRY PŁACE DORADZTWO SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', city: null, krs: null },
    ],
  },
  {
    key: 'pro_realestate', label: 'Biuro nieruchomości (68.31)',
    companies: [
      { display_name: 'PRZYKŁADOWE NIERUCHOMOŚCI', legal_name: 'PRZYKŁADOWE NIERUCHOMOŚCI SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', city: 'KRAKÓW', krs: '0000000002' },
      { display_name: 'POŚREDNICTWO I OBRÓT NIERUCHOMOŚCIAMI PRZYKŁADOWY DOM MIESZKANIA DZIAŁKI LOKALE GRUPA', legal_name: 'POŚREDNICTWO I OBRÓT NIERUCHOMOŚCIAMI PRZYKŁADOWY DOM MIESZKANIA DZIAŁKI LOKALE GRUPA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', city: null, krs: null },
    ],
  },
  {
    key: 'pro_property', label: 'Zarządca nieruchomości (68.32)',
    companies: [
      { display_name: 'PRZYKŁADOWY ZARZĄDCA', legal_name: 'PRZYKŁADOWY ZARZĄDCA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', city: 'GDAŃSK', krs: '0000000003' },
      { display_name: 'ADMINISTRACJA I ZARZĄDZANIE NIERUCHOMOŚCIAMI WSPÓLNOT MIESZKANIOWYCH PRZYKŁADOWA', legal_name: 'ADMINISTRACJA I ZARZĄDZANIE NIERUCHOMOŚCIAMI WSPÓLNOT MIESZKANIOWYCH PRZYKŁADOWA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', city: null, krs: null },
    ],
  },
];

const bar: React.CSSProperties = { padding: '10px 16px', background: '#111', color: '#fff', font: '600 14px/1.4 system-ui, sans-serif' };

export default function Page() {
  return (
    <main lang="pl" style={{ background: '#888' }}>
      <nav style={{ ...bar, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {VARIANTS.flatMap((v) => v.companies.map((_, i) => <a key={`${v.key}-${i}`} href={`#${v.key}-${i}`} style={{ color: '#fff' }}>{v.label}, firma {i + 1}</a>))}
        {VARIANTS.map((v) => <a key={`${v.key}-mini`} href={`#${v.key}-mini`} style={{ color: '#fff' }}>{v.label}, miniatura</a>)}
      </nav>
      {VARIANTS.map((v) => (
        <div key={v.key}>
          {v.companies.map((c, i) => (
            <section key={i} id={`${v.key}-${i}`}>
              <p style={bar}>{v.label}, firma {i + 1}{c.city ? '' : ' (długa nazwa, brak miasta)'}</p>
              <ProfessionalSite company={c} variant={v.key} />
            </section>
          ))}
          <section id={`${v.key}-mini`} style={{ padding: 24 }}>
            <p style={bar}>{v.label}, miniatura w panelu (embedded, preview)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 12 }}>
              {v.companies.map((c, i) => (
                <div key={i} style={{ position: 'relative', width: 480, height: 300, overflow: 'hidden', border: '1px solid #111', background: '#ddd' }}>
                  <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
                    <ProfessionalSite company={c} variant={v.key} embedded preview />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ))}
    </main>
  );
}
