'use client';

import { useEffect, useRef, useState } from 'react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentName } from '@/lib/tovernet/construction';
import ConceptSite from '../ConceptSite';
import { funnelCopy } from '@/lib/tovernet/funnelCopy';
import b from '../brand.module.css';
import f from './funnel.module.css';

/** Stage 2: the concept is the star. Tovernet keeps to a strip above and a hand-off below. */
export default function StageConcept({ demo, track, onOffer }: { demo: PublicDemo; track: (e: string, p?: Record<string, unknown>) => void; onOffer: () => void }) {
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
      <div ref={topRef} className={f.strip}>
        <p className={f.stripTag}><i className={b.dot} /><span><b>Koncept do oceny</b> · nieopublikowany</span></p>
        <div className={f.stripTools}>
          <div role="group" aria-label="Widok" className={f.device}>
            <button type="button" aria-pressed={device === 'desktop'} onClick={() => switchTo('desktop')}>Komputer</button>
            <button type="button" aria-pressed={device === 'phone'} onClick={() => switchTo('phone')}>Telefon</button>
          </div>
          {notes.length > 0 && (
            <button type="button" className={f.notesBtn} aria-expanded={open} onClick={() => { setOpen(true); track('concept_notes_opened'); }}>Dlaczego tak?</button>
          )}
        </div>
      </div>

      {device === 'phone' ? (
        <div className={f.phoneStage}>
          <div className={f.phone}>
            <ConceptSite company={company} variant={demo.config.variant} />
          </div>
          <p className={b.l}>Tak zobaczy stronę klient na telefonie</p>
        </div>
      ) : (
        <div className={f.conceptSheet}>
          <ConceptSite company={company} variant={demo.config.variant} />
        </div>
      )}

      <section aria-label="Koniec konceptu" className={f.handoff}>
        <div className={f.handoffIn}>
          <span className={f.handoffLabel}>Koniec konceptu</span>
          <p className={f.handoffTitle}>Tak mogłaby wyglądać strona {name}.</p>
          <p className={f.handoffText}>Dalej: co dokładnie dostajesz, ile to kosztuje i jak wygląda współpraca.</p>
          <div className={f.handoffActions}>
            <button type="button" className={f.primaryLight} onClick={() => { track('cta_clicked', { placement: 'concept_end' }); onOffer(); }}>Zobacz zakres i cenę<span aria-hidden="true">→</span></button>
            <button type="button" className={f.quietLight} onClick={() => topRef.current?.scrollIntoView({ behavior: 'smooth' })}>Wróć na początek konceptu</button>
          </div>
          <p className={f.handoffNote}>To koncept, nie opublikowana strona. Nazwa, miejscowość i numer KRS pochodzą z Krajowego Rejestru Sądowego. Usługi i teksty są przykładowe, a grafiki poglądowe.</p>
        </div>
      </section>

      {open && (
        <div className={f.scrim} onClick={() => setOpen(false)}>
          <div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="notes-title" className={f.notes} onClick={(e) => e.stopPropagation()}>
            <div className={f.notesHead}>
              <h2 id="notes-title">Dlaczego tak to zaprojektowaliśmy</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Zamknij">×</button>
            </div>
            <ol>
              {notes.map(([t, d], i) => <li key={t}><span className={f.num}>0{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>)}
            </ol>
            <button type="button" className={f.primary} onClick={() => { setOpen(false); track('cta_clicked', { placement: 'concept_notes' }); onOffer(); }}>Zobacz zakres i cenę<span aria-hidden="true">→</span></button>
          </div>
        </div>
      )}
    </>
  );
}
