// Template content for the professional services concept (PKD 69.20, 68.31, 68.32).
// Card: ksiegai/docs/plans/tovernet/18-niche-expansion.md, report of the professional agent.
// Services and process steps are examples for the company to confirm, and the page says so.
// Nothing here may state licences (biegły rewident, doradca podatkowy, licencja pośrednika),
// OC insurance, years, client numbers, software partnerships, listings or prices.

export type ProVariant = 'pro_accounting' | 'pro_realestate' | 'pro_property';

export function proVariant(variant: string | undefined): ProVariant {
  if (variant === 'pro_realestate' || variant === 'pro_property') return variant;
  return 'pro_accounting';
}

/* ------------------------------------------------------------------ accounting */

export type Form = 'jdg' | 'spzoo' | 'spolka' | 'ngo';

export const FORMS: { key: Form; label: string; short: string }[] = [
  { key: 'jdg', label: 'Jednoosobowa działalność', short: 'JDG' },
  { key: 'spzoo', label: 'Spółka z o.o.', short: 'Spółka z o.o.' },
  { key: 'spolka', label: 'Inna spółka', short: 'Inna spółka' },
  { key: 'ngo', label: 'Fundacja lub stowarzyszenie', short: 'Fundacja / stow.' },
];

export type Setup = { form: Form; vat: boolean; staff: boolean };

/** What the books are kept in, for the panel header. */
export const LEDGER: Record<Form, string> = {
  jdg: 'KPiR albo ryczałt',
  spzoo: 'Pełna księgowość',
  spolka: 'KPiR albo pełna księgowość',
  ngo: 'Pełna księgowość',
};

export type Deadline = {
  key: string;
  /** Day label as set in the margin, e.g. "20." or "co miesiąc". */
  day: string;
  /** True when `day` is a word, not a date; set smaller. */
  wordy?: boolean;
  title: string;
  text: (s: Setup) => string;
  /** null means it applies; a string is the reason it does not. */
  skip: (s: Setup) => string | null;
};

const zusText = (s: Setup) => {
  const tax = s.form === 'jdg' ? 'zaliczka na PIT' : s.form === 'spolka' ? 'zaliczka na podatek dochodowy' : 'zaliczka na CIT';
  if (s.form === 'jdg') return `Składki ZUS, ${tax}${s.staff ? ' i podatek od wynagrodzeń' : ''}.`;
  return s.staff ? `Składki ZUS za pracowników, ${tax} i podatek od wynagrodzeń.` : `${tax.charAt(0).toUpperCase()}${tax.slice(1)}, jeśli wychodzi do zapłaty.`;
};

export const DEADLINES: Deadline[] = [
  { key: 'docs', day: 'do 5.', title: 'Przekazujesz dokumenty', text: () => 'Faktury i wyciągi za poprzedni miesiąc. Dzień i sposób przekazania ustalamy w umowie.', skip: () => null },
  { key: 'ksef', day: 'na bieżąco', wordy: true, title: 'Faktury z KSeF', text: () => 'Faktury z Krajowego Systemu e-Faktur trafiają do księgowania bez przepisywania.', skip: () => null },
  { key: 'pay', day: 'do 10.', title: 'Listy płac', text: () => 'Wynagrodzenia policzone przed wypłatą, z kompletem dokumentów kadrowych.', skip: (s) => (s.staff ? null : 'Nie dotyczy: bez pracowników') },
  { key: 'zus', day: '20.', title: 'ZUS i podatek dochodowy', text: zusText, skip: () => null },
  { key: 'vat', day: '25.', title: 'VAT i JPK_V7', text: () => 'Rozliczenie VAT i plik JPK do urzędu skarbowego.', skip: (s) => (s.vat ? null : 'Nie dotyczy: zwolnienie z VAT') },
  { key: 'sum', day: 'co miesiąc', wordy: true, title: 'Wiesz, ile i do kiedy zapłacić', text: () => 'Po rozliczeniu dostajesz kwoty podatków i składek z terminami.', skip: () => null },
  { key: 'year', day: 'raz w roku', wordy: true, title: 'Rozliczenie roczne', text: (s) => (s.form === 'jdg' ? 'Zeznanie roczne PIT.' : 'Sprawozdanie finansowe i zeznanie roczne.'), skip: () => null },
];

export const MONTH_NOTE = 'Przykładowy miesiąc przy rozliczeniach miesięcznych. Dokładne terminy zależą od formy opodatkowania, ustalimy je przy wycenie.';

export const LEDGER_CHOICES = ['KPiR', 'Ryczałt', 'Pełna księgowość', 'Nie wiem, doradźcie'];
export const DOC_COUNTS = ['do 20', '21–50', '51–100', 'ponad 100'];
export const STAFF_COUNTS = ['0', '1–3', '4–10', 'ponad 10'];
export const SITUATIONS = ['Zakładam firmę', 'Zmieniam biuro', 'Rozliczam się samodzielnie'];

export const SCOPE: { title: string; who: string; text: string }[] = [
  { title: 'Księga przychodów i rozchodów, ryczałt', who: 'Jednoosobowe firmy i małe spółki', text: 'Ewidencja, zaliczki i rozliczenie roczne.' },
  { title: 'Pełna księgowość', who: 'Spółki z o.o., fundacje, stowarzyszenia', text: 'Księgi rachunkowe, deklaracje i sprawozdanie finansowe.' },
  { title: 'Kadry i płace', who: 'Firmy zatrudniające', text: 'Umowy, listy płac, ZUS pracowników, urlopy i zwolnienia.' },
  { title: 'VAT, JPK i KSeF', who: 'Czynni podatnicy VAT', text: 'Rejestry, pliki JPK i faktury z Krajowego Systemu e-Faktur.' },
  { title: 'Kontakt z urzędami', who: 'Każda forma', text: 'Korespondencja z urzędem skarbowym i ZUS na podstawie pełnomocnictwa.' },
  { title: 'Start firmy', who: 'Zakładający działalność', text: 'Wybór formy opodatkowania i pierwsze zgłoszenia.' },
];

export const DUTIES: { step: string; you: string; we: string }[] = [
  { step: 'Zapytanie', you: 'Opisujesz firmę w formularzu albo przez telefon.', we: 'Odpisujemy z zakresem i ceną miesięcznej obsługi.' },
  { step: 'Umowa', you: 'Podpisujesz umowę i pełnomocnictwa.', we: 'Przygotowujemy dokumenty i zgłaszamy pełnomocnictwa w urzędach.' },
  { step: 'Start', you: 'Przekazujesz dokumenty, a przy zmianie biura dotychczasowe ewidencje.', we: 'Przejmujemy księgowość od ustalonego miesiąca.' },
  { step: 'Co miesiąc', you: 'Dosyłasz dokumenty do ustalonego dnia.', we: 'Księgujemy, rozliczamy i podajemy kwoty do zapłaty.' },
  { step: 'Raz w roku', you: 'Odpowiadasz na kilka pytań o miniony rok.', we: 'Przygotowujemy rozliczenie roczne.' },
];

export const ACC_PREPARE = ['Forma prawna i NIP, jeśli firma już działa', 'Forma opodatkowania, jeśli ją znasz', 'Ile faktur sprzedaży i kosztów jest w miesiącu', 'Ilu masz pracowników i na jakich umowach', 'Od kiedy chcesz zacząć'];

export const ACC_SLOTS = ['Tu uprawnienia lub certyfikat księgowy, jeśli je podasz', 'Tu numer polisy OC biura, jeśli chcesz go pokazać', 'Tu zdjęcie i imiona osób, które prowadzą Twoje sprawy', 'Tu godziny pracy i sposób przekazywania dokumentów'];

/* ------------------------------------------------------------------ real estate and property management */

export type Field = 'type' | 'area' | 'rooms' | 'units' | 'location' | 'budget' | 'manager' | 'tenant' | 'timing';
export type Glyph = 'flat' | 'house' | 'plot' | 'shop' | 'block' | 'office';

export type Role = {
  key: string;
  label: string;
  sub: string;
  /** Ribbon on the drafted card. */
  tag: string;
  /** Card heading above the drafted card. */
  cardTitle: string;
  /** Value line on the card; `{budget}` is replaced when given. */
  value: string;
  types: { label: string; glyph: Glyph }[];
  fields: Field[];
  formTitle: string;
  cta: string;
  timing: string[];
  steps: [string, string][];
};

const LIVING = [
  { label: 'Mieszkanie', glyph: 'flat' as const },
  { label: 'Dom', glyph: 'house' as const },
  { label: 'Działka', glyph: 'plot' as const },
  { label: 'Lokal użytkowy', glyph: 'shop' as const },
];

export const ESTATE_ROLES: Role[] = [
  {
    key: 'sprzedaz', label: 'Sprzedaję', sub: 'Mieszkanie, dom, działkę albo lokal', tag: 'Na sprzedaż', cardTitle: 'Szkic Twojej oferty',
    value: 'Cena: ustalimy razem po oględzinach', types: LIVING, fields: ['type', 'area', 'rooms', 'location', 'timing'],
    formTitle: 'Opisz nieruchomość', cta: 'Umów rozmowę o sprzedaży', timing: ['Jak najszybciej', 'W ciągu 3 miesięcy', 'Na razie sprawdzam'],
    steps: [['Rozmowa i oględziny', 'Poznajemy nieruchomość, dokumenty i Twój plan.'], ['Umowa pośrednictwa', 'Na piśmie, z zakresem i wynagrodzeniem biura.'], ['Oferta', 'Zdjęcia, opis i publikacja w ustalonych miejscach.'], ['Prezentacje i negocjacje', 'Umawiamy oglądających i prowadzimy rozmowy.'], ['Umowa i akt notarialny', 'Pomagamy przejść przez umowę przedwstępną i akt.']],
  },
  {
    key: 'wynajem', label: 'Wynajmuję', sub: 'Szukam najemcy dla swojej nieruchomości', tag: 'Do wynajęcia', cardTitle: 'Szkic Twojej oferty',
    value: 'Czynsz: ustalimy razem', types: LIVING, fields: ['type', 'area', 'rooms', 'location', 'timing'],
    formTitle: 'Opisz nieruchomość', cta: 'Umów rozmowę o najmie', timing: ['Wolne od zaraz', 'Za 1–2 miesiące', 'Później'],
    steps: [['Rozmowa i oględziny', 'Ustalamy warunki najmu i oczekiwania wobec najemcy.'], ['Umowa pośrednictwa', 'Na piśmie, z zakresem i wynagrodzeniem biura.'], ['Oferta i prezentacje', 'Publikujemy ofertę i pokazujemy lokal.'], ['Wybór najemcy', 'Przedstawiamy kandydatów, decyzja należy do Ciebie.'], ['Umowa najmu i protokół', 'Spisujemy umowę i stan lokalu przy przekazaniu kluczy.']],
  },
  {
    key: 'szukam', label: 'Szukam', sub: 'Chcę kupić albo wynająć', tag: 'Poszukiwane', cardTitle: 'Twoje zlecenie poszukiwania',
    value: 'Budżet: {budget}', types: LIVING, fields: ['type', 'area', 'rooms', 'location', 'budget', 'timing'],
    formTitle: 'Czego szukasz?', cta: 'Zostaw zlecenie poszukiwania', timing: ['Kupno', 'Najem'],
    steps: [['Opisujesz, czego szukasz', 'Okolica, metraż, budżet i to, z czego nie zrezygnujesz.'], ['Umowa pośrednictwa', 'Na piśmie, z zakresem i wynagrodzeniem biura.'], ['Wybór i prezentacje', 'Pokazujemy oferty, które pasują do zlecenia.'], ['Sprawdzenie dokumentów', 'Księga wieczysta i dokumenty nieruchomości przed decyzją.'], ['Umowa i akt notarialny', 'Albo umowa najmu i protokół przekazania.']],
  },
];

export const PROPERTY_ROLES: Role[] = [
  {
    key: 'wspolnota', label: 'Wspólnota mieszkaniowa', sub: 'Szukamy zarządcy dla budynku', tag: 'Zarząd wspólnoty', cardTitle: 'Szkic zlecenia zarządu',
    value: 'Zakres i stawka: w ofercie zarządu', types: [{ label: 'Budynek wielorodzinny', glyph: 'block' }, { label: 'Kilka budynków', glyph: 'block' }],
    fields: ['type', 'units', 'location', 'manager', 'timing'], formTitle: 'Opisz wspólnotę', cta: 'Poproś o ofertę zarządu', timing: ['Jak najszybciej', 'Od nowego roku', 'Zbieramy oferty'],
    steps: [['Rozmowa i dokumenty', 'Poznajemy budynek, uchwały i bieżące sprawy.'], ['Oferta zarządu', 'Zakres, stawka i sposób kontaktu z mieszkańcami.'], ['Uchwała i umowa', 'Wspólnota podejmuje uchwałę, podpisujemy umowę.'], ['Przejęcie dokumentacji', 'Od dotychczasowego zarządcy albo zarządu.'], ['Bieżący zarząd', 'Rozliczenia, przeglądy, usterki i zebrania.']],
  },
  {
    key: 'najem', label: 'Mieszkanie na wynajem', sub: 'Chcę oddać najem w zarząd', tag: 'Zarządzanie najmem', cardTitle: 'Szkic zlecenia zarządu',
    value: 'Zakres i stawka: w ofercie zarządu', types: [{ label: 'Mieszkanie', glyph: 'flat' }, { label: 'Dom', glyph: 'house' }],
    fields: ['type', 'area', 'rooms', 'location', 'tenant'], formTitle: 'Opisz mieszkanie', cta: 'Poproś o ofertę zarządu', timing: [],
    steps: [['Rozmowa i oględziny', 'Ustalamy, czym mamy się zajmować w Twoim imieniu.'], ['Umowa o zarządzanie', 'Na piśmie, z zakresem i wynagrodzeniem.'], ['Najemca', 'Szukamy najemcy albo przejmujemy obecną umowę.'], ['Bieżąca obsługa', 'Kontakt z najemcą, opłaty i usterki.'], ['Rozliczenia z Tobą', 'Regularne zestawienie wpływów i kosztów.']],
  },
  {
    key: 'lokal', label: 'Lokal lub budynek', sub: 'Nieruchomość usługowa, biurowa, magazynowa', tag: 'Zarząd nieruchomości', cardTitle: 'Szkic zlecenia zarządu',
    value: 'Zakres i stawka: w ofercie zarządu', types: [{ label: 'Lokal usługowy', glyph: 'shop' }, { label: 'Biuro', glyph: 'office' }, { label: 'Budynek', glyph: 'block' }],
    fields: ['type', 'area', 'location', 'tenant'], formTitle: 'Opisz nieruchomość', cta: 'Poproś o ofertę zarządu', timing: [],
    steps: [['Rozmowa i oględziny', 'Poznajemy obiekt, najemców i koszty.'], ['Umowa o zarządzanie', 'Na piśmie, z zakresem i wynagrodzeniem.'], ['Przejęcie', 'Dokumentacja, umowy z dostawcami i najemcami.'], ['Bieżąca obsługa', 'Przeglądy, naprawy, kontakt z najemcami.'], ['Raporty', 'Zestawienia przychodów i kosztów dla właściciela.']],
  },
];

export const ROOMS = ['1', '2', '3', '4+'];
export const MANAGER = ['Zarząd własny', 'Inny zarządca', 'Nowa wspólnota'];
export const TENANT = ['Jest najemca', 'Lokal jest wolny'];

export const FIELD_LABEL: Record<Field, string> = {
  type: 'Rodzaj', area: 'Powierzchnia', rooms: 'Pokoje', units: 'Liczba lokali', location: 'Miejscowość, dzielnica albo adres',
  budget: 'Budżet (opcjonalnie)', manager: 'Kto zarządza teraz?', tenant: 'Najem', timing: 'Kiedy?',
};

export const ESTATE_COPY: Record<'pro_realestate' | 'pro_property', { h1: string; lead: string; ask: string; prepare: string[]; slots: string[] }> = {
  pro_realestate: {
    h1: 'Nieruchomości',
    lead: 'Sprzedaż, wynajem i poszukiwanie mieszkań, domów, działek i lokali. Opisz, z czym przychodzisz, a oddzwonimy, żeby umówić rozmowę.',
    ask: 'Z czym przychodzisz?',
    prepare: ['Numer księgi wieczystej, jeśli jest', 'Metraż i rzut, jeśli go masz', 'Wysokość czynszu lub opłat', 'Kiedy nieruchomość może być wolna'],
    slots: ['Tu numer polisy OC pośrednika, jeśli chcesz go pokazać', 'Tu zasady wynagrodzenia biura', 'Tu zdjęcia i imiona osób z biura', 'Tu adres biura i godziny'],
  },
  pro_property: {
    h1: 'Zarządzanie nieruchomościami',
    lead: 'Wspólnoty mieszkaniowe, mieszkania na wynajem i lokale. Opisz nieruchomość, a przygotujemy ofertę zarządu z jasnym zakresem.',
    ask: 'Czym mamy zarządzać?',
    prepare: ['Adres i liczba lokali', 'Aktualne uchwały i plan gospodarczy wspólnoty', 'Umowy z dostawcami mediów i usług', 'Ostatnie protokoły przeglądów technicznych'],
    slots: ['Tu numer polisy OC zarządcy, jeśli chcesz go pokazać', 'Tu zasady wynagrodzenia', 'Tu zdjęcia i imiona opiekunów nieruchomości', 'Tu adres biura i godziny'],
  },
};

export const LISTING_NOTE = 'Tu pojawią się aktualne oferty biura. Do tego czasu pokazujemy układ na przykładzie, bez prawdziwych nieruchomości.';

export const LISTING_EXAMPLES: { tag: string; glyph: Glyph; title: string; meta: string }[] = [
  { tag: 'Sprzedaż', glyph: 'flat', title: 'Mieszkanie', meta: '— m² · — pokoje · piętro —' },
  { tag: 'Wynajem', glyph: 'shop', title: 'Lokal użytkowy', meta: '— m² · parter' },
  { tag: 'Sprzedaż', glyph: 'house', title: 'Dom', meta: '— m² · działka — m²' },
];

export const MANAGEMENT_SCOPE: { title: string; text: string }[] = [
  { title: 'Rozliczenia', text: 'Zaliczki, media i rozliczenia roczne lokali.' },
  { title: 'Przeglądy techniczne', text: 'Terminy przeglądów i protokoły w jednym miejscu.' },
  { title: 'Zebrania i uchwały', text: 'Przygotowanie zebrań, głosowań i dokumentów.' },
  { title: 'Usterki i naprawy', text: 'Zgłoszenia mieszkańców i kontakt z wykonawcami.' },
  { title: 'Najem', text: 'Umowy, protokoły i kontakt z najemcami.' },
  { title: 'Sprawozdania', text: 'Zestawienia dla wspólnoty albo właściciela.' },
];
