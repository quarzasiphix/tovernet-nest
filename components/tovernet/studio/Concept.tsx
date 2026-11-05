'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, Lightbulb, Monitor, Smartphone, X } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentName } from '@/lib/tovernet/construction';
import { funnelCopy } from '@/lib/tovernet/funnelCopy';
import ConceptSite from '../ConceptSite';
import s from './studio.module.css';

/** Stage 2: the concept is the star. Tovernet keeps to a slim toolbar above and a hand-off below. */
export default function Concept({ demo, track, onOffer }: { demo: PublicDemo; track: (e: string, p?: Record<string, unknown>) => void; onOffer: () => void }) {
  const company = demo.config.company;
  const name = presentName(company.display_name);
  const notes = funnelCopy(demo.config.variant).notes;
  const [device, setDevice] = useState<'desktop' | 'phone'>('desktop');
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const switchTo = (d: 'desktop' | 'phone') => { setDevice(d); track('concept_device_switched', { device: d }); };

  return (
    <>
      <div ref={topRef} className={s.toolbar}>
        <p className={s.status}><span className={s.pulse} aria-hidden="true" /><b>Koncept do oceny</b><span className={s.statusMore}>nieopublikowany, przygotowany dla {name}</span></p>
        <div className={s.tools}>
          <div role="group" aria-label="Widok" className={s.seg} data-on={device}>
            <span className={s.segThumb} aria-hidden="true" />
            <button type="button" aria-pressed={device === 'desktop'} onClick={() => switchTo('desktop')}><Monitor size={15} aria-hidden="true" />Komputer</button>
            <button type="button" aria-pressed={device === 'phone'} onClick={() => switchTo('phone')}><Smartphone size={15} aria-hidden="true" />Telefon</button>
          </div>
          {notes.length > 0 && (
            <button type="button" className={s.notesBtn} aria-label="Dlaczego tak?" aria-expanded={open} onClick={() => { setOpen(true); track('concept_notes_opened'); }}>
              <Lightbulb size={15} aria-hidden="true" /><span>Dlaczego tak?</span>
            </button>
          )}
        </div>
      </div>

      {device === 'phone' ? (
        <div className={s.phoneStage} key="phone">
          <div className={s.phoneFrame}><div><ConceptSite company={company} variant={demo.config.variant} /></div></div>
          <p className={s.hint}>Tak stronę zobaczy klient na telefonie. Przewiń wewnątrz ekranu.</p>
        </div>
      ) : (
        <div className={s.frame} key="desktop">
          <div className={s.chrome}><i /><i /><i /><span className={s.addr}>Koncept do oceny · nieopublikowany</span></div>
          <ConceptSite company={company} variant={demo.config.variant} />
        </div>
      )}

      <section aria-label="Koniec konceptu" className={s.handoff} data-reveal="">
        <div>
          <p className={s.kicker}>Koniec konceptu</p>
          <p className={s.handoffTitle}>Tak mogłaby wyglądać strona {name}.</p>
          <p className={s.handoffText}>Dalej zobaczysz, co dokładnie dostajesz, ile to kosztuje i jak wygląda współpraca krok po kroku.</p>
        </div>
        <div className={s.handoffActions}>
          <button type="button" className={s.cta} onClick={() => { track('cta_clicked', { placement: 'concept_end' }); onOffer(); }}>Zobacz zakres i cenę<ArrowRight size={19} aria-hidden="true" /></button>
          <button type="button" className={s.ghost} onClick={() => topRef.current?.scrollIntoView({ behavior: 'smooth' })}><ArrowUp size={16} aria-hidden="true" />Na początek konceptu</button>
        </div>
        <p className={s.handoffNote}>To koncept, nie opublikowana strona. Nazwa, miejscowość i numer KRS pochodzą z Krajowego Rejestru Sądowego. Usługi i teksty są przykładowe, a grafiki poglądowe.</p>
      </section>

      {open && (
        <div className={s.scrim} onClick={() => setOpen(false)}>
          <div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="notes-title" className={s.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={s.drawerHead}>
              <h2 id="notes-title">Dlaczego tak to zaprojektowaliśmy</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Zamknij"><X size={18} /></button>
            </div>
            <ol className={s.noteList}>
              {notes.map(([t, d], i) => <li key={t} style={{ animationDelay: `${120 + i * 80}ms` }}><span>{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>)}
            </ol>
            <button type="button" className={`${s.cta} ${s.full}`} onClick={() => { setOpen(false); track('cta_clicked', { placement: 'concept_notes' }); onOffer(); }}>Zobacz zakres i cenę<ArrowRight size={19} aria-hidden="true" /></button>
          </div>
        </div>
      )}
    </>
  );
}
