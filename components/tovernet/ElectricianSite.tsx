'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { BUILDINGS, CIRCUITS, FORM_COPY, PREPARE, SAFETY, STEPS, type Circuit } from '@/lib/tovernet/electrician';
import s from './electrician.module.css';

const head = Barlow_Condensed({ subsets: ['latin', 'latin-ext'], weight: ['600', '700'], display: 'swap' });
const body = Barlow({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], display: 'swap' });

// Flagship electrician concept. The page is a distribution board: the visitor flips the
// circuit that matches their problem, and a wire runs to a form set up for that problem.
// Company facts come from `company`; everything else is template copy. The form never
// sends anything: it is a concept, and its confirmation says so.

/** Position inside `root` from offset*, so it stays correct in the scaled panel miniature. */
function offsetIn(el: HTMLElement, root: HTMLElement) {
  let x = 0, y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function Choice({ name, legend, options }: { name: string; legend: string; options: string[] }) {
  return (
    <fieldset className={s.choice}>
      <legend>{legend}</legend>
      <div>{options.map((o) => <label key={o}><input type="radio" name={name} value={o} /><span>{o}</span></label>)}</div>
    </fieldset>
  );
}

export default function ElectricianSite({ company, embedded = false, preview = false }: { company: PublicDemo['config']['company']; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const name = presentName(company.display_name);
  const city = presentCity(company.city);

  const [selected, setSelected] = useState<string | null>(preview ? 'bezpiecznik' : null);
  const [wire, setWire] = useState<string | null>(null);
  const [lit, setLit] = useState(preview);
  const [drawn, setDrawn] = useState(preview);
  const [woken, setWoken] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [sent, setSent] = useState(false);

  const circuitRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lampRef = useRef<HTMLSpanElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const breakers = useRef<Record<string, HTMLButtonElement | null>>({});
  const [stepsLive, setStepsLive] = useState(preview);

  const circuit: Circuit | null = CIRCUITS.find((c) => c.key === selected) ?? null;
  const copy = FORM_COPY[circuit?.group ?? 'none'];

  const route = useCallback(() => {
    const root = circuitRef.current;
    const from = selected ? breakers.current[selected] : null;
    const lamp = lampRef.current;
    if (!root || !from || !lamp) { setWire(null); return; }
    const a = offsetIn(from, root);
    const b = offsetIn(lamp, root);
    const bx = a.x + a.w / 2;
    const by = a.y + a.h;
    const lx = b.x + b.w / 2;
    const ly = b.y;
    // Down out of the module, along the trunking at the board's edge, then into the lamp.
    setWire(`M${bx} ${by}V${by + 7}H9V${ly - 16}H${lx}V${ly}`);
  }, [selected]);

  useEffect(() => {
    route();
    const root = circuitRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(route);
    ro.observe(root);
    return () => ro.disconnect();
  }, [route]);

  // Once on arrival the levers twitch in turn: this board can be touched.
  useEffect(() => {
    const root = circuitRef.current;
    const steps = stepsRef.current;
    if (preview || typeof IntersectionObserver === 'undefined') { setStepsLive(true); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (e.target === root) setWoken(true);
        if (e.target === steps) setStepsLive(true);
        io.unobserve(e.target);
      }
    }, { threshold: 0.35 });
    if (root) io.observe(root);
    if (steps) io.observe(steps);
    return () => io.disconnect();
  }, [preview]);

  const flip = (key: string, moveToForm: boolean) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const off = key === selected;
    setSent(false);
    setLit(false);
    setDrawn(false);
    setSelected(off ? null : key);
    if (off) return;
    // Two frames: the new path must be in the DOM undrawn before it can transition.
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    window.setTimeout(() => setLit(true), reduced ? 0 : 620);
    if (moveToForm) {
      formRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    } else if (formRef.current) {
      const r = formRef.current.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.72) window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }), reduced ? 0 : 520);
    }
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phone = String(new FormData(e.currentTarget).get('telefon') ?? '').replace(/\D/g, '');
    if (phone.length < 9) { setPhoneError(true); return; }
    setPhoneError(false);
    setSent(true);
  };

  const groups: { key: 'pilne' | 'planowane'; label: string }[] = [
    { key: 'pilne', label: 'Pilne' },
    { key: 'planowane', label: 'Planowane' },
  ];

  return (
    <div lang="pl" className={`${s.site} ${body.className}`}>
      <header className={s.top}>
        <span className={s.name}>{name}</span>
        <span className={s.slot}>Tu Twój numer telefonu</span>
      </header>

      <section className={s.hero}>
        <Title className={`${s.h1} ${head.className}`}>Elektryk.</Title>
        <div className={s.heroSide}>
          {city && <p className={`${s.area} ${head.className}`}>{city} i okolice</p>}
          <p className={s.lead}>Usterka albo planowany remont. Przełącz to, co pasuje, i zostaw numer. Oddzwonimy z terminem.</p>
        </div>
      </section>

      <div ref={circuitRef} className={s.circuit}>
        {wire && (
          <svg className={s.wire} aria-hidden="true" width="100%" height="100%">
            <path d={wire} pathLength={1} className={`${s.wireL} ${drawn ? s.drawn : ''}`} />
            <path d={wire} pathLength={1} className={`${s.wireN} ${drawn ? s.drawn : ''}`} />
          </svg>
        )}

        <div className={`${s.board} ${woken ? s.woken : ''}`} role="group" aria-label="Co się dzieje? Wybierz obwód">
          {groups.map((g) => (
            <div key={g.key} className={`${s.group} ${g.key === 'pilne' ? s.urgent : s.planned}`}>
              <p className={`${s.groupName} ${head.className}`}>{g.label}</p>
              <div className={s.rail}>
                {CIRCUITS.filter((c) => c.group === g.key).map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    ref={(el) => { breakers.current[c.key] = el; }}
                    aria-pressed={selected === c.key}
                    onClick={() => flip(c.key, false)}
                    className={`${s.module} ${selected === c.key ? s.on : ''}`}
                  >
                    <span className={s.window} aria-hidden="true" />
                    <span className={s.track} aria-hidden="true"><span className={s.lever} /></span>
                    <span className={s.moduleLabel}>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form id="kontakt" ref={formRef} onSubmit={submit} noValidate className={`${s.form} ${lit ? s.live : ''}`}>
          <div className={s.formHead}>
            <span ref={lampRef} className={s.lamp} aria-hidden="true" />
            <div>
              <h2 className={`${s.formTitle} ${head.className}`} aria-live="polite">{circuit?.label ?? 'Co się dzieje?'}</h2>
              <p className={s.formSub}>{copy.sub}</p>
            </div>
          </div>

          {circuit?.key === 'iskrzy' && <p className={s.safety}>{SAFETY}</p>}

          {sent ? (
            <p role="status" className={s.sent}>
              <strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie zgłoszenie trafi prosto do firmy, razem z wybranym obwodem.
            </p>
          ) : (
            <div className={s.fields}>
              <Choice name="budynek" legend="Gdzie?" options={BUILDINGS} />
              <Choice key={copy.timeLabel} name="termin" legend={copy.timeLabel} options={copy.times} />
              <label className={s.field}><span>Dzielnica lub miejscowość</span><input name="okolica" autoComplete="address-level2" /></label>
              <label className={s.field}><span>Imię</span><input name="imie" autoComplete="given-name" /></label>
              <label className={`${s.field} ${phoneError ? s.bad : ''}`}>
                <span>Telefon</span>
                <input name="telefon" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={phoneError} aria-describedby={phoneError ? 'tel-err' : undefined} onChange={() => setPhoneError(false)} />
                {phoneError && <em id="tel-err" role="alert">Podaj numer, żebyśmy mogli oddzwonić.</em>}
              </label>
              <label className={`${s.field} ${s.wide}`}><span>Co jeszcze warto wiedzieć? (opcjonalnie)</span><textarea name="opis" rows={3} placeholder={circuit?.placeholder ?? 'Np. nie działają gniazdka w kuchni.'} /></label>
              <button type="submit" className={`${s.send} ${head.className}`}>{copy.cta}</button>
            </div>
          )}
        </form>
      </div>

      <section className={s.legend}>
        <div className={s.legendHead}>
          <h2 className={`${s.h2} ${head.className}`}>Opis obwodów</h2>
          <p>Przykładowe usługi, do potwierdzenia przez firmę</p>
        </div>
        <ul>
          {CIRCUITS.map((c, i) => (
            <li key={c.key}>
              <span className={s.fn}>F{i + 1}</span>
              <div><h3 className={head.className}>{c.label}</h3><p>{c.text}</p></div>
              <button type="button" onClick={() => flip(c.key, true)}>{c.group === 'pilne' ? 'Zgłoś' : 'Wycena'}</button>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.plan}>
        <div>
          <h2 className={`${s.h2} ${head.className}`}>Planujesz remont albo budowę?</h2>
          <p>Elektryk wchodzi, zanim zamkną się ściany. Im wcześniej porozmawiamy, tym mniej przeróbek.</p>
          <button type="button" className={head.className} onClick={() => flip('wymiana', true)}>Poproś o wycenę</button>
        </div>
        <div>
          <h3 className={head.className}>Do wyceny przydadzą się</h3>
          <ul>{PREPARE.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </section>

      <section className={s.how}>
        <h2 className={`${s.h2} ${head.className}`}>Jak to idzie</h2>
        <ol ref={stepsRef} className={stepsLive ? s.stepsLive : ''}>
          {STEPS.map(([t, d]) => <li key={t}><h3 className={head.className}>{t}</h3><p>{d}</p></li>)}
        </ol>
      </section>

      <footer className={s.foot}>
        <p className={s.legal}>{company.legal_name}{company.krs ? `, KRS ${company.krs}` : ''}{city ? `. ${city}` : ''}</p>
        <p className={s.slotDark}>Tu numer uprawnień, jeśli go podasz</p>
      </footer>

      <div className={s.thumb}>
        <span>Tu Twój numer</span>
        <button type="button" className={head.className} onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Opisz sprawę</button>
      </div>
    </div>
  );
}
