'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Familjen_Grotesk, JetBrains_Mono } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { initials, nameScale, presentPkd } from '@/lib/tovernet/niches/business';
import { techContent } from '@/lib/tovernet/niches/tech';
import s from './tech.module.css';

const sans = Familjen_Grotesk({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], display: 'swap' });

// Software and games concept. The hero is the conversion: the visitor picks answers and a brief
// is written line by line beside them, each new line marked like an added line in a diff. The
// process below is a commit log whose branch line draws as it scrolls in. The form sends nothing.

type Company = PublicDemo['config']['company'];

export default function TechSite({
  company, variant, embedded = false, preview = false,
}: { company: Company; variant: string; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const c = techContent(variant);
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const act = presentPkd(company.pkd);

  const [picked, setPicked] = useState<Record<string, string>>(() =>
    preview ? Object.fromEntries(c.groups.map((g) => [g.key, g.options[0]])) : {});
  const [opis, setOpis] = useState('');
  const [reach, setReach] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  // Steps are visible until JavaScript arms the animation, so the page reads without it.
  const [armed, setArmed] = useState(false);

  const log = useRef<HTMLOListElement>(null);
  const composer = useRef<HTMLFormElement>(null);

  // Scoped observer only: the concept also renders embedded and in a scaled miniature.
  useEffect(() => {
    if (preview || typeof IntersectionObserver === 'undefined' || !log.current) return;
    setArmed(true);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setArmed(false); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(log.current);
    return () => io.disconnect();
  }, [preview]);

  // A button, not a #hash link: the offer page keeps the demo id in the fragment.
  const toBrief = () => {
    const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    composer.current?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = reach.trim();
    if (!/^\S+@\S+\.\S+$/.test(v) && v.replace(/\D/g, '').length < 9) { setError(true); return; }
    setError(false);
    setSent(true);
  };

  const first = picked[c.nextBy];
  const lines: [string, string][] = [
    ...c.groups.filter((g) => picked[g.key]).map((g): [string, string] => [g.key, picked[g.key]]),
    ...(first && c.next[first] ? [['pierwszy krok', c.next[first]] as [string, string]] : []),
    ...(opis.trim() ? [['opis', opis.trim()] as [string, string]] : []),
    ...(reach.trim() ? [['kontakt', reach.trim()] as [string, string]] : []),
  ];

  return (
    <div lang="pl" className={`${s.site} ${sans.className}`} data-preview={preview || undefined}>
      <header className={s.mast}>
        <span className={`${s.logo} ${mono.className}`} title="Tu Twoje logo">{initials(name)}</span>
        <span className={s.mastName}>{name}</span>
        <span className={`${s.slot} ${s.mastSlot}`}>Tu telefon i e-mail</span>
        <button type="button" className={s.mastGo} onClick={toBrief}>Napisz</button>
      </header>

      <section className={s.hero}>
        <div className={s.intro}>
          <p className={`${s.kicker} ${mono.className}`}>{c.kicker}{city ? ` · ${city}` : ''}</p>
          <Title className={s.name} data-scale={nameScale(name)}>{name}</Title>
          <p className={s.lead}>{c.lead}</p>
          {(act || company.krs) && (
            <dl className={`${s.reg} ${mono.className}`}>
              {act && <div><dt>PKD {act.code}</dt><dd>{act.label}</dd></div>}
              {company.krs && <div><dt>KRS</dt><dd>{company.krs}</dd></div>}
            </dl>
          )}
        </div>

        <form ref={composer} className={s.composer} onSubmit={submit} noValidate>
          <div className={s.questions}>
            {c.groups.map((g) => (
              <fieldset key={g.key} className={s.group}>
                <legend>{g.label}</legend>
                <div>
                  {g.options.map((o) => (
                    <label key={o}>
                      <input type="radio" name={`${uid}-${g.key}`} checked={picked[g.key] === o} onChange={() => setPicked((p) => ({ ...p, [g.key]: o }))} />
                      <span>{o}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <label className={s.field}><span>Kilka zdań</span><textarea rows={3} value={opis} placeholder={c.placeholder} onChange={(e) => setOpis(e.target.value)} /></label>
            <label className={`${s.field} ${error ? s.bad : ''}`}>
              <span>E-mail lub telefon</span>
              <input value={reach} autoComplete="email" aria-invalid={error} aria-describedby={error ? `${uid}-err` : undefined} onChange={(e) => { setReach(e.target.value); setError(false); }} />
            </label>
            {error && <em id={`${uid}-err`} role="alert" className={s.err}>Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.</em>}
          </div>

          <div className={`${s.doc} ${mono.className}`} aria-live="polite">
            <p className={s.docHead}><span>{c.fileName}</span><span>{lines.length ? `+${lines.length}` : 'pusty'}</span></p>
            <ol className={s.docBody}>
              {lines.length === 0 && <li className={s.docEmpty}><span>{c.empty}</span></li>}
              {lines.map(([k, v]) => (
                <li key={`${k}:${v}`}><span className={s.docKey}>{k}:</span> <span>{v}</span></li>
              ))}
            </ol>
            {sent ? (
              <p role="status" className={s.sent}><strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie ta wiadomość trafi prosto do firmy.</p>
            ) : (
              <button type="submit" className={`${s.send} ${sans.className}`}>{c.send}<span aria-hidden="true">→</span></button>
            )}
          </div>
        </form>
      </section>

      <section className={s.band}>
        <h2 className={s.h2}>{c.scopeTitle}</h2>
        <p className={`${s.note} ${mono.className}`}>{c.scopeNote}</p>
        <ul className={s.scope}>
          {c.scope.map(([t, d]) => (
            <li key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
              <button type="button" onClick={toBrief}>{c.scopeCta}</button>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.band}>
        <h2 className={s.h2}>{c.stepsTitle}</h2>
        <ol ref={log} className={`${s.log} ${armed ? s.armed : ''}`}>
          {c.steps.map(([t, d], i) => (
            <li key={t} style={{ transitionDelay: `${i * 140}ms` }}>
              <span className={`${s.hash} ${mono.className}`}>krok {i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <p className={`${s.note} ${mono.className}`}>{c.stepsNote}</p>
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
        <p className={s.slot}>Tu NIP, adres i informacja o przetwarzaniu danych</p>
      </footer>

      {!preview && <div className={s.thumb}><span>Tu Twój telefon</span><button type="button" onClick={toBrief}>Napisz do nas</button></div>}
    </div>
  );
}
