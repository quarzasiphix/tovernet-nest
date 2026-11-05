import { CalendarOff, DoorOpen, FolderDown, Globe2, MoonStar, Repeat2 } from 'lucide-react';
import type { DemoPackage } from '@/lib/tovernet/api';
import { price } from '../motion';
import s from '../studio.module.css';
import o from './offer.module.css';
import { FREEDOM, OWNERSHIP_FINE, PAUSE, PAUSE_FINE, PLAN } from './offerCopy';

const ICONS = [CalendarOff, Repeat2, Globe2, FolderDown];

/** No lock-in, ownership and the seasonal pause, as one argument: you stay because you want to. */
export default function Freedom({ plans, seasonal }: { plans: DemoPackage[]; seasonal: boolean }) {
  const floor = plans.find((p) => p.key === PLAN.hosting);
  return (
    <div className={o.free}>
      <div className={o.freeGrid}>
        {FREEDOM.map(([t, d], i) => {
          const Icon = ICONS[i] ?? DoorOpen;
          return (
            <article key={t} className={o.freeItem}>
              <span className={o.freeIcon}><Icon size={19} aria-hidden="true" /></span>
              <b>{t}</b><p>{d}</p>
            </article>
          );
        })}
      </div>
      <p className={o.freeFine}>{OWNERSHIP_FINE}</p>

      <div className={`${o.pause} ${seasonal ? o.pauseLead : ''}`}>
        <div className={o.pauseHead}>
          <span className={o.freeIcon}><MoonStar size={19} aria-hidden="true" /></span>
          <div>
            <p className={s.kicker}>Pracujesz sezonowo?</p>
            <h3>Wstrzymaj aktywną stronę poza sezonem i wróć, kiedy Twoja firma znów ruszy.</h3>
          </div>
        </div>
        <div className={o.pauseGrid}>
          {PAUSE.map(([t, d], i) => (
            <div key={t}>
              <b>{t}{i === 0 && floor ? <span>{price(floor.gross_minor)} / mies.</span> : null}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <p className={o.freeFine}>{PAUSE_FINE}</p>
      </div>
    </div>
  );
}
