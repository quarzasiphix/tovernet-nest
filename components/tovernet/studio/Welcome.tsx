'use client';

import { tradeOf } from '@/lib/tovernet/niches';
import { ArrowRight, BadgeCheck, Building2, LayoutTemplate, MapPin, MonitorSmartphone, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import ConceptSite from '../ConceptSite';
import type { JourneyActions } from '../funnel/Journey';
import { INSIDE, welcomeCopy } from './copy';
import { Scaled, delay } from './motion';
import s from './studio.module.css';

const INSIDE_ICONS = [LayoutTemplate, BadgeCheck, ShieldCheck];

/**
 * Stage 1: full-screen personal welcome. Presentation only: account creation and claim
 * moved to the one-time Gate (studio/Gate.tsx) shown before the journey on the first
 * visit from a personal invite. Without it, the account is opened at checkout.
 */
export default function Welcome({ demo, actions, onContinue, onOffer }: { demo: PublicDemo; actions: JourneyActions; onContinue: () => void; onOffer: () => void }) {
  const company = demo.config.company;
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const trade = tradeOf(demo.config.variant);
  const copy = welcomeCopy(demo.config.variant);

  const go = () => {
    actions.track('cta_clicked', { placement: 'intro' });
    actions.track('intro_continued', { with_account: Boolean(actions.account) });
    onContinue();
  };

  return (
    <section className={s.welcome}>
      <div className={s.wCopy}>
        <p className={`${s.chip} ${s.rise}`} style={delay(0)}>
          <span className={s.avatar} aria-hidden="true">W</span>
          <span>Wiktor z Tovernet przygotował koncept strony dla</span>
        </p>
        <h1 className={`${s.wName} ${name.length > 30 ? s.wNameLong : ''} ${s.rise}`} style={delay(90)}>{name}</h1>
        <ul className={`${s.meta} ${s.rise}`} style={delay(180)} aria-label="Dane firmy">
          {trade && <li><Wrench size={15} aria-hidden="true" />{trade}</li>}
          {city && <li><MapPin size={15} aria-hidden="true" />{city}</li>}
          {company.krs && <li><Building2 size={15} aria-hidden="true" />KRS {company.krs}</li>}
        </ul>
        <p className={`${s.wLead} ${s.rise}`} style={delay(260)}>{copy.lead}</p>

        <div className={`${s.wCta} ${s.rise}`} style={delay(340)}>
          <button type="button" className={s.cta} onClick={go}>
            Zobacz swój koncept<ArrowRight size={19} aria-hidden="true" />
          </button>
          <button type="button" className={s.ghost} onClick={onOffer}>Od razu do oferty</button>
        </div>
      </div>

      <div className={s.wVisual} aria-hidden="true">
        <div className={s.browser}>
          <div className={s.chrome}><i /><i /><i /><span className={s.addr}>Koncept do oceny · nieopublikowany</span></div>
          <div className={s.screen}>
            <Scaled width={1280} className={s.pan}><ConceptSite company={company} variant={demo.config.variant} embedded preview /></Scaled>
          </div>
        </div>
        <div className={s.phoneMini}>
          <div className={s.phoneScreen}>
            <Scaled width={390} className={s.panPhone}><ConceptSite company={company} variant={demo.config.variant} embedded preview /></Scaled>
          </div>
        </div>
        <span className={`${s.float} ${s.f1}`}><i><Sparkles size={14} /></i>{copy.features[0]}</span>
        <span className={`${s.float} ${s.f2}`}><i><MonitorSmartphone size={14} /></i>{copy.features[1]}</span>
      </div>

      <ol className={s.inside} aria-label="Co przygotowaliśmy">
        {INSIDE.map(([t, d], i) => {
          const Icon = INSIDE_ICONS[i];
          return (
            <li key={t} className={s.rise} style={delay(480 + i * 90)}>
              <span className={s.insideIcon}><Icon size={19} aria-hidden="true" /></span>
              <span><b>{t}</b>{d}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
