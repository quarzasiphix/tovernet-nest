'use client';

import { useId, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Sofia_Sans, Sofia_Sans_Extra_Condensed } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { nameScale, presentPkd } from '@/lib/tovernet/niches/business';
import { energyContent, energyVariant } from '@/lib/tovernet/niches/energy';
import s from './energy.module.css';

const plate = Sofia_Sans_Extra_Condensed({ subsets: ['latin', 'latin-ext'], weight: ['500', '700'], display: 'swap' });
const sans = Sofia_Sans({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '700'], display: 'swap' });

// Energy concept. The hero is a synoptic board from a switchroom: a live busbar with one feeder per
// kind of visitor. Choosing a feeder closes its switch, current runs to its lamp and the panel below
// shows that visitor's questions and a form already addressed to them. The registry data sits on a
// rating plate. Questions and stages are labelled examples; answers are empty slots. Sends nothing.

type Company = PublicDemo['config']['company'];

export default function EnergySite({
  company, variant, embedded = false, preview = false,
}: { company: Company; variant: string; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const c = energyContent(energyVariant(variant, company));
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const act = presentPkd(company.pkd);

  const [active, setActive] = useState(0);
  const [question, setQuestion] = useState(0);
  const [reach, setReach] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const feeder = c.feeders[active];

  const pick = (i: number) => { setActive(i); setQuestion(0); setSent(false); };

  // A button, not a #hash link: the offer page keeps the demo id in the fragment.
  const toPanel = () => {
    const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panel.current?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = reach.trim();
    if (!/^\S+@\S+\.\S+$/.test(v) && v.replace(/\D/g, '').length < 9) { setError(true); return; }
    setError(false);
    setSent(true);
  };

  const facts: [string, string][] = [
    ...(company.legal_form ? [['Forma', company.legal_form.toLocaleLowerCase('pl')] as [string, string]] : []),
    ...(company.krs ? [['KRS', company.krs] as [string, string]] : []),
    ...(act ? [['Działalność', `${act.code} ${act.label}`] as [string, string]] : []),
    ...(city ? [['Siedziba', city] as [string, string]] : []),
  ];

  return (
    <div lang="pl" className={`${s.site} ${sans.className}`} data-preview={preview || undefined}>
      <header className={s.mast}>
        <span className={`${s.mastName} ${plate.className}`}>{name}</span>
        <span className={s.slot}>Tu telefon i e-mail</span>
        <button type="button" className={s.mastGo} onClick={toPanel}>Zadaj pytanie</button>
      </header>

      <section className={s.hero}>
        <div className={s.title}>
          <p className={s.kicker}>{c.kicker}{city ? ` · ${city}` : ''}</p>
          <Title className={`${s.name} ${plate.className}`} data-scale={nameScale(name)}>{name}</Title>
          <p className={s.lead}>{c.lead}</p>
        </div>

        {facts.length > 0 && (
          <div className={s.rating}>
            <p className={plate.className}>Dane z KRS</p>
            <dl>{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
        )}

        <div className={s.board}>
          <p className={`${s.boardTitle} ${plate.className}`}>{c.boardTitle}</p>
          <div className={s.bus} aria-hidden />
          <div className={s.feeders} role="group" aria-label={c.boardTitle}>
            {c.feeders.map((f, i) => (
              <button key={f.key} type="button" aria-pressed={active === i} className={active === i ? s.on : ''} onClick={() => pick(i)}>
                <svg viewBox="0 0 60 112" aria-hidden preserveAspectRatio="xMidYMin meet">
                  <path className={s.casing} d="M30 0V34M30 70V84" />
                  <path className={s.live} d="M30 0V34" />
                  <g className={s.blade}><path className={s.casing} d="M30 70V33" /><path className={s.core} d="M30 70V33" /></g>
                  <path className={s.core} pathLength={1} d="M30 70V84" />
                  <circle className={s.pivot} cx="30" cy="70" r="4.5" />
                  <circle className={s.lamp} cx="30" cy="97" r="13" />
                  <path className={s.cross} d="M21 88l18 18M39 88l-18 18" />
                </svg>
                <span className={`${s.tab} ${plate.className}`}>{f.label}</span>
              </button>
            ))}
          </div>

          <div ref={panel} className={s.panel} style={{ '--i': active } as CSSProperties}>
            <div className={s.questions}>
              <p className={s.who}>{feeder.who}</p>
              <fieldset>
                <legend>O co chcesz zapytać?</legend>
                {feeder.questions.map((q, i) => (
                  <label key={q}>
                    <input type="radio" name={`${uid}-q`} checked={question === i} onChange={() => { setQuestion(i); setSent(false); }} />
                    <span>{q}</span>
                  </label>
                ))}
              </fieldset>
              <p className={s.slot}>{c.answerSlot}</p>
              <p className={s.note}>{c.questionsNote}</p>
            </div>

            <form className={s.form} onSubmit={submit} noValidate>
              <p className={s.topic}><span>Sprawa</span><strong>{feeder.label}: {feeder.questions[question]}</strong></p>
              <label className={s.field}><span>Kilka słów</span><textarea rows={3} placeholder={feeder.placeholder} /></label>
              <label className={`${s.field} ${error ? s.bad : ''}`}>
                <span>E-mail lub telefon</span>
                <input value={reach} autoComplete="email" aria-invalid={error} aria-describedby={error ? `${uid}-e` : undefined} onChange={(e) => { setReach(e.target.value); setError(false); }} />
              </label>
              {error && <em id={`${uid}-e`} role="alert" className={s.err}>Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.</em>}
              {sent
                ? <p role="status" className={s.sent}><strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane.</p>
                : <button type="submit" className={s.send}>Wyślij pytanie</button>}
            </form>
          </div>
        </div>
      </section>

      <section className={s.stages}>
        <h2 className={plate.className}>{c.stagesTitle}</h2>
        <ol>
          {c.stages.map(([t, d]) => (
            <li key={t}><h3>{t}</h3><p>{d}</p></li>
          ))}
        </ol>
        <p className={s.note}>{c.stagesNote}</p>
      </section>

      <section className={s.slots}>
        <h2 className={plate.className}>{c.slotsTitle}</h2>
        <div>
          {c.slots.map((x) => (
            <div key={x.title} className={s.slotRow}>
              <h3>{x.title}</h3>
              <p className={s.slot}>{x.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={s.close}>
        <div>
          <h2 className={plate.className}>{c.closeTitle}</h2>
          <p>{c.closeText}</p>
        </div>
        <button type="button" onClick={toPanel}>Przejdź do pytań</button>
      </section>

      <footer className={s.foot}>
        <p>{company.legal_name}{company.krs ? ` · KRS ${company.krs}` : ''}{city ? ` · ${city}` : ''}</p>
        <p className={s.slot}>Tu NIP, adres i informacja o przetwarzaniu danych</p>
      </footer>

      {!preview && <div className={s.thumb}><span>Tu Twój telefon</span><button type="button" onClick={toPanel}>Zadaj pytanie</button></div>}
    </div>
  );
}
