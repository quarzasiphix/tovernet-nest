// Template content for the general company concept (`business`), used for every PKD
// without a niche of its own: retail, wholesale, IT, consulting, marketing, manufacturing,
// education, energy and the rest. We know only registry facts, so the page states nothing
// about services, clients, projects, team, years, figures or certificates. Everything the
// owner will fill is a labelled slot. Customer-facing copy speaks for the company; slot
// labels speak to the owner and look like slots.

export type BusinessPkd = { code: string; label: string } | null | undefined;

export type Chapter = { n: string; key: string; title: string; note: string };

/** The page's table of contents: the four questions a visitor brings to a company page. */
export const CHAPTERS: Chapter[] = [
  { n: '01', key: 'firma', title: 'Kim jesteśmy', note: 'Firma i dane z rejestru' },
  { n: '02', key: 'oferta', title: 'Czym się zajmujemy', note: 'Usługi lub produkty' },
  { n: '03', key: 'wspolpraca', title: 'Jak pracujemy', note: 'Od pytania do współpracy' },
  { n: '04', key: 'kontakt', title: 'Napisz do nas', note: 'Dla firm i osób prywatnych' },
];

export const HERO_LEAD = 'Napisz, czego potrzebujesz. Odpowiemy konkretnie: co możemy zrobić, kiedy i na jakich warunkach.';

/** Owner slots. Each is shown as an empty, dashed, labelled field, never as content. */
export const SLOTS = {
  logo: 'Tu Twoje logo',
  contact: 'Tu telefon i e-mail',
  about: 'Tu kilka zdań o firmie: skąd się wzięła, kto za nią stoi i co jest dla Was ważne w pracy z klientem.',
  aboutLabel: 'Do uzupełnienia: o firmie',
  photo: 'Miejsce na zdjęcie: ludzie, miejsce pracy albo produkt',
  sentence: 'Tu jednym zdaniem, Twoimi słowami: co robisz i dla kogo',
  city: 'Tu miasto lub obszar działania',
  offerNote: 'Miejsca na Twoją ofertę. Od jednej do kilku pozycji, opisanych Twoimi słowami.',
  offerFields: ['Nazwa usługi lub produktu', 'Dla kogo', 'Co klient dostaje'] as const,
  footer: ['Tu NIP', 'Tu adres', 'Tu telefon i e-mail'],
  privacy: 'Tu informacja o przetwarzaniu danych z formularza. Przygotujemy ją razem z Tobą.',
};

/** Process any company can keep truthfully: no timings, no guarantees. Labelled as an example. */
export const STEPS: [string, string][] = [
  ['Piszesz albo dzwonisz', 'Wystarczy kilka zdań o tym, czego potrzebujesz.'],
  ['Ustalamy szczegóły', 'Dopytujemy o to, czego brakuje, zanim cokolwiek zaproponujemy.'],
  ['Konkretna propozycja', 'Zakres, termin i koszt, jasno i na piśmie.'],
  ['Współpraca', 'Jedna osoba kontaktowa od początku do końca.'],
];
export const STEPS_NOTE = 'Przykładowy przebieg. Dopasujemy go do tego, jak naprawdę pracujesz.';

export type Sender = 'firma' | 'prywatnie';

export const FORM = {
  title: 'Napisz, czego potrzebujesz',
  sub: 'Odpowiemy na podany e-mail albo telefon.',
  senderLegend: 'Piszesz jako',
  senders: [{ key: 'firma', label: 'Firma' }, { key: 'prywatnie', label: 'Osoba prywatna' }] as { key: Sender; label: string }[],
  topicLegend: 'Czego dotyczy wiadomość?',
  topics: ['Oferta lub wycena', 'Współpraca', 'Pytanie'],
  message: {
    firma: 'Np. czego potrzebujecie, w jakiej skali i na kiedy.',
    prywatnie: 'Np. czego szukasz i na kiedy.',
  } as Record<Sender, string>,
  reachError: 'Podaj e-mail albo telefon, żebyśmy mogli odpowiedzieć.',
  cta: 'Wyślij wiadomość',
  sentTitle: 'Tak to będzie działać.',
  sentText: 'To podgląd konceptu, więc nic nie zostało wysłane. Na gotowej stronie wiadomość trafi prosto do firmy, razem z wybranym tematem.',
};

/** Registry facts arrive in capitals ("SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ"). Sentence case, no trailing period. */
export function sentenceCase(text: string | null | undefined): string | null {
  const t = (text ?? '').trim().replace(/\.+$/, '');
  if (!t) return null;
  const shouting = t === t.toLocaleUpperCase('pl');
  const base = shouting ? t.toLocaleLowerCase('pl') : t;
  return base.charAt(0).toLocaleUpperCase('pl') + base.slice(1);
}

/** PKD from the registry, or null when either part is missing. Code keeps its filed form. */
export function presentPkd(pkd: BusinessPkd): { code: string; label: string } | null {
  if (!pkd) return null;
  const code = (pkd.code ?? '').trim().toUpperCase();
  const label = sentenceCase(pkd.label);
  return code && label ? { code, label } : null;
}

/** Up to two initials for the logo slot: "Nordtech Systemy" becomes "NS". */
export function initials(name: string): string {
  const words = name.replace(/[„”"'()]/g, ' ').split(/[\s-]+/).filter((w) => /[A-Za-z0-9\u00C0-\u024F]/.test(w));
  return words.slice(0, 2).map((w) => w.charAt(0).toLocaleUpperCase('pl')).join('') || '·';
}

/** Name size step by length, so a 6-letter name and a 70-letter one both set well. */
// The longest word decides too: a single long word may not break mid-word ("Reengineerd").
export function nameScale(name: string): 'xl' | 'l' | 'm' | 's' | 'xs' {
  const steps = ['xl', 'l', 'm', 's', 'xs'] as const;
  const n = name.length;
  const byLength = n <= 12 ? 0 : n <= 22 ? 1 : n <= 36 ? 2 : n <= 56 ? 3 : 4;
  const w = Math.max(0, ...name.split(/\s+/).map((x) => x.length));
  const byWord = w <= 7 ? 0 : w <= 10 ? 1 : w <= 14 ? 2 : w <= 19 ? 3 : 4;
  return steps[Math.max(byLength, byWord)];
}
