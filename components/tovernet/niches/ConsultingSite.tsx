'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Hanken_Grotesk, Spectral } from 'next/font/google';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { nameScale, presentPkd, sentenceCase } from '@/lib/tovernet/niches/business';
import { consultingContent } from '@/lib/tovernet/niches/consulting';
import s from './consulting.module.css';

const serif = Spectral({ subsets: ['latin', 'latin-ext'], weight: ['300', '400'], style: ['normal', 'italic'], display: 'swap' });
const sans = Hanken_Grotesk({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });

// Business consulting concept. The hero is an issue tree: each choice draws a branch to the next
// level and the path ends in one question for the first conversation, which is also the form.
// The specialism is unknown, so the tree starts from problems and is labelled as an example.
// Counterparties get their own route to the registry sheet. The form sends nothing.

type Company = PublicDemo['config']['company'];
type Path = { k: string; d: string };
type Lines = { base: Path[]; active: Path[] };

/** Offsets, not client rects: the concept also renders inside a scaled miniature. */
function at(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { l: x, r: x + el.offsetWidth, t: y, b: y + el.offsetHeight, y: y + el.offsetHeight / 2 };
}

function elbow(x1: number, y1: number, x2: number, y2: number) {
  const dy = y2 - y1;
  if (Math.abs(dy) < 1) return `M${x1} ${y1}H${x2}`;
  const mx = x1 + (x2 - x1) / 2;
  const r = Math.min(10, Math.abs(dy) / 2);
  const dir = dy > 0 ? 1 : -1;
  return `M${x1} ${y1}H${mx - r}Q${mx} ${y1} ${mx} ${y1 + r * dir}V${y2 - r * dir}Q${mx} ${y2} ${mx + r} ${y2}H${x2}`;
}

export default function ConsultingSite({
  company, variant, embedded = false, preview = false,
}: { company: Company; variant: string; embedded?: boolean; preview?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const uid = useId();
  const c = consultingContent(variant);
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const act = presentPkd(company.pkd);
  const form = sentenceCase(company.legal_form);

  // The first area starts open so the tree reads as a tree before anyone touches it.
  const [area, setArea] = useState(0);
  const [leaf, setLeaf] = useState<number | null>(preview ? 0 : null);
  const [foldArea, setFoldArea] = useState(false);
  const [foldLeaf, setFoldLeaf] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  const [reach, setReach] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const [lines, setLines] = useState<Lines>({ base: [], active: [] });

  const tree = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLFormElement>(null);
  const registry = useRef<HTMLElement>(null);

  const branch = c.tree[area];
  const question = leaf === null ? null : branch.leaves[leaf].question;

  // Lines are measured from the rendered nodes, so they survive long labels and any width.
  useEffect(() => {
    const root = tree.current;
    if (!root) return;
    const draw = () => {
      const node = (id: string) => root.querySelector<HTMLElement>(`[data-node="${id}"]`);
      const start = node('root');
      const end = node('panel');
      if (!start || !end) return;
      const base: Path[] = [];
      const active: Path[] = [];
      const from = at(start, root);
      c.tree.forEach((_, i) => {
        const el = node(`a${i}`);
        if (!el) return;
        const to = at(el, root);
        const d = elbow(from.r, from.y, to.l, to.y);
        base.push({ k: `a${i}`, d });
        if (i === area) active.push({ k: `on-a${i}`, d });
      });
      const chosen = node(`a${area}`);
      if (chosen) {
        const a = at(chosen, root);
        branch.leaves.forEach((_, i) => {
          const el = node(`l${i}`);
          if (!el) return;
          const to = at(el, root);
          const d = elbow(a.r, a.y, to.l, to.y);
          base.push({ k: `${area}-l${i}`, d });
          if (i === leaf) active.push({ k: `on-${area}-l${i}`, d });
        });
      }
      if (leaf !== null) {
        const el = node(`l${leaf}`);
        if (el) {
          const a = at(el, root);
          const p = at(end, root);
          const y = Math.min(p.b - 24, Math.max(p.t + 24, a.y));
          active.push({ k: `on-${area}-p${leaf}`, d: elbow(a.r, a.y, p.l, y) });
        }
      }
      setLines({ base, active });
    };
    draw();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(draw);
    ro?.observe(root);
    document.fonts?.ready.then(draw).catch(() => undefined);
    return () => ro?.disconnect();
  }, [area, leaf, branch, c.tree]);

  // Buttons, not #hash links: the offer page keeps the demo id in the fragment.
  const go = (el: HTMLElement | null) => {
    const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };
  const pickArea = (i: number) => { setArea(i); setLeaf(null); setFoldArea(true); setFoldLeaf(false); setSent(false); };
  const pickLeaf = (i: number) => { setLeaf(i); setFoldLeaf(true); setSent(false); };
  const askAbout = (title: string) => { setMode(title); setSent(false); go(panel.current); };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = reach.trim();
    if (!/^\S+@\S+\.\S+$/.test(v) && v.replace(/\D/g, '').length < 9) { setError(true); return; }
    setError(false);
    setSent(true);
  };

  return (
    <div lang="pl" className={`${s.site} ${sans.className}`} data-preview={preview || undefined}>
      <header className={s.mast}>
        <span className={`${s.mastName} ${serif.className}`}>{name}</span>
        <span className={`${s.slot} ${s.mastSlot}`}>Tu telefon i e-mail</span>
        <button type="button" className={s.mastGo} onClick={() => go(panel.current)}>Zadaj pytanie</button>
      </header>

      <section className={s.hero}>
        <div className={s.title}>
          <div>
            <p className={s.kicker}>{c.kicker}{city ? ` · ${city}` : ''}</p>
            <Title className={`${s.name} ${serif.className}`} data-scale={nameScale(name)}>{name}</Title>
          </div>
          <p className={`${s.lead} ${serif.className}`}>{c.lead}</p>
        </div>

        <div ref={tree} className={s.tree}>
          <svg className={s.wires} aria-hidden="true">
            {lines.base.map((p) => <path key={p.k} d={p.d} className={s.wire} />)}
            {lines.active.map((p) => <path key={p.k} d={p.d} pathLength={1} className={s.wireOn} />)}
          </svg>

          <div className={s.root} data-node="root">
            <p className={`${s.rootTitle} ${serif.className}`}>{c.rootTitle}</p>
            <p className={s.rootNote}>{c.rootNote}</p>
          </div>

          <div className={s.col} data-fold={foldArea || undefined}>
            <p className={s.colHead}>
              <span>1. {c.branchHead}</span>
              <button type="button" className={s.change} onClick={() => setFoldArea(false)}>Zmień</button>
            </p>
            {c.tree.map((b, i) => (
              <button key={b.label} type="button" data-node={`a${i}`} aria-pressed={area === i} className={`${s.node} ${area === i ? s.on : ''}`} onClick={() => pickArea(i)}>
                <span>{b.label}</span>
              </button>
            ))}
          </div>

          <div className={s.col} data-fold={foldLeaf || undefined}>
            <p className={s.colHead}>
              <span>2. {c.leafHead}</span>
              <button type="button" className={s.change} onClick={() => setFoldLeaf(false)}>Zmień</button>
            </p>
            {branch.leaves.map((l, i) => (
              <button key={`${area}-${l.label}`} type="button" data-node={`l${i}`} aria-pressed={leaf === i} className={`${s.node} ${s.fresh} ${leaf === i ? s.on : ''}`} onClick={() => pickLeaf(i)}>
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          <form ref={panel} className={s.panel} data-node="panel" onSubmit={submit} noValidate>
            <p className={s.panelHead}>{c.questionHead}</p>
            <p key={question ?? 'empty'} aria-live="polite" className={question ? `${s.question} ${serif.className}` : s.questionEmpty}>{question ?? c.questionEmpty}</p>
            {mode && (
              <p className={s.mode}>
                <span>Forma współpracy: {mode}</span>
                <button type="button" onClick={() => setMode(null)}>Usuń</button>
              </p>
            )}
            <label className={s.field}><span>Kilka słów</span><textarea rows={2} placeholder={c.placeholder} /></label>
            <label className={`${s.field} ${error ? s.bad : ''}`}>
              <span>E-mail lub telefon</span>
              <input value={reach} autoComplete="email" aria-invalid={error} aria-describedby={error ? `${uid}-e` : undefined} onChange={(e) => { setReach(e.target.value); setError(false); }} />
            </label>
            {error && <em id={`${uid}-e`} role="alert" className={s.err}>Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.</em>}
            {sent
              ? <p role="status" className={s.sent}><strong>Tak to będzie działać.</strong> To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie wiadomość trafi prosto do firmy.</p>
              : <button type="submit" className={s.send}>{c.send}<span aria-hidden="true">→</span></button>}
            <p className={s.promise}>{c.promise}</p>
          </form>
        </div>

        <div className={s.treeFoot}>
          <p className={s.note}>{c.treeNote}</p>
          <button type="button" className={s.jump} onClick={() => go(registry.current)}>{c.registryJump} Przejdź do danych</button>
        </div>
      </section>

      <section className={s.memoBand}>
        <div className={s.memoText}>
          <h2 className={`${s.h2} ${serif.className}`}>{c.memoTitle}</h2>
          <p className={s.memoLead}>{c.memoLead}</p>
          <ul className={s.points}>{c.memoPoints.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <article className={s.memo}>
          <header className={s.memoHead}>
            <strong className={serif.className}>{c.memoHead}</strong>
            <span>{c.memoWarn}</span>
          </header>
          <dl>
            <div className={s.memoRow}>
              <dt>Pytanie</dt>
              <dd className={`${s.memoQ} ${serif.className}`}><mark>{question ?? c.memoExample}</mark></dd>
            </div>
            {c.memoRows.map(([k, v]) => (
              <div key={k} className={s.memoRow}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <p className={s.note}>{c.memoNote}</p>
        </article>
      </section>

      <section className={s.forms}>
        <div className={s.formsHead}>
          <h2 className={`${s.h2} ${serif.className}`}>{c.formsTitle}</h2>
          <p className={s.note}>{c.formsNote}</p>
        </div>
        <ol className={s.stairs}>
          {c.forms.map((f, i) => (
            <li key={f.title} data-step={i}>
              <span className={`${s.stepNo} ${serif.className}`}>{i + 1}</span>
              <h3 className={serif.className}>{f.title}</h3>
              <p>{f.text}</p>
              <button type="button" onClick={() => askAbout(f.title)}>{f.cta}</button>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.people}>
        <div className={s.personBox}>
          <h2 className={`${s.h2} ${serif.className}`}>{c.peopleTitle}</h2>
          <p className={`${s.slot} ${s.portrait}`}>{c.person}</p>
        </div>
        <div className={s.sideSlots}>
          {c.slots.map((x) => (
            <div key={x.title}>
              <h3 className={serif.className}>{x.title}</h3>
              <p className={`${s.slot} ${s.slotBlock}`}>{x.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={registry} className={s.registry}>
        <div>
          <h2 className={`${s.h2} ${serif.className}`}>{c.registryTitle}</h2>
          <p className={s.memoLead}>{c.registryLead}</p>
        </div>
        <div>
          <dl className={s.sheet}>
            <div><dt>Nazwa</dt><dd>{company.legal_name}</dd></div>
            <div><dt>Forma prawna</dt><dd>{form ?? <span className={s.slot}>Tu forma prawna</span>}</dd></div>
            <div><dt>KRS</dt><dd>{company.krs ?? <span className={s.slot}>Tu numer KRS</span>}</dd></div>
            <div><dt>Miejscowość</dt><dd>{city ?? <span className={s.slot}>Tu miejscowość</span>}</dd></div>
            <div><dt>PKD</dt><dd>{act ? `${act.code} · ${act.label}` : <span className={s.slot}>Tu główna działalność</span>}</dd></div>
            <div><dt>NIP</dt><dd><span className={s.slot}>Tu numer NIP</span></dd></div>
            <div><dt>Adres</dt><dd><span className={s.slot}>Tu adres do korespondencji</span></dd></div>
            <div><dt>Reprezentacja</dt><dd><span className={s.slot}>Tu zarząd i osoba do kontaktu</span></dd></div>
          </dl>
          <p className={s.note}>{c.registryNote}</p>
        </div>
      </section>

      <footer className={s.foot}>
        <p>{company.legal_name}{company.krs ? ` · KRS ${company.krs}` : ''}{city ? ` · ${city}` : ''}</p>
        <p className={s.slot}>Tu informacja o przetwarzaniu danych</p>
      </footer>

      {!preview && <div className={s.thumb}><span>Tu Twój telefon</span><button type="button" onClick={() => go(panel.current)}>Zadaj pytanie</button></div>}
    </div>
  );
}
