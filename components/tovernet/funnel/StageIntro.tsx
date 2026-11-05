'use client';

import { tradeOf } from '@/lib/tovernet/niches';
import { useState } from 'react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import ConceptSite from '../ConceptSite';
import type { JourneyActions } from './Journey';
import b from '../brand.module.css';
import f from './funnel.module.css';

const ERRORS: Record<string, string> = {
  invite_email_mismatch: 'Jesteś zalogowany innym adresem niż ten, na który wysłaliśmy zaproszenie.',
  invite_not_valid: 'To zaproszenie zostało już wykorzystane.',
  invite_expired: 'To zaproszenie wygasło.',
  legal_form_unsupported: 'Konto dla tej formy prawnej założymy ręcznie.',
  account_exists: 'Masz już konto na ten adres. Zalogujesz się kodem z e-maila przy zamówieniu.',
};

/**
 * Stage 1: one full screen. Who it is for, what is inside, one button. With a valid
 * personal invite the button creates the account and claims the company, so the e-mail
 * link works as a magic link.
 */
export default function StageIntro({ demo, actions, onContinue }: { demo: PublicDemo; actions: JourneyActions; onContinue: () => void; onOffer?: () => void }) {
  const company = demo.config.company;
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const trade = tradeOf(demo.config.variant);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const withAccount = Boolean(actions.inviteEmail && !actions.account);

  const go = async () => {
    actions.track('cta_clicked', { placement: 'intro' });
    if (!withAccount) { actions.track('intro_continued', { with_account: Boolean(actions.account) }); onContinue(); return; }
    setBusy(true); setError('');
    const r = await actions.openWithAccount();
    setBusy(false);
    actions.track('intro_continued', { with_account: r.ok });
    // A failed account or claim never blocks the concept.
    if (!r.ok) setError(`${ERRORS[r.code] ?? 'Nie udało się założyć konta.'} Konto założysz przy zamówieniu.`);
    else onContinue();
  };

  return (
    <section className={f.welcome}>
      <div className={f.welcomeMain}>
        <p className={b.l}>Przygotowane dla</p>
        <h1 className={f.welcomeName}>{name}</h1>
        <p className={f.welcomeMeta}>{[trade, city, company.krs ? `KRS\u00a0${company.krs}` : null].filter(Boolean).join(' · ')}</p>

        <ol className={f.inside}>
          <li><span className={f.num}>01</span>Koncept strony Twojej firmy</li>
          <li><span className={f.num}>02</span>Zakres i stała cena</li>
          <li><span className={f.num}>03</span>Zamówienie, jeśli zechcesz</li>
        </ol>

        <button type="button" className={f.primary} disabled={busy} onClick={() => void go()}>
          {busy ? 'Otwieramy…' : 'Kontynuuj'}<span aria-hidden="true">→</span>
        </button>
        {error ? (
          <p role="alert" className={f.err}>{error} <button type="button" className={b.link} onClick={onContinue}>Przejdź do konceptu</button></p>
        ) : (
          <p className={f.fine}>
            {withAccount
              ? <>Otworzymy konto <b>{actions.inviteEmail}</b>, bez hasła: link z e-maila potwierdza ten adres. </>
              : actions.account ? <>Jesteś zalogowany jako <b>{actions.account}</b>. </>
              : actions.knownEmail ? <>Masz już konto <b>{actions.knownEmail}</b>. Przy zamówieniu zalogujesz się kodem z e-maila. </> : null}
            Obejrzenie nic nie kosztuje i do niczego nie zobowiązuje.
          </p>
        )}
        <p className={f.sign}>Wiktor | Tovernet</p>
      </div>

      <div className={f.teaser} aria-hidden="true">
        <div className={f.teaserScreen}>
          <div className={f.teaserPan} ref={(el) => el?.setAttribute('inert', '')}>
            <ConceptSite company={company} variant={demo.config.variant} embedded preview />
          </div>
        </div>
        <span className={f.stamp}>Koncept<br />do oceny</span>
      </div>
    </section>
  );
}
