'use client';

import { useState } from 'react';
import { Check, Globe2, Info, Mail } from 'lucide-react';
import o from './offer.module.css';
import { DOMAIN_STATES, MAIL_SAFE, MIGRATION_KEEP, MIGRATION_NOT, type DomainState, type Journey } from './offerCopy';

/** Segmented choice at the top of the scope: new site, or moving an existing one. */
export function JourneySwitch({ value, onChange }: { value: Journey; onChange: (j: Journey) => void }) {
  return (
    <div className={o.journey} role="radiogroup" aria-label="Skąd zaczynamy" data-on={value}>
      <span className={o.journeyThumb} aria-hidden="true" />
      <button type="button" role="radio" aria-checked={value === 'new'} onClick={() => onChange('new')}>
        <b>Nowa strona</b><small>Nie mam strony albo zaczynam od zera</small>
      </button>
      <button type="button" role="radio" aria-checked={value === 'migration'} onClick={() => onChange('migration')}>
        <b>Mam już stronę</b><small>Przenosimy ją do nowego projektu</small>
      </button>
    </div>
  );
}

/** What moving an existing site means, and an honest answer for each domain situation. */
export default function Migration({ track }: { track: (e: string, p?: Record<string, unknown>) => void }) {
  const [state, setState] = useState<DomainState | null>(null);
  const answer = DOMAIN_STATES.find((d) => d.key === state);
  return (
    <div className={o.mig}>
      <div className={o.migCols}>
        <div>
          <h3 className={o.migTitle}>Co bierzemy z obecnej strony</h3>
          <ul className={o.list}>{MIGRATION_KEEP.map((x) => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}</ul>
          <p className={o.migNot}><Info size={15} aria-hidden="true" />{MIGRATION_NOT}</p>
        </div>
        <div>
          <h3 className={o.migTitle}><Globe2 size={17} aria-hidden="true" />Na kogo jest Twoja domena?</h3>
          <div className={o.domain} role="radiogroup" aria-label="Sytuacja domeny">
            {DOMAIN_STATES.map((d) => (
              <button key={d.key} type="button" role="radio" aria-checked={state === d.key}
                      onClick={() => { setState(d.key); track('domain_state_selected', { state: d.key }); }}>
                <span className={o.dot} aria-hidden="true" />{d.label}
              </button>
            ))}
          </div>
          {answer && <p className={o.domainAnswer} key={answer.key}>{answer.answer}</p>}
          <p className={o.mailSafe}><Mail size={15} aria-hidden="true" />{MAIL_SAFE}</p>
        </div>
      </div>
      <p className={o.migFine}>Nie potrzebujemy żadnych haseł. Dokładne dane o domenie, hostingu i poczcie zbieramy w ankiecie po zamówieniu, a każdą zmianę domeny potwierdza osoba uprawniona w Twojej firmie.</p>
    </div>
  );
}
