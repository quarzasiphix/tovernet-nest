import type { Metadata } from 'next';
import ConsultingSite from '@/components/tovernet/niches/ConsultingSite';

// Owner review of the business consulting concept. Fixture companies only, not linked, not indexed.
export const metadata: Metadata = {
  title: 'Podgląd konceptu: doradztwo | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const PKD = { code: '70.20.Z', label: 'DORADZTWO W ZAKRESIE PROWADZENIA DZIAŁALNOŚCI GOSPODARCZEJ I ZARZĄDZANIA' };
const A = { legal_name: 'LIMA DORADZTWO SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'LIMA DORADZTWO', city: 'POZNAŃ', krs: '0001234567', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', pkd: PKD };
const B = { legal_name: 'PRZEDSIĘBIORSTWO DORADCZE ZARZĄDZANIA I ROZWOJU STRATEGICZNEGO NOWA PERSPEKTYWA PROSTA SPÓŁKA AKCYJNA', display_name: 'PRZEDSIĘBIORSTWO DORADCZE ZARZĄDZANIA I ROZWOJU STRATEGICZNEGO NOWA PERSPEKTYWA', city: null, krs: null, legal_form: 'PROSTA SPÓŁKA AKCYJNA' };
const G = { legal_name: 'ORLE HOLDING SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'ORLE HOLDING', city: 'GDAŃSK', krs: '0007654321', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', pkd: PKD };

const label: React.CSSProperties = { margin: 0, padding: '14px 16px', background: '#141414', color: '#ECEAE3', font: '500 13px/1.4 ui-monospace, monospace' };

export default function Page() {
  return (
    <main>
      <p style={label}>A · consult_business, krótka nazwa</p>
      <div id="a"><ConsultingSite company={A} variant="consult_business" /></div>
      <p style={label}>B · consult_business, długa nazwa, bez miasta, KRS i PKD</p>
      <div id="b"><ConsultingSite company={B} variant="consult_business" /></div>
      <p style={label}>G · consult_business, spółka typu holding</p>
      <div id="g"><ConsultingSite company={G} variant="consult_business" /></div>
      <p style={label}>Miniatura: panel (250% × 0.4)</p>
      <div id="mini" style={{ position: 'relative', width: 560, height: 340, overflow: 'hidden', margin: 32 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
          <ConsultingSite company={A} variant="consult_business" embedded preview />
        </div>
      </div>
    </main>
  );
}
