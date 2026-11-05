import type { ReactNode } from 'react';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import s from './brand.module.css';

type Props = {
  displayName: string;
  city: string | null;
  krs: string | null;
  trade?: string | null;
  stage: ReactNode;
  corner: [string, string];
};

/** The signature title block: who it is for, what it is, what stage it has reached. */
export default function Karta({ displayName, city, krs, trade, stage, corner }: Props) {
  const meta = [
    trade ? ['Branża', trade] : null,
    city ? ['Miasto', presentCity(city) as string] : null,
    krs ? ['KRS', krs] : null,
  ].filter(Boolean) as [string, string][];
  // Six tracks: rows divide evenly; a lone or leading cell takes the spare width.
  const span = (i: number) => (meta.length === 1 ? 6 : meta.length === 2 ? (i === 0 ? 4 : 2) : 2);
  const phone = (i: number) => (meta.length === 3 && i > 0 ? `${s.mHalf} ${i === 1 ? s.mStart : ''}` : s.mFull);

  return (
    <dl className={s.karta} aria-label="Karta projektu">
      <div className={s.first} style={{ gridColumn: '1 / -1' }}><dt className={s.l}>Dla</dt><dd className={s.big}>{presentName(displayName)}</dd></div>
      {meta.map(([label, value], i) => (
        <div key={label} className={`${i === 0 ? s.first : ''} ${phone(i)}`} style={{ gridColumn: `span ${span(i)}` }}><dt className={s.l}>{label}</dt><dd>{value}</dd></div>
      ))}
      <div className={`${s.first} ${s.end}`} style={{ gridColumn: 'span 4' }}><dt className={s.l}>Etap</dt><dd className={s.now}><i className={s.dot} />{stage}</dd></div>
      <div className={s.end} style={{ gridColumn: 'span 2' }}><dt className={s.l}>{corner[0]}</dt><dd>{corner[1]}</dd></div>
    </dl>
  );
}
