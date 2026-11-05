// Fixture data for /podglad-panelu/ (owner review and screenshots). A fictional company,
// no real registry data. Every call is simulated in memory; uploads become object URLs.

import type { Brief, FileRow, Item, Overview, PanelApi, ProjectApi, Workspace } from './types';
import type { PanelCompanyData } from '../PanelCompany';

export type FixtureState = 'materialy' | 'realizacja' | 'przeglad' | 'online' | 'pusto' | 'dlugie';
export const FIXTURE_STATES: { key: FixtureState; label: string }[] = [
  { key: 'materialy', label: 'Start: materiały' },
  { key: 'realizacja', label: 'Realizacja + Księgai' },
  { key: 'przeglad', label: 'Przegląd' },
  { key: 'online', label: 'Online' },
  { key: 'dlugie', label: 'Długa nazwa, 2 firmy' },
  { key: 'pusto', label: 'Bez projektu' },
];

const ago = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const ahead = (d: number) => new Date(Date.now() + d * 86400_000).toISOString();

function company(long: boolean): PanelCompanyData {
  return {
    lead_id: 'lead-1',
    legal_name: long ? 'PRZEDSIĘBIORSTWO INSTALACJI ELEKTRYCZNYCH I TELETECHNICZNYCH NOWAK-WIŚNIEWSKI SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ' : 'VOLTERA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    display_name: long ? 'Przedsiębiorstwo Instalacji Elektrycznych i Teletechnicznych Nowak-Wiśniewski' : 'Voltera',
    krs: '9980000001', nip: '7251234567', regon: '389123456', legal_form: 'SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    registration_date: '2026-03-12', city: long ? null : 'ŁÓDŹ', address: 'ul. Przykładowa 1/2, 90-001',
    pkd_primary: '43.21.Z', website: null, niche_key: 'construction', variant: 'electrical', public_id: null,
    claim_status: 'verified', customer: true,
  };
}

function workspace(state: FixtureState): Workspace {
  const long = state === 'dlugie';
  const c = company(long);
  const submitted = state !== 'materialy' && state !== 'dlugie';
  const status = { materialy: 'new', dlugie: 'awaiting_information', realizacja: 'in_production', przeglad: 'client_review', online: 'completed', pusto: 'new' }[state];
  const brief: Brief = submitted
    ? { phone: '600 700 800', email: 'biuro@voltera.example', area: 'Łódź i 30 km wokół', services: ['Instalacje elektryczne w domach', 'Pomiary elektryczne', 'Fotowoltaika', 'Rozdzielnice'], no_logo: true, domain_choice: 'new', notes: 'Wyceny w ciągu 2 dni roboczych.' }
    : { phone: '600 700 800', email: 'biuro@voltera.example' };
  const items: Item[] = [];
  if (submitted) {
    items.push({ id: 'i1', kind: 'message', author_side: 'staff', body: 'Dzień dobry, materiały dotarły. Zaczynamy od strony głównej i usług. Jedno pytanie: czy fotowoltaika ma być na górze listy?', status: 'open', created_at: ago(70) });
    items.push({ id: 'i2', kind: 'message', author_side: 'client', body: 'Tak, fotowoltaika jako druga. Dziękuję!', status: 'open', created_at: ago(66) });
  }
  if (state === 'przeglad' || state === 'online') items.push({ id: 'i3', kind: 'message', author_side: 'staff', body: 'Podgląd strony jest gotowy. Obejrzyj go na telefonie i komputerze, a potem zaakceptuj albo zgłoś poprawki w jednej wiadomości.', status: 'open', created_at: ago(5) });
  if (state === 'dlugie') items.push({ id: 'i4', kind: 'info_request', author_side: 'staff', body: 'Czy na stronie ma być też numer stacjonarny biura?', status: 'open', created_at: ago(2) });
  const files: FileRow[] = submitted ? [
    { id: 'f1', file_name: 'rozdzielnica.jpg', mime_type: 'image/jpeg', size_bytes: 2_400_000, purpose: 'photo', created_at: ago(72) },
    { id: 'f2', file_name: 'IMG_2041.HEIC', mime_type: 'image/heic', size_bytes: 3_100_000, purpose: 'photo', created_at: ago(72) },
    { id: 'f3', file_name: 'cennik-2026.pdf', mime_type: 'application/pdf', size_bytes: 380_000, purpose: 'document', created_at: ago(71) },
  ] : [];
  return {
    id: long ? 'proj-2' : 'proj-1', name: 'Strona Firma', status, domain: state === 'online' ? 'voltera.pl' : state === 'przeglad' ? 'voltera.pl' : null,
    preview_url: state === 'przeglad' ? '/strony-dla-elektrykow/' : state === 'online' ? '/strony-dla-elektrykow/' : null,
    production_url: state === 'online' ? '/strony-dla-elektrykow/' : null,
    created_at: ago(80),
    brief, brief_submitted_at: submitted ? ago(72) : null,
    revision_rounds_used: state === 'online' ? 1 : 0, revision_rounds_limit: 2, approved_at: state === 'online' ? ago(30) : null,
    package: { key: 'tovernet.site.firma', name: 'Strona Firma', limits: { revision_rounds: 2 } },
    plan: { key: 'tovernet.care.monthly', name: 'Opieka' },
    prefill: { company_name: c.display_name, legal_name: c.legal_name, nip: c.nip, krs: c.krs, email: 'biuro@voltera.example', city: c.city, website: null, variant: 'electrical' },
    items, files,
    ksiegai: submitted ? { status: 'ready', business_profile_id: 'bp-1', ready_at: ago(71), missing: [] } : { status: 'waiting', business_profile_id: 'bp-1', ready_at: null, missing: [] },
  };
}

export function fixtureApi(state: FixtureState): PanelApi {
  const spaces = new Map<string, Workspace>();
  const urls = new Map<string, string>();
  const base = workspace(state);
  spaces.set(base.id, base);
  if (state === 'dlugie') { const other = workspace('realizacja'); spaces.set(other.id, { ...other, prefill: { ...other.prefill, company_name: 'Voltera' } }); }
  const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
  const clone = (w: Workspace) => JSON.parse(JSON.stringify(w)) as Workspace;

  const overview = (): Overview => {
    if (state === 'pusto') return { companies: [company(false)], projects: [], offers: [], orders: [] };
    const list = Array.from(spaces.values());
    return {
      companies: [company(state === 'dlugie')],
      projects: list.map((w, i) => ({ id: w.id, name: w.name, status: w.status, company_name: w.prefill.company_name ?? '', preview_url: w.preview_url, production_url: w.production_url ?? null, domain: w.domain, open_requests: 0, lead_id: i === 0 ? 'lead-1' : 'lead-2', order_id: `ord-${i + 1}` })),
      offers: [],
      orders: list.map((w, i) => ({
        id: `ord-${i + 1}`, status: 'paid', paid_at: ago(80), company_name: w.prefill.legal_name ?? '', total_gross_minor: 308900, recurring_gross_minor: 9900, requires_review: false,
        invoice_number: `FV/2026/11/00${i + 1}`,
        items: [{ name: 'Strona Firma', quantity: 1, billing_interval: null, unit_amount_minor: 299000 }, { name: 'Opieka', quantity: 1, billing_interval: 'month', unit_amount_minor: 9900 }],
        subscription: { status: 'active', current_period_end: ahead(22), cancel_at_period_end: false },
      })),
    };
  };

  const project = (id: string): ProjectApi => {
    const w = () => spaces.get(id)!;
    return {
      get: async () => { await wait(250); return clone(w()); },
      saveBrief: async (answers, submit) => {
        await wait(400);
        if (submit && !answers.phone?.trim()) throw new Error('phone_required');
        const cur = w();
        cur.brief = answers;
        if (submit) { cur.brief_submitted_at = new Date().toISOString(); cur.status = 'awaiting_information'; cur.ksiegai = { status: 'ready', business_profile_id: 'bp-1', ready_at: new Date().toISOString(), missing: [] }; }
        return clone(cur);
      },
      post: async (kind, body) => { await wait(); w().items.push({ id: `n${Date.now()}`, kind, author_side: 'client', body, status: 'open', created_at: new Date().toISOString() }); return clone(w()); },
      review: async (decision, body) => {
        await wait();
        const cur = w();
        if (decision === 'approve') { cur.status = 'ready_to_launch'; cur.approved_at = new Date().toISOString(); }
        else { cur.status = 'in_production'; cur.revision_rounds_used += 1; cur.items.push({ id: `r${Date.now()}`, kind: 'revision', author_side: 'client', body: body ?? '', status: 'open', created_at: new Date().toISOString() }); }
        return clone(cur);
      },
      upload: async (file, purpose) => {
        await wait(700);
        const fid = `u${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
        urls.set(fid, URL.createObjectURL(file));
        w().files.push({ id: fid, file_name: file.name, mime_type: file.type || 'image/jpeg', size_bytes: file.size, purpose, created_at: new Date().toISOString() });
      },
      fileUrl: async (fid) => urls.get(fid) ?? `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER)}`,
      fileRemove: async (fid) => { await wait(); const cur = w(); cur.files = cur.files.filter((f) => f.id !== fid); },
      markRead: async () => undefined,
    };
  };

  return { overview: async () => { await wait(200); return overview(); }, documents: async () => [], portal: async () => '#konto', project };
}

// Neutral stand-in for photos in the fixture: a technical-drawing tile, clearly not a real photo.
const PLACEHOLDER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#E4E5DF"/><g stroke="#9A9C96" fill="none"><path d="M20 160h160M40 160V70l60-30 60 30v90"/><rect x="80" y="100" width="40" height="60"/></g><text x="100" y="190" font-family="monospace" font-size="10" text-anchor="middle" fill="#6A6C68">zdjęcie poglądowe</text></svg>';
