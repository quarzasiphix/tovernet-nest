'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Sofia_Sans, Sofia_Sans_Extra_Condensed, Spline_Sans_Mono } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { nameScale, presentPkd } from '@/lib/tovernet/niches/business';
import {
  CLOSE_CTA, LIST_COLUMNS, MARKS, SEND, SHEET_LABELS, STEPS_NOTE, engineeringContent, type Mark,
} from '@/lib/tovernet/niches/engineering';
import s from './engineering.module.css';

const display = Sofia_Sans_Extra_Condensed({ subsets: ['latin', 'latin-ext'], weight: ['600', '700', '800'], display: 'swap' });
const sans = Sofia_Sans({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });
const mono = Spline_Sans_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], display: 'swap' });

// Engineering and design concept. Technical clients rarely know what they are missing, so the
// hero is a gap check on millimetre paper: the visitor marks what they already have, and each
// answer draws one layer of the drawing, in ink for what exists and red pencil for what is
// missing. The red items become the scope they send. The form sends nothing.

type Company = PublicDemo['config']['company'];
type Marks = Record<string, Mark | undefined>;
type Pen = { className: string; pathLength?: number };

const SITE_PLAN: Record<string, (p: Pen) => ReactNode> = {
  mapa: (p) => (
    <>
      <path {...p} className={`${p.className} ${s.heavy}`} d="M140 96 L628 72 L664 418 L172 438 Z" />
      <path {...p} className={`${p.className} ${s.thin}`} d="M0 462 H800 M0 506 H800" />
      <path {...p} className={`${p.className} ${s.thin}`} d="M40 150 C220 120 300 210 470 176 S700 120 790 170" />
      <path {...p} className={`${p.className} ${s.thin}`} d="M20 300 C190 268 330 350 520 312 S720 290 796 312" />
      <path {...p} d="M736 92 L736 40 M736 40 L726 62 M736 40 L746 62" />
      <text className={s.t} x="731" y="30">N</text>
      <text className={s.t} x="158" y="124">działka</text>
      <text className={s.t} x="24" y="490">droga</text>
    </>
  ),
  warunki: (p) => (
    <>
      <path {...p} d="M186 372 L658 350" />
      <path {...p} className={`${p.className} ${s.thin}`} d="M214 132 L594 114 L622 344 L232 362 Z" />
      <text className={s.t} x="432" y="382">linia zabudowy</text>
    </>
  ),
  koncepcja: (p) => (
    <>
      <path className={s.tone} d="M290 186 L516 176 L526 322 L300 332 Z" />
      <path {...p} className={`${p.className} ${s.heavy}`} d="M290 186 L516 176 L526 322 L300 332 Z" />
      <path {...p} d="M345 256 L472 250 M290 186 L345 256 L300 332 M516 176 L472 250 L526 322" />
      <text className={s.t} x="368" y="302">bryła</text>
    </>
  ),
  projekt: (p) => (
    <>
      <path {...p} className={`${p.className} ${s.thin}`} d="M290 186 L288 150 M516 176 L514 140" />
      <path {...p} d="M284 154 L520 144 M290 160 L278 148 M516 150 L526 138" />
      <path {...p} className={`${p.className} ${s.thin}`} d="M526 322 L574 320 M516 176 L564 174" />
      <path {...p} d="M570 170 L580 324 M564 180 L576 168 M574 330 L586 318" />
      <text className={s.t} x="396" y="140">a</text>
      <text className={s.t} x="586" y="252">b</text>
    </>
  ),
  media: (p) => (
    <>
      <path {...p} d="M340 330 L342 462 M410 327 L413 462 M482 324 L486 462" />
      <circle className={s.dot} cx="342" cy="462" r="5" />
      <circle className={s.dot} cx="413" cy="462" r="5" />
      <circle className={s.dot} cx="486" cy="462" r="5" />
      <text className={s.t} x="310" y="452">woda</text>
      <text className={s.t} x="420" y="452">kan.</text>
      <text className={s.t} x="494" y="452">prąd</text>
    </>
  ),
};

const SECTION: Record<string, (p: Pen) => ReactNode> = {
  obiekt: (p) => (
    <>
      <path {...p} className={`${p.className} ${s.heavy}`} d="M196 202 V420 M204 202 V420 M596 202 V420 M604 202 V420" />
      <path {...p} className={`${p.className} ${s.heavy}`} d="M170 180 H630 V202 H170 Z" />
      <path {...p} className={`${p.className} ${s.heavy}`} d="M160 420 H240 V446 H160 Z M560 420 H640 V446 H560 Z" />
      <path {...p} d="M0 420 H160 M240 420 H560 M640 420 H800" />
      <path {...p} className={`${p.className} ${s.thin}`} d="M0 470 C160 456 260 486 400 472 S650 462 800 476 M0 506 C190 494 330 516 510 504 S700 500 800 510" />
      <text className={s.t} x="24" y="408">teren</text>
    </>
  ),
  dok: (p) => (
    <>
      <path {...p} className={`${p.className} ${s.thin}`} d="M200 76 V510 M600 76 V510" />
      <circle className={s.ring} cx="200" cy="60" r="16" />
      <circle className={s.ring} cx="600" cy="60" r="16" />
      <text className={s.t} x="195" y="65">A</text>
      <text className={s.t} x="595" y="65">B</text>
      <path {...p} d="M200 112 H600 M194 118 L206 106 M594 118 L606 106" />
      <text className={s.t} x="392" y="104">L</text>
      <path {...p} d="M700 202 V420 M694 208 L706 196 M694 426 L706 414" />
      <text className={s.t} x="710" y="316">H</text>
    </>
  ),
  badania: (p) => (
    <>
      <path {...p} d="M392 420 V516 M408 420 V516" />
      <path {...p} className={`${p.className} ${s.thin}`} d="M392 450 H408 M392 472 H408 M392 494 H408" />
      <circle className={s.ring} cx="300" cy="191" r="9" />
      <circle className={s.ring} cx="500" cy="191" r="9" />
      <text className={s.t} x="290" y="230">P1</text>
      <text className={s.t} x="490" y="230">P2</text>
      <text className={s.t} x="416" y="442">odwiert</text>
    </>
  ),
  wymagania: (p) => (
    <>
      <path {...p} d="M208 138 H592 M220 138 V172 M214 164 L220 174 L226 164 M300 138 V172 M294 164 L300 174 L306 164 M380 138 V172 M374 164 L380 174 L386 164 M460 138 V172 M454 164 L460 174 L466 164 M540 138 V172 M534 164 L540 174 L546 164" />
      <text className={s.t} x="614" y="146">q</text>
    </>
  ),
  analiza: (p) => (
    <>
      <path className={s.tone} d="M200 202 Q400 450 600 202 Z" />
      <path {...p} d="M200 202 Q400 450 600 202" />
      <path {...p} className={`${p.className} ${s.thin}`} d="M400 202 V326" />
      <text className={s.t} x="410" y="290">M</text>
    </>
  ),
};

export default function EngineeringSite({
  company, variant, embedded = false, preview = false,
}: { company: Company; variant: string; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const c = engineeringContent(variant);
  const drawing = variant === 'eng_architect' ? SITE_PLAN : SECTION;
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const act = presentPkd(company.pkd);

  const [marks, setMarks] = useState<Marks>(() => (preview ? c.sample : {}));
  const [cel, setCel] = useState<string | null>(preview ? c.cele[0] : null);
  const [reach, setReach] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  // The chain is complete until JavaScript arms it, so the page reads without scripts.
  const [armed, setArmed] = useState(false);

  const bench = useRef<HTMLFormElement>(null);
  const chain = useRef<HTMLOListElement>(null);

  // Scoped observer only: the concept also renders embedded and in a scaled miniature.
  useEffect(() => {
    if (preview || typeof IntersectionObserver === 'undefined' || !chain.current) return;
    setArmed(true);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setArmed(false); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(chain.current);
    return () => io.disconnect();
  }, [preview]);

  // A button, not a #hash link: the offer page keeps the demo id in the fragment.
  const toBench = () => {
    const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bench.current?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };
  const ask = (service: string) => { setCel(service); setSent(false); toBench(); };
  const mark = (key: string, value: Mark) => { setMarks((m) => ({ ...m, [key]: value })); setSent(false); };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = reach.trim();
    if (!/^\S+@\S+\.\S+$/.test(v) && v.replace(/\D/g, '').length < 9) { setError(true); return; }
    setError(false);
    setSent(true);
  };

  const missing = c.layers.filter((l) => marks[l.key] === 'brak');
  const unsure = c.layers.filter((l) => marks[l.key] === 'nie');
  const answered = c.layers.some((l) => marks[l.key]);
  const allHeld = c.layers.every((l) => marks[l.key] === 'mam');

  return (
    <div lang="pl" className={`${s.site} ${sans.className}`} data-preview={preview || undefined}>
      <header className={s.mast}>
        <span className={s.mastName}>{name}</span>
        <span className={s.slot}>Tu telefon i e-mail</span>
        <button type="button" className={s.mastGo} onClick={toBench}>Zapytaj</button>
      </header>

      <section className={s.hero}>
        <p className={`${s.kicker} ${mono.className}`}>{c.kicker}{city ? ` · ${city}` : ''}</p>
        <Title className={`${s.name} ${display.className}`} data-scale={nameScale(name)}>{name}</Title>
        <div className={`${s.dim} ${mono.className}`} aria-hidden="true"><i className={s.dimLine} /><span>{c.dimension}</span></div>
        <div className={s.under}>
          <p className={s.lead}>{c.lead}</p>
          {(act || company.krs) && (
            <dl className={`${s.reg} ${mono.className}`}>
              {act && <div><dt>PKD {act.code}</dt><dd>{act.label}</dd></div>}
              {company.krs && <div><dt>KRS</dt><dd>{company.krs}</dd></div>}
            </dl>
          )}
        </div>
      </section>

      <form ref={bench} className={s.bench} onSubmit={submit} noValidate>
        {/* The drawing stays pinned on phones only while the questions are answered, not over the form fields. */}
        <div className={s.work}>
        <div className={s.stage}>
          <p className={`${s.stageHead} ${mono.className}`}><span>{c.drawingLabel}</span><span className={s.key}><b data-k="mam">masz</b><b data-k="brak">brakuje</b><b data-k="nie">sprawdzić</b></span></p>
          <svg className={`${s.draw} ${mono.className}`} viewBox="0 0 800 520" role="img" aria-label={`${c.drawingLabel}: rysunek poglądowy, który zmienia się wraz z odpowiedziami`}>
            {c.layers.map((l) => {
              const m = marks[l.key];
              return (
                <g key={`${l.key}:${m ?? ''}`} className={s.layer} data-m={m}>
                  {drawing[l.key]({ className: s.d, pathLength: m === 'nie' ? undefined : 1 })}
                </g>
              );
            })}
          </svg>
          <p className={`${s.note} ${mono.className}`}>{c.drawingNote}</p>
        </div>

        <div className={s.panel}>
          <fieldset className={s.cele}>
            <legend>{c.celLabel}</legend>
            <div>
              {c.cele.map((o) => (
                <label key={o}>
                  <input type="radio" name={`${uid}-cel`} checked={cel === o} onChange={() => { setCel(o); setSent(false); }} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={s.layers}>
            <legend className={`${s.h3} ${display.className}`}>{c.layersTitle}</legend>
            {c.layers.map((l) => (
              <div key={l.key} className={s.row} role="radiogroup" aria-label={l.title}>
                <div className={s.rowText}>
                  <strong>{l.title}</strong>
                  <small>{l.hint}</small>
                </div>
                <div className={s.seg}>
                  {MARKS.map(([v, label]) => (
                    <label key={v}>
                      <input type="radio" name={`${uid}-${l.key}`} checked={marks[l.key] === v} onChange={() => mark(l.key, v)} />
                      <span data-v={v}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        </div>
        </div>

          <div className={s.sheet}>
            <p className={`${s.sheetHead} ${display.className}`}>
              <span>{c.sheetTitle}</span>
              {cel && <em className={mono.className}>{cel}</em>}
            </p>
            <div className={s.sheetBody} aria-live="polite">
              {!answered && <p className={s.empty}>{c.empty}</p>}
              {allHeld && <p className={s.empty}>{c.complete}</p>}
              {missing.length > 0 && (
                <div>
                  <h3 className={`${s.tag} ${mono.className}`}>{SHEET_LABELS.brak}</h3>
                  <ul>{missing.map((l) => <li key={l.key}>{l.title}</li>)}</ul>
                </div>
              )}
              {unsure.length > 0 && (
                <div data-soft="">
                  <h3 className={`${s.tag} ${mono.className}`}>{SHEET_LABELS.nie}</h3>
                  <ul>{unsure.map((l) => <li key={l.key}>{l.title}</li>)}</ul>
                </div>
              )}
              {(missing.length > 0 || unsure.length > 0) && <p className={s.reply}>{c.reply}</p>}
            </div>

            <div className={s.fields}>
              <label className={s.field}><span>Miejscowość</span><input autoComplete="address-level2" /></label>
              <label className={s.field}><span>Termin, jeśli jest</span><input /></label>
              <label className={`${s.field} ${s.wide}`}><span>Kilka słów</span><textarea rows={2} placeholder={c.placeholder} /></label>
              <label className={`${s.field} ${s.wide} ${error ? s.bad : ''}`}>
                <span>E-mail lub telefon</span>
                <input value={reach} autoComplete="email" aria-invalid={error} aria-describedby={error ? `${uid}-err` : undefined} onChange={(e) => { setReach(e.target.value); setError(false); }} />
              </label>
              {error && <em id={`${uid}-err`} role="alert" className={s.err}>Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.</em>}
            </div>

            {sent ? (
              <p role="status" className={s.sent}><strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie ta wiadomość trafi prosto do firmy.</p>
            ) : (
              <button type="submit" className={s.send}>{SEND}<span aria-hidden="true">→</span></button>
            )}
          </div>
      </form>

      <section className={s.band}>
        <div className={s.bandHead}>
          <h2 className={`${s.h2} ${display.className}`}>{c.listTitle}</h2>
          <p className={`${s.note} ${mono.className}`}>{c.listNote}</p>
        </div>
        <div className={s.list}>
          <div className={`${s.listHead} ${mono.className}`} aria-hidden="true">
            <span>Poz.</span>{LIST_COLUMNS.map((x) => <span key={x}>{x}</span>)}<span />
          </div>
          {c.rows.map(([service, gives, when], i) => (
            <div key={service} className={s.item}>
              <span className={`${s.pos} ${mono.className}`}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={display.className}>{service}</h3>
              <p>{gives}</p>
              <p className={s.when}>{when}</p>
              <button type="button" onClick={() => ask(service)}>Zapytaj o to</button>
            </div>
          ))}
        </div>
      </section>

      <section className={s.band}>
        <h2 className={`${s.h2} ${display.className}`}>{c.stepsTitle}</h2>
        <ol ref={chain} className={`${s.chain} ${armed ? s.armed : ''}`}>
          {c.steps.map(([t, d], i) => (
            <li key={t} style={{ transitionDelay: `${i * 160}ms` }}>
              <span className={`${s.pos} ${mono.className}`}>Etap {i + 1}</span>
              <h3 className={display.className}>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <p className={`${s.note} ${mono.className}`}>{STEPS_NOTE}</p>
      </section>

      <section className={`${s.band} ${s.who}`}>
        <div>
          <h2 className={`${s.h2} ${display.className}`}>{c.whoTitle}</h2>
          <p className={`${s.note} ${mono.className}`}>{c.whoNote}</p>
          <dl className={s.whoList}>
            {c.who.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd className={s.slot}>{v}</dd></div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className={`${s.h2} ${display.className}`}>{c.workTitle}</h2>
          <p className={`${s.slot} ${s.workSlot}`}>{c.work}</p>
        </div>
      </section>

      <section className={s.close}>
        <div>
          <h2 className={`${s.h2} ${display.className}`}>{c.closeTitle}</h2>
          <p>{c.closeText}</p>
        </div>
        <button type="button" className={s.closeGo} onClick={toBench}>{CLOSE_CTA}<span aria-hidden="true">→</span></button>
      </section>

      <footer className={`${s.foot} ${mono.className}`}>
        <p>{company.legal_name}{company.krs ? ` · KRS ${company.krs}` : ''}{city ? ` · ${city}` : ''}</p>
        <p className={s.slot}>Tu NIP, adres i informacja o przetwarzaniu danych</p>
      </footer>

      {!preview && <div className={s.thumb}><span>Tu Twój telefon</span><button type="button" onClick={toBench}>Zapytaj o zakres</button></div>}
    </div>
  );
}
