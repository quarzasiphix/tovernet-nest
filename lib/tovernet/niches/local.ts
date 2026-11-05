// Template content for the local-services concept (cleaning 81.2, gardens 81.30, auto repair
// 95.31.A/B and 45.20, detailing 95.31.C). One layout, four trades. The page is a sentence the
// visitor completes in their own words; every answer is one "pass" of the trade's work on the
// drawing (a squeegee stroke, a mown stripe, a line of the car drawing).
//
// Services are examples for the company to confirm, and the page says so. Nothing here may
// state prices, brands serviced, certificates, equipment, staff, years in business, reviews,
// completed jobs, arrival or turnaround times.

export type LocalVariant = 'local_cleaning' | 'local_garden' | 'local_auto' | 'local_detailing';

/** A gap in the sentence: a native select, or a short free-text input. */
export type Blank = {
  key: string;
  /** Shown inside the empty gap and read by screen readers. */
  hint: string;
  options?: string[];
  free?: { placeholder: string };
  /** Value used in the filled preview (panel miniature, sales page). */
  sample: string;
};

export type Part = string | Blank;

/** Tap target on the drawing. x and y are percent of the drawing box. */
export type Spot = { key: string; label: string; x: number; y: number; sets: Record<string, string> };

export type LocalService = { title: string; text: string; sets: Record<string, string> };

export type LocalContent = {
  art: 'window' | 'lawn' | 'car';
  gloss?: boolean;
  /** Trade line set as the page title. */
  h1: (city: string | null) => string;
  lead: string;
  sentence: Part[];
  spots: Spot[];
  spotsLabel: string;
  services: LocalService[];
  servicesTitle: string;
  servicesNote: string;
  /** Stands where a price list would put the price. */
  leader: string;
  area:'travel' | 'premises';
  areaTitle: string;
  areaSlot: string;
  notePlaceholder: string;
  askPlace: boolean;
  prepare: string[];
  steps: [string, string][];
  cta: string;
  footSlot: string;
};

const SOON = ['jak najszybciej', 'w tym tygodniu', 'w przyszłym tygodniu', 'w ciągu miesiąca', 'w dogodnym terminie'];

export const LOCAL: Record<LocalVariant, LocalContent> = {
  local_cleaning: {
    art: 'window',
    h1: (c) => `Sprzątanie mieszkań, biur i klatek schodowych${c ? `. ${c} i okolice` : ''}`,
    lead: 'Dokończ zdanie i zostaw numer. Odezwiemy się z wyceną i terminem.',
    sentence: [
      'Chodzi o ',
      { key: 'miejsce', hint: 'rodzaj miejsca', options: ['mieszkanie', 'dom', 'biuro', 'lokal usługowy', 'klatkę schodową'], sample: 'mieszkanie' },
      ', ',
      { key: 'metraz', hint: 'metraż', options: ['do 40 m²', '40–70 m²', '70–120 m²', '120–250 m²', 'ponad 250 m²', 'metraż do ustalenia'], sample: '40–70 m²' },
      '. Potrzebuję ',
      { key: 'zakres', hint: 'czego', options: ['sprzątania bieżącego', 'gruntownego sprzątania', 'sprzątania po remoncie', 'mycia okien', 'prania tapicerki'], sample: 'sprzątania po remoncie' },
      ' ',
      { key: 'czestotliwosc', hint: 'jak często', options: ['jednorazowo', 'co tydzień', 'co dwa tygodnie', 'raz w miesiącu', 'kilka razy w tygodniu'], sample: 'jednorazowo' },
      ', najlepiej ',
      { key: 'termin', hint: 'kiedy', options: SOON, sample: 'w przyszłym tygodniu' },
      '.',
    ],
    spots: [],
    spotsLabel: '',
    servicesTitle: 'Co sprzątamy',
    services: [
      { title: 'Sprzątanie bieżące', text: 'Mieszkania, domy i biura, jednorazowo albo w stałym rytmie.', sets: { zakres: 'sprzątania bieżącego' } },
      { title: 'Gruntowne sprzątanie', text: 'Kuchnia, łazienka, szafki i sprzęty: to, czego nie robi się co tydzień.', sets: { zakres: 'gruntownego sprzątania', czestotliwosc: 'jednorazowo' } },
      { title: 'Sprzątanie po remoncie', text: 'Pył, ślady farby i fug, okna po pracach.', sets: { zakres: 'sprzątania po remoncie', czestotliwosc: 'jednorazowo' } },
      { title: 'Mycie okien', text: 'Szyby, ramy i parapety, także w biurach i lokalach.', sets: { zakres: 'mycia okien' } },
      { title: 'Pranie tapicerki', text: 'Kanapy, fotele, materace i dywany.', sets: { zakres: 'prania tapicerki', czestotliwosc: 'jednorazowo' } },
      { title: 'Klatki schodowe', text: 'Stałe sprzątanie części wspólnych dla wspólnot i zarządców.', sets: { miejsce: 'klatkę schodową', zakres: 'sprzątania bieżącego', czestotliwosc: 'co tydzień' } },
    ],
    servicesNote: 'Przykładowy zakres, do potwierdzenia przez firmę. Cena zależy od metrażu, stanu i częstotliwości, dlatego podajemy ją po opisie.',
    leader: 'wycena po opisie',
    area: 'travel',
    areaTitle: 'Dojeżdżamy',
    areaSlot: 'Tu wpiszesz dzielnice i miejscowości, do których dojeżdżasz',
    notePlaceholder: 'Np. dwie łazienki, w domu jest pies.',
    askPlace: true,
    prepare: ['Rodzaj miejsca i przybliżony metraż', 'Liczba pokoi i łazienek', 'Zdjęcia z telefonu, jeśli to sprzątanie po remoncie', 'Jak często i w które dni tygodnia'],
    steps: [
      ['Opisujesz miejsce', 'Jedno zdanie i numer telefonu.'],
      ['Wycena przed sprzątaniem', 'Znasz cenę, zanim przyjedziemy.'],
      ['Ustalamy termin', 'Jednorazowo albo stały dzień w tygodniu.'],
      ['Sprzątanie', 'Jedna osoba do kontaktu, także przy zmianach.'],
    ],
    cta: 'Poproś o wycenę',
    footSlot: 'Tu godziny, w których odbierasz telefon',
  },

  local_garden: {
    art: 'lawn',
    h1: (c) => `Ogrody: koszenie, cięcie, pielęgnacja i zakładanie${c ? `. ${c} i okolice` : ''}`,
    lead: 'Dokończ zdanie i zostaw numer. Odezwiemy się, żeby ustalić zakres i wycenę.',
    sentence: [
      'Chodzi o ',
      { key: 'miejsce', hint: 'jaki teren', options: ['ogród przy domu', 'działkę rekreacyjną', 'teren wspólnoty', 'teren przy firmie'], sample: 'ogród przy domu' },
      ', ',
      { key: 'metraz', hint: 'powierzchnia', options: ['do 300 m²', '300–800 m²', '800–2000 m²', 'ponad 2000 m²', 'powierzchnia do ustalenia'], sample: '300–800 m²' },
      '. Potrzebuję ',
      { key: 'zakres', hint: 'czego', options: ['koszenia trawnika', 'cięcia żywopłotu', 'pielęgnacji rabat', 'grabienia liści', 'założenia trawnika', 'założenia ogrodu od zera', 'porządków po zimie'], sample: 'koszenia trawnika' },
      ' ',
      { key: 'czestotliwosc', hint: 'jak często', options: ['jednorazowo', 'regularnie w sezonie', 'co tydzień', 'co dwa tygodnie'], sample: 'regularnie w sezonie' },
      ', najlepiej ',
      { key: 'termin', hint: 'kiedy', options: ['jak najszybciej', 'w tym miesiącu', 'wiosną', 'latem', 'jesienią'], sample: 'wiosną' },
      '.',
    ],
    spots: [
      { key: 'zywoplot', label: 'Żywopłot', x: 30, y: 9, sets: { zakres: 'cięcia żywopłotu' } },
      { key: 'liscie', label: 'Liście', x: 73, y: 39, sets: { zakres: 'grabienia liści', czestotliwosc: 'jednorazowo', termin: 'jesienią' } },
      { key: 'trawnik', label: 'Trawnik', x: 42, y: 52, sets: { zakres: 'koszenia trawnika' } },
      { key: 'rabaty', label: 'Rabaty', x: 21, y: 80, sets: { zakres: 'pielęgnacji rabat' } },
    ],
    spotsLabel: 'Albo wskaż na planie',
    servicesTitle: 'Co robimy w ogrodzie',
    services: [
      { title: 'Koszenie trawnika', text: 'Jednorazowo albo w stałym rytmie przez cały sezon.', sets: { zakres: 'koszenia trawnika' } },
      { title: 'Cięcie żywopłotów', text: 'Formowanie i przycinanie, z uprzątnięciem gałęzi.', sets: { zakres: 'cięcia żywopłotu' } },
      { title: 'Pielęgnacja rabat', text: 'Odchwaszczanie, ściółkowanie, przycinanie bylin i krzewów.', sets: { zakres: 'pielęgnacji rabat' } },
      { title: 'Zakładanie trawnika', text: 'Z siewu albo z rolki, z przygotowaniem podłoża.', sets: { zakres: 'założenia trawnika', czestotliwosc: 'jednorazowo' } },
      { title: 'Zakładanie ogrodu', text: 'Od układu i nasadzeń po pierwszy sezon pielęgnacji.', sets: { zakres: 'założenia ogrodu od zera', czestotliwosc: 'jednorazowo' } },
      { title: 'Porządki sezonowe', text: 'Wiosną po zimie, jesienią liście i przygotowanie na mróz.', sets: { zakres: 'porządków po zimie', czestotliwosc: 'jednorazowo', termin: 'wiosną' } },
    ],
    servicesNote: 'Przykładowy zakres, do potwierdzenia przez firmę. Cena zależy od powierzchni, stanu terenu i rytmu prac, dlatego podajemy ją po opisie.',
    leader: 'wycena po opisie',
    area: 'travel',
    areaTitle: 'Dojeżdżamy',
    areaSlot: 'Tu wpiszesz miejscowości, do których dojeżdżasz',
    notePlaceholder: 'Np. teren ze spadkiem, wjazd od tyłu działki.',
    askPlace: true,
    prepare: ['Przybliżona powierzchnia terenu', 'Kilka zdjęć ogrodu z telefonu', 'Czy jest dojazd i dostęp do wody', 'Kiedy chcesz zacząć: ogród ma swój sezon'],
    steps: [
      ['Opisujesz teren', 'Jedno zdanie, numer i najlepiej kilka zdjęć.'],
      ['Oglądamy na miejscu', 'Jeśli zakres tego wymaga, przyjeżdżamy przed wyceną.'],
      ['Wycena przed pracą', 'Znasz koszt i zakres, zanim zaczniemy.'],
      ['Prace w sezonie', 'Jednorazowo albo regularnie, w ustalonym rytmie.'],
    ],
    cta: 'Poproś o wycenę',
    footSlot: 'Tu godziny, w których odbierasz telefon',
  },

  local_auto: {
    art: 'car',
    h1: (c) => `Mechanika, serwis i naprawy samochodów${c ? `. ${c}` : ''}`,
    lead: 'Dokończ zdanie i zostaw numer. Odezwiemy się z terminem i wstępną wyceną.',
    sentence: [
      'Samochód: ',
      { key: 'auto', hint: 'marka, model, rocznik', free: { placeholder: 'marka, model, rocznik' }, sample: 'kombi, 2016, diesel' },
      '. Potrzebuję ',
      { key: 'zakres', hint: 'czego', options: ['diagnozy usterki', 'przeglądu i wymiany oleju', 'naprawy hamulców', 'naprawy zawieszenia', 'serwisu klimatyzacji', 'wymiany opon', 'naprawy blacharskiej', 'lakierowania'], sample: 'naprawy hamulców' },
      '. Auto ',
      { key: 'stan', hint: 'jak jeździ', options: ['jeździ normalnie', 'jeździ, ale coś jest nie tak', 'nie nadaje się do jazdy'], sample: 'jeździ, ale coś jest nie tak' },
      ', najlepiej ',
      { key: 'termin', hint: 'kiedy', options: ['jak najszybciej', 'w tym tygodniu', 'w przyszłym tygodniu', 'w dogodnym terminie'], sample: 'w tym tygodniu' },
      '.',
    ],
    spots: [
      { key: 'silnik', label: 'Silnik', x: 20, y: 30, sets: { zakres: 'diagnozy usterki' } },
      { key: 'klima', label: 'Klimatyzacja', x: 52, y: 13, sets: { zakres: 'serwisu klimatyzacji' } },
      { key: 'nadwozie', label: 'Nadwozie', x: 79, y: 31, sets: { zakres: 'naprawy blacharskiej' } },
      { key: 'hamulce', label: 'Hamulce', x: 22, y: 90, sets: { zakres: 'naprawy hamulców' } },
      { key: 'zawieszenie', label: 'Zawieszenie', x: 74, y: 90, sets: { zakres: 'naprawy zawieszenia' } },
    ],
    spotsLabel: 'Albo wskaż na rysunku',
    servicesTitle: 'Czym się zajmujemy',
    services: [
      { title: 'Diagnoza usterki', text: 'Szukamy przyczyny, zanim cokolwiek wymienimy.', sets: { zakres: 'diagnozy usterki' } },
      { title: 'Przegląd i olej', text: 'Okresowy serwis: olej, filtry, płyny.', sets: { zakres: 'przeglądu i wymiany oleju', stan: 'jeździ normalnie' } },
      { title: 'Hamulce i zawieszenie', text: 'Klocki, tarcze, amortyzatory, wahacze.', sets: { zakres: 'naprawy hamulców' } },
      { title: 'Klimatyzacja', text: 'Sprawdzenie szczelności, odgrzybianie, uzupełnienie czynnika.', sets: { zakres: 'serwisu klimatyzacji' } },
      { title: 'Opony', text: 'Wymiana sezonowa i naprawa.', sets: { zakres: 'wymiany opon', stan: 'jeździ normalnie' } },
      { title: 'Blacharka i lakier', text: 'Naprawy po drobnych szkodach, lakierowanie elementów.', sets: { zakres: 'naprawy blacharskiej' } },
    ],
    servicesNote: 'Przykładowy zakres, do potwierdzenia przez firmę. Koszt zależy od auta i usterki, dlatego mówimy go po diagnozie, przed naprawą.',
    leader: 'wycena przed pracą',
    area: 'premises',
    areaTitle: 'Warsztat',
    areaSlot: 'Tu adres warsztatu i wskazówki dojazdu',
    notePlaceholder: 'Np. stuka z przodu przy skręcaniu, od tygodnia.',
    askPlace: false,
    prepare: ['Marka, model, rocznik i silnik', 'Od kiedy i kiedy pojawia się problem', 'Czy świeci się kontrolka na desce', 'Numer VIN, jeśli trzeba zamówić części'],
    steps: [
      ['Opisujesz auto i problem', 'Jedno zdanie i numer telefonu.'],
      ['Ustalamy termin', 'Mówimy, kiedy możesz przyjechać.'],
      ['Najpierw diagnoza', 'Mówimy, co trzeba zrobić i ile to kosztuje.'],
      ['Naprawa po Twojej zgodzie', 'Zakres ustalamy z Tobą, zanim zaczniemy.'],
    ],
    cta: 'Zapytaj o termin',
    footSlot: 'Tu godziny otwarcia warsztatu',
  },

  local_detailing: {
    art: 'car',
    gloss: true,
    h1: (c) => `Detailing samochodowy: mycie, korekta lakieru, ochrona${c ? `. ${c}` : ''}`,
    lead: 'Dokończ zdanie i zostaw numer. Odezwiemy się z wyceną i wolnym terminem.',
    sentence: [
      'Samochód: ',
      { key: 'auto', hint: 'marka, model, kolor', free: { placeholder: 'marka, model, kolor' }, sample: 'sedan, grafitowy' },
      '. Interesuje mnie ',
      { key: 'zakres', hint: 'co', options: ['mycie i sprzątanie wnętrza', 'pranie tapicerki', 'korekta lakieru', 'powłoka ochronna', 'renowacja reflektorów', 'przygotowanie auta do sprzedaży'], sample: 'korekta lakieru' },
      '. Lakier jest ',
      { key: 'stan', hint: 'w jakim stanie', options: ['w dobrym stanie', 'zmatowiały', 'porysowany', 'mocno zabrudzony po zimie'], sample: 'zmatowiały' },
      ', najlepiej ',
      { key: 'termin', hint: 'kiedy', options: ['jak najszybciej', 'w tym tygodniu', 'w przyszłym tygodniu', 'w dogodnym terminie'], sample: 'w przyszłym tygodniu' },
      '.',
    ],
    spots: [
      { key: 'reflektory', label: 'Reflektory', x: 13, y: 40, sets: { zakres: 'renowacja reflektorów' } },
      { key: 'wnetrze', label: 'Wnętrze', x: 50, y: 13, sets: { zakres: 'mycie i sprzątanie wnętrza' } },
      { key: 'lakier', label: 'Lakier', x: 79, y: 31, sets: { zakres: 'korekta lakieru' } },
      { key: 'fotele', label: 'Tapicerka', x: 50, y: 88, sets: { zakres: 'pranie tapicerki' } },
    ],
    spotsLabel: 'Albo wskaż na rysunku',
    servicesTitle: 'Co robimy z autem',
    services: [
      { title: 'Mycie i sprzątanie wnętrza', text: 'Odkurzanie, plastiki, szyby od środka.', sets: { zakres: 'mycie i sprzątanie wnętrza' } },
      { title: 'Pranie tapicerki', text: 'Fotele, podsufitka, dywaniki.', sets: { zakres: 'pranie tapicerki' } },
      { title: 'Korekta lakieru', text: 'Usuwanie zmatowień i drobnych rys.', sets: { zakres: 'korekta lakieru' } },
      { title: 'Powłoka ochronna', text: 'Wosk albo powłoka, dobrana do auta i sposobu użytkowania.', sets: { zakres: 'powłoka ochronna' } },
      { title: 'Renowacja reflektorów', text: 'Zmatowiałe i pożółkłe klosze.', sets: { zakres: 'renowacja reflektorów' } },
      { title: 'Przygotowanie do sprzedaży', text: 'Wnętrze i lakier przed zdjęciami do ogłoszenia.', sets: { zakres: 'przygotowanie auta do sprzedaży' } },
    ],
    servicesNote: 'Przykładowy zakres, do potwierdzenia przez firmę. Cena zależy od auta i stanu lakieru, dlatego podajemy ją po opisie albo po obejrzeniu auta.',
    leader: 'wycena po opisie',
    area: 'premises',
    areaTitle: 'Studio',
    areaSlot: 'Tu adres studia i wskazówki dojazdu',
    notePlaceholder: 'Np. rysy na drzwiach kierowcy, auto idzie do sprzedaży.',
    askPlace: false,
    prepare: ['Marka, model i kolor', 'Kilka zdjęć lakieru w świetle dziennym', 'Co przeszkadza najbardziej', 'Czy auto może zostać na noc'],
    steps: [
      ['Opisujesz auto', 'Jedno zdanie, numer i najlepiej kilka zdjęć.'],
      ['Wycena przed pracą', 'Po opisie i zdjęciach, a jeśli trzeba, po obejrzeniu auta.'],
      ['Ustalamy termin', 'Mówimy, na ile dni zostawiasz auto.'],
      ['Odbiór', 'Pokazujemy, co zostało zrobione.'],
    ],
    cta: 'Poproś o wycenę',
    footSlot: 'Tu godziny otwarcia studia',
  },
};

export const LOCAL_VARIANTS = Object.keys(LOCAL) as LocalVariant[];

export const localContent = (variant: string): LocalContent => LOCAL[variant as LocalVariant] ?? LOCAL.local_cleaning;

export const isBlank = (p: Part): p is Blank => typeof p !== 'string';

/** The sentence as plain text, gaps left as "…". This is what the firm would receive. */
export function sentenceText(parts: Part[], values: Record<string, string>): string {
  return parts.map((p) => (isBlank(p) ? values[p.key]?.trim() || '…' : p)).join('');
}

export const sampleValues = (parts: Part[]): Record<string, string> =>
  Object.fromEntries(parts.filter(isBlank).map((b) => [b.key, b.sample]));
