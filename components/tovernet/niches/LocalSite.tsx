'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Archivo, Fraunces, Instrument_Sans, Outfit } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { isBlank, localContent, sampleValues, sentenceText, type Blank, type LocalContent } from '@/lib/tovernet/niches/local';
import s from './local.module.css';

const body = Instrument_Sans({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });
// One display face per trade. Not preloaded: a page only ever renders one of them.
const clean = Outfit({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap', preload: false });
const garden = Fraunces({ subsets: ['latin', 'latin-ext'], axes: ['opsz', 'SOFT'], style: ['normal', 'italic'], display: 'swap', preload: false });
const motor = Archivo({ subsets: ['latin', 'latin-ext'], axes: ['wdth'], display: 'swap', preload: false });

// Local-services concept (cleaning, gardens, auto repair, detailing). The page is a sentence
// the visitor completes in their own words; it is also the enquiry the firm would receive.
// Each answered gap is one pass of the trade's work on the drawing: a squeegee stroke on the
// window, a mown stripe on the lawn, a line of the car drawing. Company facts come from
// `company`; everything else is template copy. The form never sends anything.

const THEME: Record<LocalContent['art'], string> = { window: s.cleaning, lawn: s.garden, car: s.auto };
const FACE: Record<LocalContent['art'], string> = { window: clean.className, lawn: garden.className, car: motor.className };

/* ---------- drawings ---------- */

function WindowArt({ done, uid }: { done: boolean[]; uid: string }) {
  const n = done.length;
  const top = 54, h = 336 / n;
  return (
    <svg viewBox="0 0 400 480" className={s.svg} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <clipPath id={`${uid}g`}><rect x="66" y="54" width="128" height="336" /><rect x="206" y="54" width="128" height="336" /></clipPath>
        <filter id={`${uid}f`} x="0" y="0" width="1" height="1">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.085" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 .72  0 0 0 0 .73  0 0 0 0 .68  0 0 0 -1.3 1.32" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect width="400" height="480" className={s.wall} />
      <rect x="48" y="36" width="304" height="372" className={s.frame} />
      <g clipPath={`url(#${uid}g)`}>
        <rect x="60" y="50" width="280" height="345" className={s.sky} />
        <path className={s.town} d="M60 300h44v-44h30v-26h22v70h22v-90h40v26h12v-46h44v58h28v-30h26v52h12v130H60z" />
        <path className={s.glint} d="M78 196 186 88M96 214 190 120M218 176 330 64M236 196 334 98" />
        {done.map((d, i) => (
          <g key={i} className={`${s.haze} ${d ? s.wiped : ''}`} style={{ transitionDelay: d ? '0s' : `${i * 0.03}s` }}>
            <rect x="60" y={top + i * h - 0.5} width="292" height={h + 1} className={s.grime} filter={`url(#${uid}f)`} />
            <rect x="60" y={top + i * h - 0.5} width="292" height={h + 1} className={s.film} />
            <rect x="54" y={top + i * h + 4} width="9" height={h - 8} rx="2" className={s.blade} />
            <circle cx="70" cy={top + i * h + h * 0.3} r="2.6" className={s.drop} />
            <circle cx="73" cy={top + i * h + h * 0.68} r="1.8" className={s.drop} />
          </g>
        ))}
      </g>
      <rect x="194" y="54" width="12" height="336" className={s.frame} />
      <rect x="66" y="54" width="128" height="336" className={s.pane} />
      <rect x="206" y="54" width="128" height="336" className={s.pane} />
      <rect x="183" y="206" width="6" height="30" rx="3" className={s.handle} />
      <rect x="211" y="206" width="6" height="30" rx="3" className={s.handle} />
      <rect x="34" y="408" width="332" height="16" className={s.frame} />
      <path className={s.cloth} d="M286 408v-14c0-4 3-6 7-6h34c4 0 6 3 6 6v14z" />
      <path className={s.clothLine} d="M296 396h30M296 402h30" />
    </svg>
  );
}

function LawnArt({ done, active, uid }: { done: boolean[]; active: string | null; uid: string }) {
  const n = done.length;
  const w = 320 / n;
  const hedge = Array.from({ length: 12 }, (_, i) => `q15 -26 30 0`).join(' ');
  const leaves: [number, number][] = [[250, 214], [272, 226], [318, 220], [342, 206], [236, 196], [298, 238], [356, 230], [262, 244]];
  return (
    <svg viewBox="0 0 400 480" className={s.svg} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={`${uid}p`} width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M2 8l1.2-5M6 9l.8-4.5M4.5 4.5l1-3.5" className={s.blades} />
        </pattern>
        {done.map((_, i) => <clipPath key={i} id={`${uid}c${i}`}><rect x={40 + i * w} y="84" width={w + 0.4} height="262" /></clipPath>)}
      </defs>
      <rect width="400" height="480" className={s.ground} />
      <path className={`${s.hedge} ${active === 'zywoplot' ? s.zoneOn : ''}`} d={`M20 76V44 ${hedge} V76z`} />
      <rect x="40" y="84" width="320" height="262" className={`${s.uncut} ${active === 'trawnik' ? s.zoneOn : ''}`} />
      <rect x="40" y="84" width="320" height="262" fill={`url(#${uid}p)`} />
      {done.map((d, i) => (
        <g key={i} clipPath={`url(#${uid}c${i})`}>
          <g className={`${s.mow} ${d ? s.mown : ''}`}>
            <rect x={40 + i * w} y="84" width={w + 0.4} height="262" className={i % 2 ? s.stripeB : s.stripeA} />
            <g className={s.mower} transform={`translate(${40 + i * w + w / 2 - 13} 330)`}>
              <rect width="26" height="16" rx="3" className={s.mowerBody} />
              <path d="M13 16v14" className={s.mowerHandle} />
            </g>
          </g>
        </g>
      ))}
      <g className={s.stones}>
        {[[70, 330], [104, 300], [140, 278], [178, 262], [218, 252]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="15" ry="10" />)}
      </g>
      <ellipse cx="306" cy="170" rx="58" ry="52" className={s.shadow} />
      <circle cx="296" cy="156" r="54" className={`${s.crown} ${active === 'liscie' ? s.zoneOn : ''}`} />
      <circle cx="280" cy="140" r="22" className={s.crownLight} />
      <circle cx="314" cy="170" r="16" className={s.crownLight} />
      {leaves.map(([x, y], i) => <path key={i} className={s.leaf} d={`M${x} ${y}q5 -6 10 0q-5 6 -10 0z`} transform={`rotate(${i * 47} ${x + 5} ${y})`} />)}
      <rect x="40" y="358" width="182" height="54" rx="4" className={`${s.bed} ${active === 'rabaty' ? s.zoneOn : ''}`} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={52 + (i % 7) * 26} cy={i < 7 ? 374 : 396} r={i % 3 ? 5 : 6.5} className={i % 3 === 0 ? s.bloomA : i % 3 === 1 ? s.bloomB : s.bush} />)}
      <rect x="234" y="358" width="126" height="54" className={s.terrace} />
      <path className={s.terraceJoint} d="M234 376h126M234 394h126M276 358v54M318 358v54" />
      <rect x="20" y="424" width="360" height="56" className={s.house} />
    </svg>
  );
}

const CAR_BODY = 'M22 160V138Q24 126 40 122L112 110Q130 106 142 100L186 70Q192 66 204 65H282Q292 66 300 72L338 104L368 110Q378 112 378 124V160Q378 166 372 166H334A34 34 0 0 0 266 166H134A34 34 0 0 0 66 166H30Q22 166 22 160Z';
const CAR_DETAIL = 'M150 102L188 74Q192 71 200 71H240V102ZM248 71H282Q290 72 296 78L322 102H248ZM144 104 146 154M244 104V154M134 152H266M28 128 48 124 46 134 30 136ZM370 116 377 118V132L368 130ZM176 92 166 90 164 98H174M208 112H222M262 112H276';
const ZONES: Record<string, string> = {
  silnik: 'M24 140Q26 127 40 123L112 111Q130 107 142 101L145 160H134A34 34 0 0 0 66 160H24Z',
  klima: 'M150 102L188 74Q192 71 200 71H240V102ZM248 71H282Q290 72 296 78L322 102H248Z',
  wnetrze: 'M150 102L188 74Q192 71 200 71H240V102ZM248 71H282Q290 72 296 78L322 102H248Z',
  fotele: 'M196 102V86Q196 80 202 80H212Q216 80 216 86V102ZM264 102V86Q264 80 270 80H280Q284 80 284 86V102ZM146 106H330V150H146Z',
  nadwozie: 'M248 104H336L368 111Q377 113 377 124V160H334A34 34 0 0 0 266 160H248Z',
  lakier: 'M248 104H336L368 111Q377 113 377 124V160H334A34 34 0 0 0 266 160H248Z',
  reflektory: 'M26 128 50 123 48 136 28 138Z',
  hamulce: 'M100 135A31 31 0 1 1 99.9 135Z',
  zawieszenie: 'M300 135A31 31 0 1 1 299.9 135Z',
};
const ANCHOR: Record<string, [number, number]> = {
  silnik: [92, 128], klima: [210, 88], wnetrze: [210, 88], fotele: [206, 128], nadwozie: [330, 130], lakier: [330, 130],
  reflektory: [38, 130], hamulce: [100, 166], zawieszenie: [300, 166],
};

function CarArt({ done, active, gloss, spots, uid }: { done: boolean[]; active: string | null; gloss: boolean; spots: LocalContent['spots']; uid: string }) {
  const k = done.filter(Boolean).length;
  const full = k === done.length;
  return (
    <svg viewBox="0 0 400 230" className={s.svg} aria-hidden="true">
      <defs>
        <pattern id={`${uid}m`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" className={s.mesh} /></pattern>
        <clipPath id={`${uid}b`}><path d={CAR_BODY} /></clipPath>
      </defs>
      {gloss
        ? <g className={s.lights}>{[60, 130, 200, 270, 340].map((x, i) => <path key={x} d={`M${x - 14} ${i % 2 ? 15 : 9}l7 -6h14l7 6l-7 6h-14z`} />)}</g>
        : <rect width="400" height="230" fill={`url(#${uid}m)`} />}
      <path d="M8 200H392" className={s.groundLine} />
      {spots.map((sp) => {
        const a = ANCHOR[sp.key];
        return a ? <path key={sp.key} className={`${s.leader} ${active === sp.key ? s.leaderOn : ''}`} d={`M${sp.x * 4} ${sp.y * 2.3}L${a[0]} ${a[1]}`} /> : null;
      })}
      <path d={CAR_BODY} className={s.ghost} />
      <path d={CAR_DETAIL} className={s.ghost} />
      {active && ZONES[active] && <path d={ZONES[active]} className={s.zone} />}
      <path d={CAR_BODY} pathLength={100} className={s.ink} style={{ strokeDashoffset: 100 - (100 * k) / done.length }} />
      <path d={CAR_DETAIL} className={`${s.inkDetail} ${full ? s.inkOn : ''}`} />
      {[100, 300].map((x) => (
        <g key={x} className={s.wheel}>
          <circle cx={x} cy="166" r="27" />
          <circle cx={x} cy="166" r="11" />
        </g>
      ))}
      {gloss && (
        <g clipPath={`url(#${uid}b)`}>
          <path className={`${s.sheen} ${full ? s.sheenOn : ''}`} d="M-60 40h46l-90 160h-46zM-4 40h14l-90 160h-14z" />
        </g>
      )}
    </svg>
  );
}

/* ---------- page ---------- */

function Gap({ b, value, onChange, face }: { b: Blank; value: string; onChange: (v: string) => void; face: string }) {
  const empty = !value.trim();
  if (b.free) {
    return (
      <label className={`${s.gap} ${s.gapFree} ${empty ? s.empty : ''}`}>
        <span className={s.sr}>{b.hint}</span>
        <input name={b.key} value={value} placeholder={b.free.placeholder} size={Math.max(value.length, b.free.placeholder.length - 4, 6)} autoComplete="off" onChange={(e) => onChange(e.target.value)} className={face} />
      </label>
    );
  }
  return (
    <label className={`${s.gap} ${empty ? s.empty : ''}`}>
      <span className={s.sr}>{b.hint}</span>
      <select name={b.key} value={value} onChange={(e) => onChange(e.target.value)} className={face}>
        <option value="">{b.hint}</option>
        {b.options!.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

export default function LocalSite({ company, variant, embedded = false, preview = false }: { company: PublicDemo['config']['company']; variant: string; embedded?: boolean; preview?: boolean }) {
  const c = localContent(variant);
  const Title = embedded ? 'p' : 'h1';
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const face = FACE[c.art];
  const uid = useId().replace(/:/g, '');

  const blanks = c.sentence.filter(isBlank);
  const [values, setValues] = useState<Record<string, string>>(() => (preview ? sampleValues(c.sentence) : {}));
  const [phoneError, setPhoneError] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [awake, setAwake] = useState(preview);
  const formRef = useRef<HTMLFormElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);

  const done = blanks.map((b) => (values[b.key]?.trim().length ?? 0) >= (b.free ? 2 : 1));
  const missing = blanks.filter((_, i) => !done[i]).map((b) => b.hint);
  const activeSpot = c.spots.find((sp) => sp.sets.zakres && sp.sets.zakres === values.zakres)?.key ?? null;

  // Steps line draws once it is on screen. Scoped observer: works embedded and scaled.
  useEffect(() => {
    const el = stepsRef.current;
    if (awake || !el || typeof IntersectionObserver === 'undefined') { setAwake(true); return; }
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setAwake(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [awake]);

  const set = (key: string, v: string) => { setSent(null); setValues((p) => ({ ...p, [key]: v })); };
  const apply = (sets: Record<string, string>) => { setSent(null); setValues((p) => ({ ...p, ...sets })); };

  const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A button, not a #hash link: the offer page keeps the demo id in the fragment.
  const toForm = () => {
    const f = formRef.current;
    if (!f) return;
    f.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    const gap = f.querySelector<HTMLElement>(`.${s.empty} select, .${s.empty} input, input[name="telefon"]`);
    window.setTimeout(() => gap?.focus({ preventScroll: true }), reduced() ? 0 : 450);
  };
  const choose = (sets: Record<string, string>) => { apply(sets); toForm(); };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const tel = String(data.get('telefon') ?? '').replace(/\D/g, '');
    if (tel.length < 9) { setPhoneError(true); return; }
    setPhoneError(false);
    setSent(sentenceText(c.sentence, values));
  };

  return (
    <div lang="pl" className={`${s.site} ${THEME[c.art]} ${c.gloss ? s.detailing : ''} ${body.className}`}>
      <header className={s.top}>
        <span className={s.name}>{name}</span>
        <span className={s.slot}>Tu Twój numer telefonu</span>
      </header>

      <section className={s.hero}>
        <div className={s.heroText}>
          <Title className={`${s.h1} ${face}`}>{c.h1(city)}</Title>
          <p className={s.lead}>{c.lead}</p>
        </div>

        <div className={`${s.art} ${s[`art_${c.art}`]}`}>
          <div className={s.drawing}>
          {c.art === 'window' && <WindowArt done={done} uid={uid} />}
          {c.art === 'lawn' && <LawnArt done={done} active={activeSpot} uid={uid} />}
          {c.art === 'car' && <CarArt done={done} active={activeSpot} gloss={!!c.gloss} spots={c.spots} uid={uid} />}
          {c.spots.length > 0 && (
            <div className={s.spots} role="group" aria-label={c.spotsLabel}>
              <span className={s.spotsLabel}>{c.spotsLabel}</span>
              {c.spots.map((sp) => (
                <button key={sp.key} type="button" aria-pressed={activeSpot === sp.key} onClick={() => apply(sp.sets)}
                  className={s.spot} style={{ left: `${sp.x}%`, top: `${sp.y}%` }}>{sp.label}</button>
              ))}
            </div>
          )}
          </div>
          {c.art === 'car' && !c.gloss && (
            <dl className={s.card} aria-hidden="true">
              <div className={s.cardHead}><dt>Zlecenie</dt><dd>nr —</dd></div>
              {blanks.map((b) => <div key={b.key}><dt>{b.hint}</dt><dd className={face}>{values[b.key]?.trim() || '—'}</dd></div>)}
            </dl>
          )}
          <span className={s.artNote}>Rysunek poglądowy</span>
        </div>

        <form ref={formRef} onSubmit={submit} noValidate className={s.form} aria-label="Zapytanie">
          {sent ? (
            <div role="status" className={s.sent}>
              <p><strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie firma dostanie takie zapytanie:</p>
              <blockquote className={face}>{sent}</blockquote>
              <button type="button" onClick={() => setSent(null)}>Wróć do zapytania</button>
            </div>
          ) : (
            <>
              <p className={`${s.sentence} ${face}`}>
                {c.sentence.map((p, i) => (isBlank(p)
                  ? <Gap key={p.key} b={p} face={face} value={values[p.key] ?? ''} onChange={(v) => set(p.key, v)} />
                  : <span key={i}>{p}</span>))}
              </p>

              <div className={s.fields}>
                {c.askPlace && <label className={s.field}><span>Dzielnica lub miejscowość</span><input name="okolica" autoComplete="address-level2" /></label>}
                <label className={s.field}><span>Imię</span><input name="imie" autoComplete="given-name" /></label>
                <label className={`${s.field} ${phoneError ? s.bad : ''}`}>
                  <span>Telefon</span>
                  <input name="telefon" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={phoneError} aria-describedby={phoneError ? `${uid}-tel` : undefined} onChange={() => setPhoneError(false)} />
                  {phoneError && <em id={`${uid}-tel`} role="alert">Podaj numer, żebyśmy mogli oddzwonić.</em>}
                </label>
                <label className={`${s.field} ${s.wide}`}><span>Coś jeszcze? (opcjonalnie)</span><textarea name="opis" rows={2} placeholder={c.notePlaceholder} /></label>
              </div>

              <div className={s.send}>
                <div className={s.pass} aria-live="polite">
                  <span className={s.passBar} aria-hidden="true">{done.map((d, i) => <i key={i} className={d ? s.passOn : ''} />)}</span>
                  <span className={s.passText}>{missing.length ? `Brakuje: ${missing.join(', ')}` : 'Tyle wystarczy do wyceny.'}</span>
                </div>
                <button type="submit" className={`${s.cta} ${face}`}>{c.cta}</button>
              </div>
            </>
          )}
        </form>
      </section>

      <section className={s.services}>
        <div className={s.sectionHead}>
          <h2 className={`${s.h2} ${face}`}>{c.servicesTitle}</h2>
          <p>{c.servicesNote}</p>
        </div>
        <ul>
          {c.services.map((sv) => (
            <li key={sv.title}>
              <div className={s.row}>
                <h3 className={face}>{sv.title}</h3>
                <span className={s.dots} aria-hidden="true" />
                <span className={s.price}>{c.leader}</span>
              </div>
              <p>{sv.text}</p>
              <button type="button" onClick={() => choose(sv.sets)}>Zapytaj o to</button>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.area}>
        <h2 className={`${s.h2} ${face}`}>{c.areaTitle}</h2>
        {c.area === 'travel' ? (
          <div className={s.travel}>
            <div className={s.rings} aria-hidden="true"><i /><i /><i /></div>
            <p className={`${s.city} ${face}`}>
              {city ? <>{city}<small>i okolice</small></> : <span className={s.slotInline}>Tu Twoje miasto</span>}
            </p>
            <p className={s.slot}>{c.areaSlot}</p>
          </div>
        ) : (
          <div className={s.premises}>
            <div>
              {city && <p className={`${s.city} ${face}`}>{city}</p>}
              <p className={s.slot}>{c.areaSlot}</p>
            </div>
            <div>
              <dl className={s.hours}>
                {['Pon.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sob.'].map((d) => (
                  <div key={d}><dt>{d}</dt><dd><span aria-hidden="true">__:__ – __:__</span><span className={s.sr}>do uzupełnienia</span></dd></div>
                ))}
              </dl>
              <p className={s.hoursNote}>{c.footSlot}</p>
            </div>
          </div>
        )}
      </section>

      <section className={s.how}>
        <div>
          <h2 className={`${s.h2} ${face}`}>Do wyceny przydadzą się</h2>
          <ul className={s.prepare}>{c.prepare.map((p) => <li key={p}>{p}</li>)}</ul>
          <button type="button" className={`${s.ghostCta} ${face}`} onClick={toForm}>{c.cta}</button>
        </div>
        <div>
          <h2 className={`${s.h2} ${face}`}>Jak to idzie</h2>
          <ol ref={stepsRef} className={`${s.steps} ${awake ? s.stepsOn : ''}`}>
            {c.steps.map(([t, d], i) => <li key={t}><span className={face}>{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}
          </ol>
        </div>
      </section>

      <footer className={s.foot}>
        <p className={s.legal}>{company.legal_name}{company.krs ? `, KRS ${company.krs}` : ''}{city ? `. ${city}` : ''}</p>
        {c.area === 'travel' && <p className={s.slotDark}>{c.footSlot}</p>}
      </footer>

      <div className={s.thumb}>
        <span>Tu Twój numer</span>
        <button type="button" className={face} onClick={toForm}>{c.cta}</button>
      </div>
    </div>
  );
}
