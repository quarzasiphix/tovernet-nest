'use client';

import { ArrowRight, ExternalLink, ShieldAlert } from 'lucide-react';
import type { ViewProps } from './view';
import p from './panel.module.css';

/**
 * Domain status, derived only from what the project records: the client's answer in the
 * brief, the domain staff set on the project, and the project status. No registrar data
 * exists yet, so nothing here claims a registration, transfer or DNS state it cannot see.
 */
export default function Domain({ ws, go }: ViewProps) {
  const choice = ws.brief.domain_choice;
  const live = ws.production_url ?? (ws.status === 'completed' && ws.domain ? `https://${ws.domain}` : null);
  const name = ws.domain ?? (choice === 'have' ? ws.brief.domain || null : null);
  const stage = live ? 3 : ws.status === 'ready_to_launch' ? 2 : ws.domain ? 1 : 0;

  const steps = [
    { t: 'Wybór adresu', d: choice ? (choice === 'have' ? 'Masz domenę' : choice === 'new' ? 'Nowa domena' : 'Sprawdzamy') : 'Twoja odpowiedź' },
    { t: 'Adres ustalony', d: ws.domain ?? 'Ustalimy razem' },
    { t: 'Podpięcie', d: 'Przed publikacją' },
    { t: 'Strona działa', d: live ? 'Online' : 'Po publikacji' },
  ];

  const explain = live
    ? 'Strona działa pod tym adresem. Jeśli zmieniasz pocztę albo dostawcę domeny, napisz najpierw do nas, żeby strona nie przestała działać.'
    : ws.domain ? 'Ten adres ustaliliśmy dla Twojej strony. Przed publikacją napiszemy, czy potrzebujemy od Ciebie czegoś, np. kodu do przeniesienia albo zmiany ustawień u dostawcy.'
    : choice === 'have' ? (ws.brief.domain ? 'Przed publikacją sprawdzimy, gdzie jest zarejestrowana i kto ma do niej dostęp, i napiszemy, jak ją podpiąć.' : 'Podaj adres domeny w starcie strony.')
    : choice === 'new' ? 'Zaproponujemy kilka wolnych adresów od nazwy firmy. Domenę .pl zarejestrujemy na Twoją firmę.'
    : choice === 'unsure' ? 'Sprawdzimy, czy firma ma już domenę, i napiszemy, co znaleźliśmy.'
    : 'Powiedz nam, czy masz już adres strony. To jedno pytanie w starcie strony.';

  return (
    <div>
      <div className={p.head}>
        <div>
          <span className={p.l}>Domena</span>
          <h1 className={p.h1}>Adres Twojej strony</h1>
          <p className={p.lead}>Domena to adres, który klient wpisuje albo klika, np. twojafirma.pl.</p>
        </div>
      </div>

      <div className={p.sheet} style={{ padding: '22px 24px' }}>
        <span className={p.l}>{live ? 'Działa pod adresem' : name ? 'Adres' : 'Adres jeszcze nieustalony'}</span>
        <p className={p.domainName} style={{ margin: '6px 0 0' }}>
          {live ? <a href={live} target="_blank" rel="noreferrer">{name ?? live.replace(/^https?:\/\//, '')}<ExternalLink size={20} aria-hidden="true" style={{ marginLeft: 8, verticalAlign: 0 }} /></a> : name ?? 'twojafirma.pl'}
        </p>
        <p className={p.muted} style={{ margin: '10px 0 0', maxWidth: '40em' }}>{explain}</p>
      </div>

      <ol className={`${p.dsteps} ${p.gap16}`} aria-label="Etapy domeny">
        {steps.map((s, i) => (
          <li key={s.t} className={i < stage || (i === 3 && live) ? p.done : i === stage ? p.now : ''} aria-current={i === stage ? 'step' : undefined}>
            <span className={p.l}>{String(i + 1).padStart(2, '0')}</span><b>{s.t}</b><small>{s.d}</small>
          </li>
        ))}
      </ol>

      <div className={`${p.warn} ${p.gap16}`} role="note">
        <ShieldAlert size={18} aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />
        <span><b>Nigdy nie wysyłaj nam haseł</b> do domeny, poczty ani panelu dostawcy. Jeśli będzie potrzebny dostęp albo kod przeniesienia, napiszemy, jak go bezpiecznie przekazać.</span>
      </div>

      <div className={`${p.btnRow} ${p.gap24}`}>
        {!ws.brief_submitted_at && <button type="button" className={p.btn} onClick={() => go('start', { step: 'domena' })}>{choice ? 'Zmień odpowiedź' : 'Odpowiedz w starcie strony'}<ArrowRight size={16} aria-hidden="true" /></button>}
        <button type="button" className={p.btnLine} onClick={() => go('wiadomosci', { kind: 'message', draft: 'Pytanie o domenę: ' })}>Zapytaj o domenę</button>
        {live && <button type="button" className={p.btnLine} onClick={() => go('wiadomosci', { kind: 'message', draft: 'Chcę dodać skrzynkę e-mail w domenie: ' })}>Poczta w domenie</button>}
      </div>
    </div>
  );
}
