import type { Metadata } from 'next';
import LawSite from '@/components/tovernet/niches/LawSite';

// Owner and lawyer review of the law firm concept. Fixture companies only, not linked, not indexed.
export const metadata: Metadata = {
  title: 'Podgląd konceptu: kancelarie | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const A = { legal_name: 'OSTROWSKI WALCZAK SPÓŁKA KOMANDYTOWA', display_name: 'OSTROWSKI WALCZAK', city: 'POZNAŃ', krs: '0001234567', legal_form: 'SPÓŁKA KOMANDYTOWA', pkd: { code: '69.10.Z', label: 'DZIAŁALNOŚĆ PRAWNICZA' } };
const B = { legal_name: 'KANCELARIA DORADZTWA PRAWNEGO I PODATKOWEGO ZIELIŃSKI MAZUR I WSPÓLNICY SPÓŁKA PARTNERSKA', display_name: 'KANCELARIA DORADZTWA PRAWNEGO I PODATKOWEGO ZIELIŃSKI MAZUR I WSPÓLNICY', city: null, krs: null, legal_form: 'SPÓŁKA PARTNERSKA' };
const G = { legal_name: 'NOWAK TAX SPÓŁKA JAWNA', display_name: 'NOWAK TAX', city: 'GDAŃSK', krs: '0007654321', legal_form: 'SPÓŁKA JAWNA', pkd: { code: '69.10.Z', label: 'DZIAŁALNOŚĆ PRAWNICZA' } };

const label: React.CSSProperties = { margin: 0, padding: '14px 16px', background: '#141414', color: '#ECEAE3', font: '500 13px/1.4 ui-monospace, monospace' };

export default function Page() {
  return (
    <main>
      <p style={label}>A · law_firm, krótka nazwa</p>
      <div id="a"><LawSite company={A} variant="law_firm" /></div>
      <p style={label}>B · law_firm, długa nazwa, bez miasta, KRS i PKD</p>
      <div id="b"><LawSite company={B} variant="law_firm" /></div>
      <p style={label}>G · law_firm, spółka o profilu podatkowym</p>
      <div id="g"><LawSite company={G} variant="law_firm" /></div>
      <p style={label}>Miniatura: panel (250% × 0.4)</p>
      <div id="mini" style={{ position: 'relative', width: 560, height: 340, overflow: 'hidden', margin: 32 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
          <LawSite company={A} variant="law_firm" embedded preview />
        </div>
      </div>
    </main>
  );
}
