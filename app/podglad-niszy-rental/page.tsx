import type { Metadata } from 'next';
import RentalSite from '@/components/tovernet/niches/RentalSite';

// Owner review of the vehicle rental concept. Fixture companies only, not linked, not indexed.
export const metadata: Metadata = {
  title: 'Podgląd konceptu: wynajem pojazdów | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const A = { legal_name: 'KOLA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'KOLA', city: 'RZESZÓW', krs: '0001234567', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', pkd: { code: '77.11.Z', label: 'WYNAJEM I DZIERŻAWA SAMOCHODÓW OSOBOWYCH I FURGONETEK' } };
const B = { legal_name: 'PRZEDSIĘBIORSTWO WYNAJMU POJAZDÓW NORDAUTO FLOTA I OBSŁUGA PROSTA SPÓŁKA AKCYJNA', display_name: 'PRZEDSIĘBIORSTWO WYNAJMU POJAZDÓW NORDAUTO FLOTA I OBSŁUGA', city: null, krs: null, legal_form: 'PROSTA SPÓŁKA AKCYJNA' };
const G = { legal_name: 'CIĘŻKI TERMIN SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'CIĘŻKI TERMIN', city: 'POZNAŃ', krs: '0007654321', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', pkd: { code: '77.12.Z', label: 'WYNAJEM I DZIERŻAWA POZOSTAŁYCH POJAZDÓW SAMOCHODOWYCH' } };

const label: React.CSSProperties = { margin: 0, padding: '14px 16px', background: '#141414', color: '#ECEAE3', font: '500 13px/1.4 ui-monospace, monospace' };

export default function Page() {
  return (
    <main>
      <p style={label}>A · rental_cars, krótka nazwa</p>
      <div id="a"><RentalSite company={A} variant="rental_cars" /></div>
      <p style={label}>B · rental_cars, długa nazwa, bez miasta, KRS i PKD</p>
      <div id="b"><RentalSite company={B} variant="rental_cars" /></div>
      <p style={label}>G · rental_trucks</p>
      <div id="g"><RentalSite company={G} variant="rental_trucks" /></div>
      <p style={label}>Miniatura: panel (250% × 0.4)</p>
      <div id="mini" style={{ position: 'relative', width: 560, height: 340, overflow: 'hidden', margin: 32 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
          <RentalSite company={A} variant="rental_cars" embedded preview />
        </div>
      </div>
    </main>
  );
}
