'use client';

import ConceptSite from './ConceptSite';
import Karta from './Karta';
import s from './brand.module.css';
import { presentName, presentCity } from '@/lib/tovernet/construction';
import { knownVariant, nicheForVariant, tradeOf } from '@/lib/tovernet/niches';

export type PanelCompanyData = {
  lead_id: string;
  legal_name: string;
  display_name: string;
  krs: string | null;
  nip: string | null;
  regon: string | null;
  legal_form: string | null;
  registration_date: string | null;
  city: string | null;
  address: string | null;
  pkd_primary: string | null;
  website: string | null;
  niche_key: string | null;
  variant: string | null;
  public_id: string | null;
  claim_status: string | null;
  customer: boolean;
};

// Main PKD codes of the niches we build for; others show the code only.
const PKD_LABEL: Record<string, string> = {
  '41.00.Z': 'Roboty budowlane związane ze wznoszeniem budynków',
  '41.10.Z': 'Realizacja projektów budowlanych',
  '41.20.Z': 'Roboty budowlane związane ze wznoszeniem budynków',
  '42.11.Z': 'Roboty związane z budową dróg i autostrad',
  '42.99.Z': 'Roboty związane z budową pozostałych obiektów inżynierii lądowej',
  '43.11.Z': 'Rozbiórka i burzenie obiektów budowlanych',
  '43.12.Z': 'Przygotowanie terenu pod budowę',
  '43.21.Z': 'Wykonywanie instalacji elektrycznych',
  '43.22.Z': 'Instalacje wodno-kanalizacyjne, cieplne, gazowe i klimatyzacyjne',
  '43.29.Z': 'Wykonywanie pozostałych instalacji budowlanych',
  '43.31.Z': 'Tynkowanie',
  '43.32.Z': 'Zakładanie stolarki budowlanej',
  '43.33.Z': 'Posadzkarstwo, tapetowanie i oblicowywanie ścian',
  '43.34.Z': 'Malowanie i szklenie',
  '43.39.Z': 'Wykonywanie pozostałych robót budowlanych wykończeniowych',
  '43.91.Z': 'Wykonywanie konstrukcji i pokryć dachowych',
  '43.99.Z': 'Pozostałe specjalistyczne roboty budowlane',
};

const CLAIM: Record<string, string> = {
  verified: 'Konto potwierdzone',
  pending_review: 'Potwierdzamy dane firmy',
};

// "SPÓŁKA Z OGRANICZONĄ" becomes "Spółka z Ograniczoną": words capitalised, short joiners lower case.
const pretty = (s: string) => s.toLocaleLowerCase('pl').split(' ')
  .map((w, i) => (i > 0 && w.length <= 2 ? w : w.charAt(0).toLocaleUpperCase('pl') + w.slice(1))).join(' ');

/** Company card: the title block, registry facts and a live miniature of the concept. */
export default function PanelCompany({ company }: { company: PanelCompanyData }) {
  const variant = knownVariant(company.variant);
  const niche = nicheForVariant(variant);
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const facts: [string, string | null][] = [
    ['NIP', company.nip],
    ['REGON', company.regon],
    ['Forma prawna', company.legal_form ? pretty(company.legal_form) : null],
    ['W rejestrze od', company.registration_date ? new Date(company.registration_date).toLocaleDateString('pl-PL') : null],
    ['Adres', [company.address, city].filter(Boolean).join(', ') || null],
  ];

  return (
    <section aria-label={`Firma ${name}`} className={s.pgrid}>
      <div>
        <Karta
          displayName={company.display_name}
          city={company.city}
          krs={company.krs}
          trade={tradeOf(variant)}
          stage={(company.claim_status && CLAIM[company.claim_status]) || (company.customer ? 'Klient Tovernet' : 'Koncept do Twojej oceny')}
          corner={['Branża strony', niche.label]}
        />
        <div style={{ borderTop: '1px solid #15161A', padding: '12px' }}>
          {company.pkd_primary && (
            <p style={{ margin: '0 0 12px', fontSize: 14 }}>
              <span className={s.l} style={{ display: 'inline', fontSize: 12 }}>{company.pkd_primary}</span>{' '}
              {PKD_LABEL[company.pkd_primary] ?? 'Główna działalność wg KRS'}
            </p>
          )}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm" style={{ margin: 0 }}>
            {facts.filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className={k === 'Adres' || k === 'Forma prawna' ? 'col-span-2' : ''}>
                <dt className={s.l}>{k}</dt>
                <dd style={{ margin: '2px 0 0', fontWeight: 600, overflowWrap: 'anywhere' }}>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={s.l} style={{ marginTop: 12 }}>Dane z Krajowego Rejestru Sądowego</p>
        </div>
      </div>

      {company.public_id && (
        <a href={`${niche.path}#${company.public_id}`} className={s.mini} aria-label="Otwórz koncept strony">
          {/* Live miniature of the concept, scaled down; not interactive. */}
          <div aria-hidden="true" className={s.miniIn} ref={(el) => el?.setAttribute('inert', '')}>
            <ConceptSite
              company={{ krs: company.krs, city: company.city, legal_name: company.legal_name, display_name: company.display_name }}
              variant={variant}
              embedded
              preview
            />
          </div>
          <span className={s.miniGo}>Otwórz koncept</span>
        </a>
      )}
    </section>
  );
}
