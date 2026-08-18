'use client';

import { useState } from 'react';
import { Home, Dog, Baby, FileText, ClipboardCheck, Check, X, Plus, ArrowRight, Search, Trophy, Users, Wallet, Settings, Trash2, Download, UserCog, History, Lock } from 'lucide-react';

// Colors and labels lifted directly from /p/pok (the real system we built and
// run for a kennel club office) — src/features/requests/pages/RequestsPage.tsx
// for the status palette and src/layout/AppShell.tsx for the nav structure.
// Domain shown is a placeholder, not the client's real one.
const NAVY = '#1e3a6e';
const BG = '#f0f2f4';
const CARD = '#ffffff';
const BORDER = '#e2e5ea';
const MUTED = '#6b7280';
const INK = '#111827';

const STATUS_STYLE: Record<string, { fg: string; bg: string }> = {
  oczekuje: { fg: '#92400e', bg: '#fef3c7' },
  zatwierdzone: { fg: '#065f46', bg: '#d1fae5' },
  odrzucone: { fg: '#991b1b', bg: '#fee2e2' },
};
const STATUS_LABEL: Record<string, string> = {
  oczekuje: 'Oczekuje',
  zatwierdzone: 'Zatwierdzone',
  odrzucone: 'Odrzucone',
};

type Page = 'start' | 'psy' | 'hodowle' | 'mioty' | 'wnioski';

const NAV_GROUPS: { label: string; items: { key: Page; label: string }[] }[] = [
  { label: 'KARTOTEKA', items: [
    { key: 'start', label: 'Start' },
    { key: 'psy', label: 'Psy / Księga KKR' },
    { key: 'hodowle', label: 'Hodowle' },
    { key: 'mioty', label: 'Mioty' },
  ] },
  { label: 'HODOWCY', items: [
    { key: 'wnioski', label: 'Wnioski hodowców' },
  ] },
];

const NAV_ICONS: Record<Page, typeof Home> = {
  start: Home,
  psy: Dog,
  hodowle: FileText,
  mioty: Baby,
  wnioski: ClipboardCheck,
};

// Rest of the real sidebar (src/layout/AppShell.tsx) — shown grayed out below
// the interactive part of the demo so the panel doesn't look artificially
// small, without pretending these pages are wired up here.
const DISABLED_GROUPS: { label: string; items: { icon: typeof Home; label: string }[] }[] = [
  { label: 'KARTOTEKA', items: [{ icon: Trophy, label: 'Championy' }] },
  { label: 'DOKUMENTY', items: [
    { icon: FileText, label: 'Wystaw rodowód' },
    { icon: History, label: 'Wystawione rodowody' },
  ] },
  { label: 'HODOWCY', items: [
    { icon: Users, label: 'Hodowcy i członkowie' },
    { icon: ClipboardCheck, label: 'Inspekcje hodowli' },
  ] },
  { label: 'FINANSE', items: [{ icon: Wallet, label: 'Opłaty' }] },
  { label: 'USTAWIENIA', items: [
    { icon: Settings, label: 'Ustawienia' },
    { icon: Trash2, label: 'Kosz' },
    { icon: Download, label: 'Eksport danych' },
    { icon: UserCog, label: 'Użytkownicy' },
    { icon: History, label: 'Dziennik zmian' },
  ] },
];

const PAGE_META: Record<Page, { title: string; subtitle: string }> = {
  start: { title: 'Witaj w biurze', subtitle: 'Przegląd stanu bazy i ostatnich zdarzeń.' },
  psy: { title: 'Psy i księga rodowodowa', subtitle: 'Rejestr psów, rodowody i historia właścicieli.' },
  hodowle: { title: 'Hodowle', subtitle: 'Przydomki hodowlane zarejestrowane w związku.' },
  mioty: { title: 'Mioty', subtitle: 'Rejestr miotów — rodzice, hodowca, data urodzenia.' },
  wnioski: { title: 'Wnioski hodowców', subtitle: 'Wnioski o wystawienie rodowodu przesłane przez panel hodowcy.' },
};

// ---- Psy ----
type DogRow = { id: string; name: string; kkr: string; breed: string; sex: 'Pies' | 'Suka' };
const SEED_DOGS: DogRow[] = [
  { id: 'd1', name: 'Ares Srebrny Las', kkr: 'POK/PKR/0001/2026', breed: 'Owczarek niemiecki', sex: 'Pies' },
  { id: 'd2', name: 'Luna Srebrny Las', kkr: 'POK/PKR/0002/2026', breed: 'Owczarek niemiecki', sex: 'Suka' },
  { id: 'd3', name: 'Rex Gold Paw', kkr: 'POK/PKR/0003/2026', breed: 'Labrador retriever', sex: 'Pies' },
];

// ---- Hodowle ----
type Kennel = { id: string; name: string; owner: string; dogs: number };
const SEED_KENNELS: Kennel[] = [
  { id: 'k1', name: 'Srebrny Las', owner: 'Anna Kowalska', dogs: 4 },
  { id: 'k2', name: 'Gold Paw', owner: 'Marta Wiśniewska', dogs: 2 },
  { id: 'k3', name: 'Sunshine Kennel', owner: 'Piotr Nowak', dogs: 3 },
];

// ---- Mioty ----
type Litter = { id: string; parents: string; kennel: string; date: string; puppies: number };
const SEED_LITTERS: Litter[] = [
  { id: 'm1', parents: 'Ares × Luna Srebrny Las', kennel: 'Srebrny Las', date: '2026-03-12', puppies: 5 },
  { id: 'm2', parents: 'Rex × Bella Gold Paw', kennel: 'Gold Paw', date: '2026-05-02', puppies: 3 },
];

// ---- Wnioski ----
type Status = 'oczekuje' | 'zatwierdzone' | 'odrzucone';
type Req = { id: string; dogName: string; requesterName: string; status: Status; notes: string; adminNotes: string };
const SEED_REQUESTS: Req[] = [
  { id: 'r1', dogName: 'Ares Srebrny Las', requesterName: 'Anna Kowalska', status: 'oczekuje', notes: 'Pilne — kupujący czeka na komplet dokumentów.', adminNotes: '' },
  { id: 'r2', dogName: 'Luna Sunshine Kennel', requesterName: 'Piotr Nowak', status: 'oczekuje', notes: 'Rodowód eksportowy, potrzebne tłumaczenie.', adminNotes: '' },
  { id: 'r3', dogName: 'Rex Gold Paw', requesterName: 'Marta Wiśniewska', status: 'zatwierdzone', notes: '', adminNotes: 'Zweryfikowano dane rodziców.' },
];

const REQ_FILTERS: { key: Status | 'wszystkie'; label: string }[] = [
  { key: 'oczekuje', label: 'Oczekuje' },
  { key: 'zatwierdzone', label: 'Zatwierdzone' },
  { key: 'odrzucone', label: 'Odrzucone' },
  { key: 'wszystkie', label: 'Wszystkie' },
];

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>{children}</div>;
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      <p className="text-2xl font-black" style={{ color: NAVY }}>{value}</p>
      <p className="text-xs font-semibold mt-1" style={{ color: MUTED }}>{label}</p>
    </div>
  );
}

function StartPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatTile label="Psów w księdze" value={128} />
        <StatTile label="Hodowców / członków" value={64} />
        <StatTile label="Mioty w tym roku" value={12} />
        <StatTile label="Wystawione rodowody" value={340} />
        <StatTile label="Niezapłacone" value={3} />
      </div>
      <Card>
        <p className="text-sm font-bold mb-3" style={{ color: INK }}>Ostatnia aktywność</p>
        <ul className="space-y-2 text-xs" style={{ color: MUTED }}>
          <li>Anna Kowalska złożyła wniosek o rodowód — Ares Srebrny Las</li>
          <li>Nowy miot zarejestrowany — Gold Paw (5 szczeniąt)</li>
          <li>Wystawiono rodowód POK/666/0003/I/26</li>
        </ul>
      </Card>
    </div>
  );
}

function PsyPage() {
  const [dogs, setDogs] = useState(SEED_DOGS);
  const [selectedId, setSelectedId] = useState(SEED_DOGS[0].id);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const selected = dogs.find((d) => d.id === selectedId) ?? null;

  const addDog = () => {
    if (!name.trim()) return;
    const id = 'd' + Date.now();
    const num = String(dogs.length + 1).padStart(4, '0');
    setDogs((prev) => [...prev, { id, name, breed: breed || 'Rasa nieokreślona', kkr: `POK/PKR/${num}/2026`, sex: 'Pies' }]);
    setSelectedId(id);
    setName('');
    setBreed('');
    setAdding(false);
  };

  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-1.5 rounded-lg px-2.5 h-8" style={{ background: '#f3f4f6' }}>
            <Search className="h-3.5 w-3.5" style={{ color: MUTED }} />
            <span className="text-xs" style={{ color: MUTED }}>Szukaj psa, KKR...</span>
          </div>
          <button
            onClick={() => setAdding((v) => !v)}
            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: NAVY, color: 'white' }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {adding && (
          <div className="mb-3 p-3 rounded-lg space-y-2" style={{ background: '#f9fafb', border: `1px solid ${BORDER}` }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Imię psa"
              className="w-full h-8 rounded-md px-2 text-xs outline-none"
              style={{ border: `1px solid ${BORDER}` }}
            />
            <input
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Rasa"
              className="w-full h-8 rounded-md px-2 text-xs outline-none"
              style={{ border: `1px solid ${BORDER}` }}
            />
            <button onClick={addDog} className="w-full h-8 rounded-md text-xs font-bold" style={{ background: NAVY, color: 'white' }}>
              Dodaj do księgi
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          {dogs.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className="w-full text-left rounded-lg p-2.5 transition"
              style={selectedId === d.id ? { background: '#eef2ff', border: `1px solid ${NAVY}` } : { background: '#fafafa', border: `1px solid ${BORDER}` }}
            >
              <p className="text-sm font-bold" style={{ color: INK }}>{d.name}</p>
              <p className="text-[11px]" style={{ color: MUTED }}>{d.kkr}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        {!selected ? (
          <p className="text-sm text-center py-10" style={{ color: MUTED }}>Wybierz psa z listy.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-base font-bold" style={{ color: INK }}>{selected.name}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wide" style={{ color: MUTED }}>Numer KKR</p>
                <p style={{ color: INK }}>{selected.kkr}</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wide" style={{ color: MUTED }}>Rasa</p>
                <p style={{ color: INK }}>{selected.breed}</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wide" style={{ color: MUTED }}>Płeć</p>
                <p style={{ color: INK }}>{selected.sex}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function HodowlePage() {
  const [selectedId, setSelectedId] = useState(SEED_KENNELS[0].id);
  const selected = SEED_KENNELS.find((k) => k.id === selectedId) ?? null;
  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4">
      <Card>
        <div className="space-y-1.5">
          {SEED_KENNELS.map((k) => (
            <button
              key={k.id}
              onClick={() => setSelectedId(k.id)}
              className="w-full text-left rounded-lg p-2.5 transition"
              style={selectedId === k.id ? { background: '#eef2ff', border: `1px solid ${NAVY}` } : { background: '#fafafa', border: `1px solid ${BORDER}` }}
            >
              <p className="text-sm font-bold" style={{ color: INK }}>{k.name}</p>
              <p className="text-[11px]" style={{ color: MUTED }}>{k.owner}</p>
            </button>
          ))}
        </div>
      </Card>
      <Card>
        {selected && (
          <div className="space-y-3">
            <p className="text-base font-bold" style={{ color: INK }}>{selected.name}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wide" style={{ color: MUTED }}>Właściciel</p>
                <p style={{ color: INK }}>{selected.owner}</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wide" style={{ color: MUTED }}>Psy zarejestrowane</p>
                <p style={{ color: INK }}>{selected.dogs}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function MiotyPage() {
  return (
    <Card>
      <div className="space-y-2">
        {SEED_LITTERS.map((m) => (
          <div key={m.id} className="rounded-lg p-3 flex items-center justify-between gap-3" style={{ background: '#fafafa', border: `1px solid ${BORDER}` }}>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: INK }}>{m.parents}</p>
              <p className="text-[11px]" style={{ color: MUTED }}>{m.kennel} · {m.date}</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: '#eef2ff', color: NAVY }}>
              {m.puppies} szczeniąt
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function WnioskiPage() {
  const [requests, setRequests] = useState<Req[]>(SEED_REQUESTS);
  const [filter, setFilter] = useState<Status | 'wszystkie'>('oczekuje');
  const [selectedId, setSelectedId] = useState<string | null>('r1');
  const [note, setNote] = useState('');

  const selected = requests.find((r) => r.id === selectedId) ?? null;
  const visible = requests.filter((r) => filter === 'wszystkie' || r.status === filter);

  const select = (r: Req) => {
    setSelectedId(r.id);
    setNote(r.adminNotes);
  };

  const setStatus = (status: Status) => {
    if (!selected) return;
    setRequests((prev) => prev.map((r) => (r.id === selected.id ? { ...r, status, adminNotes: note } : r)));
  };

  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4">
      <Card>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {REQ_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="h-7 px-2.5 rounded-full text-[11px] font-bold transition"
              style={filter === f.key ? { background: NAVY, color: 'white' } : { background: '#f3f4f6', color: MUTED }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {visible.length === 0 && (
            <p className="text-xs text-center py-6" style={{ color: MUTED }}>Brak wniosków w tej kategorii.</p>
          )}
          {visible.map((r) => {
            const s = STATUS_STYLE[r.status];
            return (
              <button
                key={r.id}
                onClick={() => select(r)}
                className="w-full text-left rounded-lg p-3 transition"
                style={selected?.id === r.id ? { background: '#eef2ff', border: `1px solid ${NAVY}` } : { background: '#fafafa', border: `1px solid ${BORDER}` }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold truncate" style={{ color: INK }}>{r.dogName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.fg }}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
                <p className="text-xs truncate" style={{ color: MUTED }}>{r.requesterName}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        {!selected ? (
          <p className="text-sm text-center py-10" style={{ color: MUTED }}>Wybierz wniosek z listy.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-base font-bold" style={{ color: INK }}>{selected.dogName}</p>
              <p className="text-xs" style={{ color: MUTED }}>Zgłasza: {selected.requesterName}</p>
            </div>
            {selected.notes && (
              <div className="rounded-lg p-3 text-xs" style={{ background: '#f9fafb', color: '#374151' }}>
                {selected.notes}
              </div>
            )}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide mb-1 block" style={{ color: MUTED }}>Notatka biura</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="np. Zweryfikowano dane rodziców."
                rows={3}
                className="w-full rounded-lg p-2.5 text-sm outline-none resize-none"
                style={{ border: `1px solid ${BORDER}`, color: INK }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('zatwierdzone')}
                className="flex-1 h-10 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                style={{ background: '#059669', color: 'white' }}
              >
                <Check className="h-4 w-4" /> Zatwierdź
              </button>
              <button
                onClick={() => setStatus('odrzucone')}
                className="flex-1 h-10 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                style={{ background: '#fee2e2', color: '#991b1b' }}
              >
                <X className="h-4 w-4" /> Odrzuć
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function PokPanelDemo() {
  const [page, setPage] = useState<Page>('wnioski');

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
      {/* browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <span className="ml-3 text-xs text-gray-400 font-mono">panel.twojkynolog.pl</span>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">Kliknij, żeby wypróbować</span>
      </div>

      {/* app surface */}
      <div className="p-4 sm:p-6" style={{ background: '#151a24' }}>
        <div className="rounded-2xl overflow-hidden flex flex-col lg:flex-row" style={{ background: BG }}>
          {/* sidebar (desktop only) */}
          <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col gap-5 p-5 border-r" style={{ background: CARD, borderColor: BORDER }}>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: NAVY }}>
                ZK
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>Program biurowy</p>
                <p className="text-sm font-bold" style={{ color: INK }}>Twój Związek</p>
              </div>
            </div>
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-1.5 px-2" style={{ color: MUTED }}>{group.label}</p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = NAV_ICONS[item.key];
                    const active = item.key === page;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setPage(item.key)}
                        className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] font-semibold text-left transition"
                        style={active ? { background: '#eef2ff', color: NAVY } : { color: '#374151' }}
                      >
                        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="h-px" style={{ background: BORDER }} />

            {DISABLED_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-1.5 px-2" style={{ color: '#c1c5cc' }}>{group.label}</p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] font-semibold cursor-not-allowed"
                      style={{ color: '#c1c5cc' }}
                    >
                      <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-[10px] flex items-center gap-1.5 px-2 mt-1" style={{ color: '#c1c5cc' }}>
              <Lock className="h-3 w-3" /> Reszta panelu w pełnej wersji
            </p>
          </aside>

          {/* mobile tab bar */}
          <div className="flex lg:hidden overflow-x-auto gap-1.5 p-3 border-b" style={{ borderColor: BORDER }}>
            {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className="flex-shrink-0 h-8 px-3 rounded-full text-xs font-bold transition"
                style={page === item.key ? { background: NAVY, color: 'white' } : { background: '#f3f4f6', color: MUTED }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* main content */}
          <div className="flex-1 p-5 sm:p-6 min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold" style={{ color: INK }}>{PAGE_META[page].title}</h3>
                <p className="text-xs" style={{ color: MUTED }}>{PAGE_META[page].subtitle}</p>
              </div>
              {page !== 'start' && (
                <ArrowRight className="h-4 w-4 flex-shrink-0" style={{ color: MUTED }} />
              )}
            </div>

            {page === 'start' && <StartPage />}
            {page === 'psy' && <PsyPage />}
            {page === 'hodowle' && <HodowlePage />}
            {page === 'mioty' && <MiotyPage />}
            {page === 'wnioski' && <WnioskiPage />}
          </div>
        </div>
      </div>
    </div>
  );
}
