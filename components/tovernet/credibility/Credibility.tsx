'use client';
// Static export with images.unoptimized: next/image adds nothing; the WebP files are pre-sized.
/* eslint-disable @next/next/no-img-element */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, BadgeCheck, Building2, ChevronDown, ExternalLink, Eye, Phone, ShieldCheck, X } from 'lucide-react';
import { SELLER } from '@/lib/seller';
import {
  KIND_LABEL, STATUS_LABEL, VERIFIED_ON, evidenceHref, hostOf, offerGroups, offerProjects, projectsLabel, type PortfolioProject,
} from '@/lib/tovernet/portfolio';
import { GUARANTEE } from '../studio/offer/offerCopy';
import { usePreview } from '@/components/site/preview/ProjectPreview';
import s from '../studio/studio.module.css';
import c from './credibility.module.css';

/**
 * "Kim jesteśmy i co już zrobiliśmy" (ksiegai docs/plans/tovernet/26-credibility-portfolio.md,
 * doc 25 §6). A drawer over the personal offer: verified projects, the company, the guarantee.
 * Never a stage, never opened on its own. It keeps the offer intact: no URL change (the
 * #<demo id> fragment and ?krok= stay), the cart and stage stay mounted underneath, and the
 * browser Back button closes the drawer instead of leaving the stage.
 */

type Track = (event: string, props?: Record<string, unknown>) => void;
/** Primary action at the bottom of the drawer; null: only "back to where you were". */
export type CredibilityCta = { label: string; run: () => void } | null;
type Api = { open: (placement: string, from?: HTMLElement | null) => void };

const Ctx = createContext<Api | null>(null);
/** History entry marker: Back pops it and closes the drawer. */
const KEY = 'tvCredibility';

const verifiedOn = new Date(`${VERIFIED_ON}T12:00:00`).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

export function CredibilityProvider({ children, track, stage, backLabel, cta }: {
  children: ReactNode; track: Track; stage: string; backLabel: string; cta: CredibilityCta;
}) {
  const [placement, setPlacement] = useState<string | null>(null);
  const openRef = useRef<{ placement: string; at: number; viewed: Set<string> } | null>(null);
  const viaRef = useRef<string>('back');
  const thenRef = useRef<(() => void) | null>(null);
  // Our own history entry, not read back from history.state (the router may rewrite it).
  const pushedRef = useRef(false);
  const returnRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const finish = useCallback(() => {
    const o = openRef.current;
    if (!o) return;
    openRef.current = null;
    pushedRef.current = false;
    setPlacement(null);
    track('credibility_closed', {
      via: viaRef.current, placement: o.placement, stage: stageRef.current,
      seconds: Math.round((Date.now() - o.at) / 1000), projects_opened: o.viewed.size,
    });
    const then = thenRef.current;
    thenRef.current = null;
    viaRef.current = 'back';
    if (then) then();
    else requestAnimationFrame(() => returnRef.current?.focus?.({ preventScroll: true }));
  }, [track]);

  // A reload while open leaves the marker on the entry: drop it, so a later Back is a normal Back.
  useEffect(() => {
    if (window.history.state?.[KEY]) {
      const { [KEY]: _drop, ...rest } = window.history.state as Record<string, unknown>;
      window.history.replaceState(rest, '', window.location.href);
    }
  }, []);

  useEffect(() => {
    const onPop = () => { if (openRef.current && !window.history.state?.[KEY]) finish(); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [finish]);

  const open = useCallback((where: string, from?: HTMLElement | null) => {
    if (openRef.current) return;
    // The trigger itself: Safari does not focus a clicked button, so activeElement is not enough.
    returnRef.current = from ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    openRef.current = { placement: where, at: Date.now(), viewed: new Set() };
    // Same URL, new entry: Back closes the drawer. The fragment and ?krok= are untouched.
    window.history.pushState({ ...(window.history.state ?? {}), [KEY]: true }, '', window.location.href);
    pushedRef.current = true;
    setPlacement(where);
    track('credibility_opened', { placement: where, stage: stageRef.current });
  }, [track]);

  const close = useCallback((via: string, then?: () => void) => {
    if (!openRef.current) return;
    viaRef.current = via;
    thenRef.current = then ?? null;
    // Pop our own entry; popstate then finishes. Without it (never expected), finish now.
    if (pushedRef.current) window.history.back();
    else finish();
  }, [finish]);

  const viewed = useCallback((project: string, action: string) => {
    const o = openRef.current;
    if (o && action === 'details') o.viewed.add(project);
    track('credibility_project_clicked', { project, action, placement: o?.placement ?? null, stage: stageRef.current });
  }, [track]);

  const api = useMemo(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {placement && (
        <Drawer
          onClose={(via) => close(via)}
          onProject={viewed}
          backLabel={backLabel}
          cta={cta ? { label: cta.label, run: () => { track('cta_clicked', { placement: 'credibility' }); close('cta', cta.run); } } : null}
        />
      )}
    </Ctx.Provider>
  );
}

/** Null outside a provider, so shared components (Summary) render no trigger elsewhere. */
export const useCredibility = () => useContext(Ctx);

/** Quiet text trigger. `tone="bar"`: the compact header button (icon only on phones). */
export function CredibilityLink({ placement, tone = 'link', children }: { placement: string; tone?: 'link' | 'bar'; children?: ReactNode }) {
  const api = useCredibility();
  if (!api) return null;
  const label = children ?? 'Kim jesteśmy i co już zrobiliśmy';
  return (
    <button type="button" className={tone === 'bar' ? c.barBtn : c.trigger} onClick={(e) => api.open(placement, e.currentTarget)}
            aria-haspopup="dialog" aria-label={tone === 'bar' ? 'Nasze realizacje: kim jesteśmy i co już zrobiliśmy' : undefined}>
      <BadgeCheck size={tone === 'bar' ? 16 : 15} aria-hidden="true" /><span>{label}</span>
    </button>
  );
}

/** Inline proof in the offer: three real projects at a glance, the rest in the drawer. */
export function ProofStrip({ placement }: { placement: string }) {
  const api = useCredibility();
  const projects = useMemo(() => offerProjects().slice(0, 3), []);
  if (!api || projects.length === 0) return null;
  return (
    <div className={c.strip}>
      <ul className={c.stripShots} aria-hidden="true">
        {projects.map((p) => (
          <li key={p.slug}><img src={p.shots[0].src} alt="" width={p.shots[0].width} height={p.shots[0].height} loading="lazy" decoding="async" /></li>
        ))}
      </ul>
      <div className={c.stripText}>
        <p><b>Działające strony naszych klientów:</b> {projects.map((p) => p.name).join(', ')}. W stopce każdej znajdziesz link do nas.</p>
        <button type="button" className={c.trigger} onClick={(e) => api.open(placement, e.currentTarget)} aria-haspopup="dialog">
          <BadgeCheck size={15} aria-hidden="true" /><span>Zobacz realizacje i sprawdź je sam</span>
        </button>
      </div>
    </div>
  );
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';

function Drawer({ onClose, onProject, backLabel, cta }: {
  onClose: (via: string) => void; onProject: (slug: string, action: string) => void; backLabel: string; cta: CredibilityCta;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const groups = useMemo(() => offerGroups(), []);
  const count = groups.reduce((n, g) => n + g.projects.length, 0);
  const promise = GUARANTEE[0];
  // The provider passes a new closure on each render: read it through a ref, so the effect
  // below (focus, scroll lock, keys) runs once per opening.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onClose = (via: string) => closeRef.current(via);
    panel.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose('escape'); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const els = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); html.style.overflow = before; };
  }, []);

  return (
    <div className={c.scrim} onClick={() => onClose('scrim')}>
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="cred-title" aria-describedby="cred-lead"
           className={c.panel} onClick={(e) => e.stopPropagation()}>
        <header className={c.head}>
          <div>
            <p className={s.kicker}>Sprawdź nas, zanim zamówisz</p>
            <h2 id="cred-title">Kim jesteśmy i co już zrobiliśmy</h2>
          </div>
          <button type="button" className={c.close} onClick={() => onClose('button')} aria-label="Zamknij i wróć do oferty"><X size={18} aria-hidden="true" /></button>
        </header>

        <div className={c.body}>
          <p id="cred-lead" className={c.lead}>
            Pokazujemy tylko to, co zrobiliśmy i co sprawdzisz sam: każdy projekt działa pod własnym adresem,
            a przy każdym piszemy, jak to sprawdzić. Twoja oferta i wybór czekają bez zmian.
          </p>
          <ul className={c.facts}>
            <li><Building2 size={15} aria-hidden="true" />{SELLER.name}, KRS {SELLER.krs}</li>
            <li><BadgeCheck size={15} aria-hidden="true" />{projectsLabel(count)} do sprawdzenia</li>
          </ul>

          {groups.map((g, gi) => (
            <section key={g.key} className={c.group} aria-labelledby={`cred-${g.key}`}>
              <h3 id={`cred-${g.key}`} className={c.groupTitle}>{g.title}</h3>
              <ul className={c.cards}>
                {g.projects.map((p, i) => <Card key={p.slug} project={p} index={gi * 3 + i} onProject={onProject} />)}
              </ul>
            </section>
          ))}

          <p className={c.honest}>
            Nie publikujemy opinii ani wyników klientów bez ich zgody, dlatego ich tu nie ma. Przykład z nazwą Twojej
            firmy w ofercie to szybki koncept, nie realizacja. Działanie projektów i podpisy sprawdziliśmy {verifiedOn}.
          </p>

          <section className={c.company} aria-labelledby="cred-company">
            <h3 id="cred-company" className={c.groupTitle}>Firma</h3>
            <dl>
              <div><dt>Nazwa</dt><dd>{SELLER.name}</dd></div>
              <div><dt>Adres</dt><dd>{SELLER.street}, {SELLER.postal} {SELLER.city}</dd></div>
              <div><dt>KRS</dt><dd>{SELLER.krs}</dd></div>
              <div><dt>NIP</dt><dd>{SELLER.nip}</dd></div>
              <div><dt>REGON</dt><dd>{SELLER.regon}</dd></div>
            </dl>
            <p className={c.companyLinks}>
              <a href="https://wyszukiwarka-krs.ms.gov.pl/" target="_blank" rel="noopener noreferrer"
                 onClick={() => onProject('company', 'krs')}>Sprawdź nas w KRS<ExternalLink size={13} aria-hidden="true" /></a>
              <a href={SELLER.phoneHref} onClick={() => onProject('company', 'phone')}><Phone size={13} aria-hidden="true" />{SELLER.phone}</a>
              <a href={`mailto:${SELLER.email}`} onClick={() => onProject('company', 'email')}>{SELLER.email}</a>
            </p>
          </section>

          <p className={c.promise}><ShieldCheck size={18} aria-hidden="true" /><span><b>{promise[0]}.</b> {promise[1]}</span></p>
        </div>

        <footer className={c.foot}>
          {cta && <button type="button" className={`${s.cta} ${c.footCta}`} onClick={cta.run}>{cta.label}<ArrowRight size={18} aria-hidden="true" /></button>}
          <button type="button" className={s.ghost} onClick={() => onClose('back_button')}>{backLabel}</button>
        </footer>
      </div>
    </div>
  );
}

function Card({ project: p, index, onProject }: { project: PortfolioProject; index: number; onProject: (slug: string, action: string) => void }) {
  const [open, setOpen] = useState(false);
  // The immersive preview (components/site/preview), when the offer provides one.
  const preview = usePreview();
  const canPreview = Boolean(preview && p.preview?.full && p.siteRank !== undefined);
  const proof = p.evidence[0];
  const id = `cred-more-${p.slug}`;
  const shot = p.shots[0];
  return (
    <li className={c.card} style={{ animationDelay: `${140 + index * 60}ms` }}>
      <div className={c.shot}>
        <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
        {shot.note && <span className={c.shotNote}>{shot.note}</span>}
      </div>
      <div className={c.cardBody}>
        <p className={c.badges}>
          <span>{KIND_LABEL[p.kind]}</span>
          <span className={c.status}><i aria-hidden="true" />{STATUS_LABEL[p.status]}</span>
        </p>
        <h4 className={c.name}>{p.name}</h4>
        <p className={c.category}>{p.category}</p>
        <p className={c.summary}>{p.summary}</p>
        {proof && (
          <p className={c.proof}>
            <ShieldCheck size={15} aria-hidden="true" />
            {proof.url
              ? <a href={evidenceHref(proof.url)} target="_blank" rel="noopener noreferrer" onClick={() => onProject(p.slug, 'evidence')}>{proof.label}</a>
              : <span>{proof.label}</span>}
          </p>
        )}
        <div className={c.actions}>
          {canPreview && (
            <button type="button" className={c.visit} aria-haspopup="dialog"
                    onClick={(e) => { onProject(p.slug, 'preview'); preview!.open(p.slug, 'credibility', e.currentTarget); }}>
              <Eye size={14} aria-hidden="true" />Podgląd
            </button>
          )}
          {p.url && (
            <a className={c.visit} href={p.url} target="_blank" rel="noopener noreferrer" onClick={() => onProject(p.slug, 'live')}>
              {hostOf(p.url)}<ExternalLink size={14} aria-hidden="true" /><span className={s.sr}> (otworzy się w nowej karcie)</span>
            </a>
          )}
          <button type="button" className={c.more} aria-expanded={open} aria-controls={id}
                  onClick={() => { if (!open) onProject(p.slug, 'details'); setOpen(!open); }}>
            {open ? 'Mniej' : 'Co zrobiliśmy'}<ChevronDown size={15} aria-hidden="true" />
          </button>
        </div>
        <div id={id} className={c.detail} hidden={!open}>
          <p>{p.role}</p>
          {p.built.length > 0 && <ul>{p.built.map((b) => <li key={b}>{b}</li>)}</ul>}
          {p.shots.length > 1 && open && (
            <div className={c.moreShots}>
              {p.shots.slice(1).map((x) => (
                <figure key={x.src}>
                  <img src={x.src} alt={x.alt} width={x.width} height={x.height} loading="lazy" decoding="async" />
                  {x.note && <figcaption>{x.note}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          {p.caseStudy && (
            <a className={c.caseLink} href={evidenceHref(p.caseStudy)} target="_blank" rel="noopener noreferrer" onClick={() => onProject(p.slug, 'case_study')}>
              Pełny opis realizacji<ExternalLink size={13} aria-hidden="true" /><span className={s.sr}> (otworzy się w nowej karcie)</span>
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
