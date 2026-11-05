import type { Metadata } from 'next';
import BusinessSite from '@/components/tovernet/niches/BusinessSite';

// Owner review of the general company concept (ksiegai/docs/plans/tovernet/18-niche-expansion.md).
// Fixture companies only. Not linked, not indexed, not in the sitemap. The integrator removes it.
export const metadata: Metadata = {
  title: 'Podgląd konceptu: strona firmowa | Tovernet',
  robots: { index: false, follow: false, nocache: true },
};

const A = {
  company: { legal_name: 'VAIE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ', display_name: 'VAIE', city: 'BIAŁYSTOK', krs: '0001234567', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ' },
  pkd: { code: '62.10.B', label: 'POZOSTAŁA DZIAŁALNOŚĆ W ZAKRESIE PROGRAMOWANIA' },
};
const B = {
  company: {
    legal_name: 'PRZEDSIĘBIORSTWO PRODUKCYJNO-HANDLOWO-USŁUGOWE NORDTECH SYSTEMY PRZEMYSŁOWE PROSTA SPÓŁKA AKCYJNA',
    display_name: 'PRZEDSIĘBIORSTWO PRODUKCYJNO-HANDLOWO-USŁUGOWE NORDTECH SYSTEMY PRZEMYSŁOWE',
    city: null, krs: null, legal_form: 'PROSTA SPÓŁKA AKCYJNA',
  },
};

const label: React.CSSProperties = { margin: 0, padding: '14px 16px', background: '#141414', color: '#ECEAE3', font: '500 13px/1.4 ui-monospace, monospace' };

export default function Page() {
  return (
    <main style={{ background: '#d8d7d1' }}>
      <p style={label}>A · krótka nazwa, miasto, KRS, PKD 62.10.B</p>
      <div id="a"><BusinessSite company={A.company} variant="business" pkd={A.pkd} /></div>

      <p style={label}>B · długa nazwa, bez miasta, bez KRS, bez PKD</p>
      <div id="b"><BusinessSite company={B.company} variant="business" /></div>

      <p style={label}>Miniatury: panel (250% × 0.4) i zapowiedź w ścieżce (390 px × 0.7692)</p>
      <div id="mini" style={{ display: 'flex', flexWrap: 'wrap', gap: 32, padding: 32 }}>
        <div style={{ position: 'relative', width: 560, height: 340, overflow: 'hidden', border: '1px solid #141414', background: '#F2F1EC' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '250%', transform: 'scale(.4)', transformOrigin: '0 0', pointerEvents: 'none' }}>
            <BusinessSite company={A.company} variant="business" pkd={A.pkd} embedded preview />
          </div>
        </div>
        <div style={{ position: 'relative', width: 300, height: 540, overflow: 'hidden', border: '1px solid #141414', background: '#F2F1EC' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 390, transform: 'scale(.7692)', transformOrigin: '0 0' }}>
            <BusinessSite company={B.company} variant="business" embedded preview />
          </div>
        </div>
      </div>
    </main>
  );
}
