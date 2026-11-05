'use client';

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Noto_Serif_Display, Jost } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity } from '@/lib/tovernet/construction';
import { beautyName, beautyVariant, DAYPART, HOURS, STEPS, STRANDS, TIPS, WHEN, type BeautyVariant } from '@/lib/tovernet/niches/beauty';
import s from './beauty.module.css';

const display = Noto_Serif_Display({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], display: 'swap', variable: '--bt-display' });
const text = Jost({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--bt-text' });

// Beauty concept (PKD 96.2x). The visitor is on a phone, checking the place before booking.
// The page leads with the salon's name like a brand, a hero object drawn in code (a colour
// chart, a nail tip fan or warm stones, labelled as illustrative), a treatment menu that
// fills an appointment card, and a booking path that points to the salon's own booking tool,
// phone or a request form. It never replaces Booksy and never shows prices, free slots,
// staff or reviews. The form sends nothing: its confirmation says it is a concept.

function Choice({ name, legend, options }: { name: string; legend: string; options: string[] }) {
  return (
    <fieldset className={s.choice}>
      <legend>{legend}</legend>
      <div>{options.map((o) => <label key={o}><input type="radio" name={name} value={o} /><span>{o}</span></label>)}</div>
    </fieldset>
  );
}

/** The hero object. Pure CSS and SVG, so nothing can pass as the salon's photo. */
function Art({ v, play }: { v: BeautyVariant; play: number }) {
  const cls = `${s.art} ${play ? (play % 2 ? s.playA : s.playB) : ''}`;
  if (v.art === 'strands') {
    return (
      <div className={cls} aria-hidden="true">
        <div className={s.fanTop}>
          <span className={s.ring} />
          {STRANDS.map((t, i) => (
            <span key={t.code} className={s.strand} style={{ '--i': i, '--a': `${(i - 4) * 5}deg`, '--c': t.c, '--d': t.d } as CSSProperties}>
              <span className={s.tag}>{t.code}</span>
              <span className={s.hair} />
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (v.art === 'tips') {
    return (
      <div className={cls} aria-hidden="true">
        <div className={s.fanBottom}>
          {TIPS.map((t, i) => (
            <span key={i} className={s.tipArm} style={{ '--i': i, '--a': `${(i - 4) * 9}deg`, '--c': t.c, '--d': t.d } as CSSProperties}>
              <span className={s.tip} />
              <span className={s.stick} />
            </span>
          ))}
          <span className={s.pin} />
        </div>
      </div>
    );
  }
  return (
    <div className={cls} aria-hidden="true">
      <svg className={s.steam} viewBox="0 0 120 120" preserveAspectRatio="xMidYMax meet">
        <path pathLength={1} d="M46 118 C36 96 58 84 48 62 C40 44 56 32 50 12" />
        <path pathLength={1} d="M62 118 C54 100 74 86 64 66 C56 50 70 40 66 22" />
        <path pathLength={1} d="M78 118 C70 102 88 92 80 74 C74 60 84 52 82 38" />
      </svg>
      <div className={s.cairn}>
        {[0, 1, 2, 3, 4].map((i) => <span key={i} className={s.stone} style={{ '--i': i } as CSSProperties} />)}
      </div>
      <span className={s.surface} />
    </div>
  );
}

export default function BeautySite({ company, variant, embedded = false, preview = false }: { company: PublicDemo['config']['company']; variant: string; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const v = beautyVariant(variant);
  const name = beautyName(company.display_name);
  const city = presentCity(company.city);
  const size = name.length <= 11 ? s.xl : name.length <= 18 ? s.l : name.length <= 28 ? s.m : s.sm;
  // The name is the hero. Its size follows the longest word, so no word overflows a phone.
  const longest = Math.max(5, ...name.split(' ').map((w) => w.length));

  const [picked, setPicked] = useState<string[]>(preview ? v.services.slice(0, 2).map((x) => x.key) : []);
  const [play, setPlay] = useState(0);
  const [online, setOnline] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [sent, setSent] = useState(false);

  const frameRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLFormElement>(null);

  // Once, when the hero object comes into view, it comes alive: the chart riffles like a
  // stylist thumbing through shades, the tips fan, the stones settle and steam rises.
  // The rest state is the finished drawing, so nothing jumps and no-JS shows it whole.
  useEffect(() => {
    const el = frameRef.current;
    if (preview || !el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setPlay((p) => p + 1); io.disconnect(); }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, [preview]);

  const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toCard = () => cardRef.current?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  const toggle = (key: string) => { setSent(false); setPicked((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key])); };
  const chosen = v.services.filter((x) => picked.includes(x.key));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phone = String(new FormData(e.currentTarget).get('telefon') ?? '').replace(/\D/g, '');
    if (phone.length < 9) { setPhoneError(true); return; }
    setPhoneError(false);
    setSent(true);
  };

  return (
    <div lang="pl" className={`${s.site} ${s[v.art] ?? ''} ${display.variable} ${text.variable}`}>
      <header className={s.top}>
        <span className={s.kicker}>{v.trade}{city && <><i aria-hidden="true"> · </i>{city}</>}</span>
        <button type="button" className={s.topCta} onClick={toCard}>Umów wizytę</button>
      </header>

      <section className={s.hero}>
        <div className={s.heroText}>
          <Title className={`${s.name} ${size}`} style={{ '--lw': longest } as CSSProperties}>{name}</Title>
          <p className={s.statement}>{v.statement[0]} <em>{v.statement[1]}</em></p>
          <p className={s.lead}>{v.lead}</p>
          <div className={s.heroCtas}>
            <button type="button" className={s.cta} onClick={toCard}>Umów wizytę</button>
            <span className={s.slot}>Tu Twój numer telefonu</span>
          </div>
        </div>
        <figure ref={frameRef} className={s.frame} onMouseEnter={() => { if (!preview) setPlay((p) => p + 1); }}>
          <div className={s.plate}><Art v={v} play={play} /></div>
          <figcaption><span>Grafika poglądowa</span><span>{v.artLabel}</span></figcaption>
        </figure>
      </section>

      <section className={s.book}>
        <div className={s.menu}>
          <div className={s.menuHead}>
            <h2 className={s.h2}>Zabiegi</h2>
            <p>Przykładowa lista do potwierdzenia przez firmę. Ceny i czas trwania wpisze salon.</p>
          </div>
          <ul>
            {v.services.map((x) => {
              const on = picked.includes(x.key);
              return (
                <li key={x.key}>
                  <button type="button" aria-pressed={on} onClick={() => toggle(x.key)} className={`${s.item} ${on ? s.on : ''}`}>
                    <span className={s.itemName}>{x.name}</span>
                    <span className={s.leader} aria-hidden="true" />
                    <span className={s.price}>cena</span>
                    <span className={s.add} aria-hidden="true" />
                    <span className={s.itemText}>{x.text}</span>
                    <span className={s.sr}>{on ? ', dodano do wizyty' : ', dodaj do wizyty'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <form id="wizyta" ref={cardRef} onSubmit={submit} noValidate className={s.card}>
          <div className={s.cardHead}>
            <span>Karta wizyty</span>
            <span className={s.cardName}>{name}</span>
          </div>
          <h2 className={s.cardTitle}>Umów wizytę</h2>

          <button type="button" className={s.online} onClick={() => setOnline((o) => !o)} aria-expanded={online}>
            <span>Wybierz godzinę online</span>
            <small>Tu link do Twojego Booksy lub innego kalendarza</small>
          </button>
          {online && <p className={s.note} role="status">Na gotowej stronie ten przycisk otworzy kalendarz, z którego już korzystasz. Jeśli nie masz żadnego, zostaje prośba o termin poniżej.</p>}

          <p className={s.or}><span>albo poproś o termin</span></p>

          {sent ? (
            <p role="status" className={s.sent}>
              <strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie prośba trafi prosto do firmy, razem z wybranymi zabiegami, a termin potwierdzicie telefonicznie albo SMS-em.
            </p>
          ) : (
            <div className={s.fields}>
              <div className={s.picked}>
                <span className={s.label}>Zabiegi</span>
                {chosen.length ? (
                  <ul aria-live="polite">
                    {chosen.map((x) => (
                      <li key={x.key}><button type="button" onClick={() => toggle(x.key)} aria-label={`Usuń: ${x.name}`}>{x.name}<i aria-hidden="true" /></button></li>
                    ))}
                  </ul>
                ) : <p className={s.hint} aria-live="polite">Zaznacz na liście albo opisz niżej.</p>}
              </div>
              <Choice name={v.extra.name} legend={v.extra.legend} options={v.extra.options} />
              <Choice name="kiedy" legend="Kiedy Ci pasuje?" options={WHEN} />
              <Choice name="pora" legend="Pora dnia" options={DAYPART} />
              <label className={s.field}><span>Imię</span><input name="imie" autoComplete="given-name" /></label>
              <label className={`${s.field} ${phoneError ? s.bad : ''}`}>
                <span>Telefon</span>
                <input name="telefon" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={phoneError} aria-describedby={phoneError ? 'bt-tel-err' : undefined} onChange={() => setPhoneError(false)} />
                {phoneError && <em id="bt-tel-err" role="alert">Podaj numer, żebyśmy mogli potwierdzić termin.</em>}
              </label>
              <label className={`${s.field} ${s.wide}`}><span>Uwagi (opcjonalnie)</span><textarea name="uwagi" rows={2} placeholder={v.placeholder} /></label>
              <button type="submit" className={s.send}>Poproś o termin</button>
            </div>
          )}
        </form>
      </section>

      <section className={s.first} aria-labelledby="bt-first">
        <h2 id="bt-first" className={s.firstTitle}>Pierwsza wizyta</h2>
        <ol>{STEPS.map(([t, d], i) => <li key={t}><span className={s.num}>0{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
      </section>

      <section className={s.gallery}>
        <div className={s.galleryHead}>
          <h2 className={s.h2}>Wnętrze</h2>
          <p>Miejsce na zdjęcia z telefonu: pionowe kadry, dzienne światło. Na stronie dostaną jeden spójny styl.</p>
        </div>
        <ul className={s.shots}>
          {v.shots.map(([t, d], i) => (
            <li key={t} className={s.shot}>
              <span className={s.shotNo}>0{i + 1}</span>
              <span className={s.shotName}>{t}</span>
              <span className={s.shotHint}>{d}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.visit}>
        <h2 className={s.h2}>Gdzie i kiedy</h2>
        <div className={s.visitGrid}>
          <div>
            <h3>Adres</h3>
            {city && <p className={s.city}>{city}</p>}
            <p className={s.slot}>{city ? 'Ulica i numer' : 'Adres salonu'}</p>
            <p className={s.slot}>Tu link do mapy i dojazdu</p>
          </div>
          <div>
            <h3>Godziny otwarcia</h3>
            <dl>{HOURS.map((d) => <div key={d}><dt>{d}</dt><dd className={s.slot}>godziny</dd></div>)}</dl>
          </div>
          <div>
            <h3>Kontakt</h3>
            <p className={s.slot}>Tu Twój numer telefonu</p>
            <p className={s.slot}>Instagram lub Facebook</p>
            <button type="button" className={s.cta} onClick={toCard}>Umów wizytę</button>
          </div>
        </div>
      </section>

      <footer className={s.foot}>
        <p className={s.legal}>{company.legal_name}{company.krs ? `, KRS ${company.krs}` : ''}{city ? `. ${city}` : ''}</p>
        <p>Grafiki poglądowe. Zabiegi przykładowe, do potwierdzenia przez firmę.</p>
      </footer>

      <div className={s.thumb}>
        <span>Tu Twój numer</span>
        <button type="button" onClick={toCard}>
          Umów wizytę{picked.length > 0 && <b key={picked.length} aria-label={`, wybrane zabiegi: ${picked.length}`}>{picked.length}</b>}
        </button>
      </div>
    </div>
  );
}
