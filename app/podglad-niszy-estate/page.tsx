import type { Metadata } from 'next';
import EstateSite from '@/components/tovernet/niches/EstateSite';

// Owner review of the real estate concept. Fixture companies only, not linked, not indexed.
export const metadata: Metadata = {
  title: 'Podgląd konceptu: nieruchomości | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const A = { legal_name: 'DOMY NAD WARTĄ SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'DOMY NAD WARTĄ', city: 'POZNAŃ', krs: '0001234567', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ' };
const B = { legal_name: 'PRZEDSIĘBIORSTWO INWESTYCYJNE NORDBUD NIERUCHOMOŚCI MIESZKANIOWE PROSTA SPÓŁKA AKCYJNA', display_name: 'PRZEDSIĘBIORSTWO INWESTYCYJNE NORDBUD NIERUCHOMOŚCI MIESZKANIOWE', city: null, krs: null, legal_form: 'PROSTA SPÓŁKA AKCYJNA' };

const label: React.CSSProperties = { margin: 0, padding: '14px 16px', background: '#141414', color: '#ECEAE3', font: '500 13px/1.4 ui-monospace, monospace' };

export default function Page() {
  return (
    <main>
      <p style={label}>A · estate_developer</p>
      <div id="a"><EstateSite company={A} variant="estate_developer" /></div>
      <p style={label}>B · estate_trade, długa nazwa, bez miasta i KRS</p>
      <div id="b"><EstateSite company={B} variant="estate_trade" /></div>
      <p style={label}>G · estate_rental</p>
      <div id="g"><EstateSite company={A} variant="estate_rental" /></div>
      <p style={label}>Miniatura</p>
      <div id="mini" style={{ position: 'relative', width: 340, height: 340, overflow: 'hidden', margin: 16 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
          <EstateSite company={A} variant="estate_developer" embedded preview />
        </div>
      </div>
    </main>
  );
}
