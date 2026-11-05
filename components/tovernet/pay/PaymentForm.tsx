'use client';

// Stripe's Payment Element (BLIK and card) for a PaymentIntent or SetupIntent the server
// created. Card data and BLIK codes never touch Tovernet: Stripe renders the fields in its own
// frame and handles 3-D Secure and the BLIK bank-app confirmation.
// ksiegai docs/plans/tovernet/19-instalments.md §4.

import { useMemo, useState, type FormEvent } from 'react';
import { loadStripe, type Stripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { AlertCircle, Lock } from 'lucide-react';
import p from './pay.module.css';

let stripePromise: Promise<Stripe | null> | null = null;
export function getStripe() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  stripePromise ??= loadStripe(key, { locale: 'pl' });
  return stripePromise;
}

// Stripe decline and BLIK codes, in plain Polish. Anything else gets the generic line.
const MESSAGES: Record<string, string> = {
  card_declined: 'Bank odrzucił płatność. Spróbuj inną kartą albo BLIK-iem.',
  insufficient_funds: 'Brak wystarczających środków. Spróbuj inną kartą albo BLIK-iem.',
  expired_card: 'Karta straciła ważność. Użyj innej karty albo BLIK-a.',
  incorrect_cvc: 'Kod CVC jest nieprawidłowy.',
  incorrect_number: 'Numer karty jest nieprawidłowy.',
  processing_error: 'Bank chwilowo nie odpowiada. Spróbuj ponownie za chwilę.',
  authentication_required: 'Bank wymaga potwierdzenia płatności. Spróbuj ponownie i potwierdź ją w aplikacji banku.',
  payment_intent_authentication_failure: 'Płatność nie została potwierdzona w banku. Spróbuj ponownie.',
  setup_intent_authentication_failure: 'Karta nie została potwierdzona w banku. Spróbuj ponownie.',
  blik_code_invalid: 'Kod BLIK jest nieprawidłowy albo wygasł. Wygeneruj nowy kod w aplikacji banku.',
  invalid_blik_code: 'Kod BLIK jest nieprawidłowy albo wygasł. Wygeneruj nowy kod w aplikacji banku.',
  blik_code_expired: 'Kod BLIK wygasł. Wygeneruj nowy kod w aplikacji banku.',
  payment_method_provider_timeout: 'Płatność nie została potwierdzona w aplikacji banku w czasie. Wygeneruj nowy kod BLIK i spróbuj ponownie.',
  payment_method_provider_decline: 'Bank odrzucił płatność BLIK. Spróbuj ponownie albo zapłać kartą.',
  payment_intent_payment_attempt_expired: 'Czas na potwierdzenie minął. Spróbuj ponownie.',
};
export const paymentMessage = (code?: string | null, fallback?: string | null) =>
  (code && MESSAGES[code]) || fallback || 'Płatność się nie udała. Spróbuj ponownie albo wybierz inną metodę.';

type Props = {
  clientSecret: string;
  kind?: 'payment' | 'setup';
  /** Button text, e.g. "Zapłać 439 zł". */
  submitLabel: string;
  /** Where Stripe sends the buyer back if a method needs a redirect (rare for card and BLIK). */
  returnUrl: string;
  /** Called with the intent id once Stripe reports success or processing. */
  onDone: (intentId: string, status: string) => void;
  onMethod?: (type: string) => void;
  footnote?: string;
  /** Buyer's e-mail: Stripe needs one for BLIK; given here, the form does not ask for it. */
  email?: string | null;
};

export default function PaymentForm(props: Props) {
  const stripe = getStripe();
  const options = useMemo<StripeElementsOptions>(() => ({
    clientSecret: props.clientSecret,
    locale: 'pl',
    fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }],
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#3A7BFF', colorBackground: '#0B1324', colorText: '#EEF3FC', colorTextSecondary: '#97A6BF',
        colorDanger: '#FF8A8A', colorSuccess: '#3DDC97', fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
        fontSizeBase: '15px', borderRadius: '12px', spacingUnit: '4px', focusBoxShadow: '0 0 0 2px rgba(34,211,238,.6)',
      },
      rules: {
        '.Input': { border: '1px solid rgba(148,170,210,.26)', boxShadow: 'none', padding: '12px 14px' },
        '.Input:focus': { border: '1px solid #3A7BFF' },
        '.Tab': { border: '1px solid rgba(148,170,210,.26)', backgroundColor: 'rgba(255,255,255,.02)', boxShadow: 'none' },
        '.Tab--selected': { border: '1px solid #3A7BFF', backgroundColor: 'rgba(58,123,255,.12)', boxShadow: '0 0 0 1px #3A7BFF' },
        '.Label': { color: '#C4CFE3', fontWeight: '500' },
      },
    },
  }), [props.clientSecret]);

  if (!stripe) {
    return <p className={p.error} role="alert"><AlertCircle size={18} aria-hidden="true" />Płatności online nie są skonfigurowane na tej stronie.</p>;
  }
  return (
    <Elements stripe={stripe} options={options}>
      <Inner {...props} />
    </Elements>
  );
}

function Inner({ kind = 'payment', submitLabel, returnUrl, onDone, onMethod, footnote, email }: Props) {
  const billing = email ? { payment_method_data: { billing_details: { email } } } : {};
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<string>('');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || busy) return;
    setBusy(true); setError('');
    const { error: submitError } = await elements.submit();
    if (submitError) { setBusy(false); setError(paymentMessage(submitError.code, submitError.message)); return; }

    if (kind === 'setup') {
      const r = await stripe.confirmSetup({ elements, confirmParams: { return_url: returnUrl, ...billing }, redirect: 'if_required' });
      setBusy(false);
      if (r.error) { setError(paymentMessage(r.error.decline_code ?? r.error.code, r.error.message)); return; }
      onDone(r.setupIntent.id, r.setupIntent.status);
      return;
    }
    const r = await stripe.confirmPayment({ elements, confirmParams: { return_url: returnUrl, ...billing }, redirect: 'if_required' });
    setBusy(false);
    if (r.error) { setError(paymentMessage(r.error.decline_code ?? r.error.code, r.error.message)); return; }
    onDone(r.paymentIntent.id, r.paymentIntent.status);
  };

  return (
    <form className={p.form} onSubmit={submit} noValidate>
      <div className={p.element}>
        <PaymentElement
          options={{
            layout: { type: 'tabs', defaultCollapsed: false },
            // Link (Stripe's saved-card network) adds an e-mail and phone form next to the card: off.
            wallets: { applePay: 'never', googlePay: 'never', link: 'never' },
            ...(email ? { fields: { billingDetails: { email: 'never' as const } } } : {}),
          }}
          onReady={() => setReady(true)}
          onChange={(ev) => {
            const type = (ev as { value?: { type?: string } }).value?.type ?? '';
            if (type && type !== method) { setMethod(type); onMethod?.(type); }
            if (error) setError('');
          }}
        />
      </div>
      {method === 'blik' && kind === 'payment' && (
        <p className={p.note} style={{ margin: 0 }}>Wpisz 6-cyfrowy kod z aplikacji banku, a potem potwierdź płatność w aplikacji. Kod jest ważny 2 minuty.</p>
      )}
      {error && <p className={p.error} role="alert"><AlertCircle size={18} aria-hidden="true" />{error}</p>}
      <button type="submit" className={p.btn} disabled={!stripe || !ready || busy} aria-busy={busy}>
        {busy
          ? <><span className={p.spin} aria-hidden="true" />{method === 'blik' ? 'Potwierdź w aplikacji banku…' : 'Przetwarzamy płatność…'}</>
          : <><Lock size={17} aria-hidden="true" />{submitLabel}</>}
      </button>
      <p className={p.secure}><Lock size={13} aria-hidden="true" />{footnote ?? 'Płatność obsługuje Stripe. Nie widzimy ani nie zapisujemy danych karty ani kodu BLIK.'}</p>
    </form>
  );
}
