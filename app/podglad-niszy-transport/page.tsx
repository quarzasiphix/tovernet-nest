import type { Metadata } from 'next';
import TransportSite from '@/components/tovernet/niches/TransportSite';

// Review page for the road transport concept (ksiegai/docs/plans/tovernet/18-niche-expansion.md).
// Fixture companies only. Not linked, not indexed, not in the sitemap. The integrator
// removes it once the concept is wired into ConceptSite.
export const metadata: Metadata = {
  title: 'Podgląd niszy: transport | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const SAMPLES = [
  { id: 'freight', variant: 'transport_freight', label: 'Transport drogowy towarów (49.41, 52.31)', company: { legal_name: 'Przykładowy Transport sp. z o.o.', display_name: 'PRZYKŁADOWY TRANSPORT', city: 'ŁÓDŹ', krs: '0001234567' } },
  { id: 'moving', variant: 'transport_moving', label: 'Przeprowadzki (49.42), długa nazwa, brak miasta', company: { legal_name: 'PRZEDSIĘBIORSTWO TRANSPORTOWO-USŁUGOWE SZYBKIE PRZEPROWADZKI I MAGAZYNOWANIE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'PRZEDSIĘBIORSTWO TRANSPORTOWO-USŁUGOWE SZYBKIE PRZEPROWADZKI I MAGAZYNOWANIE', city: null, krs: null } },
  { id: 'courier', variant: 'transport_courier', label: 'Kurierzy (53.20)', company: { legal_name: 'Przykładowy Kurier sp. z o.o.', display_name: 'PRZYKŁADOWY KURIER', city: 'POZNAŃ', krs: '0007654321' } },
  { id: 'freight-long', variant: 'transport_freight', label: 'Transport drogowy, długa nazwa, brak miasta', company: { legal_name: 'PRZEDSIĘBIORSTWO TRANSPORTOWE "MAXTIM TRANSPORT" SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'PRZEDSIĘBIORSTWO TRANSPORTOWE "MAXTIM TRANSPORT"', city: null, krs: null } },
];

const bar: React.CSSProperties = { padding: '14px 16px', background: '#111', color: '#eee', font: '600 14px/1.3 system-ui, sans-serif' };

export default function Page() {
  return (
    <main lang="pl" style={{ background: '#777' }}>
      {SAMPLES.map((x) => (
        <section key={x.id} id={x.id} style={{ marginBottom: 48 }}>
          <p style={bar}>{x.label} · pełna strona</p>
          <TransportSite company={x.company} variant={x.variant} />
        </section>
      ))}
      <p style={bar}>Miniatury (embedded preview, jak w panelu: 250% szerokości, skala 0,4)</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, padding: 16 }}>
        {SAMPLES.slice(0, 3).map((x) => (
          <div key={x.id} id={`mini-${x.id}`} style={{ position: 'relative', overflow: 'hidden', height: 300, background: '#D9DAD6', border: '1px solid #111' }}>
            <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
              <TransportSite company={x.company} variant={x.variant} embedded preview />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
