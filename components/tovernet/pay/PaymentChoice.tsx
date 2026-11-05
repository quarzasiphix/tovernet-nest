'use client';

// "Jak płacisz": full price now or instalments, nothing preselected (19-instalments.md §3).
// Each card says the total; the instalment card says what is paid today, how many payments
// follow and when the last one is. The plan is a separate line under both.

import { useId } from 'react';
import { dueDate, plDate, shortDate, type InstalmentTerms, type PaymentOption } from '@/lib/tovernet/payments';
import p from './pay.module.css';

const zl = (minor: number) => `${(minor / 100).toLocaleString('pl-PL', { maximumFractionDigits: 2 }).replace(/ /g, ' ')} zł`;

export default function PaymentChoice({
  value, onChange, website, addons, terms, planName, planMonthly, autopay, onAutopay, disabled,
}: {
  value: PaymentOption | null;
  onChange: (v: PaymentOption) => void;
  website: number;
  addons: number;
  terms: InstalmentTerms;
  planName: string | null;
  planMonthly: number;
  autopay: boolean;
  onAutopay: (v: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const total = terms.upfront_minor + terms.count * terms.amount_minor;
  const last = dueDate(terms.count);
  const pick = (v: PaymentOption) => !disabled && onChange(v);

  return (
    <div className={p.theme}>
      <div role="radiogroup" aria-labelledby={`${id}-l`} className={p.options}>
        <span id={`${id}-l`} className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Sposób płatności za stronę</span>
        <button type="button" role="radio" aria-checked={value === 'full'} className={p.option} onClick={() => pick('full')} disabled={disabled}>
          <span className={p.dot} aria-hidden="true" />
          <span className={p.optionName}>Całość teraz</span>
          <span className={p.optionAmount}>{zl(website + addons)}</span>
          <span className={p.optionMore}>Jedna płatność za stronę{addons ? ' i dodatki' : ''}. Bez kolejnych rat.</span>
        </button>
        <button type="button" role="radio" aria-checked={value === 'instalments'} className={p.option} onClick={() => pick('instalments')} disabled={disabled}>
          <span className={p.dot} aria-hidden="true" />
          <span className={p.optionName}>W {terms.count + 1} ratach, bez odsetek</span>
          <span className={p.optionAmount}>{zl(terms.upfront_minor + addons)} <small style={{ fontSize: 14, fontWeight: 500, color: 'var(--soft)' }}>dziś</small></span>
          <span className={p.optionMore}>
            {addons ? `Pierwsza rata ${zl(terms.upfront_minor)} i dodatki ${zl(addons)}. ` : ''}
            Potem {terms.count} × {zl(terms.amount_minor)} co miesiąc, do {plDate(last)}. Razem za stronę {zl(total)}, tyle samo co przy jednej płatności.
          </span>
        </button>
      </div>

      {value === 'instalments' && (
        <>
          <details className={p.schedule}>
            <summary>Harmonogram rat ({terms.count + 1} płatności, razem {zl(total)})</summary>
            <ol>
              <li>dziś: {zl(terms.upfront_minor)}</li>
              {Array.from({ length: terms.count }, (_, i) => <li key={i}>{shortDate(dueDate(i + 1))}: {zl(terms.amount_minor)}</li>)}
            </ol>
            <p style={{ margin: '10px 0 0' }}>Przed każdą ratą dostaniesz e-mail z linkiem do płatności BLIK-iem albo kartą. Możesz spłacić resztę w każdej chwili, bez opłat.</p>
          </details>
          <label className={p.autopay}>
            <input type="checkbox" checked={autopay} onChange={(e) => onAutopay(e.target.checked)} disabled={disabled} />
            <span>Jeśli zapłacę kartą: zapisz ją i pobieraj kolejne raty automatycznie w dniu płatności. Wyłączę to w panelu w każdej chwili. <small style={{ color: 'var(--dim)' }}>(Przy BLIK-u dostaniesz link przed każdą ratą.)</small></span>
          </label>
        </>
      )}

      {planName && (
        <p className={p.note}>
          <span className={`${p.tag} ${p.tagPlan}`}>Osobno</span>
          Plan {planName}: {zl(planMonthly)} miesięcznie, od dnia publikacji strony. To osobna płatność, niezależna od rat{value === 'instalments' ? '; pobieramy ją tego samego dnia miesiąca co ratę' : ''}.
        </p>
      )}
    </div>
  );
}
