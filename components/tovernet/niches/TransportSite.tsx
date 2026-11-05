'use client';

import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Archivo, Overpass_Mono } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { liverySize, transportVariant, validContact, type TransportBox, type TransportField } from '@/lib/tovernet/niches/transport';
import s from './transport.module.css';

const sans = Archivo({ subsets: ['latin', 'latin-ext'], axes: ['wdth'], display: 'swap' });
const mono = Overpass_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '600'], display: 'swap' });

// Road transport concept. The hero is the company's vehicle with its name painted on the
// side (illustrative, labelled). The visitor types the route on the road under it, and the
// route carries into a request laid out like a consignment note. A small truck drives down
// the note's margin as each box is filled and reaches unloading when the request is sent.
// The form never sends anything: its confirmation says it is a concept.

/** Position inside `root` from offset*, so it stays correct in the scaled panel miniature. */
function offsetTop(el: HTMLElement, root: HTMLElement) {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) { y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return y;
}

type Route = { skad: string; dokad: string };

export default function TransportSite({ company, variant, embedded = false, preview = false }: { company: PublicDemo['config']['company']; variant: string; embedded?: boolean; preview?: boolean }) {
  const v = transportVariant(variant);
  const Title = embedded ? 'p' : 'h1';
  // presentName lowercases a word that starts with a quote ("MAXTIM becomes "maxtim); fix it here.
  const name = presentName(company.display_name).replace(/(^|\s)(["„'(])([a-ząćęłńóśźż])/g, (_, a: string, b: string, c: string) => a + b + c.toLocaleUpperCase('pl'));
  const city = presentCity(company.city);
  const uid = useId();

  const [route, setRoute] = useState<Route>({ skad: '', dokad: '' });
  const [done, setDone] = useState<boolean[]>(() => v.boxes.map((_, i) => preview && i < 2));
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const [woke, setWoke] = useState(false);
  const [stops, setStops] = useState<number[]>([]);

  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finishRef = useRef<HTMLDivElement>(null);

  // Where the truck stands: at the first unfinished box, at the finish line once all are
  // filled, past it (unloading) once sent.
  const firstOpen = done.findIndex((d) => !d);
  const at = sent ? v.boxes.length + 1 : firstOpen === -1 ? v.boxes.length : firstOpen;
  const truckY = stops[Math.min(at, stops.length - 1)] ?? 0;
  const linked = preview || (route.skad.trim() !== '' && route.dokad.trim() !== '');

  const measure = useCallback(() => {
    const root = formRef.current;
    if (!root) return;
    // Stop dots sit 26px below each box's top edge (see .stop in the stylesheet).
    const ys = boxRefs.current.map((b) => (b ? offsetTop(b, root) + 26 : 0));
    const f = finishRef.current;
    if (f) { const y = offsetTop(f, root); ys.push(y + 26, y + f.offsetHeight - 32); }
    setStops(ys);
  }, []);

  useEffect(() => {
    measure();
    const root = formRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure, sent]);

  // The rig drives in on first view: lane marks run under it and slow to a stop.
  useEffect(() => {
    const hero = heroRef.current;
    if (preview || !hero || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setWoke(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(hero);
    return () => io.disconnect();
  }, [preview]);

  const check = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    setDone(v.boxes.map((b) => b.need.every((n) => String(fd.get(n) ?? '').trim() !== '')));
  }, [v.boxes]);

  useEffect(() => { if (!preview) check(); }, [route, check, preview]);

  const setLeg = (key: keyof Route, value: string) => {
    setRoute((r) => ({ ...r, [key]: value }));
    setSent(false);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  };

  const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toForm = (focus?: string) => {
    const form = formRef.current;
    if (!form) return;
    form.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    if (focus) {
      const el = form.querySelector<HTMLElement>(`[name="${focus}"]`);
      window.setTimeout(() => el?.focus({ preventScroll: true }), reduced() ? 0 : 450);
    }
  };

  const quick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Continue where the request is still empty: the route first, then the next box.
    const next = !route.skad.trim() ? 'skad' : !route.dokad.trim() ? 'dokad' : v.boxes[2]?.fields[0]?.name;
    toForm(next);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const bad: Record<string, boolean> = {
      skad: !String(fd.get('skad') ?? '').trim(),
      dokad: !String(fd.get('dokad') ?? '').trim(),
      [v.contact]: !validContact(String(fd.get(v.contact) ?? ''), v.contactMail),
    };
    setErrors(bad);
    const first = Object.keys(bad).find((k) => bad[k]);
    if (first) { e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    setSent(true);
  };

  const errText: Record<string, string> = {
    skad: `Wpisz, skąd ${v.kind === 'courier' ? 'odebrać przesyłkę' : 'ruszamy'}.`,
    dokad: `Wpisz, dokąd ${v.kind === 'courier' ? 'ją zawieźć' : 'jedziemy'}.`,
    [v.contact]: v.contactMail ? 'Podaj telefon albo e-mail, żebyśmy mogli odpowiedzieć z wyceną.' : 'Podaj numer, żebyśmy mogli oddzwonić z wyceną.',
  };

  const renderField = (f: TransportField) => {
    if (f.t === 'choice') {
      return (
        <fieldset key={f.name} className={s.choice}>
          <legend>{f.legend}{f.note && <small className={mono.className}>{f.note}</small>}</legend>
          <div>
            {f.options.map((o) => (
              <label key={o}><input type={f.multi ? 'checkbox' : 'radio'} name={f.name} value={o} /><span>{o}</span></label>
            ))}
          </div>
        </fieldset>
      );
    }
    if (f.t === 'area') {
      return <label key={f.name} className={`${s.field} ${s.wide}`}><span>{f.label}</span><textarea name={f.name} rows={2} placeholder={f.placeholder} /></label>;
    }
    const bad = !!errors[f.name];
    const errId = `${uid}-${f.name}-err`;
    const routed = f.route ? { value: route[f.route], onChange: (e: ChangeEvent<HTMLInputElement>) => setLeg(f.route!, e.target.value) } : { onChange: () => bad && setErrors((x) => ({ ...x, [f.name]: false })) };
    return (
      <label key={f.name} className={`${s.field} ${bad ? s.bad : ''}`}>
        <span>{f.label}{f.optional && <i> (opcjonalnie)</i>}</span>
        <input
          name={f.name}
          type={f.mode === 'tel' ? 'tel' : 'text'}
          inputMode={f.mode === 'tel' ? 'tel' : undefined}
          autoComplete={f.auto ?? 'off'}
          placeholder={f.placeholder}
          aria-invalid={bad}
          aria-describedby={bad ? errId : undefined}
          {...routed}
        />
        {bad && <em id={errId} role="alert">{errText[f.name]}</em>}
      </label>
    );
  };

  const box = (b: TransportBox, i: number) => (
    <div
      key={b.n}
      ref={(el) => { boxRefs.current[i] = el; }}
      role="group"
      aria-labelledby={`${uid}-b${i}`}
      className={`${s.box} ${done[i] ? s.boxDone : ''}`}
      data-copy={i % 4}
    >
      <span className={s.stop} aria-hidden="true" />
      <p id={`${uid}-b${i}`} className={s.boxHead}>
        <span className={`${s.boxN} ${mono.className}`}>{b.n}</span>
        <span className={s.boxTitle}>{b.title}</span>
      </p>
      <div className={s.fields}>{b.fields.map(renderField)}</div>
    </div>
  );

  const registry: [string, string][] = [
    ['Firma', company.legal_name],
    ...(company.krs ? [['KRS', company.krs] as [string, string]] : []),
    ...(city ? [['Siedziba', city] as [string, string]] : []),
  ];

  return (
    <div lang="pl" className={`${s.site} ${sans.className}`} data-vehicle={v.vehicle}>
      <header className={s.top}>
        <span className={s.name}>{name}</span>
        <span className={`${s.slot} ${mono.className}`}>Tu Twój numer telefonu</span>
      </header>

      <section ref={heroRef} className={`${s.hero} ${woke ? s.woke : ''}`}>
        <div className={s.scene}>
          <div className={s.rig}>
            <div className={s.body}>
              <p className={s.livery} data-size={liverySize(name)}>{name}</p>
              <Title className={s.trade}>{v.trade}{city && <span className={s.city}> · {city}</span>}</Title>
              <span className={s.tape} aria-hidden="true" />
            </div>
            <div className={s.cab} aria-hidden="true"><span className={s.glass} /><span className={s.door} /></div>
            <span className={s.wheels} aria-hidden="true">
              {Array.from({ length: v.vehicle === 'trailer' ? 5 : 2 }, (_, i) => <i key={i} />)}
            </span>
          </div>
          <span className={`${s.illus} ${mono.className}`}>Grafika poglądowa</span>
        </div>

        <div className={s.asphalt}>
          <span className={s.lanes} aria-hidden="true"><i /></span>
          <p className={s.lead}>{v.lead}</p>
          <form className={`${s.quick} ${linked ? s.linked : ''}`} onSubmit={quick} aria-label="Trasa">
            <label className={s.leg}>
              <span className={mono.className}><b className={s.pin} aria-hidden="true" />{v.from.label}</span>
              <input name="skad" autoComplete="off" placeholder={v.from.placeholder} value={route.skad} onChange={(e) => setLeg('skad', e.target.value)} />
            </label>
            <span className={s.link} aria-hidden="true"><i /></span>
            <label className={s.leg}>
              <span className={mono.className}><b className={`${s.pin} ${s.pinEnd}`} aria-hidden="true" />{v.to.label}</span>
              <input name="dokad" autoComplete="off" placeholder={v.to.placeholder} value={route.dokad} onChange={(e) => setLeg('dokad', e.target.value)} />
            </label>
            <button type="submit">{v.quickCta}</button>
          </form>
        </div>
      </section>

      <section className={s.order}>
        <div className={s.orderHead}>
          <h2 className={s.h2}>{v.formTitle}</h2>
          <p>{v.formSub}</p>
        </div>

        <div className={s.orderGrid}>
          <form ref={formRef} className={`${s.note} ${firstOpen === -1 ? s.ready : ''}`} onSubmit={submit} onInput={check} onChange={check} noValidate>
            <div className={s.road} aria-hidden="true">
              <span className={s.truck} style={{ transform: `translateY(${truckY}px)` }}><i /></span>
            </div>

            {v.boxes.map(box)}

            <div ref={finishRef} className={`${s.finish} ${sent ? s.arrived : ''}`}>
              <span className={s.stop} aria-hidden="true" />
              {sent ? (
                <p role="status" className={s.sent}>
                  <strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie zapytanie trafi prosto do firmy, z trasą i wszystkimi polami w jednej wiadomości.
                </p>
              ) : (
                <button type="submit" className={s.send}>{v.submit}</button>
              )}
            </div>
          </form>

          <aside className={s.sheet} aria-labelledby={`${uid}-sheet`}>
            <h2 id={`${uid}-sheet`} className={s.sheetTitle}>{v.sheetTitle}</h2>
            <p className={s.sheetSub}>{v.sheetSub}</p>
            <dl>
              {registry.map(([k, val]) => (
                <div key={k} className={s.row}>
                  <dt>{k}</dt>
                  <dd>{val}<span className={`${s.src} ${mono.className}`}>z KRS</span></dd>
                </div>
              ))}
              {v.slots.map(([k, slot]) => (
                <div key={k} className={s.row}>
                  <dt>{k}</dt>
                  <dd className={`${s.empty} ${mono.className}`}>{slot}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className={s.list}>
        <div className={s.listHead}>
          <h2 className={s.h2}>{v.listTitle}</h2>
          <p className={mono.className}>{v.listNote}</p>
        </div>
        <ol>
          {v.list.map(([t, d], i) => (
            <li key={t}>
              <span className={mono.className}>{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.steps}>
        <h2 className={s.h2}>{v.stepsTitle}</h2>
        <ol>
          {v.steps.map(([t, d], i) => (
            <li key={t}>
              <span className={`${s.km} ${mono.className}`}>{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <button type="button" className={s.again} onClick={() => toForm(route.skad.trim() ? undefined : 'skad')}>{v.quickCta}</button>
      </section>

      <footer className={s.foot}>
        <p className={s.legal}>{company.legal_name}{company.krs ? `, KRS ${company.krs}` : ''}{city ? `. ${city}` : ''}</p>
        <p className={`${s.slotDark} ${mono.className}`}>{v.footSlot}</p>
      </footer>

      <div className={s.thumb}>
        <span className={mono.className}>Tu Twój numer</span>
        <button type="button" onClick={() => toForm(route.skad.trim() ? undefined : 'skad')}>{v.quickCta}</button>
      </div>
    </div>
  );
}
