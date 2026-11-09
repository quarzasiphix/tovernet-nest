import type { Metadata } from 'next';
import EnergySite from '@/components/tovernet/niches/EnergySite';

// Owner review of the energy concept. Fixture companies only, not linked, not indexed.
export const metadata: Metadata = {
  title: 'Podgląd konceptu: energia | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const A = { legal_name: 'SPÓŁDZIELNIA ENERGETYCZNA PRZYKŁADOWA', display_name: 'SPÓŁDZIELNIA ENERGETYCZNA PRZYKŁADOWA', city: 'POŁAJEWO', krs: '0001234567', legal_form: 'SPÓŁDZIELNIA', pkd: { code: '35.12.B', label: 'WYTWARZANIE ENERGII ELEKTRYCZNEJ ZE ŹRÓDEŁ ODNAWIALNYCH' } };
const B = { legal_name: 'PRZEDSIĘBIORSTWO ROZWOJU INSTALACJI ODNAWIALNYCH ŹRÓDEŁ ENERGII NADWIŚLAŃSKIE PROSTA SPÓŁKA AKCYJNA', display_name: 'PRZEDSIĘBIORSTWO ROZWOJU INSTALACJI ODNAWIALNYCH ŹRÓDEŁ ENERGII NADWIŚLAŃSKIE', city: null, krs: null, legal_form: 'PROSTA SPÓŁKA AKCYJNA' };
const G = { legal_name: 'BIOGAZ ZALESIE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'BIOGAZ ZALESIE', city: 'ŻABNO', krs: '0007654321', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', pkd: { code: '35.12.D', label: 'WYTWARZANIE ENERGII ELEKTRYCZNEJ ZE ŹRÓDEŁ ODNAWIALNYCH' } };

const label: React.CSSProperties = { margin: 0, padding: '14px 16px', background: '#141414', color: '#ECEAE3', font: '500 13px/1.4 ui-monospace, monospace' };

export default function Page() {
  return (
    <main>
      <p style={label}>A · energy_project ze spółdzielnią: strona sama wybiera wariant spółdzielni</p>
      <div id="a"><EnergySite company={A} variant="energy_project" /></div>
      <p style={label}>B · energy_project, długa nazwa, bez miasta, KRS i PKD</p>
      <div id="b"><EnergySite company={B} variant="energy_project" /></div>
      <p style={label}>G · energy_project, krótka nazwa</p>
      <div id="g"><EnergySite company={G} variant="energy_project" /></div>
      <p style={label}>Miniatura: panel (250% × 0.4)</p>
      <div id="mini" style={{ position: 'relative', width: 560, height: 340, overflow: 'hidden', margin: 32 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
          <EnergySite company={A} variant="energy_coop" embedded preview />
        </div>
      </div>
    </main>
  );
}
