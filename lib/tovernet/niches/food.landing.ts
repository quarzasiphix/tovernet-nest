import type { Niche } from '../niches';

// Landing entries for the food service concept, in the `Niche` shape. `key` and `variant`
// are plain strings until the integrator adds them to `NicheKey` and `VariantKey`.
// `faq` is without COMMON_FAQ; the integrator appends it.

type FoodLanding = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

export const LANDING: FoodLanding[] = [
  {
    key: 'restauracje', path: '/strony-dla-restauracji/', variant: 'food_restaurant', label: 'Restauracje i bistra',
    title: 'Strony internetowe dla restauracji | Tovernet',
    description: 'Strona dla restauracji: karta, godziny otwarcia, dojazd i rezerwacja stolika z telefonu. Zobacz przykład.',
    h1: 'Strona dla restauracji, na której gość od razu znajdzie kartę, godziny i stolik',
    intro: 'Ktoś stoi na ulicy albo wybiera, gdzie zjeść wieczorem. Chce zobaczyć kartę, sprawdzić, czy jesteś otwarty, i trafić pod adres. Strona daje mu to na pierwszym ekranie telefonu.',
    sample: { display_name: 'Przykładowa Kuchnia', legal_name: 'Przykładowa Kuchnia sp. z o.o.', city: 'Kraków' },
    needs: [
      ['Karta, nie zdjęcie karty', 'Dania i ceny jako tekst, czytelne na telefonie i łatwe do zmiany. Bez PDF-a, który trzeba powiększać.'],
      ['Godziny i dojazd na wierzchu', 'Dzisiejsze godziny w nagłówku, pełny tydzień, adres i mapa niżej.'],
      ['Rezerwacja stolika', 'Dzień, godzina i liczba osób w kilku dotknięciach. Większe grupy od razu proszą o kontakt.'],
      ['Telefon i zamówienia na wynos', 'Klikalny numer, a jeśli korzystasz z zamówień online, link w widocznym miejscu.'],
    ],
    faq: [
      ['Czy podłączycie mój system rezerwacji albo zamówień online?', 'Możemy umieścić link do narzędzia, z którego już korzystasz. Sam formularz rezerwacji wysyła zgłoszenie do Ciebie, bez dodatkowego systemu.'],
      ['Czy zrobicie zdjęcia potraw?', 'Nie, fotografia nie jest częścią pakietów. Strona jest zaprojektowana tak, żeby dobrze wyglądała ze zdjęciami z telefonu, a do tego czasu działa bez nich.'],
    ],
  },
  {
    key: 'kawiarnie', path: '/strony-dla-kawiarni/', variant: 'food_cafe', label: 'Kawiarnie i bary',
    title: 'Strony internetowe dla kawiarni | Tovernet',
    description: 'Strona dla kawiarni: menu, godziny otwarcia, dojazd i rezerwacja miejsca dla grupy. Zobacz przykład.',
    h1: 'Strona dla kawiarni, z której od razu wiadomo, co podajesz i do której jesteś otwarty',
    intro: 'Kawiarnię wybiera się po drodze, z telefonu. Gość chce zobaczyć menu, godziny i adres, a czasem zarezerwować miejsce dla kilku osób. Tak układamy stronę.',
    sample: { display_name: 'Przykładowa Kawiarnia', legal_name: 'Przykładowa Kawiarnia sp. z o.o.', city: 'Poznań' },
    needs: [
      ['Menu jako tekst', 'Kawa, napoje i coś do jedzenia, czytelnie na telefonie.'],
      ['Dziś otwarte do...', 'Godziny na dziś w nagłówku, cały tydzień niżej.'],
      ['Miejsce dla grupy', 'Krótki formularz: kiedy i ile osób.'],
      ['Dojazd', 'Adres i mapa, żeby trafić bez szukania.'],
    ],
    faq: [
      ['Czy mogę często zmieniać menu?', 'W planie Opieka zmiany w treści robimy za Ciebie w ramach miesięcznych zmian.'],
    ],
  },
  {
    key: 'catering', path: '/strony-dla-firm-cateringowych/', variant: 'food_catering', label: 'Catering',
    title: 'Strony internetowe dla firm cateringowych | Tovernet',
    description: 'Strona dla cateringu: zapytanie z okazją, datą i liczbą gości, przykładowa propozycja menu. Zobacz przykład.',
    h1: 'Strona dla cateringu, która zbiera zapytania z datą i liczbą gości',
    intro: 'Organizator przyjęcia albo spotkania firmowego chce wiedzieć, czy obsłużysz jego wydarzenie i jak poprosić o wycenę. Strona prowadzi go przez okazję, datę, liczbę gości i sposób podania.',
    sample: { display_name: 'Przykładowy Catering', legal_name: 'Przykładowy Catering sp. z o.o.', city: 'Wrocław' },
    needs: [
      ['Zapytanie z konkretami', 'Okazja, data, liczba gości, sposób podania, miejsce i diety w jednym zgłoszeniu.'],
      ['Przykład propozycji menu', 'Organizator widzi, co dostanie po rozmowie, zanim napisze.'],
      ['Przyjęcia i firmy', 'Jedna strona dla klientów prywatnych i firmowych.'],
      ['Działa w telefonie', 'Formularz wygodny pod kciukiem, numer zawsze pod ręką.'],
    ],
    faq: [
      ['Czy na stronie mogą być ceny za osobę?', 'Tak, jeśli je podasz. Możesz też zostawić wycenę po rozmowie, jak w koncepcie.'],
    ],
  },
];

/** PKD 2025 prefix to variant. 56.40 (pośrednictwo) is left to the fallback concept. */
export const PKD_MAP: Record<string, string> = {
  '56.10': 'food_restaurant',
  '56.11': 'food_restaurant',
  '56.12': 'food_restaurant',
  '56.21': 'food_catering',
  '56.22': 'food_catering',
  '56.29': 'food_catering',
  '56.30': 'food_cafe',
};
