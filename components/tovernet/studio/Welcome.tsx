'use client';

import { tradeOf } from '@/lib/tovernet/niches';
import { ArrowRight, BadgeCheck, Building2, CalendarCheck, MapPin, MonitorSmartphone, Palette, ShieldCheck, Sparkles, Undo2, Wallet, Wrench } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { recommendedStart } from '@/lib/tovernet/payments';
import ConceptSite from '../ConceptSite';
import type { JourneyActions } from '../funnel/Journey';
import { CUSTOM, PROMISES, TYPICAL_DELIVERY, welcomeCopy } from './copy';
import Inspiration from './Inspiration';
import { Scaled, delay, price } from './motion';
import s from './studio.module.css';

const PROMISE_ICONS = [Undo2, BadgeCheck, ShieldCheck];

/**
 * Stage 1: the first screen of a personal offer (rewritten 2026-11-06, ksiegai
 * docs/plans/tovernet/20-conversion-rethink.md). Sells a site made to the visitor's taste;
 * the concept is only a quick example of where we start. Price from, typical delivery and
 * the risk reversal above the fold. The account for a personal invite is opened in the
 * background by LiveJourney; there is no gate any more.
 */
export default function Welcome({ demo, actions, onExample, onPrice }: { demo: PublicDemo; actions: JourneyActions; onExample: () => void; onPrice: () => void }) {
  const company = demo.config.company;
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const trade = tradeOf(demo.config.variant);
  const copy = welcomeCopy(demo.config.variant);
  const start = recommendedStart(demo);

  const pricing = () => {
    actions.track('cta_clicked', { placement: 'intro' });
    actions.track('intro_continued', { with_account: Boolean(actions.account), to: 'oferta' });
    onPrice();
  };
  const example = () => {
    actions.track('cta_clicked', { placement: 'intro_example' });
    actions.track('intro_continued', { with_account: Boolean(actions.account), to: 'koncept' });
    onExample();
  };

  return (
    <section className={s.welcome}>
      <div className={s.wCopy}>
        <p className={`${s.chip} ${s.rise}`} style={delay(0)}>
          <span className={s.avatar} aria-hidden="true">W</span>
          <span>Przygotowaliśmy to dla Twojej firmy</span>
        </p>
        <h1 className={`${s.wName} ${name.length > 30 ? s.wNameLong : ''} ${s.rise}`} style={delay(90)}>{name}</h1>
        <ul className={`${s.meta} ${s.rise}`} style={delay(180)} aria-label="Dane firmy">
          {trade && <li><Wrench size={15} aria-hidden="true" />{trade}</li>}
          {city && <li><MapPin size={15} aria-hidden="true" />{city}</li>}
          {company.krs && <li><Building2 size={15} aria-hidden="true" />KRS {company.krs}</li>}
        </ul>
        <p className={`${s.wLead} ${s.rise}`} style={delay(260)}>
          <b>Dopasujemy wygląd do Twojej firmy i inspiracji.</b> Obok jest tylko szybki przykład, od czego możemy zacząć.
          Podeślij strony, które Ci się podobają: weźmiemy z nich kierunek w ramach wybranego pakietu.
        </p>
        <ul className={`${s.custom} ${s.rise}`} style={delay(280)} aria-label="Co dopasujemy">
          {CUSTOM.map((c) => <li key={c}><Palette size={14} aria-hidden="true" />{c}</li>)}
        </ul>

        <ul className={`${s.facts} ${s.rise}`} style={delay(300)} aria-label="Cena i czas">
          {start && <li><Wallet size={16} aria-hidden="true" /><span><b>Od {price(start.upfront)}</b> na start, reszta w ratach bez odsetek</span></li>}
          <li><CalendarCheck size={16} aria-hidden="true" /><span>Gotowa zwykle w <b>{TYPICAL_DELIVERY}</b></span></li>
        </ul>

        <div className={`${s.wCta} ${s.rise}`} style={delay(340)}>
          <button type="button" className={s.cta} onClick={pricing}>
            Zobacz cenę i zakres<ArrowRight size={19} aria-hidden="true" />
          </button>
          <button type="button" className={s.ghost} onClick={example}>Szybki przykład</button>
        </div>
        {actions.account && (
          <p className={`${s.fine} ${s.rise}`} style={delay(400)}>
            {actions.inviteEmail
              ? <>Otworzyliśmy konto <b>{actions.account}</b>, bez hasła: link z e-maila potwierdza ten adres.</>
              : <>Jesteś zalogowany jako <b>{actions.account}</b>.</>}
            {' '}Oglądanie nic nie kosztuje i do niczego nie zobowiązuje.
          </p>
        )}
      </div>

      <div className={s.wVisual} aria-hidden="true">
        <div className={s.browser}>
          <div className={s.chrome}><i /><i /><i /><span className={s.addr}>Szybki przykład · wygląd dopasujemy do Ciebie</span></div>
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

      <ol className={s.inside} aria-label="Bez ryzyka">
        {PROMISES.map(([t, d], i) => {
          const Icon = PROMISE_ICONS[i];
          return (
            <li key={t} className={s.rise} style={delay(480 + i * 90)}>
              <span className={s.insideIcon}><Icon size={19} aria-hidden="true" /></span>
              <span><b>{t}</b>{d}</span>
            </li>
          );
        })}
      </ol>

      <div className={s.inspoWrap}><Inspiration actions={actions} placement="welcome" /></div>
    </section>
  );
}
