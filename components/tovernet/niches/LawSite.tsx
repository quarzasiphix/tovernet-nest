'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Archivo_Narrow, Spectral } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { nameScale, presentPkd } from '@/lib/tovernet/niches/business';
import { lawContent } from '@/lib/tovernet/niches/law';
import s from './law.module.css';

const serif = Spectral({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '500'], style: ['normal', 'italic'], display: 'swap' });
const sans = Archivo_Narrow({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], display: 'swap' });

// Law firm concept. The advertising limits are the idea: the page is set as a legal act stitched
// into a file, with a contents list, numbered articles and third-person information only. The
// contact form is one clause of that act. It has no field for the matter: that line is blacked
// out and the blackout draws once when the clause comes into view. The form sends nothing.

type Company = PublicDemo['config']['company'];

const CONTACT = ['telefoniczny', 'e-mailowy', 'w celu umówienia spotkania'];
const ASK_FIRST = 'wskażę w rozmowie';

export default function LawSite({
  company, variant, embedded = false, preview = false,
}: { company: Company; variant: string; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const c = lawContent(variant);
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const act = presentPkd(company.pkd);

  const [how, setHow] = useState(CONTACT[0]);
  const [when, setWhen] = useState(c.when[0]);
  const [who, setWho] = useState(c.whoAsk[0]);
  const [area, setArea] = useState(ASK_FIRST);
  const [signed, setSigned] = useState('');
  const [reach, setReach] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  // The blackout stays drawn until JavaScript arms it, so the page reads without it.
  const [armed, setArmed] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const clause = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (preview || typeof IntersectionObserver === 'undefined' || !clause.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setArmed(true);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setArmed(false); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(clause.current);
    return () => io.disconnect();
  }, [preview]);

  // Buttons, not #hash links: the offer page keeps the demo id in the fragment.
  const goTo = (el: Element | null | undefined) => {
    const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };
  const goArt = (i: number) => goTo(root.current?.querySelector(`[data-art="${i}"]`));
  const last = c.toc.length - 1;
  const toContact = () => goArt(last);
  const pickArea = (a: string) => { setArea(a); setSent(false); toContact(); };

  const reachLabel = how === 'telefoniczny' ? 'Numer telefonu' : how === 'e-mailowy' ? 'Adres e-mail' : 'Telefon lub e-mail';
  const reachError = how === 'telefoniczny' ? 'Podaj numer telefonu, na który kancelaria może oddzwonić.' : how === 'e-mailowy' ? 'Podaj adres e-mail, na który kancelaria może odpowiedzieć.' : 'Podaj telefon albo e-mail, żeby kancelaria mogła się skontaktować.';

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = reach.trim();
    const mail = /^\S+@\S+\.\S+$/.test(v);
    const phone = v.replace(/\D/g, '').length >= 9;
    const ok = how === 'telefoniczny' ? phone : how === 'e-mailowy' ? mail : mail || phone;
    if (!ok) { setError(true); return; }
    setError(false);
    setSent(true);
  };

  const Art = ({ i }: { i: number }) => <p className={`${s.artNo} ${sans.className}`}>Art. {i + 1}</p>;
  const Slot = ({ children }: { children: string }) => <span className={`${s.slot} ${sans.className}`}>{children}</span>;

  return (
    <div ref={root} lang="pl" className={`${s.site} ${serif.className}`} data-preview={preview || undefined}>
      <div className={s.page}>
      <header className={`${s.mast} ${sans.className}`}>
        <span className={s.mastName}>{name}</span>
        <span className={`${s.slot} ${s.mastSlot}`}>Tu telefon kancelarii</span>
        <button type="button" className={s.mastGo} onClick={toContact}>Kontakt</button>
      </header>

      <section className={s.hero}>
        <p className={`${s.spineText} ${sans.className}`} aria-hidden="true">Informacja o kancelarii</p>
        <div className={s.title}>
          <p className={`${s.kicker} ${sans.className}`}>Informacja o kancelarii{city ? ` · ${city}` : ''}</p>
          <Title className={s.name} data-scale={nameScale(name)}>{name}</Title>
        </div>
        <div className={s.intro}>
          <p className={s.lead}>{c.lead}</p>
          <p className={`${s.titleSlot} ${sans.className}`}>Tu tytuł zawodowy i nazwiska osób prowadzących kancelarię</p>
          <button type="button" className={`${s.contactBtn} ${sans.className}`} onClick={toContact}>Skontaktuj się z kancelarią</button>
        </div>
        <nav className={`${s.toc} ${sans.className}`} aria-label="Spis treści">
          <p className={s.tocTitle}>Spis treści</p>
          <ol>
            {c.toc.map((t, i) => (
              <li key={t}>
                <button type="button" onClick={() => goArt(i)}>
                  <span>{t}</span><span className={s.dots} style={{ animationDelay: `${i * 90}ms` }} aria-hidden="true" /><span>Art. {i + 1}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <section className={s.art} data-art={0}>
        <Art i={0} />
        <h2 className={s.h2}>{c.toc[0]}</h2>
        <dl className={s.body}>
          <div className={s.row}><dt className={sans.className}>Firma</dt><dd>{company.legal_name}</dd></div>
          <div className={s.row}><dt className={sans.className}>Siedziba</dt><dd>{city ?? <Slot>Tu adres siedziby</Slot>}</dd></div>
          <div className={s.row}><dt className={sans.className}>KRS</dt><dd>{company.krs ?? <Slot>Tu numer KRS</Slot>}</dd></div>
          <div className={s.row}><dt className={sans.className}>Przedmiot działalności</dt><dd>{act ? `${act.label} (PKD ${act.code})` : <Slot>Tu przedmiot działalności</Slot>}</dd></div>
          <div className={s.row}><dt className={sans.className}>Tytuły zawodowe</dt><dd><Slot>Tu tytuły zawodowe i organ prowadzący wpis, jeśli dotyczy</Slot></dd></div>
          <div className={s.row}><dt className={sans.className}>NIP</dt><dd><Slot>Tu NIP</Slot></dd></div>
        </dl>
      </section>

      <section className={s.art} data-art={1}>
        <Art i={1} />
        <div className={s.head}>
          <h2 className={s.h2}>{c.toc[1]}</h2>
          <p className={s.gloss}>{c.areasNote}</p>
        </div>
        <ol className={s.body}>
          {c.areas.map((a, i) => (
            <li key={a} className={s.area}>
              <span className={`${s.para} ${sans.className}`}>§ {i + 1}</span>
              <span>{a}</span>
              <button type="button" className={sans.className} onClick={() => pickArea(a)}>Wybierz w formularzu</button>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.art} data-art={2}>
        <Art i={2} />
        <h2 className={s.h2}>{c.toc[2]}</h2>
        <div className={s.body}>
          {[0, 1].map((n) => (
            <p key={n} className={s.person}>
              <Slot>Tu imię i nazwisko</Slot><Slot>Tu tytuł zawodowy</Slot><Slot>Tu numer wpisu, jeśli dotyczy</Slot>
            </p>
          ))}
        </div>
      </section>

      <section className={s.art} data-art={3}>
        <Art i={3} />
        <div className={s.head}>
          <h2 className={s.h2}>{c.toc[3]}</h2>
          <p className={s.gloss}>{c.stepsNote}</p>
        </div>
        <ol className={s.body}>
          {c.steps.map(([t, d], i) => (
            <li key={t} className={s.step}>
              <span className={`${s.para} ${sans.className}`}>§ {i + 1}</span>
              <div><h3>{t}</h3><p>{d}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.art} data-art={4}>
        <Art i={4} />
        <h2 className={s.h2}>{c.toc[4]}</h2>
        <dl className={s.body}>
          {c.practical.map(([t, d]) => (
            <div key={t} className={s.row}><dt className={sans.className}>{t}</dt><dd><Slot>{d}</Slot></dd></div>
          ))}
        </dl>
      </section>

      <section className={s.art} data-art={5}>
        <Art i={5} />
        <div className={s.head}>
          <h2 className={s.h2}>{c.toc[5]}</h2>
          <p className={`${s.slot} ${s.contactSlot} ${sans.className}`}>Tu telefon, e-mail i adres kancelarii</p>
        </div>
        <form ref={clause} className={`${s.body} ${s.clause} ${armed ? s.armed : ''}`} onSubmit={submit} noValidate>
          <p className={s.sentence}>
            Proszę o kontakt{' '}
            <select aria-label="Sposób kontaktu" value={how} onChange={(e) => { setHow(e.target.value); setError(false); }}>
              {CONTACT.map((o) => <option key={o}>{o}</option>)}
            </select>{' '}
            <select aria-label="Pora kontaktu" value={when} onChange={(e) => setWhen(e.target.value)}>
              {c.when.map((o) => <option key={o}>{o}</option>)}
            </select>.
          </p>
          <p className={s.sentence}>
            Piszę jako{' '}
            <select aria-label="Kto pisze" value={who} onChange={(e) => setWho(e.target.value)}>
              {c.whoAsk.map((o) => <option key={o}>{o}</option>)}
            </select>.
          </p>
          <p className={s.sentence}>
            Obszar sprawy:{' '}
            <select aria-label="Obszar sprawy" value={area} onChange={(e) => setArea(e.target.value)}>
              <option>{ASK_FIRST}</option>
              {c.areas.map((o) => <option key={o}>{o}</option>)}
            </select>.
          </p>

          <div className={s.matter}>
            <span className={s.matterLabel}>Treść sprawy:</span>
            <span className={s.bars} role="img" aria-label="Zaczernione: treści sprawy nie podaje się w formularzu.">
              <i /><i /><i />
            </span>
          </div>
          <p className={`${s.warning} ${sans.className}`}><strong>Bez opisu sprawy.</strong> {c.warning}</p>

          <div className={`${s.fields} ${sans.className}`}>
            <label className={s.field}>
              <span>Imię i nazwisko lub nazwa</span>
              <input value={signed} autoComplete="name" onChange={(e) => setSigned(e.target.value)} />
            </label>
            <label className={`${s.field} ${error ? s.bad : ''}`}>
              <span>{reachLabel}</span>
              <input
                value={reach}
                type={how === 'e-mailowy' ? 'email' : how === 'telefoniczny' ? 'tel' : 'text'}
                autoComplete={how === 'telefoniczny' ? 'tel' : 'email'}
                aria-invalid={error}
                aria-describedby={error ? `${uid}-err` : undefined}
                onChange={(e) => { setReach(e.target.value); setError(false); }}
              />
            </label>
          </div>
          {error && <em id={`${uid}-err`} role="alert" className={`${s.err} ${sans.className}`}>{reachError}</em>}

          {sent ? (
            <p role="status" className={`${s.sent} ${sans.className}`}><strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie prośba o kontakt trafi do kancelarii.</p>
          ) : (
            <button type="submit" className={`${s.send} ${sans.className}`}>Wyślij prośbę o kontakt</button>
          )}
          <p className={`${s.slot} ${sans.className}`}>Tu informacja o przetwarzaniu danych w formularzu</p>
        </form>
      </section>

      <footer className={`${s.foot} ${sans.className}`}>
        <p>{company.legal_name}{company.krs ? ` · KRS ${company.krs}` : ''}{city ? ` · ${city}` : ''}</p>
        <p>Treści na tej stronie mają charakter informacyjny.</p>
      </footer>

      {!preview && <div className={`${s.thumb} ${sans.className}`}><span>Tu telefon</span><button type="button" onClick={toContact}>Skontaktuj się</button></div>}
      </div>
    </div>
  );
}
