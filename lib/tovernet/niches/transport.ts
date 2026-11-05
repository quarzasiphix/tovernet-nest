// Template content for the road transport concept: freight (49.41, forwarding 52.31),
// removals (49.42) and couriers (53.20). Concept card: ksiegai/docs/plans/tovernet, transport.
//
// Nothing here may state a fleet, routes, licences, OCP or other insurance, ADR,
// certificates, years in business, reviews or completed transports. Radar knows none of
// them, so the page shows them as dashed slots the owner fills ("Tu wpiszesz ...").
// Cargo types, vehicle types and extra services are examples and are labelled as such.
// Freight copy must also stay true for a forwarder without own trucks: never "nasze auta".

export type TransportKind = 'freight' | 'moving' | 'courier';

export type TransportField =
  | { t: 'text'; name: string; label: string; placeholder?: string; auto?: string; mode?: 'text' | 'tel' | 'email'; optional?: boolean; route?: 'skad' | 'dokad' }
  | { t: 'choice'; name: string; legend: string; options: string[]; multi?: boolean; note?: string }
  | { t: 'area'; name: string; label: string; placeholder: string };

/** One numbered box of the request, like a field group on a consignment note. */
export type TransportBox = { n: string; title: string; need: string[]; fields: TransportField[] };

export type TransportVariant = {
  kind: TransportKind;
  /** Vehicle drawn in the hero. Illustrative, and labelled so. */
  vehicle: 'trailer' | 'box' | 'van';
  /** The page's h1, painted on the vehicle under the company name. */
  trade: string;
  lead: string;
  from: { label: string; placeholder: string };
  to: { label: string; placeholder: string };
  quickCta: string;
  formTitle: string;
  formSub: string;
  boxes: TransportBox[];
  /** Name of the required contact field, validated as phone (or e-mail when `contactMail`). */
  contact: string;
  contactMail: boolean;
  submit: string;
  sheetTitle: string;
  sheetSub: string;
  slots: [string, string][];
  listTitle: string;
  listNote: string;
  list: [string, string][];
  stepsTitle: string;
  steps: [string, string][];
  footSlot: string;
};

const CONTACT_BOX = (n: string, uwagi: string, withCompany: boolean): TransportBox => ({
  n,
  title: 'Kontakt',
  need: ['kontakt'],
  fields: [
    ...(withCompany ? [{ t: 'text', name: 'firma', label: 'Firma', auto: 'organization', optional: true } as TransportField] : []),
    { t: 'text', name: 'osoba', label: 'Imię i nazwisko', auto: 'name', optional: true },
    { t: 'text', name: 'kontakt', label: 'Telefon lub e-mail', auto: 'tel', mode: 'text' },
    { t: 'area', name: 'uwagi', label: 'Uwagi (opcjonalnie)', placeholder: uwagi },
  ],
});

export const TRANSPORT_VARIANTS: Record<string, TransportVariant> = {
  transport_freight: {
    kind: 'freight',
    vehicle: 'trailer',
    trade: 'Transport drogowy towarów',
    lead: 'Masz ładunek do przewiezienia? Wpisz trasę, potem termin, ładunek i auto. Odpowiemy, czy weźmiemy ten transport i za ile.',
    from: { label: 'Załadunek', placeholder: 'Miejscowość lub kod pocztowy' },
    to: { label: 'Rozładunek', placeholder: 'Miejscowość lub kod pocztowy' },
    quickCta: 'Wyceń przewóz',
    formTitle: 'Zapytanie o transport',
    formSub: 'Pięć pól, jak w zleceniu. Im więcej szczegółów, tym dokładniejsza wycena.',
    boxes: [
      { n: '01', title: 'Załadunek', need: ['skad'], fields: [
        { t: 'text', name: 'skad', label: 'Miejsce załadunku', placeholder: 'Miejscowość, kod pocztowy, kraj', route: 'skad' },
        { t: 'text', name: 'data_zal', label: 'Data załadunku', placeholder: 'np. 14.11, rano', optional: true },
      ] },
      { n: '02', title: 'Rozładunek', need: ['dokad'], fields: [
        { t: 'text', name: 'dokad', label: 'Miejsce rozładunku', placeholder: 'Miejscowość, kod pocztowy, kraj', route: 'dokad' },
        { t: 'text', name: 'data_roz', label: 'Termin rozładunku', placeholder: 'np. do 16.11 albo elastycznie', optional: true },
      ] },
      { n: '03', title: 'Ładunek', need: ['ladunek'], fields: [
        { t: 'choice', name: 'ladunek', legend: 'Co jedzie?', options: ['Palety', 'Drobnica', 'Całe auto', 'Ładunek nietypowy'] },
        { t: 'text', name: 'ilosc', label: 'Ilość i waga', placeholder: 'np. 12 palet EUR, ok. 6 t', optional: true },
      ] },
      { n: '04', title: 'Auto', need: ['auto'], fields: [
        { t: 'choice', name: 'auto', legend: 'Jakiego auta potrzebujesz?', options: ['Plandeka', 'Chłodnia', 'Bus do 3,5 t', 'Solówka', 'Bez znaczenia'], note: 'Przykładowe rodzaje aut, do potwierdzenia przez firmę' },
      ] },
      CONTACT_BOX('05', 'np. załadunek z rampy, towar nie do piętrowania, potrzebna winda', true),
    ],
    contact: 'kontakt',
    contactMail: true,
    submit: 'Wyślij zapytanie',
    sheetTitle: 'Dane firmy',
    sheetSub: 'To, o co zleceniodawca pyta przed pierwszym zleceniem, w jednym miejscu.',
    slots: [
      ['Licencja na transport drogowy', 'Tu wpiszesz numer licencji'],
      ['Ubezpieczenie OC przewoźnika lub spedytora', 'Tu wpiszesz ubezpieczyciela i sumę'],
      ['Auta', 'Tu wpiszesz rodzaje aut i ładowność'],
      ['Kierunki', 'Tu wpiszesz trasy, na których jeździsz'],
      ['ADR', 'Tylko jeśli masz uprawnienia: tu je wpiszesz'],
    ],
    listTitle: 'Co wozimy',
    listNote: 'Przykładowy zakres, do potwierdzenia przez firmę',
    list: [
      ['Całe auta', 'Jeden ładunek, jedno auto, z punktu do punktu.'],
      ['Ładunki częściowe', 'Kilka palet, gdy nie potrzebujesz całego auta.'],
      ['Palety i drobnica', 'Towar na paletach, w kartonach i paczkach.'],
      ['Ładunki nietypowe', 'Maszyny i towar o nietypowych wymiarach, po wcześniejszym uzgodnieniu.'],
    ],
    stepsTitle: 'Od zapytania do rozładunku',
    steps: [
      ['Zapytanie', 'Trasa, termin i ładunek. Formularz albo telefon.'],
      ['Odpowiedź', 'Mówimy wprost, czy możemy wziąć ten transport.'],
      ['Wycena', 'Znasz cenę, zanim potwierdzisz zlecenie.'],
      ['Przewóz', 'Jedna osoba do kontaktu od załadunku do rozładunku.'],
    ],
    footSlot: 'Tu wpiszesz numer licencji',
  },

  transport_moving: {
    kind: 'moving',
    vehicle: 'box',
    trade: 'Przeprowadzki',
    lead: 'Powiedz, skąd, dokąd i co jedzie. Wycenimy przeprowadzkę, zanim cokolwiek podniesiemy.',
    from: { label: 'Skąd', placeholder: 'Miasto, dzielnica lub adres' },
    to: { label: 'Dokąd', placeholder: 'Miasto, dzielnica lub adres' },
    quickCta: 'Wyceń przeprowadzkę',
    formTitle: 'Wycena przeprowadzki',
    formSub: 'Pytania, które i tak padną przez telefon. Odpowiesz na nie raz, w swoim tempie.',
    boxes: [
      { n: '01', title: 'Skąd', need: ['skad'], fields: [
        { t: 'text', name: 'skad', label: 'Adres lub dzielnica', placeholder: 'np. Mokotów, ul. Puławska', route: 'skad', auto: 'off' },
        { t: 'choice', name: 'pietro_z', legend: 'Piętro', options: ['Parter', 'Piętro, jest winda', 'Piętro, bez windy'] },
      ] },
      { n: '02', title: 'Dokąd', need: ['dokad'], fields: [
        { t: 'text', name: 'dokad', label: 'Adres lub dzielnica', placeholder: 'np. Piaseczno', route: 'dokad', auto: 'off' },
        { t: 'choice', name: 'pietro_do', legend: 'Piętro', options: ['Parter', 'Piętro, jest winda', 'Piętro, bez windy'] },
      ] },
      { n: '03', title: 'Co jedzie', need: ['zakres'], fields: [
        { t: 'choice', name: 'zakres', legend: 'Co przewozimy?', options: ['Kawalerka', '2–3 pokoje', 'Dom', 'Biuro', 'Kilka mebli'] },
        { t: 'text', name: 'duze', label: 'Największe rzeczy', placeholder: 'np. szafa trzydrzwiowa, pianino, lodówka', optional: true },
      ] },
      { n: '04', title: 'Termin', need: ['termin'], fields: [
        { t: 'text', name: 'termin', label: 'Kiedy?', placeholder: 'np. 30.11 albo koniec miesiąca' },
        { t: 'choice', name: 'pomoc', legend: 'Pomoc przy', options: ['Pakowaniu', 'Demontażu mebli', 'Wnoszeniu'], multi: true, note: 'Przykładowe usługi, do potwierdzenia przez firmę' },
      ] },
      { n: '05', title: 'Kontakt', need: ['kontakt'], fields: [
        { t: 'text', name: 'osoba', label: 'Imię', auto: 'given-name', optional: true },
        { t: 'text', name: 'kontakt', label: 'Telefon', auto: 'tel', mode: 'tel' },
        { t: 'area', name: 'uwagi', label: 'Uwagi (opcjonalnie)', placeholder: 'np. wąska klatka, parking tylko na podwórku' },
      ] },
    ],
    contact: 'kontakt',
    contactMail: false,
    submit: 'Poproś o wycenę',
    sheetTitle: 'Dane firmy',
    sheetSub: 'Zanim wpuścisz kogoś do domu, chcesz wiedzieć, z kim masz do czynienia.',
    slots: [
      ['Ubezpieczenie mienia w transporcie', 'Tu wpiszesz ubezpieczyciela, jeśli je masz'],
      ['Auta', 'Tu wpiszesz, czym jeździsz'],
      ['Obszar', 'Tu wpiszesz, gdzie robisz przeprowadzki'],
    ],
    listTitle: 'Do wyceny przyda się',
    listNote: 'Nie musisz mieć wszystkiego',
    list: [
      ['Lista większych rzeczy', 'Meble, sprzęt AGD, rzeczy ciężkie albo delikatne.'],
      ['Zdjęcia pokoi', 'Kilka zdjęć z telefonu wystarczy, żeby ocenić, ile tego jest.'],
      ['Piętro i winda', 'Pod oboma adresami.'],
      ['Dojazd', 'Czy auto podjedzie pod klatkę albo bramę.'],
    ],
    stepsTitle: 'Jak to idzie',
    steps: [
      ['Opis', 'Skąd, dokąd i co jedzie.'],
      ['Szczegóły', 'Dopytujemy o to, czego brakuje. Czasem prosimy o zdjęcia.'],
      ['Wycena', 'Znasz cenę przed dniem przeprowadzki.'],
      ['Przeprowadzka', 'Jedna osoba do kontaktu przez cały dzień.'],
    ],
    footSlot: 'Tu wpiszesz adres biura, jeśli go masz',
  },

  transport_courier: {
    kind: 'courier',
    vehicle: 'van',
    trade: 'Przesyłki kurierskie',
    lead: 'Podaj, skąd odebrać i dokąd zawieźć. Oddzwonimy z ceną i terminem odbioru.',
    from: { label: 'Odbiór', placeholder: 'Adres lub dzielnica' },
    to: { label: 'Doręczenie', placeholder: 'Adres lub dzielnica' },
    quickCta: 'Zapytaj o odbiór',
    formTitle: 'Zapytanie o kuriera',
    formSub: 'Cztery pola. Przy stałych dostawach zaznacz, jak często.',
    boxes: [
      { n: '01', title: 'Odbiór', need: ['skad'], fields: [
        { t: 'text', name: 'skad', label: 'Adres odbioru', placeholder: 'Adres lub dzielnica', route: 'skad', auto: 'off' },
        { t: 'choice', name: 'kiedy', legend: 'Kiedy odebrać?', options: ['Jak najszybciej', 'Dziś', 'Jutro', 'Do ustalenia'] },
      ] },
      { n: '02', title: 'Doręczenie', need: ['dokad'], fields: [
        { t: 'text', name: 'dokad', label: 'Adres doręczenia', placeholder: 'Adres lub dzielnica', route: 'dokad', auto: 'off' },
        { t: 'text', name: 'dokiedy', label: 'Do kiedy doręczyć?', placeholder: 'np. dziś do 16:00', optional: true },
      ] },
      { n: '03', title: 'Przesyłka', need: ['co'], fields: [
        { t: 'choice', name: 'co', legend: 'Co wysyłasz?', options: ['Dokumenty', 'Paczka', 'Kilka paczek', 'Paleta'] },
        { t: 'choice', name: 'czestotliwosc', legend: 'Jak często?', options: ['Jednorazowo', 'Kilka razy w tygodniu', 'Codziennie'] },
      ] },
      CONTACT_BOX('04', 'np. odbiór z recepcji, przesyłka do podpisu', true),
    ],
    contact: 'kontakt',
    contactMail: true,
    submit: 'Wyślij zapytanie',
    sheetTitle: 'Dane firmy',
    sheetSub: 'Kto odbierze przesyłkę i do kogo dzwonić, gdy coś się zmieni.',
    slots: [
      ['Obszar doręczeń', 'Tu wpiszesz miasta i dzielnice'],
      ['Godziny przyjmowania zleceń', 'Tu wpiszesz, kiedy przyjmujesz zlecenia'],
      ['Auta', 'Tu wpiszesz, czym jeździsz'],
      ['Ubezpieczenie przesyłek', 'Tu wpiszesz ubezpieczyciela, jeśli je masz'],
    ],
    listTitle: 'Co dowozimy',
    listNote: 'Przykładowy zakres, do potwierdzenia przez firmę',
    list: [
      ['Dokumenty', 'Umowy, faktury, dokumenty do podpisu.'],
      ['Paczki', 'Z firmy do klienta albo między oddziałami.'],
      ['Dostawy dla sklepów', 'Zamówienia do klientów w mieście i okolicy.'],
      ['Stałe odbiory', 'Ustalone dni i godziny, bez zamawiania za każdym razem.'],
    ],
    stepsTitle: 'Jak to idzie',
    steps: [
      ['Zapytanie', 'Adres odbioru i doręczenia.'],
      ['Potwierdzenie', 'Oddzwaniamy z ceną i terminem odbioru.'],
      ['Odbiór', 'Kierowca odbiera przesyłkę.'],
      ['Doręczenie', 'Dajemy znać, kiedy przesyłka dotrze.'],
    ],
    footSlot: 'Tu wpiszesz adres biura, jeśli go masz',
  },
};

export function transportVariant(variant: string): TransportVariant {
  return TRANSPORT_VARIANTS[variant] ?? TRANSPORT_VARIANTS.transport_freight;
}

/** Livery size step: the name is painted on the vehicle and must fit any registry name. */
export function liverySize(name: string): 'xl' | 'l' | 'm' | 's' {
  const n = name.length;
  if (n <= 14) return 'xl';
  if (n <= 24) return 'l';
  if (n <= 40) return 'm';
  return 's';
}

/** Phone (9+ digits) or, when allowed, an e-mail address. */
export function validContact(value: string, allowMail: boolean): boolean {
  const v = value.trim();
  if (allowMail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return true;
  return v.replace(/\D/g, '').length >= 9;
}
