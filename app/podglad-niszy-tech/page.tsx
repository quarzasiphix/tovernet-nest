import type { Metadata } from 'next';
import TechSite from '@/components/tovernet/niches/TechSite';

// Owner review of the software and games concept. Fixture companies only, not linked, not indexed.
export const metadata: Metadata = {
  title: 'Podgląd konceptu: IT i gry | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const A = { legal_name: 'VAIE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'VAIE', city: 'BIAŁYSTOK', krs: '0001234567', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', pkd: { code: '62.10.B', label: 'POZOSTAŁA DZIAŁALNOŚĆ W ZAKRESIE PROGRAMOWANIA' } };
const B = { legal_name: 'PRZEDSIĘBIORSTWO INFORMATYCZNE NORDTECH SYSTEMY PRZEMYSŁOWE PROSTA SPÓŁKA AKCYJNA', display_name: 'PRZEDSIĘBIORSTWO INFORMATYCZNE NORDTECH SYSTEMY PRZEMYSŁOWE', city: null, krs: null, legal_form: 'PROSTA SPÓŁKA AKCYJNA' };
const G = { legal_name: 'NOCNE PIKSELE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'NOCNE PIKSELE', city: 'KRAKÓW', krs: '0007654321', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', pkd: { code: '58.21.Z', label: 'DZIAŁALNOŚĆ WYDAWNICZA W ZAKRESIE GIER KOMPUTEROWYCH' } };

const label: React.CSSProperties = { margin: 0, padding: '14px 16px', background: '#141414', color: '#ECEAE3', font: '500 13px/1.4 ui-monospace, monospace' };

export default function Page() {
  return (
    <main>
      <p style={label}>A · tech_software, krótka nazwa</p>
      <div id="a"><TechSite company={A} variant="tech_software" /></div>
      <p style={label}>B · tech_software, długa nazwa, bez miasta, KRS i PKD</p>
      <div id="b"><TechSite company={B} variant="tech_software" /></div>
      <p style={label}>G · tech_games</p>
      <div id="g"><TechSite company={G} variant="tech_games" /></div>
      <p style={label}>Miniatura: panel (250% × 0.4)</p>
      <div id="mini" style={{ position: 'relative', width: 560, height: 340, overflow: 'hidden', margin: 32 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
          <TechSite company={A} variant="tech_software" embedded preview />
        </div>
      </div>
    </main>
  );
}
