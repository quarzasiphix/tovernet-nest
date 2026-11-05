// Analytics consent (art. 399 Prawa komunikacji elektronicznej; 14-legal-operations-audit.md P7).
// PostHog is not initialised before the visitor says yes. The choice is kept in localStorage
// for 12 months under a versioned key, so a changed banner text asks again.
export const CONSENT_KEY = 'tovernet_consent';
export const CONSENT_VERSION = 1;
const TWELVE_MONTHS = 365 * 24 * 3600 * 1000;
export const CONSENT_OPEN_EVENT = 'tovernet:consent-open';
export const CONSENT_CHANGED_EVENT = 'tovernet:consent-changed';

export type Consent = { v: number; analytics: boolean; at: string };

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.v !== CONSENT_VERSION || Date.now() - Date.parse(c.at) > TWELVE_MONTHS) return null;
    return c;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean) {
  const c: Consent = { v: CONSENT_VERSION, analytics, at: new Date().toISOString() };
  try { window.localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch { /* private mode: ask again next visit */ }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: c }));
}

export const openConsentSettings = () => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));

/** Pages that show company or order data: never recorded, even with consent. */
export const isPrivatePath = (path = window.location.pathname, hash = window.location.hash) =>
  /^\/(oferta|panel|podglad-sciezki)(\/|$)/.test(path) || /^#[0-9a-f]{36}/.test(hash) || /[?&]krok=zamowienie/.test(window.location.search);
