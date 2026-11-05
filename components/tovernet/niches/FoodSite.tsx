'use client';

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { Courier_Prime, Figtree, Fraunces } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import {
  CATERING, CATERING_PREPARE, CATERING_STEPS, DAYS, PROPOSAL, VENUE, WHEN, foodVariant,
  type Course,
} from '@/lib/tovernet/niches/food';
import s from './food.module.css';

const serif = Fraunces({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], axes: ['opsz', 'SOFT'], display: 'swap' });
const sans = Figtree({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });
const mono = Courier_Prime({ subsets: ['latin', 'latin-ext'], weight: ['400', '700'], display: 'swap' });

// Food service concept (PKD 56). Two structures in one material language:
//  - restaurant and cafe: the page is the venue's menu card. Leader dots run from each
//    example dish to an empty price slot, today's row of the opening hours is marked,
//    and the table request sets plates on a drawn table as the guest count grows.
//  - catering: the page is a kitchen order ticket. Every answer the organiser gives is
//    printed onto the ticket, which hangs on the pass rail beside the form.
// Company facts come from `company`; everything else is labelled template copy or an
// empty slot. Forms never send anything: they are a concept, and they say so.

type Company = PublicDemo['config']['company'];

const isReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scrollTo(el: HTMLElement | null) {
  el?.scrollIntoView({ behavior: isReduced() ? 'auto' : 'smooth', block: 'start' });
}

/** `live` once the element is a third in view. Hidden start states apply only while
 *  `armed`, so the content is visible without JavaScript and before any animation runs. */
function useLive<T extends Element>(preview: boolean) {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(preview);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (live) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined' || isReduced()) { setLive(true); return; }
    setArmed(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [live]);
  return [ref, !live && armed ? s.armed : ''] as const;
}

/** Monday-first index of today, known only after mount so static HTML stays neutral. */
function useToday() {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => { setToday((new Date().getDay() + 6) % 7); }, []);
  return today;
}

function nameSize(name: string) {
  return name.length > 34 ? s.nameLong : name.length > 20 ? s.nameMid : '';
}

function Chips({ name, legend, options, value, onChange, multi = false }: {
  name: string; legend: string; options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean;
}) {
  return (
    <fieldset className={s.chips}>
      <legend>{legend}</legend>
      <div>
        {options.map((o) => (
          <label key={o}>
            <input
              type={multi ? 'checkbox' : 'radio'}
              name={name}
              value={o}
              checked={value.includes(o)}
              onChange={() => onChange(multi ? (value.includes(o) ? value.filter((x) => x !== o) : [...value, o]) : [o])}
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Top({ name }: { name: string }) {
  return (
    <header className={s.top}>
      <span className={`${s.topName} ${serif.className}`}>{name}</span>
      <span className={s.slot}>Tu Twój numer telefonu</span>
    </header>
  );
}

function Foot({ company, city, note }: { company: Company; city: string | null; note: string }) {
  return (
    <footer className={s.foot}>
      <p className={s.legal}>{company.legal_name}{company.krs ? `, KRS ${company.krs}` : ''}{city ? `. ${city}` : ''}</p>
      <p className={s.footNote}>{note}</p>
    </footer>
  );
}

function Thumb({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className={s.thumb}>
      <span>Tu Twój numer</span>
      <button type="button" className={serif.className} onClick={onClick}>{label}</button>
    </div>
  );
}

function PhoneField({ error, clear }: { error: boolean; clear: () => void }) {
  return (
    <label className={`${s.field} ${error ? s.bad : ''}`}>
      <span>Telefon</span>
      <input name="telefon" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={error} aria-describedby={error ? 'food-tel-err' : undefined} onChange={clear} />
      {error && <em id="food-tel-err" role="alert">Podaj numer, żebyśmy mogli oddzwonić.</em>}
    </label>
  );
}

function phoneOk(form: HTMLFormElement) {
  return String(new FormData(form).get('telefon') ?? '').replace(/\D/g, '').length >= 9;
}

/** One course of a menu card. Leader dots draw from the dish to its empty price slot. */
function CourseBlock({ course, index, preview }: { course: Course; index: number; preview: boolean }) {
  const [ref, state] = useLive<HTMLElement>(preview);
  return (
    <section ref={ref} className={`${s.course} ${state}`}>
      <h3 className={`${s.courseTitle} ${serif.className}`}><span>{['I', 'II', 'III', 'IV', 'V'][index]}</span>{course.title}</h3>
      <ul>
        {course.dishes.map((d, i) => (
          <li key={d.name} style={{ '--i': i } as CSSProperties}>
            <p className={s.dishLine}>
              <span className={`${s.dish} ${serif.className}`}>{d.name}</span>
              {d.veg && <abbr className={`${s.veg} ${sans.className}`} title="danie wegetariańskie">wege</abbr>}
              <span className={s.leader} aria-hidden="true" />
              <span className={s.price} aria-label="cena do uzupełnienia">— zł</span>
            </p>
            {d.note && <p className={s.dishNote}>{d.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Top view of a table. Up to 8 guests sit round it; more turns it into a long table. */
function TableView({ guests }: { guests: number }) {
  const n = Math.max(1, Math.min(guests, 20));
  const round = n <= 8;
  const plates: { x: number; y: number }[] = [];
  if (round) {
    for (let i = 0; i < n; i++) {
      const a = (-90 + (i * 360) / n) * (Math.PI / 180);
      plates.push({ x: 120 + Math.cos(a) * 68, y: 100 + Math.sin(a) * 68 });
    }
  } else {
    const top = Math.ceil(n / 2), bottom = n - top;
    for (let i = 0; i < top; i++) plates.push({ x: 30 + ((i + 0.5) * 180) / top, y: 62 });
    for (let i = 0; i < bottom; i++) plates.push({ x: 30 + ((i + 0.5) * 180) / bottom, y: 138 });
  }
  return (
    <svg className={s.tableSvg} viewBox="0 0 240 200" aria-hidden="true">
      {round
        ? <circle cx="120" cy="100" r="50" className={s.tableTop} />
        : <rect x="22" y="80" width="196" height="40" rx="3" className={s.tableTop} />}
      {plates.map((p, i) => (
        <g key={`${round ? 'r' : 'l'}${n > 8 ? n : ''}-${i}`} className={s.plate} style={{ '--i': round ? 0 : i * 0.25 } as CSSProperties}>
          <circle cx={p.x} cy={p.y} r="13" />
          <circle cx={p.x} cy={p.y} r="8.5" className={s.plateIn} />
        </g>
      ))}
    </svg>
  );
}

function genitive(n: number) { return n === 1 ? 'osoby' : 'osób'; }

function Venue({ company, v, embedded, preview }: { company: Company; v: 'food_restaurant' | 'food_cafe'; embedded: boolean; preview: boolean }) {
  const copy = VENUE[v];
  const Title = embedded ? 'p' : 'h1';
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const today = useToday();

  const [guests, setGuests] = useState(preview ? 4 : 2);
  const [when, setWhen] = useState('Dziś');
  const [time, setTime] = useState(preview ? '19:00' : '');
  const [phoneError, setPhoneError] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const whenText = when === 'Inny dzień' ? 'w wybrany dzień' : when.toLocaleLowerCase('pl');
  const summary = `${v === 'food_cafe' ? 'Miejsce' : 'Stolik'} dla ${guests} ${genitive(guests)}, ${whenText}${time ? `, ok. ${time}` : ''}`;

  const setCount = (n: number) => { setSent(false); setGuests(Math.max(1, Math.min(20, n))); };
  const book = (n?: number) => { if (n) setCount(n); scrollTo(formRef.current); };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneOk(e.currentTarget)) { setPhoneError(true); return; }
    setPhoneError(false);
    setSent(true);
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: isReduced() ? 'auto' : 'smooth', block: 'nearest' }), 0);
  };

  return (
    <div lang="pl" className={`${s.site} ${v === 'food_cafe' ? s.cafe : ''} ${sans.className}`}>
      <Top name={name} />

      <section className={s.vHero}>
        <div className={s.vHeroMain}>
          <p className={s.kicker}><span>{copy.kind}</span>{city && <span>{city}</span>}</p>
          <Title className={`${s.vName} ${nameSize(name)} ${serif.className}`}>{name}</Title>
          <p className={s.vLead}>{copy.lead}</p>
        </div>

        <aside className={s.today} aria-label="Dziś">
          <p className={`${s.todayDay} ${serif.className}`}>Dziś{today !== null && <em>, {DAYS[today].toLocaleLowerCase('pl')}</em>}</p>
          <p className={s.todayHours}>
            <span>Otwarte</span>
            <span className={s.hoursSlot}>od — do —</span>
          </p>
          <p className={s.slotNote}>Tu godziny otwarcia</p>
          <div className={s.todayActions}>
            <button type="button" className={`${s.btn} ${serif.className}`} onClick={() => book()}>{copy.table.title}</button>
            <button type="button" className={s.btnGhost} onClick={() => scrollTo(menuRef.current)}>{copy.menuCta}</button>
          </div>
        </aside>
      </section>

      <section ref={menuRef} className={s.menuGround} aria-label={copy.menuTitle}>
        <div className={s.sheet}>
          <div className={s.sheetHead}>
            <h2 className={`${s.sheetTitle} ${serif.className}`}>{copy.menuTitle}</h2>
            <p>Przykładowe pozycje, do zastąpienia kartą lokalu</p>
          </div>
          <div className={s.courses}>
            {copy.courses.map((c, i) => <CourseBlock key={c.title} course={c} index={i} preview={preview} />)}
          </div>
          <p className={s.allergens}><span>Alergeny</span><span className={s.slotInline}>Tu informacja o alergenach</span></p>
        </div>
      </section>

      <section className={s.book}>
        <div className={s.bookIntro}>
          <h2 className={`${s.h2} ${serif.className}`}>{copy.table.title}</h2>
          <p>{copy.table.sub}</p>
          <div className={s.tableWrap}>
            <TableView guests={guests} />
            <p className={`${s.summary} ${serif.className}`} aria-live="polite">{summary}</p>
          </div>
        </div>

        <form ref={formRef} onSubmit={submit} noValidate className={s.form}>
          {sent ? (
            <p role="status" className={s.sent}>
              <strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie prośba o rezerwację trafi prosto do lokalu: {summary.charAt(0).toLocaleLowerCase('pl') + summary.slice(1)}.
            </p>
          ) : (
            <div className={s.fields}>
              <Chips name="kiedy" legend="Kiedy?" options={WHEN} value={[when]} onChange={([w]) => { setWhen(w); setSent(false); }} />
              {when === 'Inny dzień' && (
                <label className={s.field}><span>Dzień</span><input name="dzien" type="date" /></label>
              )}
              <label className={s.field}>
                <span>Godzina</span>
                <input name="godzina" type="time" step={900} value={time} onChange={(e) => setTime(e.target.value)} />
              </label>
              <div className={s.counter} role="group" aria-label="Liczba osób">
                <span className={s.counterLabel}>Ile osób?</span>
                <div>
                  <button type="button" onClick={() => setCount(guests - 1)} disabled={guests <= 1} aria-label="Mniej osób">−</button>
                  <output className={serif.className} aria-live="polite">{guests}</output>
                  <button type="button" onClick={() => setCount(guests + 1)} disabled={guests >= 20} aria-label="Więcej osób">+</button>
                </div>
                <div className={s.counterTable}><TableView guests={guests} /></div>
              </div>
              {guests > 8 && <p className={s.bigNote}>{copy.table.big}</p>}
              <label className={s.field}><span>Imię</span><input name="imie" autoComplete="given-name" /></label>
              <PhoneField error={phoneError} clear={() => setPhoneError(false)} />
              <label className={`${s.field} ${s.wide}`}><span>Uwagi (opcjonalnie)</span><textarea name="uwagi" rows={2} placeholder={copy.table.notePlaceholder} /></label>
              <button type="submit" className={`${s.send} ${serif.className}`}>{copy.table.cta}</button>
            </div>
          )}
        </form>
      </section>

      <section className={s.visit}>
        <div className={s.hours}>
          <h2 className={`${s.h2} ${serif.className}`}>Godziny</h2>
          <table>
            <tbody>
              {DAYS.map((d, i) => (
                <tr key={d} className={today === i ? s.isToday : ''}>
                  <th scope="row">{d}{today === i && <span className={s.todayTag}>dziś</span>}</th>
                  <td><span className={s.hoursSlot}>od — do —</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={s.slotNote}>Tu godziny otwarcia, z wyjątkami na święta</p>
        </div>

        <div className={s.where}>
          <h2 className={`${s.h2} ${serif.className}`}>Dojazd</h2>
          <div className={s.map} aria-hidden="true"><span className={s.pin} /></div>
          <p className={s.address}><span className={s.slotInline}>Tu adres lokalu</span>{city && <span>{city}</span>}</p>
          <p className={s.slotNote}>Tu mapa dojazdu i parking w okolicy</p>
        </div>

        <div className={s.takeaway}>
          <h2 className={`${s.h3} ${serif.className}`}>{copy.takeaway.title}</h2>
          <p>{copy.takeaway.text}</p>
          <p className={s.slotBox}>Tu Twój numer telefonu</p>
          <p className={`${s.slotBox} ${s.optional}`}>Tu link do zamówień online<em>opcjonalnie, jeśli z nich korzystasz</em></p>
        </div>
      </section>

      {copy.groups && (
        <section className={s.groups}>
          <h2 className={`${s.groupsTitle} ${serif.className}`}>{copy.groups.title}</h2>
          <div>
            <p>{copy.groups.text}</p>
            <button type="button" className={serif.className} onClick={() => book(12)}>{copy.groups.cta}</button>
          </div>
        </section>
      )}

      <Foot company={company} city={city} note="Dania na tej stronie to przykłady. Karta, ceny i godziny pochodzą od lokalu." />
      <Thumb label={copy.table.title} onClick={() => book()} />
    </div>
  );
}

function TicketLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <li className={value ? s.printed : ''}>
      <span>{label}</span>
      <span key={String(value ?? '')} className={s.tv}>{value || '..........'}</span>
    </li>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}.${m}.${y}` : '';
}

function Catering({ company, embedded, preview }: { company: Company; embedded: boolean; preview: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const name = presentName(company.display_name);
  const city = presentCity(company.city);

  const [occasion, setOccasion] = useState<string[]>(preview ? ['Spotkanie firmowe'] : []);
  const [date, setDate] = useState('');
  const [dateOpen, setDateOpen] = useState(preview);
  const [guests, setGuests] = useState<number | null>(preview ? 60 : null);
  const [style, setStyle] = useState<string[]>(preview ? ['Bufet'] : []);
  const [place, setPlace] = useState<string[]>(preview ? ['Biuro'] : []);
  const [diets, setDiets] = useState<string[]>(preview ? ['Wegetariańska'] : []);
  const [phoneError, setPhoneError] = useState(false);
  const [sent, setSent] = useState(false);

  const paperRef = useRef<HTMLDivElement>(null);
  const builderRef = useRef<HTMLDivElement>(null);
  const [stepsRef, stepsState] = useLive<HTMLOListElement>(preview);
  // Lines chosen while the ticket is off screen (on a phone it sits below the fields)
  // wait, then print when the ticket comes into view.
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const p = paperRef.current;
    if (preview || !p || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(p);
    return () => io.disconnect();
  }, [preview]);

  // The printer feeds the paper a little every time a line is printed.
  const feed = () => {
    setSent(false);
    const p = paperRef.current;
    if (!p || isReduced() || typeof p.animate !== 'function') return;
    p.animate([{ transform: 'translateY(-7px)' }, { transform: 'translateY(0)' }], { duration: 260, easing: 'steps(4, end)' });
  };
  const pick = <T,>(set: (v: T) => void) => (v: T) => { set(v); feed(); };
  const count = (n: number) => { setGuests(Math.max(5, Math.min(500, n))); feed(); };
  const stepUp = (g: number | null) => (g === null ? 20 : g + (g < 20 ? 1 : 5));
  const stepDown = (g: number | null) => (g === null ? 20 : g - (g <= 20 ? 1 : 5));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneOk(e.currentTarget)) { setPhoneError(true); return; }
    setPhoneError(false);
    setSent(true);
  };

  const choose = (o: string) => { setOccasion([o]); feed(); scrollTo(builderRef.current); };

  const ticket = (
    <div className={s.pass}>
      <span className={s.rail} aria-hidden="true" />
      <div ref={paperRef} className={`${s.ticket} ${mono.className} ${inView ? '' : s.paused}`} aria-label="Podsumowanie zapytania">
        <p className={s.tHead}>Zapytanie o catering</p>
        <p className={s.tName}>{name}</p>
        <p className={s.tRule} aria-hidden="true" />
        <ul className={s.tLines}>
          <TicketLine label="Okazja" value={occasion[0]} />
          <TicketLine label="Data" value={dateOpen ? 'do ustalenia' : formatDate(date)} />
          <TicketLine label="Goście" value={guests ? `${guests} os.` : ''} />
          <TicketLine label="Podanie" value={style[0]} />
          <TicketLine label="Miejsce" value={place[0]} />
          <TicketLine label="Diety" value={diets.join(', ')} />
        </ul>
        <p className={s.tRule} aria-hidden="true" />
        <p className={s.tFoot}>Wycena po rozmowie</p>
        {sent && <span className={`${s.stamp} ${mono.className}`} aria-hidden="true">Podgląd</span>}
      </div>
      <p className={s.passNote}>Tak zapytanie trafi do firmy</p>
    </div>
  );

  return (
    <div lang="pl" className={`${s.site} ${s.catering} ${sans.className}`}>
      <Top name={name} />

      <section className={s.cHero}>
        <p className={s.kicker}><span>{CATERING.kind}</span>{city && <span>{city} i okolice</span>}</p>
        <Title className={`${s.cH1} ${serif.className}`}>{CATERING.h1}</Title>
        <p className={s.cLead}>{CATERING.lead}</p>
      </section>

      <form onSubmit={submit} noValidate className={s.builder}>
        <div ref={builderRef} className={s.bFields}>
          <Chips name="okazja" legend="Okazja" options={CATERING.occasions} value={occasion} onChange={pick(setOccasion)} />
          <div className={s.dateRow}>
            <label className={s.field}>
              <span>Data</span>
              <input name="data" type="date" value={date} disabled={dateOpen} onChange={(e) => { setDate(e.target.value); feed(); }} />
            </label>
            <label className={s.check}><input type="checkbox" checked={dateOpen} onChange={(e) => { setDateOpen(e.target.checked); feed(); }} /><span>Data jeszcze nieustalona</span></label>
          </div>
          <div className={s.guests} role="group" aria-label="Liczba gości">
            <span className={s.counterLabel}>Ilu gości?</span>
            <div className={s.guestsRow}>
              <button type="button" onClick={() => count(stepDown(guests))} disabled={guests !== null && guests <= 5} aria-label="Mniej gości">−</button>
              <output className={serif.className} aria-live="polite">{guests ?? '—'}</output>
              <button type="button" onClick={() => count(stepUp(guests))} disabled={guests !== null && guests >= 500} aria-label="Więcej gości">+</button>
            </div>
            <div className={s.quick}>
              {CATERING.quick.map((q) => (
                <button key={q} type="button" aria-pressed={guests === q} onClick={() => count(q)}>{q === 150 ? '150+' : q}</button>
              ))}
            </div>
          </div>
          <Chips name="podanie" legend="Jak podać?" options={CATERING.styles} value={style} onChange={pick(setStyle)} />
          <Chips name="miejsce" legend="Gdzie?" options={CATERING.places} value={place} onChange={pick(setPlace)} />
          <Chips name="diety" legend="Diety (opcjonalnie)" options={CATERING.diets} value={diets} onChange={pick(setDiets)} multi />
          <p className={s.exampleNote}>Okazje i sposoby podania to przykłady. Firma wpisze swoje.</p>
        </div>

        {ticket}

        <div className={s.bContact}>
          {sent ? (
            <p role="status" className={s.sent}>
              <strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie zapytanie trafi prosto do firmy, razem z tym bonem.
            </p>
          ) : (
            <div className={s.fields}>
              <label className={s.field}><span>Imię</span><input name="imie" autoComplete="given-name" /></label>
              <PhoneField error={phoneError} clear={() => setPhoneError(false)} />
              <label className={`${s.field} ${s.wide}`}><span>E-mail (opcjonalnie)</span><input name="email" type="email" autoComplete="email" /></label>
              <label className={`${s.field} ${s.wide}`}><span>Coś jeszcze? (opcjonalnie)</span><textarea name="opis" rows={2} placeholder={CATERING.notePlaceholder} /></label>
              <button type="submit" className={`${s.send} ${serif.className}`}>{CATERING.cta}</button>
            </div>
          )}
        </div>
      </form>

      <section className={s.proposal}>
        <div className={s.propIntro}>
          <h2 className={`${s.h2} ${serif.className}`}>Najpierw propozycja, potem decyzja</h2>
          <p>Po rozmowie dostajesz menu ułożone pod Twoje wydarzenie i cenę za osobę. Tak może wyglądać.</p>
          <p className={s.slotBox}>Tu zakres usługi: dowóz, obsługa, zastawa, jeśli je oferujesz</p>
        </div>
        <div className={s.propSheet}>
          <p className={s.propTag}>Przykład</p>
          <h3 className={`${s.propTitle} ${serif.className}`}>{PROPOSAL.title}</h3>
          <p className={s.propMeta}>{PROPOSAL.meta}</p>
          {PROPOSAL.courses.map((c) => (
            <div key={c.title} className={s.propCourse}>
              <h4>{c.title}</h4>
              <ul>{c.dishes.map((d) => <li key={d.name} className={serif.className}>{d.name}{d.veg && <abbr className={`${s.veg} ${sans.className}`} title="danie wegetariańskie">wege</abbr>}</li>)}</ul>
            </div>
          ))}
          <p className={s.propPrice}><span>Cena za osobę</span><span className={s.price}>— zł</span></p>
        </div>
      </section>

      <section className={s.occasions}>
        <h2 className={`${s.h3} ${serif.className}`}>Na jaką okazję?</h2>
        <ul>
          {CATERING.occasions.slice(0, 5).map((o) => (
            <li key={o}><button type="button" className={serif.className} onClick={() => choose(o)}>{o}<span aria-hidden="true">→</span></button></li>
          ))}
        </ul>
      </section>

      <section className={s.flow}>
        <h2 className={`${s.h2} ${serif.className}`}>Od zapytania do przyjęcia</h2>
        <ol ref={stepsRef} className={`${s.hooks} ${stepsState}`}>
          {CATERING_STEPS.map(([t, d], i) => (
            <li key={t} style={{ '--i': i } as CSSProperties}>
              <span className={`${s.hookNo} ${mono.className}`}>#{i + 1}</span>
              <h3 className={serif.className}>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <div className={s.prepare}>
          <h3 className={serif.className}>Do zapytania przyda się</h3>
          <ul>{CATERING_PREPARE.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </section>

      <Foot company={company} city={city} note="Menu i okazje na tej stronie to przykłady. Ofertę i ceny ustala firma." />
      <Thumb label="Zapytaj o termin" onClick={() => scrollTo(builderRef.current)} />
    </div>
  );
}

export default function FoodSite({ company, variant, embedded = false, preview = false }: { company: PublicDemo['config']['company']; variant: string; embedded?: boolean; preview?: boolean }) {
  const v = foodVariant(variant);
  if (v === 'food_catering') return <Catering company={company} embedded={embedded} preview={preview} />;
  return <Venue company={company} v={v} embedded={embedded} preview={preview} />;
}
