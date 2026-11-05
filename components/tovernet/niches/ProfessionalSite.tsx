'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Newsreader, Public_Sans } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import {
  ACC_PREPARE, ACC_SLOTS, DEADLINES, DOC_COUNTS, DUTIES, ESTATE_COPY, ESTATE_ROLES, FIELD_LABEL, FORMS, LEDGER, LEDGER_CHOICES,
  LISTING_EXAMPLES, LISTING_NOTE, MANAGEMENT_SCOPE, MANAGER, MONTH_NOTE, PROPERTY_ROLES, ROOMS, SCOPE, SITUATIONS, STAFF_COUNTS, TENANT,
  proVariant, type Form, type Glyph, type Role, type Setup,
} from '@/lib/tovernet/niches/professional';
import s from './professional.module.css';

const serif = Newsreader({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], style: ['normal', 'italic'], display: 'swap' });
const sans = Public_Sans({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });

// Professional services concept: accounting offices (69.20), estate agents (68.31) and
// property managers (68.32). One editorial system on paper, two instruments:
// - accounting: "Twój miesiąc z biurem". The visitor sets company form, VAT and staff; the
//   deadlines that apply get a highlighter stroke, and the quote form opens with that setup.
// - estate and property: the enquiry drafts a property card beside the form, the way the
//   office would present it, with an intentional, labelled empty listings section.
// Company facts come from `company`; the forms never send anything and say so.

type Company = PublicDemo['config']['company'];

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollTo = (el: HTMLElement | null) => el?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  const t = n % 10, h = n % 100;
  return t >= 2 && t <= 4 && (h < 12 || h > 14) ? few : many;
}

/** Radio group drawn as boxes of a paper form; controlled, so other parts of the page can set it. */
function Boxes({ legend, no, options, value, onChange, name }: { legend: string; no?: string; options: string[]; value: string; onChange: (v: string) => void; name: string }) {
  return (
    <fieldset className={s.boxes}>
      <legend>{no && <span className={s.no}>{no}</span>}{legend}</legend>
      <div>
        {options.map((o) => (
          <label key={o}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Line({ label, no, children, error, errorId }: { label: string; no?: string; children: ReactNode; error?: string; errorId?: string }) {
  return (
    <label className={`${s.line} ${error ? s.bad : ''}`}>
      <span>{no && <span className={s.no}>{no}</span>}{label}</span>
      {children}
      {error && <em id={errorId} role="alert">{error}</em>}
    </label>
  );
}

function Top({ name, cta, onCta }: { name: string; cta: string; onCta: () => void }) {
  return (
    <header className={s.top}>
      <span className={s.name}>{name}</span>
      <span className={s.slot}>Tu Twój numer telefonu</span>
      <button type="button" className={s.topCta} onClick={onCta}>{cta}</button>
    </header>
  );
}

function Foot({ company, city, slot }: { company: Company; city: string | null; slot: string }) {
  return (
    <footer className={s.foot}>
      <p className={s.legal}>{company.legal_name}{company.krs ? `, KRS ${company.krs}` : ''}{city ? `. ${city}` : ''}</p>
      <p className={s.slotDark}>{slot}</p>
    </footer>
  );
}

function Thumb({ cta, onCta }: { cta: string; onCta: () => void }) {
  return (
    <div className={s.thumb}>
      <span>Tu Twój numer</span>
      <button type="button" onClick={onCta}>{cta}</button>
    </div>
  );
}

function Sent({ what }: { what: string }) {
  return (
    <p role="status" className={s.sent}>
      <strong className={serif.className}>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie {what}
    </p>
  );
}

/** Fires once when `ref` is a third on screen. Scoped observer: works embedded and scaled. */
function useSeen(ref: React.RefObject<Element>, initial: boolean) {
  const [seen, setSeen] = useState(initial);
  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen]);
  return seen;
}

/* ================================================================== accounting */

function Accounting({ company, embedded, preview }: { company: Company; embedded: boolean; preview: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const name = presentName(company.display_name);
  const city = presentCity(company.city);

  const [form, setForm] = useState<Form>(preview ? 'spzoo' : 'jdg');
  const [vat, setVat] = useState(true);
  const [staffCount, setStaffCount] = useState(preview ? '1–3' : '0');
  const [ledger, setLedger] = useState(preview ? 'Pełna księgowość' : '');
  const [docs, setDocs] = useState(preview ? '21–50' : '');
  const [situation, setSituation] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);

  const monthRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const live = useSeen(monthRef, preview);

  const staff = staffCount !== '0';
  const setup: Setup = { form, vat, staff };
  const formLabel = FORMS.find((f) => f.key === form)!;

  const pickForm = (f: Form) => {
    setForm(f);
    setSent(false);
    // The ledger follows the company form until the visitor picks one in the quote form.
    setLedger((l) => (l && l !== 'Pełna księgowość' && l !== 'KPiR' ? l : f === 'spzoo' || f === 'ngo' ? 'Pełna księgowość' : ''));
  };
  const pickStaff = (on: boolean) => setStaffCount((c) => (on ? (c === '0' ? '1–3' : c) : '0'));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const mail = String(d.get('email') ?? '').trim();
    const tel = String(d.get('telefon') ?? '').replace(/\D/g, '');
    if (!/^\S+@\S+\.\S+$/.test(mail) && tel.length < 9) { setError(true); return; }
    setError(false);
    setSent(true);
  };

  const errId = `${uid}-err`;

  return (
    <div lang="pl" className={`${s.site} ${s.acc} ${sans.className}`}>
      <Top name={name} cta="Wycena obsługi" onCta={() => scrollTo(formRef.current)} />

      <section className={s.accHero}>
        <div className={s.accIntro}>
          <Title className={`${s.h1} ${serif.className}`}>Biuro <em>rachunkowe</em></Title>
          <p className={s.meta}>{city && <><b>{city}</b><i aria-hidden="true" /></>}Księgowość, kadry i płace, podatki</p>
          <p className={s.lead}>Zaznacz, jaką masz firmę. Zobaczysz, czym zajmiemy się co miesiąc, a potem poprosisz o wycenę z konkretnym zakresem.</p>
          <button type="button" className={s.cta} onClick={() => scrollTo(formRef.current)}>Poproś o wycenę</button>
          <p className={s.under}>Zakres i cenę znasz przed podpisaniem umowy.</p>
        </div>

        <div ref={monthRef} className={`${s.month} ${live ? s.live : ''}`}>
          <div className={s.monthHead}>
            <h2 className={serif.className}>Twój miesiąc z biurem</h2>
            <p>Ewidencja: <b key={form} className={s.swap}>{LEDGER[form]}</b></p>
          </div>

          <div className={s.setup}>
            <div role="group" aria-label="Forma firmy" className={s.seg}>
              {FORMS.map((f) => <button key={f.key} type="button" aria-pressed={form === f.key} onClick={() => pickForm(f.key)}>{f.short}</button>)}
            </div>
            <div className={s.segRow}>
              <div role="group" aria-label="VAT" className={s.seg}>
                <button type="button" aria-pressed={vat} onClick={() => setVat(true)}>Czynny VAT</button>
                <button type="button" aria-pressed={!vat} onClick={() => setVat(false)}>Bez VAT</button>
              </div>
              <div role="group" aria-label="Pracownicy" className={s.seg}>
                <button type="button" aria-pressed={staff} onClick={() => pickStaff(true)}>Z pracownikami</button>
                <button type="button" aria-pressed={!staff} onClick={() => pickStaff(false)}>Bez pracowników</button>
              </div>
            </div>
          </div>

          <ol className={s.days}>
            {DEADLINES.map((d, i) => {
              const skip = d.skip(setup);
              return (
                <li key={d.key} className={skip ? s.off : s.on} style={{ ['--i' as string]: i }}>
                  <span className={`${s.day} ${d.wordy ? s.wordy : ''} ${serif.className}`}>{d.day}</span>
                  <div>
                    <h3><span className={s.mark}>{d.title}</span></h3>
                    <p>{skip ?? d.text(setup)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className={s.note}>{MONTH_NOTE}</p>
        </div>
      </section>

      <section className={s.quote}>
        <form ref={formRef} onSubmit={submit} noValidate className={s.sheet}>
          <div className={s.sheetHead}>
            <h2 className={serif.className}>Zapytanie o wycenę</h2>
            <p aria-live="polite">Dla: <b>{formLabel.label}</b>, {vat ? 'czynny VAT' : 'bez VAT'}, {staff ? `pracownicy: ${staffCount}` : 'bez pracowników'}</p>
          </div>

          {sent ? <Sent what="zapytanie trafi do biura razem z opisem firmy, a biuro odpisze z zakresem i ceną." /> : (
            <div className={s.sheetGrid}>
              <div className={s.col}>
                <p className={s.colHead}>Twoja firma</p>
                <Boxes no="1" name={`${uid}-forma`} legend="Forma prawna" options={FORMS.map((f) => f.label)} value={formLabel.label} onChange={(v) => pickForm(FORMS.find((f) => f.label === v)!.key)} />
                <Boxes no="2" name={`${uid}-ewid`} legend="Ewidencja" options={LEDGER_CHOICES} value={ledger} onChange={setLedger} />
                <Boxes no="3" name={`${uid}-dok`} legend="Dokumenty w miesiącu, sprzedaż i koszty razem" options={DOC_COUNTS} value={docs} onChange={setDocs} />
                <Boxes no="4" name={`${uid}-prac`} legend="Pracownicy i zleceniobiorcy" options={STAFF_COUNTS} value={staffCount} onChange={setStaffCount} />
                <Boxes no="5" name={`${uid}-sytuacja`} legend="Sytuacja" options={SITUATIONS} value={situation} onChange={setSituation} />
              </div>
              <div className={s.col}>
                <p className={s.colHead}>Kontakt</p>
                <Line no="6" label="Imię"><input name="imie" autoComplete="given-name" /></Line>
                <Line no="7" label="E-mail" error={error ? 'Podaj e-mail albo telefon, żebyśmy mogli odesłać wycenę.' : undefined} errorId={errId}>
                  <input name="email" type="email" inputMode="email" autoComplete="email" aria-invalid={error} aria-describedby={error ? errId : undefined} onChange={() => setError(false)} />
                </Line>
                <Line no="8" label="Telefon"><input name="telefon" type="tel" inputMode="tel" autoComplete="tel" onChange={() => setError(false)} /></Line>
                <p className={s.formNote}>Wystarczy e-mail albo telefon. Odpiszemy tam, gdzie wolisz.</p>
                <button type="submit" className={s.send}>Poproś o wycenę</button>
              </div>
            </div>
          )}
        </form>
      </section>

      <section className={s.scope}>
        <div className={s.secHead}>
          <h2 className={`${s.h2} ${serif.className}`}>Zakres obsługi</h2>
          <p>Przykładowy zakres, do potwierdzenia przez biuro</p>
        </div>
        <ul>
          {SCOPE.map((x, i) => (
            <li key={x.title}>
              <span className={`${s.num} ${serif.className}`}>{String(i + 1).padStart(2, '0')}</span>
              <div><h3 className={serif.className}>{x.title}</h3><p className={s.who}>{x.who}</p><p>{x.text}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.duties}>
        <div className={s.secHead}>
          <h2 className={`${s.h2} ${serif.className}`}>Kto co robi</h2>
          <p>Od pierwszego zapytania do rozliczenia rocznego</p>
        </div>
        <table>
          <thead><tr><th scope="col"><span className={s.vh}>Etap</span></th><th scope="col">Ty</th><th scope="col">Biuro</th></tr></thead>
          <tbody>
            {DUTIES.map((d) => (
              <tr key={d.step}><th scope="row" className={serif.className}>{d.step}</th><td data-h="Ty">{d.you}</td><td data-h="Biuro">{d.we}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={s.prep}>
        <div>
          <h2 className={`${s.h2} ${serif.className}`}>Do wyceny przydadzą się</h2>
          <ul className={s.ticks}>{ACC_PREPARE.map((p) => <li key={p}>{p}</li>)}</ul>
          <button type="button" className={s.cta} onClick={() => scrollTo(formRef.current)}>Poproś o wycenę</button>
        </div>
        <div>
          <h3 className={serif.className}>O biurze</h3>
          <ul className={s.slots}>{ACC_SLOTS.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </section>

      <Foot company={company} city={city} slot="Tu numer telefonu i e-mail biura" />
      <Thumb cta="Wycena obsługi" onCta={() => scrollTo(formRef.current)} />
    </div>
  );
}

/* ================================================================== estate and property */

/** Elevation drawings, stroke only, so nothing can pass for a photo of a real property. */
function Elevation({ glyph, draw }: { glyph: Glyph; draw: boolean }) {
  const p = { pathLength: 1, className: draw ? s.draw : undefined };
  const win = (cols: number, rows: number, x0: number, y0: number, dx: number, dy: number, w: number, h: number, mine?: [number, number]) => {
    const out: ReactNode[] = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const own = mine && mine[0] === r && mine[1] === c;
      out.push(<rect key={`${r}-${c}`} x={x0 + c * dx} y={y0 + r * dy} width={w} height={h} {...p} className={`${p.className ?? ''} ${own ? s.mine : ''}`} />);
    }
    return out;
  };
  let body: ReactNode;
  switch (glyph) {
    case 'house':
      body = <><path d="M98 180V98h124v82" {...p} /><path d="M84 104l76-60 76 60" {...p} /><path d="M196 74V52h14v33" {...p} /><rect x="148" y="136" width="24" height="44" {...p} className={`${p.className ?? ''} ${s.mine}`} /><rect x="112" y="116" width="24" height="20" {...p} /><rect x="184" y="116" width="24" height="20" {...p} /></>;
      break;
    case 'plot':
      body = <><path d="M54 172l58-56h160l-22 56z" {...p} className={`${p.className ?? ''} ${s.dash}`} /><circle cx="54" cy="172" r="4" {...p} /><circle cx="112" cy="116" r="4" {...p} /><circle cx="272" cy="116" r="4" {...p} /><circle cx="250" cy="172" r="4" {...p} /><circle cx="226" cy="88" r="20" {...p} /><path d="M226 108v26" {...p} /><path d="M150 150h50" {...p} className={`${p.className ?? ''} ${s.dash}`} /></>;
      break;
    case 'shop':
      body = <><path d="M80 180V38h160v142" {...p} />{win(4, 2, 94, 52, 38, 30, 20, 16)}<path d="M80 118h160l-8 12H88z" {...p} /><rect x="94" y="136" width="96" height="44" {...p} className={`${p.className ?? ''} ${s.mine}`} /><rect x="202" y="136" width="26" height="44" {...p} /></>;
      break;
    case 'office':
      body = <><path d="M116 180V14h88v166" {...p} />{[30, 48, 66, 84, 102, 120, 138, 156].map((y) => <path key={y} d={`M116 ${y}h88`} {...p} />)}<rect x="146" y="160" width="28" height="20" {...p} className={`${p.className ?? ''} ${s.mine}`} /></>;
      break;
    case 'block':
      body = <><path d="M52 180V22h216v158" {...p} />{win(7, 6, 64, 34, 29, 23, 16, 13)}<rect x="146" y="164" width="28" height="16" {...p} /></>;
      break;
    default:
      body = <><path d="M92 180V28h136v152" {...p} /><path d="M86 28h148" {...p} />{win(4, 6, 106, 40, 30, 22, 18, 13, [2, 2])}<rect x="148" y="166" width="24" height="14" {...p} /></>;
  }
  return (
    <svg viewBox="0 0 320 200" className={s.elev} aria-hidden="true">
      <path d="M22 180h276" className={s.ground} />
      {body}
    </svg>
  );
}

function Estate({ company, variant, embedded, preview }: { company: Company; variant: 'pro_realestate' | 'pro_property'; embedded: boolean; preview: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const copy = ESTATE_COPY[variant];
  const roles = variant === 'pro_property' ? PROPERTY_ROLES : ESTATE_ROLES;

  const [roleKey, setRoleKey] = useState(roles[0].key);
  const role: Role = roles.find((r) => r.key === roleKey) ?? roles[0];
  const [type, setType] = useState(role.types[0].label);
  const [area, setArea] = useState(preview ? '54' : '');
  const [rooms, setRooms] = useState(preview ? '3' : '');
  const [units, setUnits] = useState(preview ? '24' : '');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [manager, setManager] = useState('');
  const [tenant, setTenant] = useState('');
  const [timing, setTiming] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const [filter, setFilter] = useState('Wszystkie');
  const [moved, setMoved] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const typeDef = role.types.find((t) => t.label === type) ?? role.types[0];
  const has = (f: (typeof role.fields)[number]) => role.fields.includes(f) && !(f === 'rooms' && (typeDef.glyph === 'plot' || typeDef.glyph === 'shop' || typeDef.glyph === 'office'));

  const pickRole = (k: string, jump = false) => {
    const r = roles.find((x) => x.key === k)!;
    setRoleKey(k);
    setMoved(true);
    setSent(false);
    if (!r.types.some((t) => t.label === type)) setType(r.types[0].label);
    setTiming('');
    if (jump) scrollTo(formRef.current);
  };

  // The drafted card: what the visitor gave, in the shape of a listing.
  const n = (v: string) => Number(v.replace(',', '.'));
  const searching = role.key === 'szukam';
  const areaTxt = area && n(area) > 0 ? `${searching ? 'ok. ' : ''}${area} m²` : '— m²';
  const roomsTxt = rooms ? (rooms === '4+' ? '4 i więcej pokoi' : `${rooms} ${plural(n(rooms), 'pokój', 'pokoje', 'pokoi')}`) : '— pokoje';
  const unitsTxt = units && n(units) > 0 ? `${units} ${plural(n(units), 'lokal', 'lokale', 'lokali')}` : '— lokali';
  const where = location.trim() || city || 'lokalizacja do uzupełnienia';
  const title = searching ? `Szukam: ${type.toLocaleLowerCase('pl')}` : type;
  const meta = [has('units') ? unitsTxt : has('area') ? areaTxt : null, has('rooms') ? roomsTxt : null, where].filter(Boolean).join(' · ');
  const tag = searching && timing ? `Poszukiwane: ${timing.toLocaleLowerCase('pl')}` : role.tag;
  const value = role.value.replace('{budget}', budget.trim() || 'do ustalenia');
  const extra = [has('manager') && manager, has('tenant') && tenant, !searching && has('timing') && timing].filter(Boolean).join(' · ');
  const cardNote = variant === 'pro_property' ? 'Szkic z Twojego opisu. Ofertę zarządu przygotujemy po rozmowie.' : searching ? 'Szkic z Twojego opisu. Damy znać, gdy pojawi się pasująca oferta.' : 'Szkic z Twojego opisu. Pełną ofertę przygotujemy po oględzinach.';

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tel = String(new FormData(e.currentTarget).get('telefon') ?? '').replace(/\D/g, '');
    if (tel.length < 9) { setError(true); return; }
    setError(false);
    setSent(true);
  };

  const errId = `${uid}-err`;
  const listings = LISTING_EXAMPLES.filter((l) => filter === 'Wszystkie' || l.tag === (filter === 'Sprzedaż' ? 'Sprzedaż' : 'Wynajem'));

  return (
    <div lang="pl" className={`${s.site} ${s.est} ${variant === 'pro_property' ? s.prop : ''} ${sans.className}`}>
      <Top name={name} cta={variant === 'pro_property' ? 'Oferta zarządu' : 'Opisz nieruchomość'} onCta={() => scrollTo(formRef.current)} />

      <section className={s.compose}>
        <div className={s.estIntro}>
          <Title className={`${s.h1} ${s.estH1} ${serif.className}`}>{copy.h1}</Title>
          {city && <p className={`${s.area} ${serif.className}`}>{city} <em>i okolice</em></p>}
          <p className={s.lead}>{copy.lead}</p>
          <p className={s.ask}>{copy.ask}</p>
          <div className={s.roles} role="group" aria-label={copy.ask}>
            {roles.map((r, i) => (
              <button key={r.key} type="button" aria-pressed={roleKey === r.key} onClick={() => pickRole(r.key)}>
                <span className={`${s.rn} ${serif.className}`}>{['I', 'II', 'III'][i]}</span>
                <span><b className={serif.className}>{r.label}</b><small>{r.sub}</small></span>
              </button>
            ))}
          </div>
        </div>

        <div className={s.cardCol}>
          <div className={s.card} aria-live="polite">
            <p className={s.cardKick}>{role.cardTitle}</p>
            <div className={s.photo}>
              <span key={tag} className={`${s.ribbon} ${moved ? s.swing : ''}`}>{tag}</span>
              <Elevation key={typeDef.glyph} glyph={typeDef.glyph} draw={!preview} />
              <span className={s.illu}>Rysunek poglądowy</span>
            </div>
            <div className={s.cardBody}>
              <h2 className={serif.className}>{title}</h2>
              <p className={s.cardMeta}>{meta}</p>
              {extra && <p className={s.cardMeta}>{extra}</p>}
              <p className={s.value}>{value}</p>
            </div>
            <p className={s.cardNote}>{cardNote}</p>
          </div>
        </div>

        <div ref={formRef} className={s.estForm}>
          <h2 className={`${s.formTitle} ${serif.className}`}>{role.formTitle}</h2>
          {sent ? <Sent what="zgłoszenie trafi do biura razem ze szkicem, który widzisz obok." /> : (
            <form onSubmit={submit} noValidate className={s.fields}>
              <Boxes name={`${uid}-typ`} legend={FIELD_LABEL.type} options={role.types.map((t) => t.label)} value={type} onChange={setType} />
              {has('units') && <Line label={FIELD_LABEL.units}><input name="lokale" inputMode="numeric" value={units} onChange={(e) => setUnits(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="Np. 24" /></Line>}
              {has('area') && <Line label={searching ? 'Powierzchnia, mniej więcej' : FIELD_LABEL.area}><span className={s.unit}><input name="metraz" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value.replace(/[^\d,.]/g, '').slice(0, 6))} placeholder="Np. 54" /><i>m²</i></span></Line>}
              {has('rooms') && <Boxes name={`${uid}-pokoje`} legend={FIELD_LABEL.rooms} options={ROOMS} value={rooms} onChange={setRooms} />}
              <Line label={FIELD_LABEL.location}><input name="lokalizacja" autoComplete="off" value={location} onChange={(e) => setLocation(e.target.value.slice(0, 60))} placeholder={city ? `Np. ${city}, centrum` : 'Np. Śródmieście'} /></Line>
              {has('budget') && <Line label={FIELD_LABEL.budget}><input name="budzet" value={budget} onChange={(e) => setBudget(e.target.value.slice(0, 30))} placeholder="Np. do 600 tys. zł" /></Line>}
              {has('manager') && <Boxes name={`${uid}-zarzad`} legend={FIELD_LABEL.manager} options={MANAGER} value={manager} onChange={setManager} />}
              {has('tenant') && <Boxes name={`${uid}-najem`} legend={FIELD_LABEL.tenant} options={TENANT} value={tenant} onChange={setTenant} />}
              {has('timing') && role.timing.length > 0 && <Boxes name={`${uid}-kiedy`} legend={searching ? 'Kupno czy najem?' : FIELD_LABEL.timing} options={role.timing} value={timing} onChange={setTiming} />}
              <div className={s.pair}>
                <Line label="Imię"><input name="imie" autoComplete="given-name" /></Line>
                <Line label="Telefon" error={error ? 'Podaj numer, żebyśmy mogli oddzwonić.' : undefined} errorId={errId}>
                  <input name="telefon" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={error} aria-describedby={error ? errId : undefined} onChange={() => setError(false)} />
                </Line>
              </div>
              <button type="submit" className={s.send}>{role.cta}</button>
            </form>
          )}
        </div>
      </section>

      {variant === 'pro_realestate' ? (
        <section className={s.listings}>
          <div className={s.secHead}>
            <h2 className={`${s.h2} ${serif.className}`}>Oferty</h2>
            <div role="group" aria-label="Rodzaj oferty" className={s.seg}>
              {['Wszystkie', 'Sprzedaż', 'Wynajem'].map((f) => <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}
            </div>
          </div>
          <p className={s.listNote}>{LISTING_NOTE}</p>
          <ul className={s.grid}>
            {listings.map((l) => (
              <li key={l.title} className={s.example}>
                <div className={s.photo}><span className={s.stamp}>Przykład</span><Elevation glyph={l.glyph} draw={false} /><span className={s.illu}>Tu zdjęcie oferty</span></div>
                <div className={s.cardBody}>
                  <p className={s.exTag}>{l.tag}</p>
                  <h3 className={serif.className}>{l.title}</h3>
                  <p className={s.cardMeta}>{l.meta}</p>
                  <p className={s.value}>— zł</p>
                </div>
              </li>
            ))}
            <li className={s.askCard}>
              <h3 className={serif.className}>Nie ma tu tego, czego szukasz?</h3>
              <p>Zostaw zlecenie poszukiwania. Damy znać, gdy pojawi się oferta, która do niego pasuje.</p>
              <button type="button" onClick={() => pickRole('szukam', true)}>Zostaw zlecenie</button>
            </li>
          </ul>
        </section>
      ) : (
        <section className={s.listings}>
          <div className={s.secHead}>
            <h2 className={`${s.h2} ${serif.className}`}>Co obejmuje zarząd</h2>
            <p>Przykładowy zakres, do potwierdzenia przez firmę</p>
          </div>
          <ul className={s.mgmt}>
            {MANAGEMENT_SCOPE.map((m, i) => (
              <li key={m.title}><span className={`${s.num} ${serif.className}`}>{String(i + 1).padStart(2, '0')}</span><h3 className={serif.className}>{m.title}</h3><p>{m.text}</p></li>
            ))}
          </ul>
        </section>
      )}

      <section className={s.path}>
        <div className={s.secHead}>
          <h2 className={`${s.h2} ${serif.className}`}>Jak pracujemy</h2>
          <div role="group" aria-label="Pokaż przebieg dla" className={s.seg}>
            {roles.map((r) => <button key={r.key} type="button" aria-pressed={roleKey === r.key} onClick={() => pickRole(r.key)}>{r.label}</button>)}
          </div>
        </div>
        <ol key={role.key} className={s.track}>
          {role.steps.map(([t, d], i) => (
            <li key={t} style={{ ['--i' as string]: i }}><span className={`${s.node} ${serif.className}`}>{i + 1}</span><h3 className={serif.className}>{t}</h3><p>{d}</p></li>
          ))}
        </ol>
        <p className={s.trackNote}>Przykładowy przebieg, do potwierdzenia przez firmę.</p>
      </section>

      <section className={s.prep}>
        <div>
          <h2 className={`${s.h2} ${serif.className}`}>Na pierwszą rozmowę przydadzą się</h2>
          <ul className={s.ticks}>{copy.prepare.map((p) => <li key={p}>{p}</li>)}</ul>
          <button type="button" className={s.cta} onClick={() => scrollTo(formRef.current)}>{role.cta}</button>
        </div>
        <div>
          <h3 className={serif.className}>O biurze</h3>
          <ul className={s.slots}>{copy.slots.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </section>

      <Foot company={company} city={city} slot="Tu numer telefonu i e-mail biura" />
      <Thumb cta={variant === 'pro_property' ? 'Oferta zarządu' : 'Opisz nieruchomość'} onCta={() => scrollTo(formRef.current)} />
    </div>
  );
}

export default function ProfessionalSite({ company, variant, embedded = false, preview = false }: { company: PublicDemo['config']['company']; variant: string; embedded?: boolean; preview?: boolean }) {
  const v = proVariant(variant);
  if (v === 'pro_accounting') return <Accounting company={company} embedded={embedded} preview={preview} />;
  return <Estate key={v} company={company} variant={v} embedded={embedded} preview={preview} />;
}
