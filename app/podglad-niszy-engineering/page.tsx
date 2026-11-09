import type { Metadata } from 'next';
import EngineeringSite from '@/components/tovernet/niches/EngineeringSite';

// Owner review of the engineering and design concept. Fixture companies only, not linked, not indexed.
export const metadata: Metadata = {
  title: 'Podgląd konceptu: inżynieria i architektura | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const A = { legal_name: 'PRACOWNIA KRESKA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'PRACOWNIA KRESKA', city: 'GDAŃSK', krs: '0001234567', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', pkd: { code: '71.11.Z', label: 'DZIAŁALNOŚĆ W ZAKRESIE ARCHITEKTURY' } };
const B = { legal_name: 'PRZEDSIĘBIORSTWO PROJEKTOWO-BADAWCZE KONSTRUKCJI INŻYNIERSKICH I DRÓG PROSTA SPÓŁKA AKCYJNA', display_name: 'PRZEDSIĘBIORSTWO PROJEKTOWO-BADAWCZE KONSTRUKCJI INŻYNIERSKICH I DRÓG', city: null, krs: null, legal_form: 'PROSTA SPÓŁKA AKCYJNA' };
const G = { legal_name: 'TRASA POMIAR SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'TRASA POMIAR', city: 'LUBLIN', krs: '0007654321', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', pkd: { code: '71.12.B', label: 'DZIAŁALNOŚĆ W ZAKRESIE INŻYNIERII I ZWIĄZANE Z NIĄ DORADZTWO TECHNICZNE' } };

const label: React.CSSProperties = { margin: 0, padding: '14px 16px', background: '#141414', color: '#ECEAE3', font: '500 13px/1.4 ui-monospace, monospace' };

export default function Page() {
  return (
    <main>
      <p style={label}>A · eng_architect, krótka nazwa</p>
      <div id="a"><EngineeringSite company={A} variant="eng_architect" /></div>
      <p style={label}>B · eng_engineering, długa nazwa, bez miasta, KRS i PKD</p>
      <div id="b"><EngineeringSite company={B} variant="eng_engineering" /></div>
      <p style={label}>G · eng_engineering</p>
      <div id="g"><EngineeringSite company={G} variant="eng_engineering" /></div>
      <p style={label}>Miniatura: panel (250% × 0.4)</p>
      <div id="mini" style={{ position: 'relative', width: 560, height: 340, overflow: 'hidden', margin: 32 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
          <EngineeringSite company={G} variant="eng_engineering" embedded preview />
        </div>
      </div>
    </main>
  );
}
