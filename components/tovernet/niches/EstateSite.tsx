'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { Bodoni_Moda, Manrope } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { nameScale } from '@/lib/tovernet/niches/business';
import { STEPS_NOTE, estateContent } from '@/lib/tovernet/niches/estate';
import s from './estate.module.css';

const serif = Bodoni_Moda({ subsets: ['latin', 'latin-ext'], weight: 'variable', display: 'swap' });
const sans = Manrope({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '700'], display: 'swap' });

// Real estate concept. The hero is a building elevation: its floors rise on load and the visitor
// picks a unit or a property type directly on it, which fills the enquiry beside it. The rows
// are labelled as illustrative; no unit, price or investment is stated. The form sends nothing.

type Company = PublicDemo['config']['company'];

export default function EstateSite({
  company, variant, embedded = false, preview = false,
}: { company: Company; variant: string; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const c = estateContent(variant);
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const [unit, setUnit] = useState<string | null>(preview ? c.rows[0][0] : null);
  const [intent, setIntent] = useState(c.intents[0]);
  const [reach, setReach] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const toForm = () => {
    const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    form.current?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = reach.trim();
    if (!/^\S+@\S+\.\S+$/.test(v) && v.replace(/\D/g, '').length < 9) { setError(true); return; }
    setError(false);
    setSent(true);
  };

  return (
    <div lang="pl" className={`${s.site} ${sans.className}`} data-preview={preview || undefined}>
      <header className={s.mast}>
        <span className={`${s.mastName} ${serif.className}`}>{name}</span>
        <span className={s.slot}>Tu telefon i e-mail</span>
        <button type="button" className={s.mastGo} onClick={toForm}>Zapytaj</button>
      </header>

      <section className={s.hero}>
        <div className={s.title}>
          <p className={s.kicker}>{c.kicker}{city ? ` · ${city}` : ''}</p>
          <Title className={`${s.name} ${serif.className}`} data-scale={nameScale(name)}>{name}</Title>
          <p className={s.lead}>{c.lead}</p>
        </div>

        <div className={s.plan}>
          <p className={s.planTitle}>{c.planTitle}</p>
          <div className={s.building} role="group" aria-label={c.planTitle}>
            {c.rows.map((row, r) => (
              <div key={row.join()} className={s.floor} style={{ animationDelay: `${(c.rows.length - 1 - r) * 130}ms`, gridTemplateColumns: `repeat(${row.length},minmax(0,1fr))` }}>
                {row.map((u) => (
                  <button key={u} type="button" aria-pressed={unit === u} className={unit === u ? s.on : ''} onClick={() => { setUnit(u); setSent(false); }}>{u}</button>
                ))}
              </div>
            ))}
          </div>
          <p className={s.note}>{c.planNote}</p>
        </div>

        <form ref={form} className={s.card} onSubmit={submit} noValidate>
          <p className={s.pick}><span>{c.pickedLabel}</span><strong className={serif.className}>{unit ?? 'Nie wybrano'}</strong></p>
          <fieldset className={s.intents}>
            <legend>Czego dotyczy pytanie?</legend>
            {c.intents.map((o) => (
              <label key={o}>
                <input type="radio" name={`${uid}-i`} checked={intent === o} onChange={() => setIntent(o)} />
                <span>{o}</span>
              </label>
            ))}
          </fieldset>
          <label className={s.field}><span>Kilka słów</span><textarea rows={3} placeholder={c.placeholder} /></label>
          <label className={`${s.field} ${error ? s.bad : ''}`}>
            <span>E-mail lub telefon</span>
            <input value={reach} autoComplete="email" aria-invalid={error} aria-describedby={error ? `${uid}-e` : undefined} onChange={(e) => { setReach(e.target.value); setError(false); }} />
          </label>
          {error && <em id={`${uid}-e`} role="alert" className={s.err}>Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.</em>}
          {sent
            ? <p role="status" className={s.sent}><strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane.</p>
            : <button type="submit" className={s.send}>Wyślij zapytanie</button>}
        </form>
      </section>

      <section className={s.columns}>
        {c.sections.map((x) => (
          <div key={x.title}>
            <h2 className={serif.className}>{x.title}</h2>
            <p className={s.slot}>{x.text}</p>
          </div>
        ))}
      </section>

      <section className={s.path}>
        <h2 className={serif.className}>{c.stepsTitle}</h2>
        <ol>
          {c.steps.map(([t, d], i) => (
            <li key={t}><span className={serif.className}>{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
          ))}
        </ol>
        <p className={s.note}>{STEPS_NOTE}</p>
      </section>

      <footer className={s.foot}>
        <p>{company.legal_name}{company.krs ? ` · KRS ${company.krs}` : ''}{city ? ` · ${city}` : ''}</p>
        <p className={s.slot}>Tu NIP, adres i informacja o przetwarzaniu danych</p>
      </footer>

      {!preview && <div className={s.thumb}><span>Tu Twój telefon</span><button type="button" onClick={toForm}>Zapytaj</button></div>}
    </div>
  );
}
