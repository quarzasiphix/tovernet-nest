'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft, Banknote, Baby, Check, ChevronDown, ClipboardList, Dog as DogIcon, FileText, Home, LayoutGrid, MoreHorizontal,
  Plus, QrCode, Search, ShieldCheck, Sparkles, Trophy, Users, X, ScrollText, BookOpen, ClipboardCheck, Building2, Upload,
} from 'lucide-react';
import posthog from 'posthog-js';
import {
  BREEDER, BREEDER_KENNEL, DOGS, FEE_LABEL, PEOPLE, REQUESTS, ROLE_LABEL, STATUS_LABEL, isPuppy, plDate,
  type Dog, type Person, type Req, type ReqStatus,
} from './data';
import s from './pok-demo.module.css';

/**
 * Interactive demo of the office software we built for a kennel club (POK), rebuilt
 * 2026-11-17 from the current panel UI (/p/pok: AppShell, Psy, Rodowody do wystawienia,
 * Hodowcy i członkowie, Wnioski, Panel hodowcy). Fictional data, nothing leaves the browser,
 * no address of the real system. Try: submit a request in the breeder panel, approve it in
 * the office, issue the pedigree, then check its QR verification.
 */

type View = 'start' | 'psy' | 'rodowody' | 'hodowcy' | 'wnioski' | 'other';
type Side = 'biuro' | 'hodowca' | 'qr';

const NAV: { group: string; items: { key: View | string; label: string; icon: typeof Home; note?: string }[] }[] = [
  { group: 'Rejestr', items: [
    { key: 'psy', label: 'Psy', icon: DogIcon },
    { key: 'mioty', label: 'Mioty', icon: Baby, note: 'Mioty z kolejnością szczeniąt, kartami miotu i rodowodami dla całego miotu naraz.' },
    { key: 'hodowle', label: 'Hodowle', icon: Building2, note: 'Przydomki hodowlane, właściciele, kontrole i panel każdej hodowli.' },
    { key: 'hodowcy', label: 'Hodowcy i członkowie', icon: Users },
    { key: 'championy', label: 'Championy', icon: Trophy, note: 'Tytuły championów przypisane do psów, z datą uzyskania.' },
  ] },
  { group: 'Dokumenty', items: [
    { key: 'rodowody', label: 'Rodowody do wystawienia', icon: ScrollText },
    { key: 'wystawione', label: 'Wystawione rodowody', icon: FileText, note: 'Archiwum wystawionych dokumentów z PDF do druku i kodem QR.' },
    { key: 'kkr', label: 'KKR – Krajowa Księga Rodowodowa', icon: BookOpen, note: 'Wewnętrzna księga numerów KKR z audytem zgodności.' },
  ] },
  { group: 'Sprawy', items: [
    { key: 'wnioski', label: 'Wnioski hodowców', icon: ClipboardCheck },
    { key: 'inspekcje', label: 'Inspekcje hodowli', icon: ClipboardList, note: 'Protokoły kontroli hodowli z terminami kolejnych wizyt.' },
  ] },
  { group: 'Finanse', items: [
    { key: 'oplaty', label: 'Opłaty', icon: Banknote, note: 'Składki i opłaty za dokumenty, zaległości, raport do księgowości.' },
  ] },
];
const NOTES: Record<string, { label: string; note: string }> = Object.fromEntries(
  NAV.flatMap((g) => g.items.filter((i) => i.note).map((i) => [i.key, { label: i.label, note: i.note! }])),
);

const track = (action: string, props: Record<string, unknown> = {}) => { try { posthog.capture?.('pok_demo_interaction', { action, ...props }); } catch { /* demo only */ } };

export default function PokDemo() {
  const [side, setSide] = useState<Side>('biuro');
  const [view, setView] = useState<View>('start');
  const [other, setOther] = useState<string>('mioty');
  const [dogs, setDogs] = useState<Dog[]>(DOGS);
  const [people, setPeople] = useState<Person[]>(PEOPLE);
  const [requests, setRequests] = useState<Req[]>(REQUESTS);
  const [toast, setToast] = useState<string | null>(null);
  const [qrDog, setQrDog] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const say = (t: string) => { setToast(t); window.setTimeout(() => setToast((x) => (x === t ? null : x)), 3200); };
  const go = (key: string) => {
    setNavOpen(false);
    if (['start', 'psy', 'rodowody', 'hodowcy', 'wnioski'].includes(key)) setView(key as View);
    else { setOther(key); setView('other'); }
    track('view', { view: key });
  };

  const issue = (id: string) => {
    const no = `POK/666/${String(20 + dogs.filter((x) => x.pedigreeNo).length).padStart(4, '0')}/I/26`;
    setDogs((list) => list.map((d) => (d.id === id ? { ...d, ready: false, doc: 'R', pedigreeNo: no, kr: d.kr ?? `POK/PKR/00${30 + list.length}/2026` } : d)));
    say(`Rodowód ${no} wystawiony. PDF do druku z kodem QR jest gotowy.`);
    track('issue_pedigree');
  };
  const decide = (id: string, status: ReqStatus) => {
    const r = requests.find((x) => x.id === id);
    setRequests((list) => list.map((x) => (x.id === id ? { ...x, status } : x)));
    if (status === 'zatwierdzone' && r) setDogs((list) => list.map((d) => (d.id === r.dogId && !d.pedigreeNo ? { ...d, ready: true, kr: d.kr ?? 'POK/PKR/0031/2026' } : d)));
    say(status === 'zatwierdzone' ? 'Wniosek zatwierdzony. Pies trafił do „Rodowodów do wystawienia”.' : 'Wniosek odrzucony. Hodowca zobaczy uzasadnienie w swoim panelu.');
    track('decide_request', { status });
  };
  const submitRequest = (dogId: string, kind: string, note: string) => {
    setRequests((list) => [{ id: `r${list.length + 10}`, dogId, breeder: BREEDER, kind, date: '2026-11-17', status: 'oczekuje', note }, ...list]);
    say('Wniosek wysłany do biura. Przełącz na „Biuro POK”, żeby go rozpatrzyć.');
    track('submit_request');
  };

  return (
    <div className={s.demo}>
      <div className={s.switch} role="group" aria-label="Widok demo">
        <button type="button" aria-pressed={side === 'biuro'} onClick={() => { setSide('biuro'); track('side', { side: 'biuro' }); }}>Biuro związku</button>
        <button type="button" aria-pressed={side === 'hodowca'} onClick={() => { setSide('hodowca'); track('side', { side: 'hodowca' }); }}>Panel hodowcy</button>
        <button type="button" aria-pressed={side === 'qr'} onClick={() => { setSide('qr'); track('side', { side: 'qr' }); }}>Weryfikacja QR</button>
      </div>

      <div className={s.frame}>
        <div className={s.chrome} aria-hidden="true"><i /><i /><i /><span>Program biurowy związku · dane testowe</span></div>
        <div className={s.app}>
          {side === 'biuro' && (
            <Office view={view} other={other} go={go} navOpen={navOpen} setNavOpen={setNavOpen}
                    dogs={dogs} people={people} setPeople={setPeople} requests={requests}
                    issue={issue} decide={decide} openQr={(id) => { setQrDog(id); setSide('qr'); }} say={say} setDogs={setDogs} />
          )}
          {side === 'hodowca' && <Breeder dogs={dogs} requests={requests} submit={submitRequest} />}
          {side === 'qr' && <Verify dogs={dogs} dogId={qrDog} pick={setQrDog} />}
          {toast && <p className={s.toast} role="status"><Check size={16} aria-hidden="true" />{toast}</p>}
        </div>
      </div>
      <p className={s.caption}>Interaktywne demo z danymi testowymi. Działa w przeglądarce: nic nie jest zapisywane ani wysyłane.</p>
    </div>
  );
}

/* ================= office ================= */

function Office(p: {
  view: View; other: string; go: (k: string) => void; navOpen: boolean; setNavOpen: (v: boolean) => void;
  dogs: Dog[]; setDogs: (f: (d: Dog[]) => Dog[]) => void; people: Person[]; setPeople: (f: (p: Person[]) => Person[]) => void; requests: Req[];
  issue: (id: string) => void; decide: (id: string, s: ReqStatus) => void; openQr: (id: string) => void; say: (t: string) => void;
}) {
  const current = p.view === 'other' ? p.other : p.view;
  const group = NAV.find((g) => g.items.some((i) => i.key === current));
  const pending = p.requests.filter((r) => r.status === 'oczekuje').length;
  return (
    <div className={s.office}>
      <aside className={s.side} data-open={p.navOpen || undefined} aria-label="Menu programu">
        <div className={s.brand}><span>POK</span><b>Program biurowy</b></div>
        <div className={s.find} aria-hidden="true"><Search size={14} />Szukaj…<kbd>Ctrl K</kbd></div>
        <button type="button" className={s.navItem} aria-current={current === 'start' ? 'page' : undefined} onClick={() => p.go('start')}><Home size={15} aria-hidden="true" />Start</button>
        {NAV.map((g) => (
          <div key={g.group} className={s.navGroup}>
            <p>{g.group}<ChevronDown size={12} aria-hidden="true" /></p>
            {g.items.map((i) => (
              <button key={i.key} type="button" className={s.navItem} aria-current={current === i.key ? 'page' : undefined} onClick={() => p.go(i.key)}>
                <i.icon size={15} aria-hidden="true" />{i.label}
                {i.key === 'wnioski' && pending > 0 && <em>{pending}</em>}
              </button>
            ))}
          </div>
        ))}
        <div className={s.user}><span>Z</span><b>Zarząd (konto testowe)</b></div>
      </aside>

      <section className={s.main}>
        <div className={s.top}>
          <button type="button" className={s.menuBtn} onClick={() => p.setNavOpen(!p.navOpen)} aria-expanded={p.navOpen}><LayoutGrid size={15} aria-hidden="true" />Menu</button>
          <span className={s.crumb}><ArrowLeft size={13} aria-hidden="true" />Wróć</span>
          {group && <span className={s.crumbGroup}>{group.group}</span>}
          {group?.items.slice(0, 5).map((i) => (
            <button key={i.key} type="button" className={s.tab} aria-current={current === i.key ? 'page' : undefined} onClick={() => p.go(i.key)}>{i.label.split(' – ')[0]}</button>
          ))}
        </div>
        <div className={s.page} key={current}>
          {p.view === 'start' && <Start {...p} pending={pending} />}
          {p.view === 'psy' && <Dogs {...p} />}
          {p.view === 'rodowody' && <Pedigrees {...p} />}
          {p.view === 'hodowcy' && <People {...p} />}
          {p.view === 'wnioski' && <Requests {...p} />}
          {p.view === 'other' && NOTES[p.other] && (
            <div className={s.card}>
              <h3 className={s.h}>{NOTES[p.other].label}</h3>
              <p className={s.muted}>{NOTES[p.other].note}</p>
              <p className={s.muted}>Ten widok jest w pełnej wersji programu. W demo wypróbujesz: Start, Psy, Rodowody do wystawienia, Hodowców i członków oraz Wnioski hodowców.</p>
              <button type="button" className={s.primary} onClick={() => p.go('psy')}>Przejdź do psów</button>
            </div>
          )}
        </div>
        <nav className={s.bottom} aria-label="Nawigacja (telefon)">
          {([['start', Home, 'Start'], ['psy', DogIcon, 'Psy'], ['rodowody', ScrollText, 'Dokumenty'], ['hodowcy', Users, 'Ludzie'], ['wnioski', MoreHorizontal, 'Wnioski']] as const).map(([k, I, l]) => (
            <button key={k} type="button" aria-current={current === k ? 'page' : undefined} onClick={() => p.go(k)}><I size={18} aria-hidden="true" />{l}</button>
          ))}
        </nav>
      </section>
    </div>
  );
}

function Head({ icon, title, sub, stats, actions }: { icon: ReactNode; title: string; sub: string; stats?: [string, number][]; actions?: ReactNode }) {
  return (
    <div className={s.head}>
      <div className={s.headTitle}>
        <span className={s.headIcon} aria-hidden="true">{icon}</span>
        <div><h3>{title}</h3><p>{sub}</p></div>
      </div>
      {stats && <dl className={s.stats}>{stats.map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>}
      {actions && <div className={s.headActions}>{actions}</div>}
    </div>
  );
}

function Chips<T extends string>({ items, value, onChange }: { items: [T, string, number][]; value: T; onChange: (v: T) => void }) {
  return (
    <div className={s.chips} role="group" aria-label="Filtry">
      {items.map(([k, l, n]) => <button key={k} type="button" aria-pressed={value === k} onClick={() => onChange(k)}>{l}<span>{n}</span></button>)}
    </div>
  );
}

function Start({ dogs, people, go, pending }: { dogs: Dog[]; people: Person[]; go: (k: string) => void; pending: number }) {
  const ready = dogs.filter((d) => d.ready).length;
  const issued = dogs.filter((d) => d.pedigreeNo).length;
  const unpaid = people.filter((x) => x.fee !== 'oplacona').length;
  const alerts: [string, string][] = [
    ...(pending ? [[`${pending} ${pending === 1 ? 'wniosek czeka' : 'wnioski czekają'} na decyzję`, 'wnioski'] as [string, string]] : []),
    ...(ready ? [[`${ready} rodowodów gotowych do wystawienia`, 'rodowody'] as [string, string]] : []),
    ...(unpaid ? [[`${unpaid} osób bez opłaconej składki`, 'hodowcy'] as [string, string]] : []),
  ];
  return (
    <>
      <h3 className={s.hello}>Dzień dobry, Zarząd</h3>
      <p className={s.muted}>poniedziałek, 17 listopada 2026 · dane testowe</p>
      <div className={s.card}>
        <p className={s.cardLabel}>Na co zwrócić uwagę</p>
        {alerts.length === 0 ? <p className={s.allGood}><Check size={16} aria-hidden="true" />Wszystko w porządku: nic nie wymaga dziś reakcji.</p> : (
          <ul className={s.alerts}>{alerts.map(([t, k]) => <li key={t}><button type="button" onClick={() => go(k)}>{t}<span>Przejdź →</span></button></li>)}</ul>
        )}
      </div>
      <div className={s.card}>
        <p className={s.cardLabel}>Szybkie akcje</p>
        <div className={s.quick}>
          {([['psy', DogIcon, 'Dodaj / znajdź psa'], ['rodowody', ScrollText, 'Wystaw rodowód'], ['hodowcy', Users, 'Hodowcy i członkowie'], ['wnioski', ClipboardCheck, 'Wnioski hodowców'], ['mioty', Baby, 'Dodaj miot'], ['oplaty', Banknote, 'Opłaty']] as const)
            .map(([k, I, l]) => <button key={k} type="button" onClick={() => go(k)}><I size={17} aria-hidden="true" />{l}</button>)}
        </div>
      </div>
      <p className={s.cardLabel} style={{ marginTop: 18 }}>Księga w liczbach</p>
      <div className={s.numbers}>
        {([['Psów w księdze', dogs.length], ['Gotowe do rodowodu', ready], ['Wydanych rodowodów', issued], ['Osób w kartotece', people.length], ['Hodowców', people.filter((x) => x.roles.includes('hodowca')).length], ['Szczeniąt', dogs.filter(isPuppy).length]] as const)
          .map(([l, v]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
      </div>
    </>
  );
}

function docPill(d: Dog) {
  if (d.doc === 'R') return <span className={`${s.pill} ${s.pillR}`}>R · rodowód</span>;
  if (d.doc === 'P') return <span className={`${s.pill} ${s.pillP}`}>P · przodkowie</span>;
  return <span className={`${s.pill} ${s.pillNone}`}>brak</span>;
}
function nextPill(d: Dog) {
  if (d.pedigreeNo) return <span className={`${s.pill} ${s.pillOk}`}>Rodowód wystawiony</span>;
  if (d.ready) return <span className={`${s.pill} ${s.pillGo}`}>Gotowy do rodowodu</span>;
  if (!d.kr) return <span className={`${s.pill} ${s.pillWarn}`}>Brak numeru KR</span>;
  return <span className={`${s.pill} ${s.pillNone}`}>—</span>;
}

function Dogs({ dogs, setDogs, issue, openQr, say }: { dogs: Dog[]; setDogs: (f: (d: Dog[]) => Dog[]) => void; issue: (id: string) => void; openQr: (id: string) => void; say: (t: string) => void }) {
  type F = 'all' | 'puppy' | 'adult' | 'r' | 'ready' | 'nokr';
  const [f, setF] = useState<F>('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const match: Record<F, (d: Dog) => boolean> = { all: () => true, puppy: isPuppy, adult: (d) => !isPuppy(d), r: (d) => d.doc === 'R', ready: (d) => d.ready, nokr: (d) => !d.kr };
  const list = dogs.filter(match[f]).filter((d) => !q || `${d.name} ${d.breed} ${d.owner} ${d.kr ?? ''} ${d.chip}`.toLowerCase().includes(q.toLowerCase()));
  const dog = dogs.find((d) => d.id === sel);
  const add = (name: string, breed: string, sex: Dog['sex']) => {
    const id = `d${Date.now()}`;
    setDogs((l) => [{ id, name, breed, sex, born: '2026-09-01', owner: BREEDER, kennel: BREEDER_KENNEL, kr: null, doc: 'none', ready: false, pedigreeNo: null, chip: '616093900099999' }, ...l]);
    setAdding(false); setSel(id); say(`Dodano psa ${name}. Następny krok: numer KR.`);
  };
  return (
    <>
      <Head icon={<DogIcon size={20} />} title="Psy" sub="Księga psów: dane, właściciele, rodowody i karty rejestracji. Kliknij psa, aby otworzyć jego kartę."
            stats={[['Psów w księdze', dogs.length], ['Gotowe do rodowodu', dogs.filter((d) => d.ready).length], ['Bez numeru KR', dogs.filter((d) => !d.kr).length]]}
            actions={<>
              <button type="button" className={s.ghost} onClick={() => say('Import rodowodów z AI: czyta skan rodowodu innej organizacji i wypełnia kartę psa. W demo wyłączony.')}><Sparkles size={14} aria-hidden="true" />Import rodowodów z AI</button>
              <button type="button" className={s.primary} onClick={() => setAdding(true)}><Plus size={14} aria-hidden="true" />Dodaj psa</button>
            </>} />
      {adding && <AddDog onAdd={add} onCancel={() => setAdding(false)} />}
      <div className={s.searchRow}>
        <label className={s.search}><Search size={14} aria-hidden="true" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Imię psa, numer KR, mikroczip, właściciel…" aria-label="Szukaj psa" /></label>
      </div>
      <Chips<F> value={f} onChange={setF} items={[['all', 'Wszystkie', dogs.length], ['puppy', 'Szczenięta', dogs.filter(isPuppy).length], ['adult', 'Psy dorosłe', dogs.filter((d) => !isPuppy(d)).length], ['r', 'Z rodowodem (R)', dogs.filter((d) => d.doc === 'R').length], ['ready', 'Gotowe do rodowodu', dogs.filter((d) => d.ready).length], ['nokr', 'Bez numeru KR', dogs.filter((d) => !d.kr).length]]} />
      <div className={s.split} data-detail={dog ? '' : undefined}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Pies</th><th>Płeć</th><th>Urodzony</th><th>Właściciel</th><th>Nr KR</th><th>Dokument</th><th>Co dalej</th></tr></thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id} aria-selected={sel === d.id} onClick={() => setSel(d.id)} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setSel(d.id); }}>
                  <td><b>{d.name}</b><small>{d.breed}</small></td><td>{d.sex === 'pies' ? '♂ Pies' : '♀ Suka'}</td><td>{plDate(d.born)}</td>
                  <td>{d.owner}</td><td className={s.mono}>{d.kr ?? '—'}</td><td>{docPill(d)}</td><td>{nextPill(d)}</td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={7} className={s.empty}>Brak psów pasujących do filtrów.</td></tr>}
            </tbody>
          </table>
        </div>
        {dog && (
          <div className={s.detail}>
            <button type="button" className={s.detailClose} onClick={() => setSel(null)} aria-label="Zamknij kartę psa"><X size={16} aria-hidden="true" /></button>
            <p className={s.cardLabel}>Karta psa</p>
            <h4>{dog.name}</h4>
            <dl className={s.facts}>
              <div><dt>Rasa</dt><dd>{dog.breed}</dd></div><div><dt>Płeć</dt><dd>{dog.sex === 'pies' ? 'Pies' : 'Suka'}</dd></div>
              <div><dt>Urodzony</dt><dd>{plDate(dog.born)}</dd></div><div><dt>Mikroczip</dt><dd className={s.mono}>{dog.chip}</dd></div>
              <div><dt>Hodowla</dt><dd>{dog.kennel}</dd></div><div><dt>Właściciel</dt><dd>{dog.owner}</dd></div>
              <div><dt>Nr KR</dt><dd className={s.mono}>{dog.kr ?? '—'}</dd></div><div><dt>Rodowód</dt><dd className={s.mono}>{dog.pedigreeNo ?? '—'}</dd></div>
            </dl>
            {dog.ready && <button type="button" className={s.primary} onClick={() => issue(dog.id)}><ScrollText size={14} aria-hidden="true" />Wystaw rodowód</button>}
            {dog.pedigreeNo && <button type="button" className={s.ghost} onClick={() => openQr(dog.id)}><QrCode size={14} aria-hidden="true" />Sprawdź kod QR</button>}
            {!dog.ready && !dog.pedigreeNo && <p className={s.muted}>{dog.kr ? 'Brakuje danych do rodowodu (np. przodków). Uzupełnij kartę albo poczekaj na wniosek hodowcy.' : 'Najpierw nadaj numer KR (wniosek hodowcy albo ręcznie w biurze).'}</p>}
          </div>
        )}
      </div>
    </>
  );
}

function AddDog({ onAdd, onCancel }: { onAdd: (n: string, b: string, s: Dog['sex']) => void; onCancel: () => void }) {
  const [n, setN] = useState(''); const [b, setB] = useState('Szpic miniaturowy'); const [sx, setSx] = useState<Dog['sex']>('suka');
  return (
    <form className={s.card} onSubmit={(e) => { e.preventDefault(); if (n.trim()) onAdd(n.trim(), b, sx); }}>
      <p className={s.cardLabel}>Nowy pies</p>
      <div className={s.form}>
        <label>Imię i przydomek<input value={n} onChange={(e) => setN(e.target.value)} placeholder="np. Mila Złota Łąka" autoFocus /></label>
        <label>Rasa<select value={b} onChange={(e) => setB(e.target.value)}>{['Szpic miniaturowy', 'Yorkshire terrier', 'Maltańczyk', 'Owczarek niemiecki', 'Border collie'].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Płeć<select value={sx} onChange={(e) => setSx(e.target.value as Dog['sex'])}><option value="suka">Suka</option><option value="pies">Pies</option></select></label>
      </div>
      <div className={s.row}><button type="submit" className={s.primary} disabled={!n.trim()}>Zapisz psa</button><button type="button" className={s.ghost} onClick={onCancel}>Anuluj</button></div>
    </form>
  );
}

function Pedigrees({ dogs, issue, openQr }: { dogs: Dog[]; issue: (id: string) => void; openQr: (id: string) => void }) {
  type F = 'ready' | 'issued' | 'missing';
  const [f, setF] = useState<F>('ready');
  const list = dogs.filter((d) => (f === 'ready' ? d.ready : f === 'issued' ? Boolean(d.pedigreeNo) : !d.ready && !d.pedigreeNo));
  return (
    <>
      <Head icon={<ScrollText size={20} />} title="Rodowody do wystawienia" sub="Lista pracy: które psy są gotowe do rodowodu, a którym czegoś brakuje. Rodowód wystawiasz jednym kliknięciem, PDF z kodem QR powstaje od razu."
            stats={[['Gotowe', dogs.filter((d) => d.ready).length], ['Brak danych', dogs.filter((d) => !d.ready && !d.pedigreeNo).length], ['Wystawione', dogs.filter((d) => d.pedigreeNo).length]]} />
      <Chips<F> value={f} onChange={setF} items={[['ready', 'Do wystawienia', dogs.filter((d) => d.ready).length], ['missing', 'Brak danych', dogs.filter((d) => !d.ready && !d.pedigreeNo).length], ['issued', 'Wystawione', dogs.filter((d) => d.pedigreeNo).length]]} />
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead><tr><th>Pies</th><th>Urodzony</th><th>Hodowla</th><th>Stan</th><th /></tr></thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.id}>
                <td><b>{d.name}</b><small>{d.breed}</small></td><td>{plDate(d.born)}</td><td>{d.kennel}</td><td>{nextPill(d)}</td>
                <td className={s.right}>
                  {d.ready && <button type="button" className={s.primarySm} onClick={() => issue(d.id)}>Wystaw rodowód</button>}
                  {d.pedigreeNo && <button type="button" className={s.ghostSm} onClick={() => openQr(d.id)}><QrCode size={13} aria-hidden="true" />QR</button>}
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className={s.empty}>Nic tu nie czeka.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

function People({ people, setPeople, say }: { people: Person[]; setPeople: (f: (p: Person[]) => Person[]) => void; say: (t: string) => void }) {
  type F = 'all' | 'hodowca' | 'czlonek' | 'paid' | 'unpaid';
  const [f, setF] = useState<F>('all');
  const [sel, setSel] = useState<string | null>(null);
  const match: Record<F, (x: Person) => boolean> = { all: () => true, hodowca: (x) => x.roles.includes('hodowca'), czlonek: (x) => x.roles.includes('czlonek'), paid: (x) => x.fee === 'oplacona', unpaid: (x) => x.fee !== 'oplacona' };
  const list = people.filter(match[f]);
  const person = people.find((x) => x.id === sel);
  return (
    <>
      <Head icon={<Users size={20} />} title="Hodowcy i członkowie" sub="Osoby: role, hodowle, psy, składki i dostęp do panelu hodowcy."
            stats={[['Osób', people.length], ['Hodowców', people.filter(match.hodowca).length], ['Bez opłaconej składki', people.filter(match.unpaid).length]]} />
      <Chips<F> value={f} onChange={setF} items={[['all', 'Wszystkie', people.length], ['hodowca', 'Hodowcy', people.filter(match.hodowca).length], ['czlonek', 'Członkowie', people.filter(match.czlonek).length], ['paid', 'Składka opłacona', people.filter(match.paid).length], ['unpaid', 'Składka nieopłacona', people.filter(match.unpaid).length]]} />
      <div className={s.split} data-detail={person ? '' : undefined}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Imię i nazwisko</th><th>Role</th><th>Hodowla</th><th>Miejscowość</th><th>Psy</th><th>Składka</th></tr></thead>
            <tbody>
              {list.map((x) => (
                <tr key={x.id} aria-selected={sel === x.id} onClick={() => setSel(x.id)} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setSel(x.id); }}>
                  <td><b>{x.name}</b><small>{x.email}</small></td>
                  <td>{x.roles.map((r) => <span key={r} className={`${s.pill} ${r === 'hodowca' ? s.pillWarnSoft : s.pillOkSoft}`}>{ROLE_LABEL[r]}</span>)}</td>
                  <td>{x.kennel ?? '—'}</td><td>{x.city}</td><td>{x.dogs}</td>
                  <td><span className={`${s.pill} ${x.fee === 'oplacona' ? s.pillOk : s.pillWarn}`}>{FEE_LABEL[x.fee]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {person && (
          <div className={s.detail}>
            <button type="button" className={s.detailClose} onClick={() => setSel(null)} aria-label="Zamknij kartotekę"><X size={16} aria-hidden="true" /></button>
            <p className={s.cardLabel}>Kartoteka</p>
            <h4>{person.name}</h4>
            <dl className={s.facts}>
              <div><dt>Miejscowość</dt><dd>{person.city}</dd></div><div><dt>E-mail</dt><dd>{person.email}</dd></div>
              <div><dt>Role</dt><dd>{person.roles.map((r) => ROLE_LABEL[r]).join(', ')}</dd></div><div><dt>Składka</dt><dd>{FEE_LABEL[person.fee]}</dd></div>
            </dl>
            {person.fee !== 'oplacona' && (
              <button type="button" className={s.primary} onClick={() => { setPeople((l) => l.map((x) => (x.id === person.id ? { ...x, fee: 'oplacona' } : x))); say(`Składka ${person.name} zaksięgowana. Ważna do 31.03.2027.`); track('fee_paid'); }}>
                <Banknote size={14} aria-hidden="true" />Oznacz składkę jako opłaconą
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function Requests({ requests, dogs, decide }: { requests: Req[]; dogs: Dog[]; decide: (id: string, s: ReqStatus) => void }) {
  const [f, setF] = useState<ReqStatus | 'all'>('oczekuje');
  const [sel, setSel] = useState<string | null>(null);
  const list = requests.filter((r) => f === 'all' || r.status === f);
  const req = requests.find((r) => r.id === (sel ?? list[0]?.id));
  const dogName = (id: string) => dogs.find((d) => d.id === id)?.name ?? '—';
  return (
    <>
      <Head icon={<ClipboardCheck size={20} />} title="Wnioski hodowców" sub="Wnioski o rodowód i numer KR przesłane z panelu hodowcy. Decyzja wraca do hodowcy od razu." />
      <Chips<ReqStatus | 'all'> value={f} onChange={(v) => { setF(v); setSel(null); }} items={[['oczekuje', 'Oczekuje', requests.filter((r) => r.status === 'oczekuje').length], ['zatwierdzone', 'Zatwierdzone', requests.filter((r) => r.status === 'zatwierdzone').length], ['odrzucone', 'Odrzucone', requests.filter((r) => r.status === 'odrzucone').length], ['all', 'Wszystkie', requests.length]]} />
      <div className={s.split} data-detail={req ? '' : undefined}>
        <ul className={s.reqList}>
          {list.map((r) => (
            <li key={r.id}><button type="button" aria-current={req?.id === r.id ? 'true' : undefined} onClick={() => setSel(r.id)}>
              <b>{dogName(r.dogId)}</b><small>{r.kind} · {r.breeder} · {plDate(r.date)}</small>
              <span className={`${s.pill} ${r.status === 'oczekuje' ? s.pillWarn : r.status === 'zatwierdzone' ? s.pillOk : s.pillBad}`}>{STATUS_LABEL[r.status]}</span>
            </button></li>
          ))}
          {list.length === 0 && <li className={s.empty}>Brak wniosków w tej zakładce.</li>}
        </ul>
        {req && (
          <div className={s.detail}>
            <p className={s.cardLabel}>Wniosek</p>
            <h4>{req.kind}</h4>
            <dl className={s.facts}>
              <div><dt>Pies</dt><dd>{dogName(req.dogId)}</dd></div><div><dt>Hodowca</dt><dd>{req.breeder}</dd></div>
              <div><dt>Złożony</dt><dd>{plDate(req.date)}</dd></div><div><dt>Status</dt><dd>{STATUS_LABEL[req.status]}</dd></div>
            </dl>
            {req.note && <p className={s.quote}>„{req.note}”</p>}
            {req.status === 'oczekuje' && (
              <div className={s.row}>
                <button type="button" className={s.primary} onClick={() => decide(req.id, 'zatwierdzone')}><Check size={14} aria-hidden="true" />Zatwierdź</button>
                <button type="button" className={s.ghost} onClick={() => decide(req.id, 'odrzucone')}><X size={14} aria-hidden="true" />Odrzuć</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ================= breeder panel ================= */

function Breeder({ dogs, requests, submit }: { dogs: Dog[]; requests: Req[]; submit: (dogId: string, kind: string, note: string) => void }) {
  const mine = dogs.filter((d) => d.owner === BREEDER || d.kennel === BREEDER_KENNEL);
  const myReq = requests.filter((r) => r.breeder === BREEDER);
  const [tab, setTab] = useState<'home' | 'form'>('home');
  const [dogId, setDogId] = useState(mine[0]?.id ?? '');
  const [kind, setKind] = useState('Rodowód dla szczenięcia');
  const [note, setNote] = useState('');
  return (
    <div className={s.breeder}>
      <header className={s.bHead}>
        <span className={s.bLogo}>POK</span><div><small>Panel hodowcy</small><b>Hodowla {BREEDER_KENNEL}</b></div>
        <span className={s.bUser}>{BREEDER}</span>
      </header>
      {tab === 'home' ? (
        <div className={s.bBody}>
          <h3 className={s.hello}>Witaj w Panelu Hodowcy</h3>
          <p className={s.muted}>Twoje psy, mioty i wnioski. Wnioski trafiają prosto do biura związku.</p>
          <div className={s.bCards}>
            <div><DogIcon size={18} aria-hidden="true" /><b>Moje psy</b><span>{mine.length} w księdze</span></div>
            <div><Baby size={18} aria-hidden="true" /><b>Moje mioty</b><span>1 miot w 2026</span></div>
            <button type="button" onClick={() => setTab('form')}><Upload size={18} aria-hidden="true" /><b>Złóż wniosek</b><span>o rodowód albo numer KR</span></button>
          </div>
          <p className={s.cardLabel} style={{ marginTop: 18 }}>Moje wnioski</p>
          <ul className={s.reqList}>
            {myReq.map((r) => (
              <li key={r.id}><div className={s.reqStatic}>
                <b>{dogs.find((d) => d.id === r.dogId)?.name}</b><small>{r.kind} · {plDate(r.date)}</small>
                <span className={`${s.pill} ${r.status === 'oczekuje' ? s.pillWarn : r.status === 'zatwierdzone' ? s.pillOk : s.pillBad}`}>{STATUS_LABEL[r.status]}</span>
              </div></li>
            ))}
          </ul>
        </div>
      ) : (
        <form className={s.bBody} onSubmit={(e) => { e.preventDefault(); submit(dogId, kind, note); setNote(''); setTab('home'); }}>
          <h3 className={s.hello}>Nowy wniosek</h3>
          <div className={s.form}>
            <label>Pies<select value={dogId} onChange={(e) => setDogId(e.target.value)}>{mine.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
            <label>Rodzaj<select value={kind} onChange={(e) => setKind(e.target.value)}><option>Rodowód dla szczenięcia</option><option>Nadanie numeru KR</option><option>Zmiana właściciela</option></select></label>
            <label className={s.wide}>Uwagi dla biura<textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="np. komplet dokumentów od lekarza weterynarii" /></label>
          </div>
          <div className={s.row}><button type="submit" className={s.orange}>Wyślij wniosek do biura</button><button type="button" className={s.ghost} onClick={() => setTab('home')}>Anuluj</button></div>
        </form>
      )}
    </div>
  );
}

/* ================= public QR verification ================= */

function Verify({ dogs, dogId, pick }: { dogs: Dog[]; dogId: string | null; pick: (id: string) => void }) {
  const issued = dogs.filter((d) => d.pedigreeNo);
  const dog = dogs.find((d) => d.id === dogId && d.pedigreeNo) ?? issued[0];
  const cells = useMemo(() => qrCells(dog?.pedigreeNo ?? 'x'), [dog?.pedigreeNo]);
  return (
    <div className={s.verify}>
      <header className={s.vHead}><ShieldCheck size={18} aria-hidden="true" /><div><b>Polska Organizacja Kynologiczna</b><small>Weryfikacja dokumentu</small></div></header>
      <div className={s.vBody}>
        <div className={s.vQr} aria-label="Kod QR z rodowodu (podgląd)">
          <svg viewBox="0 0 25 25" role="img" aria-hidden="true">{cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)}</svg>
          <small>Kupujący skanuje kod z rodowodu telefonem</small>
        </div>
        {dog ? (
          <div className={s.vCard}>
            <p className={s.vOk}><Check size={16} aria-hidden="true" />Dokument ważny</p>
            <h4>{dog.name}</h4>
            <dl className={s.facts}>
              <div><dt>Nr rodowodu</dt><dd className={s.mono}>{dog.pedigreeNo}</dd></div><div><dt>Nr KR</dt><dd className={s.mono}>{dog.kr}</dd></div>
              <div><dt>Rasa</dt><dd>{dog.breed}</dd></div><div><dt>Urodzony</dt><dd>{plDate(dog.born)}</dd></div>
              <div><dt>Hodowla</dt><dd>{dog.kennel}</dd></div>
            </dl>
            <p className={s.muted}>Podgląd oryginału dokumentu po wpisaniu kodu bezpieczeństwa z rodowodu. Bez logowania i bez dostępu do programu biura.</p>
          </div>
        ) : <p className={s.muted}>Wystaw rodowód w biurze, a jego kod pojawi się tutaj.</p>}
        {issued.length > 1 && (
          <div className={s.chips} role="group" aria-label="Wystawione rodowody">
            {issued.map((d) => <button key={d.id} type="button" aria-pressed={dog?.id === d.id} onClick={() => pick(d.id)}>{d.name}</button>)}
          </div>
        )}
      </div>
    </div>
  );
}

/** A deterministic QR-like pattern for the preview (not a scannable code). */
function qrCells(seed: string): [number, number][] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const out: [number, number][] = [];
  const finder = (x: number, y: number) => { for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) if (i === 0 || i === 6 || j === 0 || j === 6 || (i > 1 && i < 5 && j > 1 && j < 5)) out.push([x + i, y + j]); };
  finder(0, 0); finder(18, 0); finder(0, 18);
  for (let x = 0; x < 25; x++) for (let y = 0; y < 25; y++) {
    if ((x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16)) continue;
    h = Math.imul(h ^ (x * 31 + y), 16777619);
    if ((h >>> 0) % 100 < 46) out.push([x, y]);
  }
  return out;
}
