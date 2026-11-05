import type { ConstructionVariantKey } from './api';

// Template content for construction and trades. Services are examples for the company
// to confirm, and the page says so. Nothing here may state reviews, completed projects,
// qualifications, certificates, staff numbers or years in business.

export type ConstructionVariant = {
  trade: string;
  headline: (city: string | null) => string;
  lead: string;
  cta: string;
  services: { title: string; text: string }[];
  steps: string[];
  formTitle: string;
  formHint: string;
  theme: { bg: string; surface: string; ink: string; muted: string; accent: string; onAccent: string; line: string };
  art: 'frame' | 'pipes' | 'circuit' | 'walls' | 'road' | 'tools';
};

const where = (city: string | null) => (city ? `: ${city} i okolice` : '');

export const CONSTRUCTION_VARIANTS: Record<ConstructionVariantKey, ConstructionVariant> = {
  general: {
    trade: 'Firma budowlana',
    headline: (c) => `Budowa i remonty${where(c)}`,
    lead: 'Jasny zakres, wycena przed rozpoczęciem prac i jeden kontakt przez całą realizację.',
    cta: 'Poproś o wycenę',
    services: [
      { title: 'Budowa domów', text: 'Od stanu zerowego po wybrany etap realizacji.' },
      { title: 'Roboty murarskie i konstrukcyjne', text: 'Ściany, stropy i elementy nośne według projektu.' },
      { title: 'Remonty i przebudowy', text: 'Zmiana układu, modernizacja i odświeżenie budynku.' },
      { title: 'Prace wykończeniowe', text: 'Domknięcie inwestycji pod klucz lub wybranych etapów.' },
    ],
    steps: ['Opisujesz inwestycję', 'Oględziny i ustalenie zakresu', 'Pisemna wycena', 'Termin i realizacja'],
    formTitle: 'Opisz swoją inwestycję',
    formHint: 'Lokalizacja, rodzaj prac, planowany termin.',
    theme: { bg: '#15171a', surface: '#1f2226', ink: '#f5f3ee', muted: '#a8a9a6', accent: '#f26a1b', onAccent: '#15171a', line: '#34383d' },
    art: 'frame',
  },
  infrastructure: {
    trade: 'Roboty inżynieryjne',
    headline: (c) => `Roboty ziemne i infrastruktura${where(c)}`,
    lead: 'Dla inwestorów, którzy potrzebują konkretnego zakresu, harmonogramu i wyceny.',
    cta: 'Wyślij zapytanie ofertowe',
    services: [
      { title: 'Roboty ziemne', text: 'Wykopy, niwelacja i przygotowanie terenu.' },
      { title: 'Drogi i nawierzchnie', text: 'Podbudowy, nawierzchnie i place manewrowe.' },
      { title: 'Sieci i przyłącza', text: 'Prace liniowe i przyłącza według projektu.' },
      { title: 'Zagospodarowanie terenu', text: 'Odwodnienie, ogrodzenia i wjazdy.' },
    ],
    steps: ['Przesyłasz dokumentację', 'Analiza zakresu', 'Oferta i harmonogram', 'Realizacja'],
    formTitle: 'Zapytanie ofertowe',
    formHint: 'Rodzaj inwestycji, lokalizacja, dostępna dokumentacja.',
    theme: { bg: '#10222e', surface: '#16303f', ink: '#eef4f7', muted: '#9db3bf', accent: '#f2c230', onAccent: '#10222e', line: '#2a4757' },
    art: 'road',
  },
  finishing: {
    trade: 'Wykończenia wnętrz',
    headline: (c) => `Wykończenia wnętrz${where(c)}`,
    lead: 'Mieszkania, domy i lokale. Ustalamy zakres, materiały i termin, zanim zaczną się prace.',
    cta: 'Umów wycenę',
    services: [
      { title: 'Malowanie i gładzie', text: 'Przygotowanie ścian i sufitów, wykończenie powierzchni.' },
      { title: 'Płytki i łazienki', text: 'Układanie okładzin i kompleksowe wykończenie łazienki.' },
      { title: 'Podłogi', text: 'Panele, deska, wylewki i listwy.' },
      { title: 'Zabudowy i sufity', text: 'Zabudowy z płyt, sufity podwieszane, drobna stolarka.' },
    ],
    steps: ['Metraż i zakres', 'Pomiar na miejscu', 'Wycena z podziałem na prace', 'Termin rozpoczęcia'],
    formTitle: 'Opowiedz o swoim wnętrzu',
    formHint: 'Metraż, które pomieszczenia, kiedy chcesz zacząć.',
    theme: { bg: '#f3eee6', surface: '#fbf8f3', ink: '#2a2420', muted: '#74695f', accent: '#a9502f', onAccent: '#fbf8f3', line: '#ddd3c5' },
    art: 'walls',
  },
  electrical: {
    trade: 'Instalacje elektryczne',
    headline: (c) => `Elektryk${where(c)}`,
    lead: 'Nowe instalacje, modernizacje i usuwanie usterek. Powiedz, co się dzieje, a oddzwonimy z terminem.',
    cta: 'Zgłoś zlecenie',
    services: [
      { title: 'Instalacje w nowych budynkach', text: 'Projektowany rozkład obwodów i osprzętu.' },
      { title: 'Wymiana starej instalacji', text: 'Modernizacja w mieszkaniach i domach.' },
      { title: 'Tablice rozdzielcze', text: 'Montaż i modernizacja rozdzielnic.' },
      { title: 'Usterki', text: 'Lokalizacja i usuwanie awarii.' },
    ],
    steps: ['Opisujesz problem', 'Ustalamy termin', 'Wycena przed pracą', 'Wykonanie'],
    formTitle: 'Co trzeba zrobić?',
    formHint: 'Rodzaj budynku, adres lub okolica, pilność.',
    theme: { bg: '#101214', surface: '#1a1d21', ink: '#f7f7f2', muted: '#a3a6a8', accent: '#ffd21f', onAccent: '#101214', line: '#2e3237' },
    art: 'circuit',
  },
  plumbing_hvac: {
    trade: 'Instalacje sanitarne i ogrzewanie',
    headline: (c) => `Hydraulika i ogrzewanie${where(c)}`,
    lead: 'Woda, kanalizacja, ogrzewanie i wentylacja: montaż, wymiana i serwis.',
    cta: 'Zgłoś zlecenie',
    services: [
      { title: 'Instalacje wodno-kanalizacyjne', text: 'Nowe instalacje i przeróbki.' },
      { title: 'Ogrzewanie', text: 'Montaż i wymiana źródeł ciepła oraz grzejników.' },
      { title: 'Klimatyzacja i wentylacja', text: 'Dobór i montaż urządzeń.' },
      { title: 'Awarie i serwis', text: 'Przecieki, zatory, przeglądy urządzeń.' },
    ],
    steps: ['Opisujesz potrzebę', 'Ustalamy termin wizyty', 'Wycena', 'Montaż lub naprawa'],
    formTitle: 'W czym możemy pomóc?',
    formHint: 'Rodzaj budynku, okolica, czy to awaria.',
    theme: { bg: '#0c2a33', surface: '#123742', ink: '#eaf6f7', muted: '#93b7bd', accent: '#39c6c0', onAccent: '#0c2a33', line: '#22505c' },
    art: 'pipes',
  },
  specialist: {
    trade: 'Roboty specjalistyczne',
    headline: (c) => `Roboty budowlane specjalistyczne${where(c)}`,
    lead: 'Konkretny zakres prac dla inwestorów prywatnych i firm.',
    cta: 'Poproś o wycenę',
    services: [
      { title: 'Roboty specjalistyczne', text: 'Tu wpiszemy dokładny zakres Twoich usług.' },
      { title: 'Prace dla firm budowlanych', text: 'Podwykonawstwo wybranych etapów.' },
      { title: 'Zlecenia prywatne', text: 'Realizacje dla właścicieli domów i lokali.' },
    ],
    steps: ['Opisujesz zakres', 'Oględziny', 'Wycena', 'Realizacja'],
    formTitle: 'Opisz zakres prac',
    formHint: 'Rodzaj prac, lokalizacja, termin.',
    theme: { bg: '#1c1b1f', surface: '#27262b', ink: '#f4f2ed', muted: '#a9a7a3', accent: '#e8b04a', onAccent: '#1c1b1f', line: '#3a393f' },
    art: 'tools',
  },
};

/** "OBERON SERWIS" becomes "Oberon Serwis"; short tokens like "ABC" stay as filed. */
// Polish joining words stay lower case inside a name ("Pośrednictwo i Obrót").
const JOINERS = new Set(['i', 'z', 'w', 'we', 'na', 'do', 'od', 'dla', 'o', 'oraz', 'a', 'u', 'ze', 'pod', 'nad', 'przy', 'of', 'and', 'the']);
const capital = (w: string) => w.charAt(0).toLocaleUpperCase('pl') + w.slice(1).toLocaleLowerCase('pl');

/** Registry names are upper case: "PRZEDSIĘBIORSTWO NOWAK-WIŚNIEWSKI" becomes "Przedsiębiorstwo Nowak-Wiśniewski".
 *  Short words other than joiners are kept as filed (acronyms such as "ABC"). */
export function presentName(name: string): string {
  return name
    .split(/\s+/)
    .map((word, i) => {
      // Leading and trailing punctuation (quotes, brackets) stay as they are.
      const m = /^([^0-9A-Za-zÀ-ž]*)(.*?)([^0-9A-Za-zÀ-ž]*)$/.exec(word);
      const [, pre, core, post] = m ?? ['', '', word, ''];
      const lower = core.toLocaleLowerCase('pl');
      if (i > 0 && JOINERS.has(lower)) return pre + lower + post;
      if (core.length <= 3) return pre + core + post;
      return pre + core.split('-').map((part) => (part.length <= 1 ? part : capital(part))).join('-') + post;
    })
    .join(' ');
}

export function presentCity(city: string | null): string | null {
  return city ? presentName(city.length <= 3 ? city.charAt(0) + city.slice(1).toLocaleLowerCase('pl') : city) : null;
}
