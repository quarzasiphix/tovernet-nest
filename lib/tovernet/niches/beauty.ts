// Template content for the beauty concept (PKD 96.21, 96.22, 96.23 and the PKD 2007
// codes 96.02, 96.04). Every service is an example for the company to confirm, and the
// page says so. Nothing here may state prices, durations, free slots, opening hours,
// staff, reviews, results, brands of cosmetics, qualifications or years in business.
// No medical or therapeutic claims: aesthetic medicine and "leczniczy" massage stay out.

import { presentName } from '../construction';

export type BeautyVariantKey = 'beauty_hair' | 'beauty_salon' | 'beauty_spa';

export type BeautyService = { key: string; name: string; text: string };

export type BeautyVariant = {
  key: BeautyVariantKey;
  /** Kind of place, shown above the name. */
  trade: string;
  /** Short display statement: plain part, then the italic part. */
  statement: [string, string];
  lead: string;
  /** Hero object drawn in code. */
  art: 'strands' | 'tips' | 'stones';
  artLabel: string;
  services: BeautyService[];
  /** One extra choice in the booking card that this kind of place needs to plan a visit. */
  extra: { name: string; legend: string; options: string[] };
  placeholder: string;
  /** Shot list for the owner's phone photos. */
  shots: [string, string][];
};

export const BEAUTY_VARIANTS: Record<BeautyVariantKey, BeautyVariant> = {
  beauty_hair: {
    key: 'beauty_hair',
    trade: 'Fryzjer i barber',
    statement: ['Cięcie, kolor,', 'pielęgnacja.'],
    lead: 'Zobacz, co robimy, i umów się tak, jak Ci wygodnie: online, telefonicznie albo zostaw prośbę o termin.',
    art: 'strands',
    artLabel: 'Wzornik koloru włosów',
    services: [
      { key: 'damskie', name: 'Strzyżenie damskie', text: 'Rozmowa, mycie, cięcie i modelowanie.' },
      { key: 'meskie', name: 'Strzyżenie męskie', text: 'Maszynka, nożyczki albo jedno i drugie. Z myciem i stylizacją.' },
      { key: 'broda', name: 'Broda', text: 'Trymowanie, kontur i pielęgnacja zarostu.' },
      { key: 'kolor', name: 'Koloryzacja', text: 'Odrost, jeden kolor albo zmiana koloru. Najpierw rozmowa o efekcie.' },
      { key: 'rozjasnianie', name: 'Rozjaśnianie i refleksy', text: 'Pasemka, balayage, ombre.' },
      { key: 'pielegnacja', name: 'Pielęgnacja', text: 'Zabieg dobrany do stanu włosów i skóry głowy.' },
      { key: 'upiecie', name: 'Upięcie okolicznościowe', text: 'Ślub, studniówka, wieczorne wyjście.' },
    ],
    extra: { name: 'dlugosc', legend: 'Długość włosów', options: ['Krótkie', 'Do ramion', 'Długie', 'Tylko broda'] },
    placeholder: 'Np. chcę zejść z koloru o dwa tony.',
    shots: [
      ['Wejście', 'Witryna albo drzwi od ulicy, żeby łatwo trafić.'],
      ['Stanowisko', 'Fotel i lustro przy dziennym świetle.'],
      ['Detal', 'Narzędzia, kosmetyki, kolor. Bez twarzy klientów.'],
    ],
  },
  beauty_salon: {
    key: 'beauty_salon',
    trade: 'Salon kosmetyczny',
    statement: ['Dłonie, twarz,', 'spojrzenie.'],
    lead: 'Zobacz, co robimy, i umów się tak, jak Ci wygodnie: online, telefonicznie albo zostaw prośbę o termin.',
    art: 'tips',
    artLabel: 'Wzornik kolorów lakieru',
    services: [
      { key: 'hybryda', name: 'Manicure hybrydowy', text: 'Opracowanie paznokci i skórek, kolor hybrydowy.' },
      { key: 'manicure', name: 'Manicure klasyczny', text: 'Kształt, skórki i lakier albo odżywka.' },
      { key: 'pedicure', name: 'Pedicure', text: 'Stopy i paznokcie, z kolorem albo bez.' },
      { key: 'brwi', name: 'Brwi i rzęsy', text: 'Regulacja, henna, laminacja.' },
      { key: 'twarz', name: 'Oczyszczanie twarzy', text: 'Zabieg dobrany do skóry po krótkiej rozmowie.' },
      { key: 'makijaz', name: 'Makijaż', text: 'Dzienny, wieczorowy, ślubny. Także próbny.' },
      { key: 'depilacja', name: 'Depilacja', text: 'Wosk albo pasta cukrowa.' },
    ],
    extra: { name: 'pierwsza', legend: 'Pierwsza wizyta u nas?', options: ['Tak', 'Nie'] },
    placeholder: 'Np. mam hybrydę do zdjęcia, krótkie paznokcie.',
    shots: [
      ['Wejście', 'Witryna albo drzwi od ulicy, żeby łatwo trafić.'],
      ['Stanowisko', 'Stolik albo fotel zabiegowy przy dziennym świetle.'],
      ['Detal', 'Kolory, narzędzia, kosmetyki. Bez twarzy klientek.'],
    ],
  },
  beauty_spa: {
    key: 'beauty_spa',
    trade: 'Masaż i spa',
    statement: ['Masaż, ciepło,', 'cisza.'],
    lead: 'Zobacz, co robimy, i umów się tak, jak Ci wygodnie: online, telefonicznie albo zostaw prośbę o termin. Także na prezent.',
    art: 'stones',
    artLabel: 'Kamienie do masażu',
    services: [
      { key: 'relaks', name: 'Masaż relaksacyjny', text: 'Całe ciało, spokojne tempo, ciepły olej.' },
      { key: 'klasyczny', name: 'Masaż klasyczny', text: 'Plecy, kark i ramiona albo całe ciało.' },
      { key: 'tajski', name: 'Masaż tajski', text: 'Na macie, w wygodnym stroju, bez olejku.' },
      { key: 'kamienie', name: 'Gorące kamienie', text: 'Masaż z użyciem ciepłych kamieni.' },
      { key: 'sauna', name: 'Sauna', text: 'Seans z czasem na odpoczynek po wyjściu.' },
      { key: 'dwoje', name: 'Rytuał dla dwojga', text: 'Dwie osoby w jednym pokoju, w tym samym czasie.' },
      { key: 'bon', name: 'Bon podarunkowy', text: 'Na wybrany zabieg. Do wręczenia albo wysłania.' },
    ],
    extra: { name: 'dla', legend: 'Dla kogo?', options: ['Dla mnie', 'Dla dwóch osób', 'Na prezent'] },
    placeholder: 'Np. masaż dla dwóch osób w sobotę po południu.',
    shots: [
      ['Wejście', 'Witryna albo drzwi od ulicy, żeby łatwo trafić.'],
      ['Pokój', 'Stół do masażu, światło, tekstylia.'],
      ['Detal', 'Olejki, ręczniki, kamienie. Bez twarzy gości.'],
    ],
  },
};

export const beautyVariant = (variant: string): BeautyVariant =>
  BEAUTY_VARIANTS[variant as BeautyVariantKey] ?? BEAUTY_VARIANTS.beauty_salon;

export const WHEN = ['Jak najszybciej', 'W tym tygodniu', 'W przyszłym tygodniu', 'Inny termin'];
export const DAYPART = ['Rano', 'Po południu', 'Wieczorem', 'Obojętnie'];

export const STEPS: [string, string][] = [
  ['Umawiasz się, jak Ci wygodnie', 'Online, telefonicznie albo przez prośbę o termin na tej stronie.'],
  ['Zaczynamy od rozmowy', 'Mówisz, czego oczekujesz. Mówimy, co da się zrobić.'],
  ['Cena przed zabiegiem', 'Wiesz, ile zapłacisz, zanim zaczniemy.'],
];

export const HOURS = ['Poniedziałek–piątek', 'Sobota', 'Niedziela'];

// Shade codes follow the usual hair colour numbering (level.tone). They label the drawing,
// not a product range.
export const STRANDS: { code: string; c: string; d: string }[] = [
  { code: '10.21', c: '#ECE0C9', d: '#CDB998' },
  { code: '9.3', c: '#DCC08E', d: '#B8945C' },
  { code: '8.0', c: '#BC9A6C', d: '#8F6E45' },
  { code: '7.43', c: '#B0603A', d: '#7C3B20' },
  { code: '6.0', c: '#86603F', d: '#5C3F27' },
  { code: '5.62', c: '#7A3236', d: '#4E1C21' },
  { code: '4.0', c: '#5A3C2A', d: '#38241A' },
  { code: '3.0', c: '#3B2A21', d: '#211712' },
  { code: '1.0', c: '#1E1816', d: '#0C0A09' },
];

export const TIPS: { c: string; d: string }[] = [
  { c: '#F1E4DC', d: '#D9C4B8' },
  { c: '#E8C5B8', d: '#C99C8C' },
  { c: '#D69A8E', d: '#B27063' },
  { c: '#C2414A', d: '#8E1F2A' },
  { c: '#8E1B2C', d: '#5C0E1A' },
  { c: '#5B1E35', d: '#36101F' },
  { c: '#B9A2B8', d: '#8E7590' },
  { c: '#2A2224', d: '#110D0E' },
  { c: '#F7F1EC', d: '#DCD2CA' },
];

const SMALL = new Set(['and', 'of', 'the', 'de', 'la', 'i', 'w', 'z', 'na', 'by', 'for']);

/** presentName, plus lower-case joining words, which matter in salon names ("House of Barbers"). */
export function beautyName(name: string): string {
  return presentName(name)
    .split(' ')
    .map((w, i) => (i > 0 && SMALL.has(w.toLocaleLowerCase('pl')) ? w.toLocaleLowerCase('pl') : w))
    .join(' ')
    // Double surnames: "Wiśniewska-kowalczyk" becomes "Wiśniewska-Kowalczyk".
    .replace(/-([a-ząćęłńóśźż])/g, (_, c: string) => `-${c.toLocaleUpperCase('pl')}`);
}
