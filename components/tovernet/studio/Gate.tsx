'use client';

import { tradeOf } from '@/lib/tovernet/niches';
import { useEffect, useState } from 'react';
import { ArrowRight, Building2, Lock, MapPin, Wrench } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import type { JourneyActions } from '../funnel/Journey';
import { studioFonts } from './fonts';
import { delay } from './motion';
import s from './studio.module.css';
import AccountLink from '../AccountLink';

const ERRORS: Record<string, string> = {
  invite_email_mismatch: 'Jesteś zalogowany innym adresem niż ten, na który wysłaliśmy zaproszenie.',
  invite_not_valid: 'To zaproszenie zostało już wykorzystane.',
  invite_expired: 'To zaproszenie wygasło.',
  legal_form_unsupported: 'Konto dla tej formy prawnej założymy ręcznie.',
  account_exists: 'Masz już konto na ten adres. Zalogujesz się kodem z e-maila przy zamówieniu.',
};

/**
 * One-time full-screen entry for a personal invite (owner direction, 2026-11-02). Shown
 * only while the invite can still create the account and nobody is signed in. Its one
 * button creates the account and claims the company (actions.openWithAccount), so the
 * session persists and this screen is not shown again. Then the journey opens at
 * Przywitanie. A failed account or claim never blocks the offer.
 */
export default function Gate({ demo, actions, onUnlocked }: { demo: PublicDemo; actions: JourneyActions; onUnlocked: () => void }) {
  const company = demo.config.company;
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const trade = tradeOf(demo.config.variant);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { track } = actions;

  useEffect(() => { track('stage_viewed', { stage: 'odblokowanie', from: null }); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unlock = async () => {
    track('cta_clicked', { placement: 'gate' });
    setBusy(true); setError('');
    const r = await actions.openWithAccount();
    setBusy(false);
    track('intro_continued', { with_account: r.ok, placement: 'gate' });
    if (r.ok) onUnlocked();
    else setError(`${ERRORS[r.code] ?? 'Nie udało się założyć konta.'} Konto założysz przy zamówieniu.`);
  };

  return (
    <div lang="pl" className={`${studioFonts} ${s.root}`}>
      <div className={s.ambient} aria-hidden="true"><i className={s.o1} /><i className={s.o2} /><i className={s.grid} /></div>
      <header className={s.gateBar} style={{ justifyContent: 'space-between' }}>
        <a href="/pl/" className={s.logo}><i aria-hidden="true" />tovernet</a>
        <AccountLink className={s.gateAccount} />
      </header>

      <main className={s.gate} aria-label={`Oferta dla ${name}`}>
        <p className={`${s.chip} ${s.rise}`} style={delay(0)}>
          <span className={s.avatar} aria-hidden="true">W</span>
          <span>Wiktor z Tovernet przygotował to dla Twojej firmy</span>
        </p>
        <h1 className={`${s.wName} ${name.length > 30 ? s.wNameLong : ''} ${s.rise}`} style={delay(90)}>{name}</h1>
        <ul className={`${s.meta} ${s.gateMeta} ${s.rise}`} style={delay(180)} aria-label="Dane firmy">
          {trade && <li><Wrench size={15} aria-hidden="true" />{trade}</li>}
          {city && <li><MapPin size={15} aria-hidden="true" />{city}</li>}
          {company.krs && <li><Building2 size={15} aria-hidden="true" />KRS {company.krs}</li>}
        </ul>
        <p className={`${s.wLead} ${s.gateLead} ${s.rise}`} style={delay(260)}>
          Przygotowaliśmy koncept strony internetowej{trade ? <> dla branży <b>{trade.toLowerCase()}</b></> : null}, razem z zakresem i stałą ceną.
          Wszystko czeka w środku.
        </p>

        <div className={`${s.gateCta} ${s.rise}`} style={delay(340)}>
          <button type="button" className={s.cta} disabled={busy} onClick={() => void unlock()}>
            <Lock size={18} aria-hidden="true" />{busy ? 'Otwieramy ofertę…' : 'Odblokuj ofertę'}<ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
        {error ? (
          <p role="alert" className={`${s.err} ${s.gateFine}`}>{error} <button type="button" className={s.link} onClick={onUnlocked}>Przejdź dalej</button></p>
        ) : (
          <p className={`${s.fine} ${s.gateFine} ${s.rise}`} style={delay(400)}>
            Jednym kliknięciem otworzymy konto <b>{actions.inviteEmail}</b>, bez hasła: link z e-maila potwierdza ten adres.
            {' '}Oglądanie nic nie kosztuje i do niczego nie zobowiązuje.
          </p>
        )}
      </main>
    </div>
  );
}
