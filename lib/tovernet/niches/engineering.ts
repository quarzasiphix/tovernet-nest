// Template content for the engineering and design concept (`eng_architect`, `eng_engineering`).
// Concept card lives with the niche round notes. We know registry facts only, so the page names
// no licences, projects, methods, staff or years. Service rows are labelled examples and every
// qualification is a labelled empty slot the owner fills from their own documents.

export type Mark = 'mam' | 'brak' | 'nie';
export type LayerRow = { key: string; title: string; hint: string };
export type EngineeringContent = {
  kicker: string;
  dimension: string;
  lead: string;
  drawingLabel: string;
  drawingNote: string;
  celLabel: string;
  cele: string[];
  layersTitle: string;
  layers: LayerRow[];
  /** Marks the panel miniature starts with, so it shows the drawing mid-way. */
  sample: Record<string, Mark>;
  sheetTitle: string;
  empty: string;
  complete: string;
  reply: string;
  placeholder: string;
  listTitle: string;
  listNote: string;
  rows: [string, string, string][];
  stepsTitle: string;
  steps: [string, string][];
  whoTitle: string;
  whoNote: string;
  who: [string, string][];
  workTitle: string;
  work: string;
  closeTitle: string;
  closeText: string;
};

export const MARKS: [Mark, string][] = [['mam', 'Mam'], ['brak', 'Brakuje'], ['nie', 'Nie wiem']];
export const SHEET_LABELS = { brak: 'Brakuje', nie: 'Do sprawdzenia' } as const;
export const SEND = 'Wyślij zakres do wyceny';
export const LIST_COLUMNS = ['Usługa', 'Co dostajesz', 'Kiedy'] as const;
export const STEPS_NOTE = 'Przykładowy przebieg. Dopasujemy go do tego, jak naprawdę pracujesz.';
export const CLOSE_CTA = 'Zaznacz, co masz';

const ARCHITECT: EngineeringContent = {
  kicker: 'Architektura',
  dimension: 'od działki do projektu',
  lead: 'Zaznacz, co masz już przygotowane. Rysunek pokaże, czego brakuje, i z tym do nas napiszesz.',
  drawingLabel: 'Plan działki',
  drawingNote: 'Rysunek poglądowy. Przed publikacją dopasujemy go do Twoich usług.',
  celLabel: 'Czego dotyczy sprawa?',
  cele: ['Koncepcja', 'Projekt budowlany', 'Adaptacja gotowego projektu', 'Przebudowa lub nadbudowa'],
  layersTitle: 'Co już masz?',
  layers: [
    { key: 'mapa', title: 'Mapa do celów projektowych', hint: 'Działka i jej otoczenie, od geodety' },
    { key: 'warunki', title: 'Plan miejscowy lub warunki zabudowy', hint: 'Co wolno zbudować na tej działce' },
    { key: 'koncepcja', title: 'Koncepcja', hint: 'Bryła, układ i ustawienie na działce' },
    { key: 'projekt', title: 'Projekt budowlany', hint: 'Dokumentacja do pozwolenia lub zgłoszenia' },
    { key: 'media', title: 'Warunki przyłączy', hint: 'Prąd, woda, kanalizacja, gaz' },
  ],
  sample: { mapa: 'mam', warunki: 'mam', koncepcja: 'brak', projekt: 'brak', media: 'nie' },
  sheetTitle: 'Zakres do wyceny',
  empty: 'Zaznacz, co masz, a tu zobaczysz swój zakres.',
  complete: 'Masz wszystko z tej listy. Napisz, czego szukasz, a powiemy, czy możemy pomóc.',
  reply: 'Odpowiemy, co z tej listy przygotujemy sami, a co trzeba zlecić komuś innemu.',
  placeholder: 'Np. co chcesz zbudować albo zmienić.',
  listTitle: 'Zestawienie usług',
  listNote: 'Przykładowy zakres. Przed publikacją zastąpimy go Twoją ofertą.',
  rows: [
    ['Koncepcja', 'Układ, bryła i ustawienie na działce', 'Gdy chcesz wiedzieć, co się zmieści'],
    ['Projekt budowlany', 'Dokumentacja do pozwolenia lub zgłoszenia', 'Gdy wiesz już, co chcesz budować'],
    ['Adaptacja gotowego projektu', 'Projekt z katalogu dostosowany do działki', 'Gdy masz wybrany projekt'],
    ['Przebudowa lub nadbudowa', 'Inwentaryzacja i projekt zmian', 'Gdy budynek już stoi'],
  ],
  stepsTitle: 'Jak pracujemy',
  steps: [
    ['Zakres', 'Ustalamy, co już jest, czego brakuje i co z tego robimy.'],
    ['Wycena', 'Cena i etapy na piśmie, zanim cokolwiek zaczniemy.'],
    ['Projekt', 'Pracujemy etapami, każdy do Twojej akceptacji.'],
    ['Komplet dokumentów', 'Dostajesz dokumentację i wyjaśnienie, co dalej.'],
  ],
  whoTitle: 'Kto podpisuje projekt',
  whoNote: 'Dane wpisujemy wyłącznie z Twoich dokumentów. Niczego nie dopisujemy za Ciebie.',
  who: [
    ['Projektant', 'Tu imię i nazwisko'],
    ['Uprawnienia', 'Tu numer i specjalność uprawnień'],
    ['Izba', 'Tu przynależność do izby'],
    ['Ubezpieczenie OC', 'Tu informacja, jeśli chcesz ją pokazać'],
  ],
  workTitle: 'Projekty',
  work: 'Tu Twoje projekty: rysunek lub zdjęcie, miejsce i zakres. Bez nich strona działa dzięki zestawieniu usług.',
  closeTitle: 'Nie wiesz, od czego zacząć?',
  closeText: 'Zaznacz „Nie wiem”. Od tego też można zacząć.',
};

const ENGINEERING: EngineeringContent = {
  kicker: 'Inżynieria i doradztwo techniczne',
  dimension: 'od pytania do dokumentu',
  lead: 'Zaznacz, co masz już o swoim obiekcie. Rysunek pokaże, czego brakuje, i z tym do nas napiszesz.',
  drawingLabel: 'Przekrój obiektu',
  drawingNote: 'Rysunek poglądowy. Przed publikacją dopasujemy go do Twojej branży.',
  celLabel: 'Czego dotyczy sprawa?',
  cele: ['Ekspertyza lub opinia techniczna', 'Projekt lub dokumentacja', 'Badania i pomiary', 'Doradztwo lub nadzór'],
  layersTitle: 'Co już masz?',
  layers: [
    { key: 'obiekt', title: 'Opis obiektu', hint: 'Co to jest, gdzie stoi, do czego służy' },
    { key: 'dok', title: 'Dokumentacja', hint: 'Rysunki, projekt, wcześniejsze opinie' },
    { key: 'badania', title: 'Pomiary lub badania', hint: 'Wyniki z terenu albo z laboratorium' },
    { key: 'wymagania', title: 'Wymagania do spełnienia', hint: 'Kto i czego oczekuje: urząd, inwestor, odbiór' },
    { key: 'analiza', title: 'Analiza lub obliczenia', hint: 'Czy obiekt spełnia te wymagania' },
  ],
  sample: { obiekt: 'mam', dok: 'nie', badania: 'brak', wymagania: 'mam', analiza: 'brak' },
  sheetTitle: 'Zakres do wyceny',
  empty: 'Zaznacz, co masz, a tu zobaczysz swój zakres.',
  complete: 'Masz wszystko z tej listy. Napisz, czego szukasz, a powiemy, czy możemy pomóc.',
  reply: 'Odpowiemy, co z tej listy możemy wykonać i czego potrzebujemy, żeby to wycenić.',
  placeholder: 'Np. co się dzieje z obiektem albo do czego potrzebny jest dokument.',
  listTitle: 'Zestawienie usług',
  listNote: 'Przykładowy zakres. Przed publikacją zastąpimy go Twoją ofertą.',
  rows: [
    ['Ekspertyza lub opinia techniczna', 'Pisemna ocena stanu i zalecenia', 'Gdy trzeba rozstrzygnąć, co dalej z obiektem'],
    ['Projekt lub dokumentacja', 'Rysunki i obliczenia do realizacji', 'Gdy obiekt ma powstać lub się zmienić'],
    ['Badania i pomiary', 'Raport z metodą i wynikami', 'Gdy decyzję muszą poprzeć dane'],
    ['Doradztwo lub nadzór', 'Uzgodnienia i sprawdzenie na miejscu', 'Gdy potrzebujesz inżyniera po swojej stronie'],
  ],
  stepsTitle: 'Jak pracujemy',
  steps: [
    ['Zakres', 'Ustalamy, co już jest, czego brakuje i do czego ma służyć wynik.'],
    ['Wycena', 'Cena, zakres i termin na piśmie, zanim cokolwiek zaczniemy.'],
    ['Praca', 'Na miejscu i przy biurku, z informacją, na jakim jesteśmy etapie.'],
    ['Dokument', 'Wynik na piśmie: metoda, ustalenia i wnioski.'],
  ],
  whoTitle: 'Kto odpowiada za wynik',
  whoNote: 'Dane wpisujemy wyłącznie z Twoich dokumentów. Niczego nie dopisujemy za Ciebie.',
  who: [
    ['Osoba odpowiedzialna', 'Tu imię i nazwisko'],
    ['Uprawnienia', 'Tu numer i specjalność uprawnień, jeśli są wymagane'],
    ['Akredytacje i certyfikaty', 'Tu dokumenty, które faktycznie posiadasz'],
    ['Metody i normy', 'Tu metody i normy, według których pracujesz'],
  ],
  workTitle: 'Opracowania',
  work: 'Tu Twoje opracowania: rodzaj obiektu, zakres i wynik. Jeśli są poufne, opiszemy je bez nazw.',
  closeTitle: 'Nie wiesz, czego potrzebujesz?',
  closeText: 'Zaznacz „Nie wiem”. Od tego też można zacząć.',
};

export const ENGINEERING_CONTENT: Record<string, EngineeringContent> = { eng_architect: ARCHITECT, eng_engineering: ENGINEERING };
export const engineeringContent = (variant: string): EngineeringContent => ENGINEERING_CONTENT[variant] ?? ENGINEERING;
