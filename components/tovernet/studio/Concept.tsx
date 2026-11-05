'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Lightbulb, Monitor, Palette, Smartphone, X } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentName } from '@/lib/tovernet/construction';
import { funnelCopy } from '@/lib/tovernet/funnelCopy';
import ConceptSite from '../ConceptSite';
import s from './studio.module.css';

/** Optional stage after the offer: a quick example, explicitly not the final design. Slim toolbar above, hand-off to the order below. */
export default function Concept({ demo, track, onOrder, onOffer }: { demo: PublicDemo; track: (e: string, p?: Record<string, unknown>) => void; onOrder: () => void; onOffer: () => void }) {
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
        <p className={s.status}><span className={s.pulse} aria-hidden="true" /><b>Szybki przykład</b><span className={s.statusMore}>tego, co możemy zrobić dla {name}</span></p>
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

      {/* Visitors read the concept as the final design and left (owner 2026-11-05); say up front it is only a sample. */}
      <aside className={s.disclaimer} aria-label="O koncepcie">
        <span className={s.disclaimerIcon} aria-hidden="true"><Palette size={18} /></span>
        <p><b>To szybki przykład tego, co możemy zrobić.</b> Twoja strona może wyglądać kompletnie inaczej: kolory, układ, banery, zdjęcia i teksty dopasujemy do Ciebie. Nic nie opublikujemy, dopóki nie będziesz zadowolony.</p>
      </aside>

      {device === 'phone' ? (
        <div className={s.phoneStage} key="phone">
          <div className={s.phoneFrame}><div><ConceptSite company={company} variant={demo.config.variant} /></div></div>
          <p className={s.hint}>Tak stronę zobaczy klient na telefonie. Przewiń wewnątrz ekranu.</p>
        </div>
      ) : (
        <div className={s.frame} key="desktop">
          <div className={s.chrome}><i /><i /><i /><span className={s.addr}>Przykład · Twoja strona może wyglądać inaczej</span></div>
          <ConceptSite company={company} variant={demo.config.variant} />
        </div>
      )}

      <section aria-label="Koniec przykładu" className={s.handoff} data-reveal="">
        <div>
          <p className={s.kicker}>Koniec przykładu</p>
          <p className={s.handoffTitle}>Tak może wyglądać strona {name}. Albo zupełnie inaczej.</p>
          <p className={s.handoffText}>Wygląd ustalimy razem: Twoje kolory, zdjęcia, banery i układ. Gotową stronę zobaczysz i poprawisz, zanim trafi do sieci.</p>
        </div>
        <div className={s.handoffActions}>
          <button type="button" className={s.cta} onClick={() => { track('cta_clicked', { placement: 'concept_end' }); onOrder(); }}>Przejdź do zamówienia<ArrowRight size={19} aria-hidden="true" /></button>
          <button type="button" className={s.ghost} onClick={onOffer}><ArrowLeft size={16} aria-hidden="true" />Wróć do oferty</button>
          <button type="button" className={s.link} onClick={() => topRef.current?.scrollIntoView({ behavior: 'smooth' })}><ArrowUp size={14} aria-hidden="true" />Na początek przykładu</button>
        </div>
        <p className={s.handoffNote}>To przykład, nie opublikowana strona ani ostateczny wygląd. Kolory, układ, banery i zdjęcia zmienimy według Twoich potrzeb. Nazwa, miejscowość i numer KRS pochodzą z Krajowego Rejestru Sądowego. Usługi i teksty są przykładowe, a grafiki poglądowe.</p>
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
            <button type="button" className={`${s.cta} ${s.full}`} onClick={() => { setOpen(false); track('cta_clicked', { placement: 'concept_notes' }); onOrder(); }}>Przejdź do zamówienia<ArrowRight size={19} aria-hidden="true" /></button>
          </div>
        </div>
      )}
    </>
  );
}
