'use client';

import { useState, type FormEvent } from 'react';
import { AlertCircle, ArrowRight, Building2, Check, ClipboardList, CreditCard, FileText, Lock, PencilLine, RefreshCcw, UserRound } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentName } from '@/lib/tovernet/construction';
import { cartLines, type Cart } from '@/lib/tovernet/funnel';
import { money, plDate, dueDate, type PaymentOption } from '@/lib/tovernet/payments';
import PaymentChoice from '../pay/PaymentChoice';
import PayModal, { type ConfirmResult } from '../pay/PayModal';
import type { CheckoutOrder, JourneyActions, PaymentStart, SignatoryCheck } from '../funnel/Journey';
import { CAPACITY_OPTIONS, LEGAL, consentText, type Capacity } from '@/lib/legal/versions';
import { SELLER, SELLER_SHORT, VAT_LINE } from '@/lib/seller';
import { delay, price, useTween } from './motion';
import s from './studio.module.css';
import p from '../pay/pay.module.css';

// Same messages as OrderFlow.tsx and funnel/StageCheckout.tsx, keyed by the server's error codes.
const ERRORS: Record<string, string> = {
  checkout_disabled: 'Płatności online nie są jeszcze włączone. Napisz do nas w ofercie, a przygotujemy zamówienie.',
  invite_email_mismatch: 'To zaproszenie jest przypisane do innego adresu. Zaloguj się adresem, na który je wysłaliśmy.',
  invite_not_valid: 'To zaproszenie zostało już wykorzystane.',
  invite_expired: 'To zaproszenie wygasło. Napisz do nas, wyślemy nowe.',
  legal_form_unsupported: 'Dla tej formy prawnej przygotujemy zamówienie ręcznie. Napisz do nas w ofercie.',
  item_not_available: 'Któraś z pozycji nie jest już dostępna. Odśwież stronę.',
  demo_not_available: 'Ta oferta nie jest już dostępna.',
  documents_outdated: 'Regulamin zmienił się w międzyczasie. Odśwież stronę i zapoznaj się z aktualną wersją.',
  signatory_required: 'Podaj imię i nazwisko osoby zamawiającej i jej funkcję.',
  authority_not_confirmed: 'Potwierdź, że możesz zawrzeć umowę w imieniu firmy.',
  terms_not_accepted: 'Zaakceptuj Regulamin i Umowę powierzenia.',
};

// Outcome of the KRS check (14-legal-operations-audit.md §5.3, 15-legal-drafts-pl.md §2.2).
const AUTHORITY_MESSAGE: Record<SignatoryCheck['status'], { tone: 'ok' | 'info' | 'warn'; text: (company: string) => string }> = {
  verified: { tone: 'ok', text: (c) => `Sprawdziliśmy w KRS: ta osoba może samodzielnie reprezentować ${c}.` },
  co_signatory_required: { tone: 'info', text: () => 'Według KRS firmę reprezentują łącznie dwie osoby. Po płatności poprosimy drugą osobę o akceptację zamówienia. Prace zaczniemy po obu akceptacjach.' },
  poa_required: { tone: 'info', text: () => 'Pełnomocnictwo prześlesz w panelu klienta po zamówieniu. Prace zaczniemy po jego sprawdzeniu.' },
  not_in_registry: { tone: 'warn', text: () => 'Nie znaleźliśmy tej osoby wśród reprezentantów w KRS. Sprawdź pisownię imienia i nazwiska albo wybierz „Pełnomocnik” i prześlij pełnomocnictwo po zamówieniu. Bez potwierdzenia umowy przez osobę uprawnioną w 14 dni zwrócimy całą wpłatę.' },
  staff_review: { tone: 'info', text: () => 'Umocowanie sprawdzimy ręcznie w rejestrze przed rozpoczęciem prac.' },
};

const NEXT: [string, string][] = [
  ['Faktura', 'Na e-mail i w panelu klienta, od razu po płatności.'],
  ['Ankieta', 'W panelu: numer, usługi i zdjęcia. Podpowiemy, czego potrzeba.'],
  ['Projekt do akceptacji', 'Widzisz stronę przed publikacją i zgłaszasz poprawki.'],
];

/** Stage 4: focused checkout. Logic as funnel/StageCheckout.tsx: choice carried over, account, company and terms, pay. */
export default function Checkout({ demo, cart, actions, onChange }: { demo: PublicDemo; cart: Cart; actions: JourneyActions; onChange: () => void }) {
  const { track } = actions;
  const company = demo.config.company;
  const name = presentName(company.display_name);
  const { rows, monthly, website, addons } = cartLines(demo, cart);
  const [option, setOption] = useState<PaymentOption | null>(cart.payment ?? null);
  const [autopay, setAutopay] = useState(Boolean(cart.autopay));
  const m = money(demo, { ...cart, payment: option }, website, addons, monthly);
  const { today, terms } = m;
  const planRow = rows.find((r) => r.item.billing_interval);
  const [payment, setPayment] = useState<PaymentStart | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const exempt = demo.packages.every((p) => p.vat_exempt);
  const [signer, setSigner] = useState('');
  const [capacity, setCapacity] = useState<Capacity | null>(null);
  const [check, setCheck] = useState<SignatoryCheck | null>(null);
  const [checking, setChecking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [termsAccepted, setTerms] = useState(false);
  const [earlyStart, setEarlyStart] = useState(false);
  const [professional, setProfessional] = useState<CheckoutOrder['professional']>(null);
  // Natural persons in business (CEIDG) are protected by art. 7aa UPK unless they say otherwise.
  // KRS buyers are companies, so today this is false; the inbound CEIDG path sets legal_form.
  const protectedBuyer = /DZIAŁALNOŚĆ|JDG|CEIDG/i.test(company.legal_form ?? '');
  const signerValid = /\S+\s+\S+/.test(signer.trim()) && signer.trim().length >= 5;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [paid, setPaid] = useState(false);
  const shownToday = useTween(today);

  // Who is ordering is already known from the personal link: no account step, the account
  // opens inside "Zamawiam i płacę". Only a browser without the link asks for a code.
  const known = actions.account ?? actions.inviteEmail;
  const ready = Boolean(known);
  const agreed = confirmed && termsAccepted && signerValid && Boolean(capacity) && Boolean(check);

  const runCheck = async (name = signer, cap = capacity) => {
    if (!cap || !/\S+\s+\S+/.test(name.trim())) return;
    setChecking(true);
    // A personal-link buyer has no account yet: open it now (payment would anyway), so the
    // KRS check runs and the authority text shown is the one the server records.
    if (!actions.account) {
      const a = actions.inviteEmail ? await actions.openWithAccount() : { ok: false };
      if (!a.ok) { setChecking(false); setError('Nie udało się otworzyć konta. Spróbuj ponownie.'); return; }
    }
    const r = await actions.checkSignatory(name.trim(), cap);
    setChecking(false);
    setConfirmed(false);
    setCheck(r.ok && r.check ? r.check : { status: 'staff_review', scope: 'alone', method: 'unavailable' });
    track('signatory_checked', { status: r.check?.status ?? 'error', capacity: cap });
  };
  const chosen = !terms || option !== null;
  const canPay = ready && agreed && chosen && !busy;

  const pay = async () => {
    setBusy(true); setError('');
    track('cta_clicked', { placement: 'pay' });
    if (!actions.account && actions.inviteEmail) {
      const a = await actions.openWithAccount();
      if (!a.ok) { setError('Nie udało się otworzyć konta. Spróbuj ponownie.'); setBusy(false); return; }
    }
    const paymentOption: PaymentOption = terms ? option ?? 'full' : 'full';
    const r = await actions.pay({ ...cart, payment: paymentOption, autopay: paymentOption === 'instalments' && autopay }, {
      signatory: { name: signer.trim(), capacity: capacity! },
      consents: { documents: termsAccepted, authority: confirmed, earlyStart: protectedBuyer && earlyStart },
      professional: protectedBuyer || professional ? professional ?? 'no_answer' : null,
    });
    if (r.ok) {
      track('checkout_started', { package: cart.pkg, plan: cart.plan, payment_option: paymentOption, autopay: paymentOption === 'instalments' && autopay,
                                  value: today / 100, contract_value: (website + addons) / 100, currency: 'PLN', monthly_value: monthly / 100 });
      setBusy(false);
      if (r.payment) { setPayment(r.payment); setModalOpen(true); track('checkout_opened', { payment_option: paymentOption }); return; }
      setPaid(true); window.scrollTo({ top: 0 });
      return;
    }
    track('checkout_failed', { reason: r.code || 'unknown' });
    setError(ERRORS[r.code] ?? 'Nie udało się przejść do płatności. Spróbuj ponownie.');
    setBusy(false);
  };

  const confirm = async (intentId: string, status: string): Promise<ConfirmResult> => {
    if (!payment || !actions.confirmPayment) return { status: status === 'succeeded' ? 'paid' : 'pending' };
    const r = await actions.confirmPayment(payment.orderId, intentId);
    if (r.status === 'paid') track('payment_succeeded', { payment_option: payment.paymentOption, value: payment.amountMinor / 100, currency: 'PLN' });
    if (r.status === 'failed') { track('payment_failed', { payment_option: payment.paymentOption }); return { status: 'failed', message: r.message ?? 'Płatność się nie udała.' }; }
    return { status: r.status };
  };

  if (paid) return <Paid name={name} />;

  const progress: { label: string; state: 'done' | 'now' | 'next' }[] = [
    { label: 'Wybór', state: 'done' },
    { label: 'Konto', state: ready ? 'done' : 'now' },
    { label: 'Potwierdzenie', state: !ready ? 'next' : agreed ? 'done' : 'now' },
    { label: 'Płatność', state: canPay ? 'now' : 'next' },
  ];
  const n = (k: number) => (ready ? k : k + 1);

  return (
    <div className={s.co}>
      <div className={s.coMain}>
        <p className={`${s.chip} ${s.rise}`}><Lock size={13} aria-hidden="true" />Zamówienie dla {name}</p>
        <h1 className={`${s.h1s} ${s.rise}`} style={delay(70)}>Ostatni krok. Potem zaczynamy pracę nad Twoją stroną.</h1>

        <ol className={`${s.track} ${s.rise}`} style={delay(140)} aria-label="Postęp zamówienia">
          {progress.map((p, i) => (
            <li key={p.label} className={s[`t_${p.state}`]}>
              <span className={s.trackDot}>{p.state === 'done' ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : i + 1}</span>
              <span>{p.label}<span className={s.sr}>{p.state === 'done' ? ', gotowe' : p.state === 'now' ? ', teraz' : ''}</span></span>
            </li>
          ))}
        </ol>

        <section className={`${s.card} ${s.cardDone} ${s.rise}`} style={delay(200)}>
          <h2 className={s.cardHead}><span className={s.cardNum}><Check size={14} strokeWidth={3} aria-hidden="true" /></span>Twój wybór
            <button type="button" className={s.edit} onClick={onChange}><PencilLine size={14} aria-hidden="true" />Zmień</button></h2>
          <ul className={s.choice}>
            {rows.map(({ item, quantity }) => (
              <li key={item.key}>
                <span><b>{item.name}{quantity > 1 ? ` × ${quantity}` : ''}</b><small>{item.billing_interval ? 'Plan miesięczny, od publikacji strony' : item.kind === 'addon' ? 'Dodatek, płatny dziś' : m.option === 'instalments' && terms ? `Wykonanie strony, w ${terms.count + 1} ratach` : 'Wykonanie strony, jednorazowo'}</small></span>
                <span>{price(item.gross_minor * quantity)}{item.billing_interval ? ' / mies.' : ''}</span>
              </li>
            ))}
          </ul>
        </section>

        {!ready && (
          <section className={`${s.card} ${s.cardNow}`}>
            <h2 className={s.cardHead}><span className={s.cardNum}>2</span>Konto</h2>
            <Account actions={actions} />
          </section>
        )}

        <section className={`${s.card} ${!ready ? s.cardLocked : agreed ? s.cardDone : s.cardNow} ${s.rise}`} style={delay(260)} aria-disabled={!ready}>
          <h2 className={s.cardHead}><span className={s.cardNum}>{agreed && ready ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : n(2)}</span>Kto zamawia</h2>
          <div className={s.company}>
            <span className={s.companyIcon}><Building2 size={20} aria-hidden="true" /></span>
            <span><b>{company.legal_name}</b><small>{[company.krs ? `KRS ${company.krs}` : null, company.city ? presentName(company.city) : null].filter(Boolean).join(' · ')} · stroną umowy i nabywcą na fakturze jest ta firma</small></span>
          </div>
          {known && (
            <p className={s.orderAs}>
              <UserRound size={15} aria-hidden="true" />
              <span>Konto: <b>{known}</b>.{' '}
                {actions.account
                  ? <button type="button" className={s.link} onClick={actions.signOut}>To nie Ty?</button>
                  : 'Konto bez hasła otworzymy przy płatności. Tam zobaczysz postęp prac, dokumenty i faktury.'}</span>
            </p>
          )}

          <label><span className={s.label}>Imię i nazwisko osoby zamawiającej</span>
            <input className={s.field} value={signer} disabled={!ready} autoComplete="name" maxLength={200}
                   onChange={(e) => { setSigner(e.target.value); setCheck(null); setConfirmed(false); }}
                   onBlur={() => void runCheck()} /></label>
          <fieldset className={s.capacity} disabled={!ready}>
            <legend className={s.label}>Funkcja w firmie</legend>
            <div className={s.row}>
              {CAPACITY_OPTIONS.filter((o) => o.key !== 'owner' || protectedBuyer).map((o) => (
                <button key={o.key} type="button" aria-pressed={capacity === o.key}
                        className={`${s.ghost} ${capacity === o.key ? s.chipOn : ''}`}
                        onClick={() => { setCapacity(o.key); setCheck(null); void runCheck(signer, o.key); }}>{o.label}</button>
              ))}
            </div>
            <small className={s.small}>Umowę zawiera osoba uprawniona do reprezentowania firmy według KRS albo jej pełnomocnik. Jeśli nią nie jesteś, możesz dalej oglądać ofertę i napisać do nas, a zamówienie złoży osoba uprawniona.</small>
          </fieldset>
          {checking && <p className={s.small} role="status"><span className={s.spin} aria-hidden="true" />Sprawdzamy w KRS…</p>}
          {check && !checking && (
            <p role="status" className={`${s.authority} ${s[`auth_${AUTHORITY_MESSAGE[check.status].tone}`] ?? ''}`}>
              {AUTHORITY_MESSAGE[check.status].text(company.legal_name)}
              {check.representation && <small>Sposób reprezentacji w KRS: {check.representation.toLocaleLowerCase('pl')}</small>}
            </p>
          )}

          {protectedBuyer && (
            <fieldset className={s.capacity} disabled={!ready}>
              <legend className={s.label}>{consentText.professional()}</legend>
              <div className={s.row}>
                {([['yes', 'Tak'], ['no', 'Nie'], ['no_answer', 'Nie odpowiadam']] as const).map(([k, l]) => (
                  <button key={k} type="button" aria-pressed={professional === k} className={`${s.ghost} ${professional === k ? s.chipOn : ''}`}
                          onClick={() => setProfessional(k)}>{l}</button>
                ))}
              </div>
            </fieldset>
          )}
        </section>

        {terms && (
          <section className={`${s.card} ${option ? s.cardDone : s.cardNow} ${s.rise}`} style={delay(275)}>
            <h2 className={s.cardHead}><span className={s.cardNum}>{option ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : n(3)}</span>Jak płacisz za stronę</h2>
            <PaymentChoice value={option} onChange={(v) => { setOption(v); track('payment_option_selected', { option: v, package: cart.pkg }); }}
              website={website} addons={addons} terms={terms} planName={planRow?.item.name ?? null} planMonthly={monthly}
              autopay={autopay} onAutopay={(v) => { setAutopay(v); track('autopay_toggled', { on: v }); }} />
          </section>
        )}

        <section className={`${s.card} ${!ready ? s.cardLocked : agreed ? s.cardDone : s.cardNow} ${s.rise}`} style={delay(290)} aria-disabled={!ready}>
          <h2 className={s.cardHead}><span className={s.cardNum}>{agreed && ready ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : n(terms ? 4 : 3)}</span>Umowa i dokumenty</h2>
          <div className={s.precontract}>
            <p><b>Sprzedawca:</b> {SELLER_SHORT}. Kontakt: <a href={`mailto:${SELLER.email}`}>{SELLER.email}</a>, <a href={SELLER.phoneHref}>{SELLER.phone}</a>.</p>
            <p><b>Umowa</b> zostanie zawarta po zaksięgowaniu płatności; potwierdzenie z dokumentami w PDF wyślemy e-mailem. Treść umowy: Specyfikacja zamówienia (Twój wybór powyżej, z zakresem z oferty), Regulamin i Umowa powierzenia.</p>
            <p><b>Plan</b> płacisz co miesiąc z góry, od dnia publikacji strony, BLIK-iem albo kartą. Anulujesz go w panelu klienta w każdym czasie, ze skutkiem na koniec opłaconego miesiąca, bez kar.</p>
            {m.option === 'instalments' && terms && <p><b>Raty za stronę</b>: dziś {price(terms.upfront_minor)}, potem {terms.count} × {price(terms.amount_minor)} co miesiąc, ostatnia {plDate(dueDate(terms.count))}. Bez odsetek i opłat; resztę możesz spłacić w każdej chwili. Raty są osobnym zobowiązaniem niż plan: rezygnacja z planu ich nie kończy. Pliki źródłowe strony przekazujemy po zapłacie całości; do tego czasu masz licencję na korzystanie ze strony. Domena od początku jest Twoja.</p>}
            <p><b>Jeśli zrezygnujesz</b> z wykonania strony przed przekazaniem materiałów, zwrócimy całą cenę; później rozliczamy wykonane etapy (§ 19 Regulaminu). Reklamacje rozpatrujemy w 14 dni.</p>
            {protectedBuyer && <p><b>Prawo odstąpienia:</b> masz 14 dni na odstąpienie od umowy bez podania przyczyny (§ 20 i załącznik nr 2 Regulaminu). Pouczenie i formularz otrzymasz też e-mailem.</p>}
            <p className={s.docs}>
              {[LEGAL.regulamin, LEGAL.dpa, LEGAL.privacy].map((d) => d.pdf && (
                <a key={d.key} href={d.pdf} target="_blank" rel="noreferrer"><FileText size={14} aria-hidden="true" />{d.title} (PDF, wersja {d.version})</a>
              ))}
            </p>
          </div>
          <label className={s.check}>
            <input type="checkbox" className={s.sr} checked={termsAccepted} disabled={!ready} onChange={(e) => setTerms(e.target.checked)} />
            <span className={s.box} aria-hidden="true"><Check size={14} strokeWidth={3.2} /></span>
            <span>{consentText.documents()} <a href={`/pl/regulamin/`} target="_blank" rel="noreferrer">Regulamin</a> · <a href="/pl/umowa-powierzenia/" target="_blank" rel="noreferrer">Umowa powierzenia</a></span>
          </label>
          <label className={s.check}>
            <input type="checkbox" className={s.sr} checked={confirmed} disabled={!ready || !check || !capacity}
                   onChange={(e) => setConfirmed(e.target.checked)} />
            <span className={s.box} aria-hidden="true"><Check size={14} strokeWidth={3.2} /></span>
            <span>{capacity && check
              ? consentText.authority(capacity, company.legal_name, check.scope)
              : 'Oświadczenie o umocowaniu pojawi się po podaniu imienia, nazwiska i funkcji.'}</span>
          </label>
          {protectedBuyer && (
            <>
              <label className={s.check}>
                <input type="checkbox" className={s.sr} checked={earlyStart} disabled={!ready} onChange={(e) => setEarlyStart(e.target.checked)} />
                <span className={s.box} aria-hidden="true"><Check size={14} strokeWidth={3.2} /></span>
                <span>Opcjonalnie: {consentText.earlyStart()}</span>
              </label>
              {!earlyStart && <p className={s.small}>Bez tego zaznaczenia zaczniemy prace po upływie 14 dni od zamówienia. Do tego dnia możesz odstąpić od umowy i otrzymasz zwrot całej wpłaty.</p>}
            </>
          )}
        </section>

        <div className={`${s.payBlock} ${s.rise}`} style={delay(320)}>
          <button type="button" className={`${s.cta} ${s.pay} ${canPay ? s.payReady : ''}`} disabled={!canPay} onClick={() => void pay()}>
            {busy ? <><span className={s.spin} aria-hidden="true" />Przygotowujemy płatność…</> : <><Lock size={18} aria-hidden="true" />Zamawiam i płacę {price(today)}</>}
          </button>
          {!busy && !canPay && <p className={s.payHint}>{!ready ? 'Najpierw potwierdź adres e-mail.' : !chosen ? 'Wybierz, jak płacisz za stronę.' : 'Podaj osobę zamawiającą i zaznacz oba wymagane oświadczenia.'}</p>}
          {error && <p role="alert" className={s.err}><AlertCircle size={16} aria-hidden="true" />{error}</p>}
          <ul className={s.trust}>
            <li><CreditCard size={16} aria-hidden="true" />BLIK albo karta, w bezpiecznym oknie Stripe, bez wychodzenia ze strony</li>
            <li><FileText size={16} aria-hidden="true" />Faktura automatycznie, trafi też do kosztów tej firmy w KsięgaI</li>
            <li><RefreshCcw size={16} aria-hidden="true" />Plan zaczyna się od publikacji strony; anulujesz go w panelu klienta, ze skutkiem na koniec opłaconego miesiąca</li>
            <li><Lock size={16} aria-hidden="true" />Na wyciągu z karty: TOVERNET.ONLINE</li>
          </ul>
        </div>
      </div>

      {payment && (
        <PayModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          kicker={`Zamówienie dla ${name}`}
          title={payment.paymentOption === 'instalments' ? 'Pierwsza rata za stronę' : 'Płatność za stronę'}
          todayAmount={price(payment.amountMinor)}
          lines={rows.filter((r) => !r.item.billing_interval).map(({ item, quantity }) => ({
            label: `${item.name}${quantity > 1 ? ` × ${quantity}` : ''}`,
            sub: item.kind === 'package' && payment.paymentOption === 'instalments' && terms ? `rata 1 z ${terms.count + 1}` : item.kind === 'addon' ? 'dodatek' : undefined,
            amount: price(item.kind === 'package' && payment.paymentOption === 'instalments' && terms ? terms.upfront_minor : item.gross_minor * quantity),
          }))}
          future={<>
            {payment.paymentOption === 'instalments' && terms && (
              <p><span className={p.tag}>Raty za stronę</span><b>{terms.count} × {price(terms.amount_minor)}</b> co miesiąc, od {plDate(dueDate(1))} do {plDate(dueDate(terms.count))}. Razem za stronę {price(website)}, bez odsetek. Przed każdą ratą e-mail z linkiem{autopay ? '; z zapisaną kartą pobierzemy ją automatycznie' : ''}.</p>
            )}
            {planRow && <p><span className={`${p.tag} ${p.tagPlan}`}>Plan</span><b>{planRow.item.name}, {price(monthly)}/mies.</b> od dnia publikacji strony. Osobna płatność.</p>}
          </>}
          note="Na wyciągu: TOVERNET.ONLINE. Faktura trafi na e-mail, do panelu klienta i do kosztów firmy w KsięgaI."
          clientSecret={payment.clientSecret}
          submitLabel={`Zapłać ${price(payment.amountMinor)}`}
          returnUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/panel/?zamowienie=${payment.orderId}`}
          onMethod={(type) => track('payment_method_selected', { method: type, payment_option: payment.paymentOption })}
          email={actions.account ?? actions.inviteEmail}
          confirm={confirm}
          success={{
            title: `Dziękujemy. Zaczynamy pracę nad stroną ${name}.`,
            text: 'Płatność jest potwierdzona. Faktura jest w panelu klienta i na Twoim e-mailu. W panelu czeka krótka ankieta, od której zaczynamy.',
            action: { href: `/panel/?zamowienie=${payment.orderId}`, label: 'Wejdź do panelu klienta' },
          }}
        />
      )}

      <aside className={`${s.rc} ${s.rise}`} style={delay(160)} aria-label="Zamówienie">
        <div className={s.rcTop}>
          <p className={s.kicker}>Zamówienie dla</p>
          <p className={s.rcName}>{name}</p>
        </div>
        <ul className={s.rcLines}>
          {rows.map(({ item, quantity }) => (
            <li key={item.key}><span>{item.name}{quantity > 1 ? ` × ${quantity}` : ''}</span><span>{price(item.gross_minor * quantity)}{item.billing_interval ? ' / mies.' : ''}</span></li>
          ))}
        </ul>
        <div className={s.rcTotal}>
          <span>{m.option === 'instalments' ? 'Płatność dziś (pierwsza rata)' : 'Płatność dziś'}</span>
          <b aria-live="polite">{price(shownToday)}</b>
          <p>{m.option === 'instalments' && terms
            ? <>Pierwsza rata {price(terms.upfront_minor)}{addons ? <> i dodatki {price(addons)}</> : null}. Potem {terms.count} × {price(terms.amount_minor)} co miesiąc; razem za stronę {price(website)}.</>
            : <>Wykonanie strony {price(website)}{addons ? <> i dodatki {price(addons)}</> : null}, jednorazowo.</>}
            {' '}{monthly ? <>Plan {price(monthly)} miesięcznie od publikacji strony, osobno.</> : null}</p>
          <p className={s.vat}><Check size={14} aria-hidden="true" />{exempt ? VAT_LINE : 'Ceny brutto, zawierają VAT.'}</p>
        </div>
        <div className={s.rcNext}>
          <p className={s.kicker}>Po płatności</p>
          <ol>{NEXT.map(([t, d], i) => <li key={t}><span>{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>)}</ol>
        </div>
      </aside>
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
      <p className={s.accountOk}><Check size={16} aria-hidden="true" /><span>Konto <b>{actions.account}</b>. Tu zobaczysz postęp prac, faktury i plan.</span>
        <button type="button" className={s.link} onClick={actions.signOut}>zmień</button></p>
    );
  }

  if (actions.inviteEmail) {
    return (
      <div className={s.ask}>
        <p className={s.small}>Utworzymy konto dla <b>{actions.inviteEmail}</b>. Bez hasła, jednym kliknięciem. Konto działa też w KsięgaI, ale nie musisz z niej korzystać.</p>
        <button type="button" className={s.ghost} disabled={busy} onClick={async () => {
          setBusy(true); setError('');
          const r = await actions.openWithAccount();
          setBusy(false);
          if (!r.ok) setError('Nie udało się utworzyć konta. Spróbuj ponownie.');
        }}>{busy ? 'Tworzymy konto…' : 'Utwórz konto'}</button>
        {error && <p role="alert" className={s.err}>{error}</p>}
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
      <form onSubmit={send} className={s.ask}>
        <p className={s.small}>Masz już konto <b>{actions.knownEmail}</b>. Wyślemy na ten adres 6-cyfrowy kod logowania.</p>
        <div className={s.row}>
          <button type="submit" className={s.ghost} disabled={busy}>{busy ? 'Wysyłamy…' : 'Wyślij kod'}</button>
          <button type="button" className={s.link} onClick={() => { setOther(true); setEmail(''); }}>Użyj innego adresu</button>
        </div>
        {error && <p role="alert" className={s.err}>{error}</p>}
      </form>
    );
  }

  return stage === 'email' ? (
    <form onSubmit={send} className={s.ask}>
      <p className={s.small}><b>Masz nasz e-mail z linkiem?</b> Otwórz go na tym urządzeniu, a zalogujemy Cię automatycznie. Albo podaj adres, wyślemy 6-cyfrowy kod.</p>
      <label><span className={s.label}>E-mail</span><input className={s.field} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <button type="submit" className={s.ghost} disabled={busy}>{busy ? 'Wysyłamy…' : 'Wyślij kod'}<ArrowRight size={16} aria-hidden="true" /></button>
      {error && <p role="alert" className={s.err}>{error}</p>}
    </form>
  ) : (
    <form onSubmit={verify} className={s.ask}>
      <p className={s.small}>Wysłaliśmy kod na <b>{email}</b>. Wiadomość przyjdzie od KsięgaI, systemu kont, z którego korzystamy.</p>
      <label><span className={s.label}>Kod z e-maila</span>
        <input className={`${s.field} ${s.code}`} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" required pattern="\d{6}" /></label>
      <div className={s.row}>
        <button type="submit" className={s.ghost} disabled={busy || code.length !== 6}>{busy ? 'Sprawdzamy…' : 'Potwierdź'}</button>
        <button type="button" className={s.link} onClick={() => { setStage('email'); setCode(''); }}>Zmień adres</button>
      </div>
      {error && <p role="alert" className={s.err}>{error}</p>}
    </form>
  );
}

function Paid({ name }: { name: string }) {
  return (
    <section className={s.paid}>
      <svg className={s.okRing} viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="48" cy="48" r="44" />
        <path d="M30 49 l12 12 l24 -26" />
      </svg>
      <p className={s.kicker}>Opłacone</p>
      <h1 className={s.h1s}>Dziękujemy. Zaczynamy pracę nad stroną {name}.</h1>
      <ol className={s.paidSteps}>
        <li className={s.paidDone} style={delay(500)}><span><Check size={15} strokeWidth={3} aria-hidden="true" /></span><div><b>Płatność i faktura</b><p>Faktura jest w panelu klienta i na Twoim e-mailu.</p></div></li>
        <li style={delay(620)}><span><ClipboardList size={15} aria-hidden="true" /></span><div><b>Ankieta w panelu klienta</b><p>Numer, usługi i zdjęcia. Od niej zaczynamy pracę.</p></div></li>
        <li style={delay(740)}><span><PencilLine size={15} aria-hidden="true" /></span><div><b>Projekt do akceptacji</b><p>Zobaczysz go w panelu klienta, zanim cokolwiek opublikujemy.</p></div></li>
      </ol>
      <a href="/panel/" className={s.cta}>Przejdź do panelu klienta<ArrowRight size={19} aria-hidden="true" /></a>
    </section>
  );
}
