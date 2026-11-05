'use client';

import { useState, type FormEvent } from 'react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentName } from '@/lib/tovernet/construction';
import { money } from '@/lib/tovernet/money';
import { cartLines, type Cart } from '@/lib/tovernet/funnel';
import type { JourneyActions } from './Journey';
import b from '../brand.module.css';
import f from './funnel.module.css';

// Same messages as OrderFlow.tsx, keyed by the server's error codes.
const ERRORS: Record<string, string> = {
  checkout_disabled: 'Płatności online nie są jeszcze włączone. Napisz do nas w ofercie, a przygotujemy zamówienie.',
  invite_email_mismatch: 'To zaproszenie jest przypisane do innego adresu. Zaloguj się adresem, na który je wysłaliśmy.',
  invite_not_valid: 'To zaproszenie zostało już wykorzystane.',
  invite_expired: 'To zaproszenie wygasło. Napisz do nas, wyślemy nowe.',
  legal_form_unsupported: 'Dla tej formy prawnej przygotujemy zamówienie ręcznie. Napisz do nas w ofercie.',
  item_not_available: 'Któraś z pozycji nie jest już dostępna. Odśwież stronę.',
  demo_not_available: 'Ta oferta nie jest już dostępna.',
};

const NEXT: [string, string][] = [
  ['Faktura', 'Na e-mail i w panelu klienta, od razu po płatności.'],
  ['Ankieta', 'W panelu: numer, usługi i zdjęcia. Podpowiemy, czego potrzeba.'],
  ['Projekt do akceptacji', 'Widzisz stronę przed publikacją i zgłaszasz poprawki.'],
];

/** Stage 4: one focused page. Choice carried over, account, company and terms, pay. */
export default function StageCheckout({ demo, cart, actions, onChange }: { demo: PublicDemo; cart: Cart; actions: JourneyActions; onChange: () => void }) {
  const { track } = actions;
  const company = demo.config.company;
  const name = presentName(company.display_name);
  const { rows, once, monthly, today } = cartLines(demo, cart);
  const exempt = demo.packages.every((p) => p.vat_exempt);
  const [confirmed, setConfirmed] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [paid, setPaid] = useState(false);

  // Who is ordering is already known from the personal link: no account step, the account
  // opens inside "Zapłać". Only a browser without the link asks for a code.
  const known = actions.account ?? actions.inviteEmail;
  const ready = Boolean(known);

  const pay = async () => {
    setBusy(true); setError('');
    track('cta_clicked', { placement: 'pay' });
    if (!actions.account && actions.inviteEmail) {
      const a = await actions.openWithAccount();
      if (!a.ok) { setError('Nie udało się otworzyć konta. Spróbuj ponownie.'); setBusy(false); return; }
    }
    // Previous presentation (preview only): no signatory step; the live checkout is studio/Checkout.tsx.
    const r = await actions.pay(cart, { signatory: { name: '', capacity: 'board_member' }, consents: { documents: terms, authority: confirmed, earlyStart: false }, professional: null });
    if (r.ok) {
      track('checkout_started', { package: cart.pkg, plan: cart.plan, value: today / 100, currency: 'PLN', monthly_value: monthly / 100 }, );
      setPaid(true); setBusy(false); window.scrollTo({ top: 0 });
      return;
    }
    track('checkout_failed', { reason: r.code || 'unknown' });
    setError(ERRORS[r.code] ?? 'Nie udało się przejść do płatności. Spróbuj ponownie.');
    setBusy(false);
  };

  if (paid) return <Paid />;

  const receipt = (
    <aside className={f.receipt} aria-label="Zamówienie">
      <div className={f.receiptHead}><span className={b.l}>Zamówienie dla</span><b>{name}</b></div>
      <ul>
        {rows.map(({ item, quantity }) => (
          <li key={item.key}><span>{item.name}{quantity > 1 ? ` × ${quantity}` : ''}</span><span>{money(item.gross_minor * quantity)}{item.billing_interval ? ' / mies.' : ''}</span></li>
        ))}
      </ul>
      <div className={f.receiptTotal}>
        <span className={b.l}>Płatność dziś</span>
        <b>{money(today)}</b>
        <p>Wykonanie strony jednorazowo {money(once)}. Plan {money(monthly)} miesięcznie od publikacji strony, z możliwością rezygnacji na koniec okresu.</p>
        <p>{exempt ? 'Sprzedawca zwolniony z VAT. Kwoty są ostateczne.' : 'Ceny brutto, zawierają VAT.'}</p>
      </div>
      <div className={f.receiptNext}>
        <span className={b.l}>Po płatności</span>
        <ol>{NEXT.map(([t, d], i) => <li key={t}><span className={f.num}>0{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>)}</ol>
      </div>
    </aside>
  );

  return (
    <div className={f.checkout}>
      <div className={f.checkoutMain}>
        <p className={b.l}>Zamówienie</p>
        <h1 className={f.h1s}>Ostatni krok. Potem zaczynamy pracę.</h1>

        <section className={f.cstep}>
          <h2><span className={f.num}>1</span>Twój wybór <button type="button" className={b.link} onClick={onChange}>Zmień</button></h2>
          <ul className={f.choice}>
            {rows.map(({ item, quantity }) => <li key={item.key}><span>{item.name}{quantity > 1 ? ` × ${quantity}` : ''}</span><span>{money(item.gross_minor * quantity)}{item.billing_interval ? ' / mies.' : ''}</span></li>)}
          </ul>
        </section>

        {!ready && (
          <section className={f.cstep}>
            <h2><span className={f.num}>2</span>Konto</h2>
            <Account actions={actions} />
          </section>
        )}

        <section className={`${f.cstep} ${ready ? '' : f.locked}`} aria-disabled={!ready}>
          <h2><span className={f.num}>{ready ? 2 : 3}</span>Firma i regulamin</h2>
          <div className={f.company}>
            <b>{company.legal_name}</b>
            <span>{[company.krs ? `KRS ${company.krs}` : null, company.city ? presentName(company.city) : null].filter(Boolean).join(' · ')}</span>
          </div>
          {known && (
            <p className={f.orderAs}>
              Zamawiasz jako <b>{known}</b>.{' '}
              {actions.account
                ? <button type="button" className={b.link} onClick={actions.signOut}>To nie Ty?</button>
                : 'Konto bez hasła otworzymy przy płatności. Tam zobaczysz postęp prac i faktury.'}
            </p>
          )}
          <label className={f.check}>
            <input type="checkbox" checked={confirmed} disabled={!ready} onChange={(e) => setConfirmed(e.target.checked)} />
            <span>Reprezentuję tę firmę albo zamawiam w jej imieniu. Faktura zostanie wystawiona na nią.</span>
          </label>
          <label className={f.check}>
            <input type="checkbox" checked={terms} disabled={!ready} onChange={(e) => setTerms(e.target.checked)} />
            <span>Akceptuję <a href="/pl/regulamin/" target="_blank" rel="noreferrer">regulamin usług</a>.</span>
          </label>
          <button type="button" className={f.pay} disabled={busy || !ready || !confirmed || !terms} onClick={() => void pay()}>
            {busy ? 'Przekierowujemy do płatności…' : `Zapłać ${money(today)}`}
          </button>
          {error && <p role="alert" className={f.err}>{error}</p>}
          <p className={f.small}>Płatność kartą przez Stripe. Fakturę wystawimy automatycznie i trafi też do kosztów tej firmy w KsięgaI. Plan odnawia się co miesiąc, rezygnację zgłosisz w panelu.</p>
        </section>
      </div>
      {receipt}
    </div>
  );
}

function Account({ actions }: { actions: JourneyActions }) {
  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState(actions.inviteEmail ?? actions.knownEmail ?? '');
  const [other, setOther] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (actions.account) {
    return (
      <p className={f.accountOk}><i aria-hidden="true">✓</i><span>Konto <b>{actions.account}</b>. Tu zobaczysz postęp prac, faktury i plan.</span>
        <button type="button" className={b.link} onClick={actions.signOut}>zmień</button></p>
    );
  }

  if (actions.inviteEmail) {
    return (
      <div>
        <p className={f.small}>Utworzymy konto dla <b>{actions.inviteEmail}</b>. Bez hasła, jednym kliknięciem. Konto działa też w KsięgaI, ale nie musisz z niej korzystać.</p>
        <button type="button" className={f.secondary} disabled={busy} onClick={async () => {
          setBusy(true); setError('');
          const r = await actions.openWithAccount();
          setBusy(false);
          if (!r.ok) setError('Nie udało się utworzyć konta. Spróbuj ponownie.');
        }}>{busy ? 'Tworzymy konto…' : 'Utwórz konto'}</button>
        {error && <p role="alert" className={f.err}>{error}</p>}
      </div>
    );
  }

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true); setError('');
    const r = await actions.sendCode(email.trim());
    setBusy(false);
    if (r.ok) setStage('code'); else setError('Nie udało się wysłać kodu.');
  };
  const verify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true); setError('');
    const r = await actions.verifyCode(email.trim(), code);
    setBusy(false);
    if (!r.ok) setError('Kod jest nieprawidłowy albo wygasł.');
  };

  if (stage === 'email' && actions.knownEmail && !other) {
    return (
      <form onSubmit={send} className={f.ask}>
        <p className={f.small}>Masz już konto <b>{actions.knownEmail}</b>. Wyślemy na ten adres 6-cyfrowy kod logowania.</p>
        <button type="submit" className={f.secondary} disabled={busy}>{busy ? 'Wysyłamy…' : 'Wyślij kod'}</button>
        <button type="button" className={b.link} onClick={() => { setOther(true); setEmail(''); }}>Użyj innego adresu</button>
        {error && <p role="alert" className={f.err}>{error}</p>}
      </form>
    );
  }

  return stage === 'email' ? (
    <form onSubmit={send} className={f.ask}>
      <p className={f.small}><b>Masz nasz e-mail z linkiem?</b> Otwórz go na tym urządzeniu, a zalogujemy Cię automatycznie. Albo podaj adres, wyślemy 6-cyfrowy kod.</p>
      <label><span className={b.l}>E-mail</span><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <button type="submit" className={f.secondary} disabled={busy}>{busy ? 'Wysyłamy…' : 'Wyślij kod'}</button>
      {error && <p role="alert" className={f.err}>{error}</p>}
    </form>
  ) : (
    <form onSubmit={verify} className={f.ask}>
      <p className={f.small}>Wysłaliśmy kod na <b>{email}</b>. Wiadomość przyjdzie od KsięgaI, systemu kont, z którego korzystamy.</p>
      <label><span className={b.l}>Kod z e-maila</span>
        <input className={f.code} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" required pattern="\d{6}" /></label>
      <button type="submit" className={f.secondary} disabled={busy || code.length !== 6}>{busy ? 'Sprawdzamy…' : 'Potwierdź'}</button>
      <button type="button" className={b.link} onClick={() => { setStage('email'); setCode(''); }}>Zmień adres</button>
      {error && <p role="alert" className={f.err}>{error}</p>}
    </form>
  );
}

function Paid() {
  return (
    <section className={f.paid}>
      <p className={f.stampInk}>Opłacone</p>
      <h1 className={f.h1}>Dziękujemy. Zaczynamy pracę nad Twoją stroną.</h1>
      <ol className={f.index}>
        <li className={f.idxDone}><span className={f.num}>✓</span><div><b>Płatność i faktura</b><p>Faktura jest w panelu klienta i na Twoim e-mailu.</p></div></li>
        <li><span className={f.num}>02</span><div><b>Ankieta w panelu klienta</b><p>Numer, usługi i zdjęcia. Od niej zaczynamy pracę.</p></div></li>
        <li><span className={f.num}>03</span><div><b>Projekt do akceptacji</b><p>Zobaczysz go w panelu klienta, zanim cokolwiek opublikujemy.</p></div></li>
      </ol>
      <a href="/panel/" className={f.primary}>Przejdź do panelu klienta<span aria-hidden="true">→</span></a>
    </section>
  );
}
