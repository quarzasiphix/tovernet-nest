'use client';

import { useState } from 'react';
import {
  Home, PawPrint, Baby, Dog, Camera, MessageSquare, Star, Plus, Search, ImageIcon,
} from 'lucide-react';
import PuppyAvatar from './PuppyAvatar';
import type { GryfinSiteContent } from '@/lib/gryfin';
import { sexLabel } from '@/lib/gryfin';

// Structure borrowed from PokPanelDemo.tsx (sidebar + mobile pill tabs, list+detail
// layout). Colors lifted from GryfinPanelDemo.tsx / the real GRYFIN YORK panel CSS —
// this is the actual palette the panel runs on, not a generic mockup. Content is the
// real GRYFIN YORK data (dogs/litters/puppies/testimonials/gallery) pulled at build
// time from their public get-site-content Edge Function — see /p/grif/CLAUDE.md.
const CREAM = '#fbf7ef';
const CARD = '#ffffff';
const BORDER = '#f0e6d2';
const NAVY = '#1b2740';
const MUTED = '#5b6b8c';
const TEAL = '#14ab9d';
const TEAL_SOFT = '#d5f5f0';
const PINK = '#db2777';
const PINK_SOFT = '#fce7f3';
const LAVENDER = '#8a68f5';
const LAVENDER_SOFT = '#ece7ff';
const YELLOW = '#f59e0b';
const YELLOW_SOFT = '#fef3c7';

type TabKey = 'start' | 'psy' | 'mioty' | 'szczeniaki' | 'zdjecia' | 'opinie' | 'zapytania';

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: 'start', label: 'Start', icon: Home },
  { key: 'psy', label: 'Psy', icon: Dog },
  { key: 'mioty', label: 'Mioty', icon: PawPrint },
  { key: 'szczeniaki', label: 'Szczenięta', icon: Baby },
  { key: 'zdjecia', label: 'Zdjęcia', icon: Camera },
  { key: 'opinie', label: 'Opinie', icon: Star },
  { key: 'zapytania', label: 'Zapytania', icon: MessageSquare },
];

type Sex = 'Suczka' | 'Reproduktor';
type Status = 'dostepny' | 'zarezerwowany' | 'sprzedany';

const STATUS_META: Record<Status, { label: string; fg: string; bg: string }> = {
  dostepny: { label: 'Dostępny', fg: TEAL, bg: TEAL_SOFT },
  zarezerwowany: { label: 'Zarezerwowany', fg: '#b45309', bg: YELLOW_SOFT },
  sprzedany: { label: 'Sprzedany', fg: PINK, bg: PINK_SOFT },
};

// Real puppy statuses (schema) collapse onto the 3-state demo above.
const REAL_STATUS_TO_DEMO: Record<string, Status> = {
  dostepny: 'dostepny',
  'wstepnie-zarezerwowany': 'zarezerwowany',
  zarezerwowany: 'zarezerwowany',
  'w-nowym-domu': 'sprzedany',
};

const LITTER_STATUS_LABEL: Record<string, string> = {
  planowany: 'Planowany',
  oczekujemy: 'W drodze',
  urodzone: 'Urodzone',
  rezerwacje: 'Rezerwacje otwarte',
  zakonczony: 'Zakończony',
};

const COLOR_PRESETS = ['Blue & Tan', 'Gold', 'Biewer', 'Parti'];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      {children}
    </div>
  );
}

type StartStats = { dogsCount: number; plannedLittersCount: number; galleryCount: number; testimonialsCount: number };

function StartTab({ statsInput, activity }: { statsInput: StartStats; activity: string[] }) {
  const stats = [
    { label: 'Psów hodowlanych', value: statsInput.dogsCount, bg: TEAL_SOFT, fg: TEAL },
    { label: 'Mioty planowane', value: statsInput.plannedLittersCount, bg: LAVENDER_SOFT, fg: LAVENDER },
    { label: 'Zdjęcia i pliki', value: statsInput.galleryCount, bg: YELLOW_SOFT, fg: '#b45309' },
    { label: 'Opinie klientów', value: statsInput.testimonialsCount, bg: PINK_SOFT, fg: PINK },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: s.bg }}>
            <p className="text-2xl font-black" style={{ color: s.fg }}>{s.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: NAVY }}>{s.label}</p>
          </div>
        ))}
      </div>
      {activity.length > 0 && (
        <Card>
          <p className="text-sm font-bold mb-3" style={{ color: NAVY }}>Ostatnia aktywność</p>
          <ul className="space-y-2 text-xs" style={{ color: MUTED }}>
            {activity.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </Card>
      )}
    </div>
  );
}

type PsyDog = { name: string; color: string | null; sex: Sex; photoUrl: string | null };

function PsyTab({ dogs }: { dogs: PsyDog[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {dogs.map((d) => (
        <Card key={d.name}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: PINK_SOFT }}>
              {d.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.photoUrl} alt={d.name} className="h-full w-full object-cover" />
              ) : (
                <PuppyAvatar className="h-7 w-7" color={PINK} />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: NAVY }}>{d.name}</p>
              <p className="text-xs truncate" style={{ color: MUTED }}>{[d.color, d.sex].filter(Boolean).join(' · ')}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

type MiotyLitter = { key: string; parents: string; statusLine: string; puppiesCount: number };

function MiotyTab({ litters }: { litters: MiotyLitter[] }) {
  return (
    <div className="space-y-2">
      {litters.map((m) => (
        <Card key={m.key}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold" style={{ color: NAVY }}>{m.parents}</p>
              <p className="text-xs" style={{ color: MUTED }}>{m.statusLine}</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: LAVENDER_SOFT, color: LAVENDER }}>
              {m.puppiesCount} szczeniąt
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

type Puppy = { name: string; price: string; sex: Sex; color: string; status: Status };

function SzczeniatkaTab({ initial, photoUrl }: { initial: Puppy; photoUrl: string | null }) {
  const [puppy, setPuppy] = useState<Puppy>(initial);

  const set = <K extends keyof Puppy>(key: K, value: Puppy[K]) => setPuppy((p) => ({ ...p, [key]: value }));
  const statusMeta = STATUS_META[puppy.status];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: MUTED }}>Edytuj szczenię</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>Imię</label>
            <input
              value={puppy.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full h-10 rounded-lg px-3 text-sm outline-none"
              style={{ border: `1px solid ${BORDER}`, color: NAVY }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>Cena</label>
            <input
              value={puppy.price}
              onChange={(e) => set('price', e.target.value)}
              className="w-full h-10 rounded-lg px-3 text-sm outline-none"
              style={{ border: `1px solid ${BORDER}`, color: NAVY }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['Suczka', 'Reproduktor'] as Sex[]).map((s) => (
              <button
                key={s}
                onClick={() => set('sex', s)}
                className="h-9 rounded-lg text-xs font-bold transition"
                style={puppy.sex === s ? { background: TEAL, color: 'white' } : { background: CREAM, color: MUTED, border: `1px solid ${BORDER}` }}
              >
                {s}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>Kolor</label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => set('color', c)}
                  className="h-8 px-3 rounded-full text-xs font-bold transition"
                  style={puppy.color === c ? { background: LAVENDER, color: 'white' } : { background: CREAM, color: MUTED, border: `1px solid ${BORDER}` }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>Status</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(STATUS_META) as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => set('status', s)}
                  className="h-9 rounded-lg text-[11px] font-bold transition"
                  style={puppy.status === s
                    ? { background: STATUS_META[s].bg, color: STATUS_META[s].fg, border: `1.5px solid ${STATUS_META[s].fg}` }
                    : { background: CREAM, color: MUTED, border: `1px solid ${BORDER}` }}
                >
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* live public-site preview, seeded from a real GRYFIN YORK puppy — try editing it */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: MUTED }}>Podgląd na stronie publicznej</p>
        <div className="rounded-2xl p-5" style={{ background: CREAM, border: `1px solid ${BORDER}` }}>
          <div className="rounded-2xl overflow-hidden bg-white kennel-card-shadow">
            <div className="h-36 flex items-center justify-center overflow-hidden" style={{ background: PINK_SOFT }}>
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt={puppy.name} className="h-full w-full object-cover" />
              ) : (
                <PuppyAvatar className="h-16 w-16" color={PINK} />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-base font-bold" style={{ color: NAVY }}>{puppy.name || 'Imię szczenięcia'}</p>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: statusMeta.bg, color: statusMeta.fg }}>
                  {statusMeta.label}
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: MUTED }}>{puppy.color} · {puppy.sex}</p>
              <p className="text-lg font-black" style={{ color: TEAL }}>{puppy.price || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ZdjeciaTab({ images }: { images: string[] }) {
  const tints = [YELLOW_SOFT, TEAL_SOFT, PINK_SOFT, LAVENDER_SOFT];
  const cells = images.length > 0 ? images : Array.from({ length: 10 }).map(() => null);
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {cells.map((url, i) => (
        <div key={i} className="aspect-square rounded-xl flex items-center justify-center overflow-hidden" style={{ background: tints[i % 4] }}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5" style={{ color: MUTED, opacity: 0.5 }} />
          )}
        </div>
      ))}
    </div>
  );
}

type Review = { author: string; text: string; rating: number };

function OpinieTab({ reviews }: { reviews: Review[] }) {
  return (
    <div className="space-y-2">
      {reviews.map((r, i) => (
        <Card key={`${r.author}-${i}`}>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className="h-3.5 w-3.5" style={{ color: YELLOW, fill: j < r.rating ? YELLOW : 'transparent' }} />
            ))}
          </div>
          <p className="text-sm mb-2" style={{ color: NAVY }}>&ldquo;{r.text}&rdquo;</p>
          <p className="text-xs font-semibold" style={{ color: MUTED }}>{r.author}</p>
        </Card>
      ))}
    </div>
  );
}

function ZapytaniaTab() {
  // Enquiries hold real customer contact details and are never exposed via the
  // public content API — this tab stays an illustrative example, not live data.
  const requests = [
    { name: 'Katarzyna N.', about: 'Zapytanie o dostępne szczenię', status: 'Nowe' },
    { name: 'Tomasz P.', about: 'Zapytanie o planowany miot', status: 'Odpowiedziano' },
  ];
  return (
    <div className="space-y-2">
      {requests.map((r) => (
        <Card key={r.name}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: NAVY }}>{r.name}</p>
              <p className="text-xs truncate" style={{ color: MUTED }}>{r.about}</p>
            </div>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              style={r.status === 'Nowe' ? { background: PINK_SOFT, color: PINK } : { background: TEAL_SOFT, color: TEAL }}
            >
              {r.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function PanelShowcase({ content }: { content: GryfinSiteContent | null }) {
  const [tab, setTab] = useState<TabKey>('szczeniaki');

  const dogs = content?.dogs ?? [];
  const litters = content?.litters ?? [];
  const puppies = content?.puppies ?? [];
  const testimonials = content?.testimonials ?? [];
  const gallery = content?.gallery ?? [];

  const dogNameById = new Map(dogs.map((d) => [d.id, d.name]));
  const activeDogs = dogs.filter((d) => d.status === 'aktywny');
  const activeLitters = litters.filter((l) => l.status !== 'zakonczony');

  const startStats: StartStats = {
    dogsCount: activeDogs.length,
    plannedLittersCount: activeLitters.length,
    galleryCount: gallery.length,
    testimonialsCount: testimonials.length,
  };

  const activityEvents = [
    ...dogs.map((d) => ({ at: d.created_at, line: `Dodano psa: ${d.name}` })),
    ...litters.map((l) => ({ at: l.created_at, line: `Nowy miot: ${l.name} (${l.puppies_count} szczeniąt)` })),
    ...puppies.map((p) => ({ at: p.created_at, line: `Dodano szczenię: ${p.name}` })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const activity = activityEvents.slice(0, 3).map((e) => e.line);

  const psyDogs: PsyDog[] = activeDogs.slice(0, 4).map((d) => ({
    name: d.name,
    color: d.color,
    sex: sexLabel(d.sex),
    photoUrl: d.photo_url,
  }));

  const miotyLitters: MiotyLitter[] = activeLitters.slice(0, 4).map((l) => {
    const mother = l.mother_id ? dogNameById.get(l.mother_id) : null;
    const father = l.father_id ? dogNameById.get(l.father_id) : null;
    const parents = [mother, father].filter(Boolean).join(' × ') || l.name;
    const statusLabel = LITTER_STATUS_LABEL[l.status] ?? l.status;
    return {
      key: l.id,
      parents,
      statusLine: l.planned_date ? `${statusLabel}: ${l.planned_date}` : statusLabel,
      puppiesCount: l.puppies_count,
    };
  });

  const heroPuppySource = puppies.find((p) => p.status === 'dostepny') ?? puppies[0];
  const szczeniatkaInitial: Puppy = heroPuppySource
    ? {
        name: heroPuppySource.name,
        price: '',
        sex: sexLabel(heroPuppySource.sex),
        color: heroPuppySource.color ?? '',
        status: REAL_STATUS_TO_DEMO[heroPuppySource.status] ?? 'dostepny',
      }
    : { name: 'Rocky', price: '4500 zł', sex: 'Reproduktor', color: 'Gold', status: 'dostepny' };

  const galleryImages = gallery.slice(0, 10).map((g) => g.image_url);

  const reviews: Review[] = testimonials.slice(0, 4).map((t) => ({
    author: t.customer_name,
    text: t.content,
    rating: t.rating,
  }));
  const fallbackReviews: Review[] = [
    { author: 'Anna K.', text: 'Wspaniała hodowla, piesek zdrowy i towarzyski od pierwszego dnia.', rating: 5 },
    { author: 'Marek W.', text: 'Pełen profesjonalizm i troska o szczenięta. Polecam każdemu.', rating: 5 },
  ];

  return (
    <div className="rounded-3xl overflow-hidden border kennel-card-shadow" style={{ borderColor: BORDER }}>
      {/* browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b" style={{ borderColor: BORDER }}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-3 text-xs font-mono" style={{ color: MUTED }}>panel.twojahodowla.pl</span>
        <span className="ml-auto text-[10px] uppercase tracking-wider hidden sm:inline" style={{ color: MUTED }}>Kliknij, żeby wypróbować</span>
      </div>

      <div className="flex flex-col lg:flex-row" style={{ background: CREAM }}>
        {/* sidebar (desktop) */}
        <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col gap-1 p-4 border-r bg-white" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: TEAL }}>
              GY
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>Panel hodowli</p>
              <p className="text-sm font-bold" style={{ color: NAVY }}>Gryfin York</p>
            </div>
          </div>
          <button
            className="flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-bold mb-3"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)', color: 'white' }}
          >
            <Plus className="h-3.5 w-3.5" /> Dodaj psa
          </button>
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = item.key === tab;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-left transition"
                style={active ? { background: TEAL_SOFT, color: TEAL } : { color: MUTED }}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* mobile pill tabs */}
        <div className="flex lg:hidden overflow-x-auto gap-1.5 p-3 border-b bg-white" style={{ borderColor: BORDER }}>
          {TABS.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className="flex-shrink-0 h-8 px-3 rounded-full text-xs font-bold transition"
              style={tab === item.key ? { background: TEAL, color: 'white' } : { background: CREAM, color: MUTED }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* content */}
        <div className="flex-1 p-5 sm:p-6 min-w-0">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 rounded-lg px-2.5 h-8 bg-white flex-1 max-w-[220px]" style={{ border: `1px solid ${BORDER}` }}>
              <Search className="h-3.5 w-3.5" style={{ color: MUTED }} />
              <span className="text-xs" style={{ color: MUTED }}>Szukaj...</span>
            </div>
          </div>

          {tab === 'start' && <StartTab statsInput={startStats} activity={activity} />}
          {tab === 'psy' && <PsyTab dogs={psyDogs} />}
          {tab === 'mioty' && <MiotyTab litters={miotyLitters} />}
          {tab === 'szczeniaki' && <SzczeniatkaTab initial={szczeniatkaInitial} photoUrl={heroPuppySource?.photo_url ?? null} />}
          {tab === 'zdjecia' && <ZdjeciaTab images={galleryImages} />}
          {tab === 'opinie' && <OpinieTab reviews={reviews.length > 0 ? reviews : fallbackReviews} />}
          {tab === 'zapytania' && <ZapytaniaTab />}
        </div>
      </div>
    </div>
  );
}
