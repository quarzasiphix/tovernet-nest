// Template content for the software and games concept (`tech_software`, `tech_games`).
// Concept card: ksiegai docs/plans/tovernet/23-niche-round-2.md. We know registry facts only,
// so the page names no technologies, clients, projects, team size or years. Scope rows are
// labelled as examples; everything else the owner fills is a labelled slot.

export type BriefGroup = { key: string; label: string; options: string[] };
export type TechContent = {
  kicker: string;
  lead: string;
  fileName: string;
  send: string;
  empty: string;
  groups: BriefGroup[];
  /** The group whose answer decides the "first step" line of the brief. */
  nextBy: string;
  next: Record<string, string>;
  scopeTitle: string;
  scopeNote: string;
  scope: [string, string][];
  scopeCta: string;
  steps: [string, string][];
  stepsTitle: string;
  stepsNote: string;
  slots: { title: string; text: string }[];
  placeholder: string;
};

const SOFTWARE: TechContent = {
  kicker: 'Oprogramowanie na zamówienie',
  lead: 'Opisz, co chcesz zbudować albo naprawić. Z Twoich odpowiedzi powstaje brief, od którego zaczniemy rozmowę.',
  fileName: 'brief.md',
  send: 'Wyślij brief',
  empty: 'Wybierz odpowiedzi, a brief napisze się tutaj.',
  groups: [
    { key: 'projekt', label: 'Czego potrzebujesz?', options: ['Aplikacja webowa', 'Aplikacja mobilna', 'Integracja systemów', 'Rozwój istniejącego produktu'] },
    { key: 'etap', label: 'Na jakim jesteś etapie?', options: ['Mam pomysł', 'Mam makiety lub prototyp', 'Produkt już działa'] },
    { key: 'priorytet', label: 'Co jest teraz najważniejsze?', options: ['Szybko sprawdzić pomysł', 'Stabilność', 'Porządek w kodzie'] },
  ],
  nextBy: 'etap',
  next: {
    'Mam pomysł': 'rozmowa o problemie i najmniejszej wersji, którą warto zbudować',
    'Mam makiety lub prototyp': 'przegląd prototypu i lista tego, czego brakuje',
    'Produkt już działa': 'przegląd kodu i tego, co dziś blokuje zmiany',
  },
  scopeTitle: 'Co możemy zbudować',
  scopeNote: 'Przykładowy zakres. Przed publikacją zastąpimy go Twoją ofertą.',
  scope: [
    ['Aplikacje webowe', 'Panele, systemy dla klientów i narzędzia wewnętrzne.'],
    ['Integracje', 'Połączenie systemów, które dziś wymieniają dane ręcznie.'],
    ['Przejęcie projektu', 'Dalszy rozwój kodu, który napisał ktoś inny.'],
  ],
  scopeCta: 'Zapytaj o to',
  stepsTitle: 'Jak pracujemy',
  steps: [
    ['Brief i rozmowa', 'Najpierw problem, potem technologia.'],
    ['Zakres na piśmie', 'Co wchodzi, co nie wchodzi i jak to odbierzemy.'],
    ['Krótkie etapy', 'Działające fragmenty do obejrzenia, zamiast jednej dużej premiery.'],
    ['Odbiór i przekazanie', 'Ustalamy, kto i jak utrzymuje projekt po wdrożeniu.'],
  ],
  stepsNote: 'Przykładowy przebieg. Dopasujemy go do tego, jak naprawdę pracujesz.',
  slots: [
    { title: 'Realizacje', text: 'Tu Twoje projekty: problem, rozwiązanie, link. Jeśli są pod NDA, opiszemy je bez nazw.' },
    { title: 'Technologie', text: 'Tu języki i narzędzia, w których naprawdę pracujesz.' },
    { title: 'Zespół', text: 'Tu osoby, z którymi klient będzie rozmawiać.' },
  ],
  placeholder: 'Np. kto będzie z tego korzystać i jaki problem to rozwiązuje.',
};

const GAMES: TechContent = {
  kicker: 'Studio gier',
  lead: 'Wydawca, prasa, twórca albo gracz: napisz, kim jesteś i w jakiej sprawie. Z Twoich odpowiedzi powstaje wiadomość, która trafi do właściwej osoby.',
  fileName: 'kontakt.md',
  send: 'Wyślij wiadomość',
  empty: 'Wybierz odpowiedzi, a wiadomość napisze się tutaj.',
  groups: [
    { key: 'nadawca', label: 'Kim jesteś?', options: ['Wydawca lub inwestor', 'Studio lub podwykonawca', 'Prasa lub twórca', 'Gracz'] },
    { key: 'sprawa', label: 'W jakiej sprawie?', options: ['Współpraca przy tytule', 'Materiały prasowe', 'Pytanie o grę'] },
    { key: 'platforma', label: 'Która platforma?', options: ['PC', 'Konsole', 'Mobile', 'Jeszcze nie wiem'] },
  ],
  nextBy: 'nadawca',
  next: {
    'Wydawca lub inwestor': 'rozmowa o tytule i przesłanie materiałów',
    'Studio lub podwykonawca': 'wymiana portfolio i zakresu',
    'Prasa lub twórca': 'przesłanie materiałów prasowych i kluczy, jeśli są dostępne',
    Gracz: 'odpowiedź na pytanie o grę',
  },
  scopeTitle: 'Nasze tytuły',
  scopeNote: 'Miejsca na Twoje gry. Bez tytułów strona zbiera kontakt od wydawców i prasy.',
  scope: [
    ['Tytuł gry', 'Tu gatunek, platformy i data premiery.'],
    ['Zwiastun', 'Tu film lub zrzuty ekranu z gry.'],
    ['Strona w sklepie', 'Tu link do listy życzeń lub zakupu.'],
  ],
  scopeCta: 'Napisz do nas',
  stepsTitle: 'Jak wygląda współpraca',
  steps: [
    ['Wiadomość', 'Kim jesteś i czego szukasz.'],
    ['Materiały', 'Build, prezentacja lub pakiet prasowy, zależnie od sprawy.'],
    ['Rozmowa', 'Zakres, role i terminy.'],
    ['Ustalenia na piśmie', 'Kto za co odpowiada.'],
  ],
  stepsNote: 'Przykładowy przebieg. Dopasujemy go do tego, jak naprawdę pracujesz.',
  slots: [
    { title: 'Pakiet prasowy', text: 'Tu logotypy, grafiki i opis studia do pobrania.' },
    { title: 'Społeczność', text: 'Tu Discord, Steam i media społecznościowe.' },
    { title: 'Zespół', text: 'Tu ludzie stojący za grami.' },
  ],
  placeholder: 'Np. nad czym pracujesz albo o co chcesz zapytać.',
};

export const TECH_CONTENT: Record<string, TechContent> = { tech_software: SOFTWARE, tech_games: GAMES };
export const techContent = (variant: string): TechContent => TECH_CONTENT[variant] ?? SOFTWARE;
