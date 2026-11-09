import type { Niche } from '../niches';

// Landing entries for developers, property traders and owners renting out property.

type Landing = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

const OFFERS_FAQ: [string, string] = ['Czy mogę dodać swoje oferty i ceny?', 'Tak. Wpisujemy tylko dane, które podasz. Niczego nie dopisujemy za Ciebie.'];

export const LANDING: Landing[] = [
  {
    key: 'deweloperzy', path: '/strony-dla-deweloperow/', variant: 'estate_developer', label: 'Deweloperzy',
    title: 'Strony internetowe dla deweloperów | Tovernet',
    description: 'Strona dla dewelopera: klient wskazuje lokal na układzie budynku i wysyła pytanie o ten konkretny lokal.',
    h1: 'Strona dla dewelopera, na której klient pyta o konkretny lokal',
    intro: 'Kupujący chce zobaczyć inwestycję, ceny i dokumenty. Strona pokazuje układ budynku, a zapytanie od razu wskazuje lokal.',
    sample: { display_name: 'Przykładowy Deweloper', legal_name: 'Przykładowy Deweloper sp. z o.o.', city: 'Poznań' },
    needs: [['Wybór na układzie budynku', 'Klient wskazuje lokal, a pytanie trafia z jego numerem.'], ['Miejsce na ceny i prospekt', 'Dokumenty i ceny w jednym miejscu.'], ['Przebieg zakupu', 'Od zapytania po umowę u notariusza.'], ['Działa w telefonie', 'Układ i zapytanie mieszczą się na ekranie telefonu.']],
    faq: [OFFERS_FAQ, ['Czy strona spełni obowiązki informacyjne dewelopera?', 'Strona ma miejsce na ceny i dokumenty. Zakres obowiązków sprawdź ze swoim prawnikiem.']],
  },
  {
    key: 'kupno-sprzedaz-nieruchomosci', path: '/strony-dla-firm-kupna-sprzedazy-nieruchomosci/', variant: 'estate_trade', label: 'Kupno i sprzedaż nieruchomości',
    title: 'Strony dla firm kupujących i sprzedających nieruchomości | Tovernet',
    description: 'Strona dla firmy obracającej nieruchomościami: osobne zapytania od sprzedających i kupujących.',
    h1: 'Strona dla firmy, która kupuje i sprzedaje nieruchomości',
    intro: 'Właściciel chce sprzedać, a kupujący szuka oferty. Strona od razu rozdziela te sprawy i zbiera szczegóły.',
    sample: { display_name: 'Przykładowe Inwestycje', legal_name: 'Przykładowe Inwestycje sp. z o.o.', city: 'Katowice' },
    needs: [['Sprzedaję albo kupuję', 'Dwie sprawy, jeden prosty wybór.'], ['Rodzaj nieruchomości', 'Mieszkanie, dom, działka lub lokal.'], ['Miejsce na oferty', 'Bez ofert strona nadal zbiera propozycje.'], ['Działa w telefonie', 'Zapytanie wyślesz z każdego ekranu.']],
    faq: [OFFERS_FAQ],
  },
  {
    key: 'wynajem-nieruchomosci', path: '/strony-dla-wynajmu-nieruchomosci/', variant: 'estate_rental', label: 'Wynajem nieruchomości',
    title: 'Strony dla firm wynajmujących nieruchomości | Tovernet',
    description: 'Strona dla właściciela lokali na wynajem: wybór lokalu, termin i zapytanie o dostępność.',
    h1: 'Strona dla firmy, która wynajmuje własne lokale',
    intro: 'Najemca chce wiedzieć, co jest dostępne, od kiedy i na jakich warunkach. Strona prowadzi go do pytania o konkretny lokal.',
    sample: { display_name: 'Przykładowe Lokale', legal_name: 'Przykładowe Lokale sp. z o.o.', city: 'Gdynia' },
    needs: [['Wybór lokalu', 'Najemca pyta o konkretny lokal.'], ['Warunki najmu', 'Stawka, kaucja i okres umowy.'], ['Oglądanie', 'Prosta prośba o termin.'], ['Działa w telefonie', 'Zapytanie wyślesz z każdego ekranu.']],
    faq: [OFFERS_FAQ],
  },
];

/** PKD 2025 prefix to variant. 68.31 and 68.32 stay on `pro_*`. */
export const PKD_MAP: Record<string, string> = { '68.11': 'estate_trade', '68.12': 'estate_developer', '68.20': 'estate_rental' };
