'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, Lightbulb, Monitor, Palette, Smartphone, X } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import type { JourneyActions } from '../funnel/Journey';
import Inspiration from './Inspiration';
import { presentName } from '@/lib/tovernet/construction';
import { funnelCopy } from '@/lib/tovernet/funnelCopy';
import { recommendedStart } from '@/lib/tovernet/payments';
import ConceptSite from '../ConceptSite';
import { TYPICAL_DELIVERY } from './copy';
import { price } from './motion';
import s from './studio.module.css';

/**
 * Optional stage after the offer: a quick example of where we start, not the design
 * (owner 2026-11-06: visitors are not interested in the exact sample). Slim toolbar above,
 * a price dock while reading, an invitation to send sites they like, hand-off to the order.
 */
export default function Concept({ demo, actions, onOrder, onOffer }: { demo: PublicDemo; actions: JourneyActions; onOrder: () => void; onOffer: () => void }) {
  const { track } = actions;
  const company = demo.config.company;
  const start = recommendedStart(demo);
  const want = (placement: string) => { track('cta_clicked', { placement }); onOrder(); };
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
        <p className={s.status}><span className={s.pulse} aria-hidden="true" /><b>Szybki przykład</b><span className={s.statusMore}>od czego możemy zacząć</span></p>
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

      {/* Visitors read the concept as the final design and left (owner 2026-11-05, 2026-11-06):
          say up front it is only a quick example and their site is made to their taste. */}
      <aside className={s.disclaimer} aria-label="O przykładzie">
        <span className={s.disclaimerIcon} aria-hidden="true"><Palette size={18} /></span>
        <p><b>To tylko szybki przykład.</b> Wygląd dopasujemy do Twojej firmy i inspiracji: kolory, zdjęcia, układ i teksty w ramach wybranego pakietu. Podeślij strony, które Ci się podobają.</p>
      </aside>

      {device === 'phone' ? (
        <div className={s.phoneStage} key="phone">
          <div className={s.phoneFrame}><div><ConceptSite company={company} variant={demo.config.variant} /></div></div>
          <p className={s.hint}>Tak stronę zobaczy Twój klient na telefonie. Przewiń wewnątrz ekranu.</p>
        </div>
      ) : (
        <div className={s.frame} key="desktop">
          <div className={s.chrome}><i /><i /><i /><span className={s.addr}>Szybki przykład · wygląd dopasujemy do Ciebie</span></div>
          <ConceptSite company={company} variant={demo.config.variant} />
        </div>
      )}

      <section aria-label="Koniec przykładu" className={s.handoff} data-reveal="">
        <div>
          <p className={s.kicker}>Koniec przykładu</p>
          <p className={s.handoffTitle}>Wygląd strony {name} dopasujemy do Twojej firmy i inspiracji.</p>
          <p className={s.handoffText}>Kolory, układ, zdjęcia i teksty ustalimy w ankiecie, w ramach pakietu, a gotową stronę zobaczysz przed publikacją{start ? <>. Od <b>{price(start.upfront)}</b> na start</> : null}, gotowa zwykle w {TYPICAL_DELIVERY}. Zanim prześlesz materiały, możesz zrezygnować i odzyskać całą wpłatę.</p>
          <div className={s.inspoInline}><Inspiration actions={actions} placement="concept" /></div>
        </div>
        <div className={s.handoffActions}>
          <button type="button" className={s.cta} onClick={() => want('concept_end')}>Przejdź do zamówienia<ArrowRight size={19} aria-hidden="true" /></button>
          <button type="button" className={s.ghost} onClick={onOffer}>Wróć do oferty</button>
          <button type="button" className={s.link} onClick={() => topRef.current?.scrollIntoView({ behavior: 'smooth' })}><ArrowUp size={14} aria-hidden="true" />Na początek przykładu</button>
        </div>
        <p className={s.handoffNote}>To przykład, nie opublikowana strona ani ostateczny wygląd. Kolory, układ, banery i zdjęcia zmienimy według Twoich potrzeb. Nazwa, miejscowość i numer KRS pochodzą z Krajowego Rejestru Sądowego. Usługi i teksty są przykładowe, a grafiki poglądowe.</p>
      </section>

      <div className={s.conceptDockSpace} aria-hidden="true" />
      <div className={s.conceptDock} role="region" aria-label="Zamówienie strony">
        <p><b>{start ? `Strona dla Twojej firmy od ${price(start.upfront)}` : 'Strona dla Twojej firmy'}</b>Gotowa zwykle w {TYPICAL_DELIVERY}</p>
        <button type="button" className={s.cta} onClick={() => want('concept_dock')}>Zamawiam<ArrowRight size={17} aria-hidden="true" /></button>
      </div>

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
            <button type="button" className={`${s.cta} ${s.full}`} onClick={() => { setOpen(false); want('concept_notes'); }}>Przejdź do zamówienia<ArrowRight size={19} aria-hidden="true" /></button>
          </div>
        </div>
      )}
    </>
  );
}
