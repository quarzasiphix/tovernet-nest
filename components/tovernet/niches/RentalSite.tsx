'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Overpass, Overpass_Mono } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { nameScale } from '@/lib/tovernet/niches/business';
import { BOARD_NOTE, STEPS_NOTE, TERMS_NOTE, rentalContent, type VehicleShape } from '@/lib/tovernet/niches/rental';
import s from './rental.module.css';

const sans = Overpass({ subsets: ['latin', 'latin-ext'], weight: ['400', '600', '800'], display: 'swap' });
const mono = Overpass_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '600'], display: 'swap' });

// Vehicle rental concept. The hero is a road-sign panel holding a hire planner: rows are vehicle
// classes, columns are days, and one bar marks both. The bar drives out to the return day. It holds
// no availability data, so the page says plainly that this is an enquiry. The form sends nothing.

type Company = PublicDemo['config']['company'];
type Sel = { row: number | null; start: number | null; end: number | null; open: boolean };

const DAYS = 28;
const WD = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
const MONTH = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
const MONTH_OF = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];

const dayAt = (origin: Date, i: number) => new Date(origin.getFullYear(), origin.getMonth(), origin.getDate() + 1 + i);
const longDay = (d: Date) => `${WD[d.getDay()]}, ${d.getDate()} ${MONTH_OF[d.getMonth()]}`;

/** "1 doba", "3 doby", "12 dób", "22 doby". */
function doby(n: number): string {
  if (n === 1) return '1 doba';
  const t = n % 10;
  const h = n % 100;
  return `${n} ${t >= 2 && t <= 4 && !(h >= 12 && h <= 14) ? 'doby' : 'dób'}`;
}

// Side profiles on one scale: 10 units are one metre, ground at y=40, front faces right.
const arch = (x: number) => `H${x + 4} A4 4 0 0 0 ${x - 4} 35.5`;
const CARS: Partial<Record<VehicleShape, { w: number; d: string; wheels: number[] }>> = {
  city: { w: 40, d: `M2 35.5V29.5Q2 26.5 5 26L8 25H21L28 30L34 31Q38 32 38 34V35.5${arch(30)}${arch(10)}H2ZM8.5 27H20.2L25 30.8H7.5Z`, wheels: [10, 30] },
  compact: { w: 47, d: `M2 35.5V30Q2 27 5 26L9 24.5H25L33 30L41 31Q45 32 45 34V35.5${arch(36)}${arch(11)}H2ZM10 26.5H24L29.5 30.6H8.5Z`, wheels: [11, 36] },
  estate: { w: 51, d: `M2 35.5V28Q2 25.5 4.5 25L8 24H29L37 30L45 31Q49 32 49 34V35.5${arch(40)}${arch(11)}H2ZM5.5 26.2H28L33 30.5H4.5Z`, wheels: [11, 40] },
  minibus: { w: 55, d: `M2 35.5V22Q2 20 4 20H36Q39 20 41 22L46 28Q51 29 53 31V35.5${arch(43)}${arch(12)}H2ZM5 23H37L42 29H5Z`, wheels: [12, 43] },
  van: { w: 64, d: `M2 35.5V16Q2 14 4 14H48Q51 14 53 17L57 26Q62 27 62 31V35.5${arch(52)}${arch(13)}H2ZM48 18H51L54.5 26H48Z`, wheels: [13, 52] },
};
const cab = (x: number, top: number) => `M${x} 34V${top + 2}Q${x} ${top} ${x + 2} ${top}H${x + 9}Q${x + 11} ${top} ${x + 12} ${top + 2}L${x + 15} 23Q${x + 16.5} 24 ${x + 16.5} 27V34ZM${x + 7} ${top + 3}H${x + 10.3}L${x + 13} 23H${x + 7}Z`;
const slits = (from: number, to: number) => {
  let d = '';
  for (let x = from; x < to; x += 6) d += `M${x} 13H${x + 1}V31H${x}Z`;
  return d;
};
const TRUCKS: Partial<Record<VehicleShape, { w: number; body: string; d: string; wheels: number[] }>> = {
  box: { w: 70, body: 'M2 10H50V33H2Z', d: cab(52, 13), wheels: [14, 58] },
  curtain: { w: 84, body: `M2 7H64V33H2ZM5 7${slits(8, 62)}`, d: cab(66, 11), wheels: [16, 72] },
  reefer: { w: 100, body: 'M2 5H78V33H2ZM6 18H74V18.8H6ZM78 7H81.2V22H78Z', d: cab(82, 10), wheels: [18, 28, 88] },
  tipper: { w: 80, body: 'M2 17H60L55 33H4Z', d: cab(62, 11), wheels: [14, 26, 68] },
  semi: { w: 168, body: 'M2 5H130V31H2ZM34 31H128V33.5H34Z', d: cab(146, 4) + 'M133 33H148V34H133Z', wheels: [10, 21, 32, 150, 139] },
};
const widthOf = (shape: VehicleShape) => (CARS[shape] ?? TRUCKS[shape])!.w;

function Vehicle({ shape, className, style }: { shape: VehicleShape; className?: string; style?: React.CSSProperties }) {
  const car = CARS[shape];
  const truck = TRUCKS[shape];
  const r = car ? 3.2 : 4.5;
  const cy = car ? 36.8 : 35.5;
  const w = widthOf(shape);
  return (
    <svg className={className} style={style} viewBox={`0 0 ${w} 42`} fill="currentColor" aria-hidden="true">
      {truck && <path d={truck.body} fillRule="evenodd" />}
      <path d={car?.d ?? truck!.d} fillRule="evenodd" />
      {(car?.wheels ?? truck!.wheels).map((x) => (
        <path key={x} fillRule="evenodd" d={`M${x - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0ZM${x - 1.3} ${cy}a1.3 1.3 0 1 0 2.6 0a1.3 1.3 0 1 0 -2.6 0Z`} />
      ))}
    </svg>
  );
}

export default function RentalSite({
  company, variant, embedded = false, preview = false,
}: { company: Company; variant: string; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const c = rentalContent(variant);
  const name = presentName(company.display_name);
  const city = presentCity(company.city);

  // Dates come from the visitor's clock after mount, so static HTML and hydration match.
  const [origin, setOrigin] = useState<Date | null>(null);
  const [sel, setSel] = useState<Sel>(preview ? { row: 1, start: 3, end: 7, open: false } : { row: null, start: null, end: null, open: false });
  const [hover, setHover] = useState<number | null>(null);
  const [extra, setExtra] = useState(c.extra.options[0]);
  const [reach, setReach] = useState('');
  const [error, setError] = useState<'dates' | 'contact' | null>(null);
  const [sent, setSent] = useState(false);
  // Vehicles are visible until JavaScript arms the roll-in, so the page reads without it.
  const [armed, setArmed] = useState(false);

  const board = useRef<HTMLDivElement>(null);
  const fleet = useRef<HTMLUListElement>(null);

  useEffect(() => setOrigin(new Date()), []);

  // Scoped observer only: the concept also renders embedded and in a scaled miniature.
  useEffect(() => {
    if (preview || typeof IntersectionObserver === 'undefined' || !fleet.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setArmed(true);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setArmed(false); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(fleet.current);
    return () => io.disconnect();
  }, [preview]);

  // A button, not a #hash link: the offer page keeps the demo id in the fragment.
  const toBoard = () => {
    const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    board.current?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };

  const pickRow = (row: number) => { setSel((v) => ({ ...v, row })); setSent(false); setError(null); };

  const pickDay = (row: number, day: number) => {
    setSent(false);
    setError(null);
    setSel((v) => {
      if (v.start !== null && v.open && v.row === row && day >= v.start) return { row, start: v.start, end: day, open: false };
      // A finished bar moves to another class when the tapped day is inside it.
      if (v.start !== null && v.end !== null && !v.open && v.row !== row && day >= v.start && day <= v.end) return { ...v, row };
      return { row, start: day, end: null, open: true };
    });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sel.row === null || sel.start === null || sel.end === null) { setError('dates'); return; }
    const v = reach.trim();
    if (!/^\S+@\S+\.\S+$/.test(v) && v.replace(/\D/g, '').length < 9) { setError('contact'); return; }
    setError(null);
    setSent(true);
  };

  const days = origin ? Array.from({ length: DAYS }, (_, i) => dayAt(origin, i)) : null;
  const barEnd = sel.end ?? sel.start;
  const ghostEnd = sel.open && sel.start !== null && hover !== null && hover >= sel.start ? hover : null;
  const fleetMax = Math.max(...c.classes.map((x) => widthOf(x.shape)));
  const pickedClass = sel.row !== null ? c.classes[sel.row] : null;

  return (
    <div lang="pl" className={`${s.site} ${sans.className}`} data-preview={preview || undefined}>
      <header className={s.mast}>
        <span className={s.mastName}>{name}</span>
        <span className={`${s.slot} ${s.mastSlot}`}>Tu telefon i e-mail</span>
        <button type="button" className={s.mastGo} onClick={toBoard}>Zapytaj o termin</button>
      </header>

      <section className={s.sign}>
        <div className={s.panel}>
          <div className={s.head}>
            <div>
              <p className={`${s.kicker} ${mono.className}`}>{c.kicker}{city ? ` · ${city}` : ''}</p>
              <Title className={s.name} data-scale={nameScale(name)}>{name}</Title>
            </div>
            <p className={s.lead}>{c.lead}</p>
          </div>

          <div ref={board} className={s.boardWrap}>
            <div className={s.boardHead}>
              <h2 className={s.boardTitle}>{c.boardTitle}</h2>
              <p className={`${s.how} ${mono.className}`}>W wierszu wybranego rodzaju pojazdu wskaż dzień odbioru, potem dzień zwrotu.</p>
            </div>

            <div className={s.scroller} tabIndex={0} aria-label={c.boardTitle} role="group">
              <div className={s.grid}>
                <div className={`${s.dayRow} ${mono.className}`} aria-hidden="true">
                  <span className={s.corner} />
                  <div className={s.track}>
                    {Array.from({ length: DAYS }, (_, i) => {
                      const d = days?.[i];
                      const weekend = d ? d.getDay() === 0 || d.getDay() === 6 : false;
                      const first = d ? i === 0 || d.getDate() === 1 : false;
                      return (
                        <span key={i} className={`${s.day} ${weekend ? s.weekend : ''}`}>
                          {first && d && <em>{MONTH[d.getMonth()]}</em>}
                          <i>{d ? WD[d.getDay()] : ' '}</i>
                          <b>{d ? d.getDate() : ' '}</b>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {c.classes.map((v, r) => {
                  const here = sel.row === r;
                  return (
                    <div key={v.name} className={`${s.row} ${here ? s.rowOn : ''}`}>
                      <button type="button" className={`${s.rowHead} ${sans.className}`} aria-pressed={here} onClick={() => pickRow(r)}>
                        <span className={s.rowName}>{v.name}</span>
                        <Vehicle shape={v.shape} className={s.rowCar} style={{ width: `${(widthOf(v.shape) / fleetMax) * 84}px` }} />
                      </button>
                      <div className={s.track} onMouseLeave={() => setHover(null)}>
                        {Array.from({ length: DAYS }, (_, i) => {
                          const d = days?.[i];
                          const weekend = d ? d.getDay() === 0 || d.getDay() === 6 : false;
                          const ghost = here && ghostEnd !== null && sel.start !== null && i > sel.start && i <= ghostEnd;
                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={!d}
                              className={`${s.cell} ${weekend ? s.weekend : ''} ${ghost ? s.ghost : ''}`}
                              aria-label={d ? `${v.name}: ${longDay(d)}` : undefined}
                              aria-pressed={here && sel.start !== null && barEnd !== null && i >= sel.start && i <= barEnd}
                              onMouseEnter={() => setHover(i)}
                              onClick={() => pickDay(r, i)}
                            />
                          );
                        })}
                        {here && sel.start !== null && barEnd !== null && (
                          <span
                            key={`${sel.start}-${barEnd}-${sel.open}`}
                            className={s.bar}
                            style={{ left: `${(sel.start / DAYS) * 100}%`, width: `${((barEnd - sel.start + 1) / DAYS) * 100}%` }}
                          >
                            <span className={`${s.drive} ${sel.open ? s.parked : ''}`}>
                              <Vehicle shape={v.shape} className={s.barCar} />
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className={`${s.swipe} ${mono.className}`}>Przesuń tablicę, żeby zobaczyć kolejne dni.</p>
            <p className={`${s.boardNote} ${mono.className}`}>{BOARD_NOTE}</p>
          </div>

          <form className={s.form} onSubmit={submit} noValidate>
            <dl className={s.summary} aria-live="polite">
              <div><dt className={mono.className}>{c.rowLabel}</dt><dd>{pickedClass?.name ?? 'Nie wybrano'}</dd></div>
              <div><dt className={mono.className}>Odbiór</dt><dd>{days && sel.start !== null ? longDay(days[sel.start]) : 'Wskaż na tablicy'}</dd></div>
              <div><dt className={mono.className}>Zwrot</dt><dd>{days && sel.end !== null ? longDay(days[sel.end]) : sel.open ? 'Teraz wskaż dzień zwrotu' : 'Wskaż na tablicy'}</dd></div>
              <div><dt className={mono.className}>Razem</dt><dd>{sel.start !== null && sel.end !== null ? (sel.end === sel.start ? 'W tym samym dniu' : doby(sel.end - sel.start)) : '–'}</dd></div>
            </dl>
            <div className={s.fields}>
              <label className={s.field}><span>Miejsce odbioru</span><input autoComplete="address-level2" placeholder="Np. miasto lub adres" /></label>
              <fieldset className={s.radios}>
                <legend>{c.extra.label}</legend>
                <div>
                  {c.extra.options.map((o) => (
                    <label key={o}>
                      <input type="radio" name={`${uid}-x`} checked={extra === o} onChange={() => setExtra(o)} />
                      <span>{o}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className={`${s.field} ${s.wide}`}><span>Kilka słów</span><textarea rows={2} placeholder={c.placeholder} /></label>
              <label className={`${s.field} ${s.wide} ${error === 'contact' ? s.bad : ''}`}>
                <span>E-mail lub telefon</span>
                <input value={reach} autoComplete="email" aria-invalid={error === 'contact'} aria-describedby={error ? `${uid}-e` : undefined} onChange={(e) => { setReach(e.target.value); if (error === 'contact') setError(null); }} />
              </label>
            </div>
            <div className={s.action}>
              {error && <em id={`${uid}-e`} role="alert" className={s.err}>{error === 'dates' ? 'Zaznacz na tablicy dzień odbioru i dzień zwrotu.' : 'Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.'}</em>}
              {sent
                ? <p role="status" className={s.sent}><strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie zapytanie trafi do firmy, a ona odpisze, czy ma wolny pojazd.</p>
                : <button type="submit" className={s.send}>Zapytaj o ten termin<span aria-hidden="true">→</span></button>}
            </div>
          </form>
        </div>
      </section>

      <section className={s.band}>
        <h2 className={s.h2}>{c.fleetTitle}</h2>
        <ul ref={fleet} className={`${s.fleet} ${armed ? s.armed : ''}`} style={{ gridTemplateColumns: c.classes.map((x) => `${widthOf(x.shape)}fr`).join(' ') }}>
          {c.classes.map((v, r) => (
            <li key={v.name} style={{ transitionDelay: `${r * 110}ms`, '--w': widthOf(v.shape) / fleetMax } as React.CSSProperties}>
              <div className={s.stand}><Vehicle shape={v.shape} className={s.fleetCar} /></div>
              <div className={s.plate}>
                <h3>{v.name}</h3>
                <p>{v.use}</p>
                <p className={`${s.slot} ${s.price}`}>Tu cena za dobę</p>
                <button type="button" onClick={() => { pickRow(r); toBoard(); }}>{c.rowCta}</button>
              </div>
            </li>
          ))}
        </ul>
        <p className={`${s.note} ${mono.className}`}>{c.fleetNote}</p>
      </section>

      <section className={`${s.band} ${s.termsBand}`}>
        <div className={s.termsIntro}>
          <h2 className={s.h2}>{c.termsTitle}</h2>
          <p>{c.termsLead}</p>
          <p className={`${s.note} ${mono.className}`}>{TERMS_NOTE}</p>
        </div>
        <dl className={s.terms}>
          {c.terms.map(([t, q, slot]) => (
            <div key={t}>
              <dt><strong>{t}</strong><span>{q}</span></dt>
              <dd className={s.slot}>{slot}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={s.band}>
        <h2 className={s.h2}>{c.stepsTitle}</h2>
        <ol className={s.road}>
          {c.steps.map(([t, d], i) => (
            <li key={t}>
              <span className={`${s.km} ${mono.className}`}>{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <p className={`${s.note} ${mono.className}`}>{STEPS_NOTE}</p>
      </section>

      <section className={`${s.band} ${s.slots}`}>
        {c.slots.map((x) => (
          <div key={x.title}>
            <h2 className={s.h3}>{x.title}</h2>
            <p className={`${s.slot} ${s.slotBlock}`}>{x.text}</p>
          </div>
        ))}
      </section>

      <footer className={`${s.foot} ${mono.className}`}>
        <p>{company.legal_name}{company.krs ? ` · KRS ${company.krs}` : ''}{city ? ` · ${city}` : ''}</p>
        <p className={s.slot}>Tu NIP, adres, regulamin najmu i informacja o przetwarzaniu danych</p>
      </footer>

      {!preview && <div className={s.thumb}><span>Tu Twój telefon</span><button type="button" onClick={toBoard}>Zaznacz termin</button></div>}
    </div>
  );
}
