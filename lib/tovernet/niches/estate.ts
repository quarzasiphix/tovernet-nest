// Template content for real estate owners: developers (`estate_developer`), firms buying and
// selling property (`estate_trade`) and firms renting out their own property (`estate_rental`).
// Agencies and managers are `pro_*`. Concept card: ksiegai docs/plans/tovernet/23-niche-round-2.md.
// We know registry facts only: no investments, prices, areas, dates or locations are stated.

export type EstateContent = {
  kicker: string;
  lead: string;
  planTitle: string;
  planNote: string;
  /** Top row first, as a building is read. */
  rows: string[][];
  pickedLabel: string;
  intents: string[];
  sections: { title: string; text: string }[];
  stepsTitle: string;
  steps: [string, string][];
  placeholder: string;
};

const floors = (prefixes: string[]) => prefixes.map((f) => ['1', '2', '3', '4'].map((n) => `${f}.${n}`));
const STEPS_NOTE = 'Przykładowy przebieg. Dopasujemy go do tego, jak naprawdę pracujesz.';
export { STEPS_NOTE };

const CONTENT: Record<string, EstateContent> = {
  estate_developer: {
    kicker: 'Deweloper',
    lead: 'Wskaż lokal na rzucie i zapytaj o szczegóły. Odpowiemy na pytania o ten konkretny lokal.',
    planTitle: 'Przykładowy układ budynku',
    planNote: 'Układ poglądowy. Tu pojawią się Twoje lokale, metraże i ceny.',
    rows: floors(['3', '2', '1', '0']),
    pickedLabel: 'Lokal',
    intents: ['Chcę kupić', 'Pytam o termin', 'Pytam o finansowanie'],
    sections: [
      { title: 'Inwestycja', text: 'Tu nazwa, adres i opis inwestycji oraz wizualizacje.' },
      { title: 'Ceny i dokumenty', text: 'Tu ceny lokali i prospekt informacyjny.' },
      { title: 'Okolica', text: 'Tu mapa i to, co jest w pobliżu.' },
    ],
    stepsTitle: 'Jak wygląda zakup',
    steps: [['Zapytanie', 'Wskazujesz lokal albo opisujesz, czego szukasz.'], ['Rozmowa', 'Omawiamy lokal, dokumenty i terminy.'], ['Rezerwacja', 'Jeśli lokal Ci odpowiada, ustalamy warunki.'], ['Umowa', 'Umowa u notariusza.']],
    placeholder: 'Np. ile osób będzie mieszkać, czy potrzebny jest balkon lub miejsce postojowe.',
  },
  estate_trade: {
    kicker: 'Kupno i sprzedaż nieruchomości',
    lead: 'Wybierz rodzaj nieruchomości i napisz, czy chcesz kupić, czy sprzedać. Odpowiemy konkretnie.',
    planTitle: 'Czego dotyczy sprawa?',
    planNote: 'Rodzaje poglądowe. Dopasujemy je do tego, czym się zajmujesz.',
    rows: [['Mieszkanie', 'Dom'], ['Działka', 'Lokal użytkowy']],
    pickedLabel: 'Nieruchomość',
    intents: ['Chcę sprzedać', 'Chcę kupić', 'Inna sprawa'],
    sections: [
      { title: 'Aktualne oferty', text: 'Tu nieruchomości na sprzedaż. Bez nich strona zbiera propozycje.' },
      { title: 'Czego szukamy', text: 'Tu rodzaje i okolice nieruchomości, które kupujesz.' },
      { title: 'O firmie', text: 'Tu kilka zdań o firmie i osoby do kontaktu.' },
    ],
    stepsTitle: 'Jak to przebiega',
    steps: [['Wiadomość', 'Rodzaj nieruchomości i kilka szczegółów.'], ['Oględziny', 'Umawiamy się na miejscu.'], ['Propozycja', 'Warunki podane na piśmie.'], ['Umowa', 'Akt notarialny.']],
    placeholder: 'Np. lokalizacja, metraż i stan nieruchomości.',
  },
  estate_rental: {
    kicker: 'Wynajem nieruchomości',
    lead: 'Wskaż lokal i napisz, od kiedy i na jak długo go potrzebujesz.',
    planTitle: 'Przykładowy układ lokali',
    planNote: 'Układ poglądowy. Tu pojawią się Twoje lokale, metraże i stawki.',
    rows: floors(['2', '1', '0']),
    pickedLabel: 'Lokal',
    intents: ['Najem długoterminowy', 'Najem biura lub lokalu', 'Pytanie o dostępność'],
    sections: [
      { title: 'Dostępne lokale', text: 'Tu lokale do wynajęcia ze zdjęciami i stawkami.' },
      { title: 'Warunki najmu', text: 'Tu kaucja, okres umowy i opłaty.' },
      { title: 'Lokalizacja', text: 'Tu adres, mapa i dojazd.' },
    ],
    stepsTitle: 'Jak wygląda wynajem',
    steps: [['Zapytanie', 'Lokal i termin.'], ['Oglądanie', 'Umawiamy termin na miejscu.'], ['Warunki', 'Stawka, kaucja i okres najmu.'], ['Umowa', 'Podpisanie umowy i przekazanie lokalu.']],
    placeholder: 'Np. od kiedy, na jak długo i ile osób lub stanowisk.',
  },
};

export const estateContent = (variant: string): EstateContent => CONTENT[variant] ?? CONTENT.estate_developer;
