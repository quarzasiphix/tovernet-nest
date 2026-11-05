// Client-safe view of the legal registry: the versions the checkout shows and sends.
// The server (rpc_tovernet_create_order) refuses an order whose versions are not current.
import registry from './registry.json';
import zgody from '@/content/legal/zgody-zamowienie.json';

type Entry = { key: string; version: string; title: string; pdf: string | null; sha256: string };

const latest = (key: string): Entry => {
  const e = (registry as Entry[]).filter((x) => x.key === key)
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))[0];
  if (!e) throw new Error(`legal registry has no ${key}`);
  return e;
};

export const LEGAL = {
  regulamin: latest('regulamin'),
  dpa: latest('umowa-powierzenia'),
  privacy: latest('polityka-prywatnosci'),
  consents: latest('zgody-zamowienie'),
};

/** Sent with the order; compared with tovernet.legal_documents on the server. */
export const DOCUMENT_VERSIONS = {
  regulamin: LEGAL.regulamin.version,
  'umowa-powierzenia': LEGAL.dpa.version,
  'zgody-zamowienie': LEGAL.consents.version,
};

export type Capacity = keyof typeof zgody.capacities;
export type Scope = keyof typeof zgody.scopes;

export const CAPACITY_OPTIONS: { key: Capacity; label: string }[] = [
  { key: 'board_member', label: 'Członek zarządu' },
  { key: 'partner', label: 'Wspólnik' },
  { key: 'proxy_holder', label: 'Prokurent' },
  { key: 'attorney', label: 'Pełnomocnik' },
  { key: 'owner', label: 'Właściciel (JDG)' },
];

const fill = (t: string, v: Record<string, string>) => t.replace(/\{([a-z-]+)\}/g, (_, k: string) => v[k] ?? '');

/** The exact texts the server stores (same template, same placeholders). */
export const consentText = {
  documents: () => fill(zgody.consents.documents.text, { regulamin: LEGAL.regulamin.version, 'umowa-powierzenia': LEGAL.dpa.version }),
  authority: (capacity: Capacity, company: string, scope: Scope) =>
    fill(zgody.consents.authority.text, { capacity: zgody.capacities[capacity], company, scope: zgody.scopes[scope] }),
  earlyStart: () => zgody.consents.early_start.text,
  professional: () => zgody.professional_question,
};
