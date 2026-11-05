'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { DM_Mono, Newsreader, Onest } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import {
  CHAPTERS, FORM, HERO_LEAD, SLOTS, STEPS, STEPS_NOTE,
  initials, nameScale, presentPkd, sentenceCase, type BusinessPkd, type Sender,
} from '@/lib/tovernet/niches/business';
import s from './business.module.css';

const serif = Newsreader({ subsets: ['latin', 'latin-ext'], weight: 'variable', style: ['normal', 'italic'], axes: ['opsz'], display: 'swap' });
const sans = Onest({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], display: 'swap' });
const mono = DM_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], display: 'swap' });

// General company concept for every PKD without a niche. The page is set like a company
// prospectus: the name as the cover, a table of contents built from the four questions a
// visitor brings (who, what, how, how to ask), chapters with numbers in the margin, and a
// running head that rolls to the chapter being read. Registry facts are set as facts;
// everything the owner will write is an empty, labelled slot. The form sends nothing.

type Company = PublicDemo['config']['company'];
const ALL_RULED: Record<string, boolean> = { hero: true, firma: true, oferta: true, wspolpraca: true, kontakt: true };

export default function BusinessSite({
  company, variant: _variant, embedded = false, preview = false, pkd = null,
}: { company: Company; variant: string; embedded?: boolean; preview?: boolean; pkd?: BusinessPkd }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const form = sentenceCase(company.legal_form);
  const act = presentPkd(pkd);
  const scale = nameScale(name);

  const [current, setCurrent] = useState<number>(preview ? 0 : -1);
  const [ruled, setRuled] = useState<Record<string, boolean>>(() => (preview ? ALL_RULED : {}));
  const [sender, setSender] = useState<Sender>('firma');
  const [topic, setTopic] = useState<string | null>(preview ? FORM.topics[0] : null);
  const [reachError, setReachError] = useState(false);
  const [sent, setSent] = useState(false);

  const sections = useRef<Record<string, HTMLElement | null>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Running head and rules. Scoped observers only: the concept also renders inside other
  // pages and in a scaled miniature, so nothing here reads page scroll or the viewport size.
  useEffect(() => {
    if (preview || typeof IntersectionObserver === 'undefined') {
      setRuled(ALL_RULED);
      return;
    }
    const els = Object.entries(sections.current).filter(([, el]) => el) as [string, HTMLElement][];
    const rule = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const key = (e.target as HTMLElement).dataset.key!;
        setRuled((r) => (r[key] ? r : { ...r, [key]: true }));
        rule.unobserve(e.target);
      }
    }, { threshold: 0.12 });
    // A thin band across the upper middle of the screen: the chapter crossing it is "being read".
    // Fast jumps skip chapters, so on every change also ask whether chapter 01 is still
    // below the band: then the reader is on the cover and the head shows the contents.
    const head = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        // The cover counts too, so a jump straight back to the top resets the head.
        setCurrent(CHAPTERS.findIndex((c) => c.key === (e.target as HTMLElement).dataset.key));
      }
      const first = sections.current.firma;
      const band = (entries[0]?.rootBounds?.top ?? 0);
      if (first && first.getBoundingClientRect().top > band) setCurrent(-1);
    }, { rootMargin: '-38% 0px -56% 0px' });
    for (const [, el] of els) {
      rule.observe(el);
      head.observe(el);
    }
    return () => { rule.disconnect(); head.disconnect(); };
  }, [preview]);

  const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Buttons, not #hash links: the offer page keeps the demo id in the fragment.
  const go = (key: string) => {
    const el = key === 'kontakt' ? formRef.current : sections.current[key];
    el?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  };
  const ask = () => { setTopic(FORM.topics[0]); setSent(false); go('kontakt'); };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const mail = String(d.get('email') ?? '').trim();
    const tel = String(d.get('telefon') ?? '').replace(/\D/g, '');
    if (!/^\S+@\S+\.\S+$/.test(mail) && tel.length < 9) { setReachError(true); return; }
    setReachError(false);
    setSent(true);
  };

  const ch = current >= 0 ? CHAPTERS[current] : null;
  const reg = (key: string) => (el: HTMLElement | null) => { sections.current[key] = el; };

  return (
    <div lang="pl" className={`${s.site} ${sans.className}`} data-preview={preview || undefined}>
      <header className={s.mast}>
        <span className={`${s.logo} ${serif.className}`} title={SLOTS.logo}>
          <span aria-hidden="true">{initials(name)}</span>
          <span className={s.sr}>{SLOTS.logo}</span>
        </span>
        <span className={s.mastName}>{name}</span>
        <span className={`${s.run} ${mono.className}`} aria-hidden="true">
          {ch ? (
            <span key={ch.key} className={s.runIn}><b>{ch.n}</b><i>/ 04</i><span className={s.runTitle}>{ch.title}</span></span>
          ) : (
            <span key="spis" className={s.runIn}><span className={s.runTitle}>Spis treści</span></span>
          )}
        </span>
        <span className={`${s.slot} ${s.mastSlot}`}>{SLOTS.contact}</span>
        <button type="button" className={s.mastGo} onClick={() => go('kontakt')}>Napisz</button>
      </header>

      <section ref={reg('hero')} data-key="hero" className={`${s.hero} ${ruled.hero ? s.ruled : ''}`}>
        <div className={s.cover} data-scale={scale}>
          <Title className={`${s.name} ${serif.className}`} data-scale={scale}>{name}</Title>
          {(form || company.krs) && (
            <p className={`${s.colophon} ${mono.className}`}>
              {form && <span>{form}</span>}
              {company.krs && <span>KRS {company.krs}</span>}
            </p>
          )}
        </div>

        <div className={s.facts}>
          <div className={s.fact}>
            {act ? (
              <>
                <p className={`${s.cap} ${mono.className}`}>Główna działalność · PKD {act.code}</p>
                <p className={`${s.factBig} ${serif.className}`}>{act.label}</p>
              </>
            ) : (
              <>
                <p className={`${s.cap} ${mono.className}`}>Czym się zajmujemy</p>
                <p className={`${s.slot} ${s.slotBlock}`}>{SLOTS.sentence}</p>
              </>
            )}
          </div>
          <div className={s.fact}>
            <p className={`${s.cap} ${mono.className}`}>Siedziba</p>
            {city ? <p className={`${s.factBig} ${serif.className}`}>{city}</p> : <p className={`${s.slot} ${s.slotBlock}`}>{SLOTS.city}</p>}
          </div>
          <div className={s.lead}>
            <p>{HERO_LEAD}</p>
            <button type="button" className={s.primary} onClick={() => go('kontakt')}>Napisz do nas</button>
          </div>
        </div>

        <nav className={s.toc} aria-label="Spis treści">
          <p className={`${s.cap} ${mono.className}`}>Spis treści</p>
          <ol>
            {CHAPTERS.map((c) => (
              <li key={c.key}>
                <button type="button" onClick={() => go(c.key)}>
                  <span className={`${s.tocN} ${serif.className}`}>{c.n}</span>
                  <span className={`${s.tocT} ${serif.className}`}>{c.title}</span>
                  <span className={`${s.tocNote} ${mono.className}`}>{c.note}</span>
                  <span className={s.tocArrow} aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <section ref={reg('firma')} data-key="firma" className={`${s.chapter} ${ruled.firma ? s.ruled : ''}`} aria-labelledby={`${uid}-firma`}>
        <p className={`${s.num} ${serif.className}`} aria-hidden="true">01</p>
        <div className={s.body}>
          <h2 id={`${uid}-firma`} className={`${s.h2} ${serif.className}`}>Kim jesteśmy</h2>
          <div className={s.about}>
            <div className={s.aboutText}>
              <p className={`${s.cap} ${mono.className}`}>{SLOTS.aboutLabel}</p>
              <p className={`${s.slot} ${s.slotTall}`}>{SLOTS.about}</p>
              <div className={s.frame} role="img" aria-label={SLOTS.photo}>
                <span>{SLOTS.photo}</span>
              </div>
            </div>
            <div className={s.registry}>
              <p className={`${s.cap} ${mono.className}`}>Z rejestru</p>
              <dl>
                <div><dt>Nazwa</dt><dd>{company.legal_name}</dd></div>
                {form && <div><dt>Forma prawna</dt><dd>{form}</dd></div>}
                {city && <div><dt>Siedziba</dt><dd>{city}</dd></div>}
                {company.krs && <div><dt>KRS</dt><dd className={mono.className}>{company.krs}</dd></div>}
                {act && <div><dt>Główna działalność</dt><dd><span className={mono.className}>{act.code}</span> {act.label}</dd></div>}
              </dl>
              <p className={`${s.src} ${mono.className}`}>{company.krs ? 'Źródło: Krajowy Rejestr Sądowy' : 'Dane rejestrowe firmy'}</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={reg('oferta')} data-key="oferta" className={`${s.chapter} ${ruled.oferta ? s.ruled : ''}`} aria-labelledby={`${uid}-oferta`}>
        <p className={`${s.num} ${serif.className}`} aria-hidden="true">02</p>
        <div className={s.body}>
          <h2 id={`${uid}-oferta`} className={`${s.h2} ${serif.className}`}>Czym się zajmujemy</h2>
          <p className={`${s.note} ${mono.className}`}>{SLOTS.offerNote}</p>
          <ol className={s.offer}>
            {['A', 'B', 'C'].map((l) => (
              <li key={l}>
                <span className={`${s.offerL} ${serif.className}`}>{l}</span>
                {SLOTS.offerFields.map((f) => <span key={f} className={s.offerCell}>{f}</span>)}
                <button type="button" onClick={ask}>Zapytaj</button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section ref={reg('wspolpraca')} data-key="wspolpraca" className={`${s.chapter} ${ruled.wspolpraca ? s.ruled : ''}`} aria-labelledby={`${uid}-wsp`}>
        <p className={`${s.num} ${serif.className}`} aria-hidden="true">03</p>
        <div className={s.body}>
          <h2 id={`${uid}-wsp`} className={`${s.h2} ${serif.className}`}>Jak pracujemy</h2>
          <ol className={s.steps}>
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <span className={`${s.stepN} ${mono.className}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={serif.className}>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
          <p className={`${s.note} ${mono.className}`}>{STEPS_NOTE}</p>
        </div>
      </section>

      <section ref={reg('kontakt')} data-key="kontakt" className={`${s.chapter} ${s.contact} ${ruled.kontakt ? s.ruled : ''}`} aria-labelledby={`${uid}-kontakt`}>
        <p className={`${s.num} ${serif.className}`} aria-hidden="true">04</p>
        <form ref={formRef} onSubmit={submit} noValidate className={s.form}>
          <h2 id={`${uid}-kontakt`} className={`${s.h2} ${serif.className}`}>{FORM.title}</h2>
          <p className={s.formSub}>{FORM.sub}</p>

          {sent ? (
            <p role="status" className={s.sent}><strong>{FORM.sentTitle}</strong> {FORM.sentText}</p>
          ) : (
            <div className={s.fields}>
              <fieldset className={`${s.seg} ${s.full}`}>
                <legend>{FORM.senderLegend}</legend>
                <div>
                  {FORM.senders.map((o) => (
                    <label key={o.key}>
                      <input type="radio" name="nadawca" value={o.key} checked={sender === o.key} onChange={() => setSender(o.key)} />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {sender === 'firma' && (
                <>
                  <label className={`${s.field} ${s.appear}`}><span>Nazwa firmy</span><input name="firma" autoComplete="organization" /></label>
                  <label className={`${s.field} ${s.appear}`}><span>NIP <small>(opcjonalnie)</small></span><input name="nip" inputMode="numeric" autoComplete="off" /></label>
                </>
              )}
              <label className={`${s.field} ${s.full}`}><span>Imię i nazwisko</span><input name="imie" autoComplete="name" /></label>

              <fieldset className={`${s.chips} ${s.full}`}>
                <legend>{FORM.topicLegend}</legend>
                <div>
                  {FORM.topics.map((t) => (
                    <label key={t}>
                      <input type="radio" name="temat" value={t} checked={topic === t} onChange={() => setTopic(t)} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className={`${s.field} ${reachError ? s.bad : ''}`}>
                <span>E-mail</span>
                <input name="email" type="email" inputMode="email" autoComplete="email" aria-invalid={reachError} aria-describedby={reachError ? `${uid}-reach` : undefined} onChange={() => setReachError(false)} />
              </label>
              <label className={`${s.field} ${reachError ? s.bad : ''}`}>
                <span>Telefon</span>
                <input name="telefon" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={reachError} aria-describedby={reachError ? `${uid}-reach` : undefined} onChange={() => setReachError(false)} />
              </label>
              {reachError && <em id={`${uid}-reach`} role="alert" className={`${s.err} ${s.full}`}>{FORM.reachError}</em>}
              {!reachError && <p className={`${s.hint} ${s.full}`}>Wystarczy jedno z dwóch.</p>}

              <label className={`${s.field} ${s.full}`}>
                <span>Wiadomość</span>
                <textarea name="wiadomosc" rows={4} placeholder={FORM.message[sender]} />
              </label>

              <p className={`${s.slot} ${s.slotDark} ${s.full}`}>{SLOTS.privacy}</p>
              <button type="submit" className={`${s.send} ${s.full}`}>{FORM.cta}<span aria-hidden="true">→</span></button>
            </div>
          )}
        </form>
      </section>

      <footer className={s.foot}>
        <div>
          <p className={`${s.footName} ${serif.className}`}>{name}</p>
          <p className={`${s.footLegal} ${mono.className}`}>
            {company.legal_name}{company.krs ? ` · KRS ${company.krs}` : ''}{city ? ` · ${city}` : ''}
          </p>
        </div>
        <ul>{SLOTS.footer.map((f) => <li key={f} className={`${s.slot} ${s.slotDark}`}>{f}</li>)}</ul>
      </footer>

      {/* Sticky phone bar. Left out of previews: a miniature has no scroll box, so it would float mid-frame. */}
      {!preview && <div className={s.thumb}>
        <span>Tu Twój telefon</span>
        <button type="button" onClick={() => go('kontakt')}>Napisz do nas</button>
      </div>}
    </div>
  );
}
