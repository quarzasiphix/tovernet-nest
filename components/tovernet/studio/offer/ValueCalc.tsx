'use client';

import { useId, useState } from 'react';
import { Calculator } from 'lucide-react';
import { price } from '../motion';
import o from './offer.module.css';

const jobsWord = (n: number) => (n === 1 ? 'jednym zleceniu' : `${n} zleceniach`);
/** "1,5 zlecenia", "2 zlecenia", "5 zleceń", "12 zleceń". */
const jobsCount = (v: number) => {
  const t = v.toLocaleString('pl-PL');
  if (v % 1 !== 0) return `${t} zlecenia`;
  if (v === 1) return '1 zlecenie';
  const d = v % 10, h = v % 100;
  return `${t} ${d >= 2 && d <= 4 && (h < 12 || h > 14) ? 'zlecenia' : 'zleceń'}`;
};

/**
 * "Porównaj cenę strony z wartością jednego zlecenia." The visitor types their own profit per
 * job; nothing is prefilled and nothing is predicted. Pure arithmetic, said so on screen.
 */
export default function ValueCalc({ pkgName, once, monthly, track }: {
  pkgName: string; once: number; monthly: number; track: (e: string, p?: Record<string, unknown>) => void;
}) {
  const id = useId();
  const [raw, setRaw] = useState('');
  const [sent, setSent] = useState(false);
  const profit = Number(raw.replace(/\s/g, '').replace(',', '.')) * 100;
  const valid = Number.isFinite(profit) && profit >= 1000;
  const ratio = valid ? once / profit : 0;
  const n = Math.max(1, Math.round(ratio));
  const year = monthly * 12;
  const blocks = valid ? Math.min(12, Math.ceil(ratio)) : 0;

  return (
    <div className={o.calc}>
      <div className={o.calcHead}>
        <span className={o.calcIcon}><Calculator size={18} aria-hidden="true" /></span>
        <div>
          <h3>Porównaj cenę strony z wartością jednego zlecenia</h3>
          <p>Wpisz, ile mniej więcej zarabiasz na jednym wykonanym zleceniu.</p>
        </div>
      </div>
      <label htmlFor={id} className={o.calcLabel}>Zarobek na jednym zleceniu</label>
      <div className={o.calcField}>
        <input id={id} inputMode="decimal" autoComplete="off" placeholder="np. 1 500" value={raw}
               onChange={(e) => { setRaw(e.target.value.replace(/[^\d\s,.]/g, '').slice(0, 9)); }}
               onBlur={() => { if (valid && !sent) { track('value_calculated', { profit_minor: Math.round(profit), package_minor: once }); setSent(true); } }} />
        <span>zł</span>
      </div>
      <div className={o.calcOut} aria-live="polite">
        {valid ? (
          <>
            <div className={o.calcBar} aria-hidden="true">
              {Array.from({ length: blocks }, (_, i) => <i key={i} style={{ ['--i' as string]: i, ['--w' as string]: i === blocks - 1 && ratio % 1 > 0 ? ratio % 1 : 1 }} />)}
            </div>
            <p className={o.calcResult}>
              {ratio < 1
                ? <>Strona {pkgName} kosztuje <b>mniej niż zarabiasz na jednym zleceniu</b>.</>
                : <>Strona {pkgName} ({price(once)}) to mniej więcej tyle, ile zarabiasz na <b>{ratio % 1 > 0.15 && ratio % 1 < 0.85 ? `${Math.floor(ratio)}–${Math.ceil(ratio)} zleceniach` : jobsWord(n)}</b>.</>}
            </p>
            {monthly > 0 && <p className={o.calcYear}>Rok planu to {price(year)}, czyli {year / profit < 1 ? 'mniej niż jedno zlecenie' : `ok. ${jobsCount(Math.round((year / profit) * 10) / 10)}`}.</p>}
          </>
        ) : <p className={o.calcEmpty}>Wynik pojawi się po wpisaniu kwoty.</p>}
      </div>
      <p className={o.calcFine}>To tylko porównanie kwot. Nie obiecujemy, że strona przyniesie zlecenia ani konkretną liczbę zapytań.</p>
    </div>
  );
}
