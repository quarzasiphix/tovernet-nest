'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Hanken_Grotesk, Instrument_Serif } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { MATERIALS, PREPARE, ROOMS, SCHEDULE, STATES, TIMES } from '@/lib/tovernet/finishing';
import s from './finishing.module.css';

const serif = Instrument_Serif({ subsets: ['latin', 'latin-ext'], weight: '400', style: ['normal', 'italic'], display: 'swap' });
const sans = Hanken_Grotesk({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });

// Finishing concept (ksiegai/docs/plans/tovernet/12-finishing-concept.md). The page is an
// example floor plan: the visitor marks the rooms to finish, each one fills with its
// material and joins the scope, and the quote form opens with that scope written out.
// Company facts come from `company`; the form never sends anything.

function Choice({ name, legend, options }: { name: string; legend: string; options: string[] }) {
  return (
    <fieldset className={s.choice}>
      <legend>{legend}</legend>
      <div>{options.map((o) => <label key={o}><input type="radio" name={name} value={o} /><span>{o}</span></label>)}</div>
    </fieldset>
  );
}

export default function FinishingSite({ company, embedded = false, preview = false }: { company: PublicDemo['config']['company']; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const [picked, setPicked] = useState<string[]>(preview ? ['lazienka', 'kuchnia'] : []);
  const [drawn, setDrawn] = useState(preview);
  const [sent, setSent] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const planRef = useRef<SVGSVGElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Walls draw in once the plan is on screen. Scoped observer: works embedded and scaled.
  useEffect(() => {
    if (drawn) return;
    const el = planRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setDrawn(true); return; }
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setDrawn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [drawn]);

  const toggle = (key: string) => setPicked((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));
  const rooms = ROOMS.filter((r) => picked.includes(r.key));
  // A button, not a #hash link: the offer page keeps the demo id in the fragment.
  const toForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tel = String(new FormData(e.currentTarget).get('telefon') ?? '').replace(/\D/g, '');
    if (tel.length < 9) { setPhoneError(true); return; }
    setSent(true);
  };

  return (
    <div className={`${s.site} ${sans.className}`}>
      <header className={s.top}>
        <span className={s.name}>{name}{city && <small>{city}</small>}</span>
        <span className={s.slot}>Tu Twój numer telefonu</span>
      </header>

      <section className={s.hero}>
        <div className={s.heroText}>
          <Title className={`${s.h1} ${serif.className}`}>Wykończenia <em>wnętrz.</em></Title>
          {city
            ? <p className={`${s.area} ${s.city} ${serif.className}`}><span className={`${s.pin} ${sans.className}`}>Działamy w okolicy</span>{city}</p>
            : <p className={s.area}>Mieszkania, domy i lokale</p>}
          <p className={s.lead}>Zaznacz na planie, co chcesz wykończyć. Przygotujemy wycenę z podziałem na prace, zanim cokolwiek zaczniemy.</p>
          <button type="button" className={s.cta} onClick={toForm}>Poproś o wycenę</button>
        </div>

        <figure className={s.planBox}>
          <svg ref={planRef} viewBox="-10 -10 620 400" className={`${s.plan} ${drawn ? s.drawn : ''}`} role="img" aria-label="Przykładowy układ mieszkania">
            <defs>
              <pattern id="fin-tile" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#E9E6E0" /><path d="M20 0H0V20" fill="none" stroke="#B9B3A8" strokeWidth="1.2" />
              </pattern>
              <pattern id="fin-oak" width="120" height="16" patternUnits="userSpaceOnUse">
                <rect width="120" height="16" fill="#C99B6B" /><path d="M0 16H120M70 0V16" stroke="#A97B4C" strokeWidth="1.2" />
                <path d="M8 6c20 -3 40 3 58 0" stroke="#B88857" strokeWidth=".8" fill="none" />
              </pattern>
              <pattern id="fin-paint" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#DCE3DA" /><circle cx="2" cy="3" r=".7" fill="#C9D2C6" />
              </pattern>
            </defs>
            {ROOMS.map((r) => {
              const on = picked.includes(r.key);
              return (
                <g key={r.key} className={`${s.room} ${on ? s.on : ''}`} onClick={() => toggle(r.key)} aria-hidden="true">
                  <rect x={r.x} y={r.y} width={r.w} height={r.h} className={s.floor} />
                  <rect x={r.x + 4} y={r.y + 4} width={r.w - 8} height={r.h - 8} fill={`url(#fin-${r.material})`} className={s.fill} />
                  <rect x={r.x} y={r.y} width={r.w} height={r.h} pathLength={1} className={s.wall} />
                  <text x={r.x + r.w / 2} y={r.y + r.h / 2} className={s.label}>{r.label}</text>
                </g>
              );
            })}
            <rect x="0" y="0" width="600" height="380" pathLength={1} className={s.outer} />
            <path d="M420 380a50 50 0 0 1 50 -50" className={s.door} />
            <path d="M200 230a40 40 0 0 0 40 40" className={s.door} />
          </svg>
          <figcaption>Przykładowy układ. Zaznacz pomieszczenia na planie albo poniżej.</figcaption>
          <div className={s.chips} role="group" aria-label="Pomieszczenia do wykończenia">
            {ROOMS.map((r) => (
              <button key={r.key} type="button" aria-pressed={picked.includes(r.key)} onClick={() => toggle(r.key)}>{r.label}</button>
            ))}
          </div>
        </figure>
      </section>

      <section className={s.quote}>
        <div className={s.scope}>
          <h2 className={`${s.h2} ${serif.className}`}>Twój zakres</h2>
          {rooms.length === 0 ? (
            <p className={s.empty}>Na razie pusto. Wybierz pomieszczenia na planie albo opisz zakres w formularzu.</p>
          ) : (
            <ul className={s.tapes} aria-live="polite">
              {rooms.map((r) => (
                <li key={r.key}><b>{r.label}</b><span>{r.works.join(' · ')}</span></li>
              ))}
            </ul>
          )}
          <p className={s.note}>Prace przy pomieszczeniach są przykładowe. Dokładny zakres ustalimy przy pomiarze.</p>
        </div>

        <form ref={formRef} onSubmit={submit} noValidate className={s.form}>
          <h2 className={`${s.formTitle} ${serif.className}`} aria-live="polite">
            {rooms.length ? <>Wycena: <em>{rooms.map((r) => r.label.toLocaleLowerCase('pl')).join(', ')}</em></> : 'Opowiedz o swoim wnętrzu'}
          </h2>
          {sent ? (
            <p role="status" className={s.sent}>
              <strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie zapytanie trafi prosto do firmy, razem z zaznaczonym zakresem.
            </p>
          ) : (
            <div className={s.fields}>
              <label className={s.field}><span>Metraż, około</span><span className={s.unit}><input name="metraz" inputMode="numeric" placeholder="np. 54" /><i>m²</i></span></label>
              <label className={s.field}><span>Miejscowość</span><input name="miejscowosc" autoComplete="address-level2" placeholder={city ? `np. ${city}` : undefined} /></label>
              <Choice name="stan" legend="Stan wnętrza" options={STATES} />
              <Choice name="kiedy" legend="Kiedy chcesz zacząć?" options={TIMES} />
              <label className={s.field}><span>Imię</span><input name="imie" autoComplete="given-name" /></label>
              <label className={`${s.field} ${phoneError ? s.bad : ''}`}>
                <span>Telefon</span>
                <input name="telefon" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={phoneError} aria-describedby={phoneError ? 'fin-tel-err' : undefined} onChange={() => setPhoneError(false)} />
                {phoneError && <em id="fin-tel-err" role="alert">Podaj numer, żebyśmy mogli umówić pomiar.</em>}
              </label>
              <label className={`${s.field} ${s.wide}`}><span>Co jeszcze warto wiedzieć? (opcjonalnie)</span><textarea name="opis" rows={3} placeholder="Np. mieszkanie z rynku wtórnego, chcemy zachować drzwi." /></label>
              <button type="submit" className={s.send}>Poproś o wycenę</button>
            </div>
          )}
        </form>
      </section>

      <section className={s.materials}>
        <ul aria-hidden="true">
          {MATERIALS.map((m) => <li key={m.key}><i className={s[`sw_${m.key}`]} /><span>{m.label}</span></li>)}
        </ul>
        <p className={serif.className}>Materiały i ich standard ustalamy w kosztorysie, <em>zanim zaczniemy.</em></p>
      </section>

      <section className={s.how}>
        <h2 className={`${s.h2} ${serif.className}`}>Jak pracujemy</h2>
        <ol className={`${s.gantt} ${drawn ? s.ganttLive : ''}`}>
          {SCHEDULE.map(([t, d], i) => (
            <li key={t} style={{ ['--i' as string]: i }}>
              <span className={s.step}>0{i + 1}</span>
              <div className={s.bar}><b>{t}</b></div>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.prep}>
        <h2 className={`${s.h2} ${serif.className}`}>Przed pomiarem przydadzą się</h2>
        <ul>{PREPARE.map((p) => <li key={p}>{p}</li>)}</ul>
      </section>

      <footer className={s.foot}>
        <p>{company.legal_name}{company.krs ? `, KRS ${company.krs}` : ''}{city ? `. ${city}` : ''}</p>
      </footer>

      <div className={s.thumb}>
        <span>Tu Twój numer</span>
        <button type="button" className={serif.className} onClick={toForm}>Wycena</button>
      </div>
    </div>
  );
}
