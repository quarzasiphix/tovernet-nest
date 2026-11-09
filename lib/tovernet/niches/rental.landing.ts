import type { Niche } from '../niches';

// Landing entries for car and truck rental firms, in the `Niche` shape.

type Landing = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

export const LANDING: Landing[] = [
  {
    key: 'wypozyczalnie-samochodow', path: '/strony-dla-wypozyczalni-samochodow/', variant: 'rental_cars', label: 'Wypożyczalnie samochodów',
    title: 'Strony internetowe dla wypożyczalni samochodów | Tovernet',
    description: 'Strona dla wypożyczalni samochodów: klient zaznacza termin i klasę auta, a Ty dostajesz zapytanie, na które da się od razu odpowiedzieć.',
    h1: 'Strona dla wypożyczalni, na której klient od razu podaje termin i klasę auta',
    intro: 'Kto szuka auta do wynajęcia, ma konkretne dni. Strona pokazuje tablicę dni i klas, a klient zaznacza swój termin jednym ruchem. Warunki najmu są wypisane na wierzchu, zanim ktokolwiek zadzwoni.',
    sample: { display_name: 'Przykładowa Wypożyczalnia', legal_name: 'Przykładowa Wypożyczalnia sp. z o.o.', city: 'Rzeszów' },
    needs: [
      ['Termin i klasa w jednym ruchu', 'Klient zaznacza dni na tablicy, więc w zapytaniu są od razu daty i rodzaj auta.'],
      ['Warunki na wierzchu', 'Kaucja, limit kilometrów, ubezpieczenie i paliwo w jednym miejscu.'],
      ['Zapytanie, nie rezerwacja', 'Odpowiadasz, gdy sprawdzisz flotę. Strona niczego nie obiecuje za Ciebie.'],
      ['Działa w telefonie', 'Tablicę przesuwa się palcem, a kontakt jest pod ręką.'],
    ],
    faq: [
      ['Czy strona pokazuje wolne auta na żywo?', 'Nie w tej wersji. Klient wysyła zapytanie o termin, a Ty potwierdzasz dostępność. Połączenie z programem do rezerwacji wymaga pakietu Pro i narzędzia, z którego korzystasz.'],
      ['Skąd wezmą się ceny i warunki?', 'Podajesz je w formularzu. Wpisujemy tylko to, co od Ciebie dostaniemy.'],
    ],
  },
  {
    key: 'wynajem-ciezarowek', path: '/strony-dla-wynajmu-samochodow-ciezarowych/', variant: 'rental_trucks', label: 'Wynajem samochodów ciężarowych',
    title: 'Strony internetowe dla wynajmu samochodów ciężarowych | Tovernet',
    description: 'Strona dla firmy wynajmującej ciężarówki: klient zaznacza termin i typ pojazdu, podaje kategorię prawa jazdy i opisuje ładunek.',
    h1: 'Strona dla wynajmu ciężarówek, na której klient podaje termin, typ pojazdu i uprawnienia kierowcy',
    intro: 'Firma, która potrzebuje ciężarówki, ma termin i ładunek. Strona zbiera to w jednym zapytaniu, a typy pojazdów pokazuje w jednej skali, żeby od razu było widać różnicę.',
    sample: { display_name: 'Przykładowy Wynajem Ciężarówek', legal_name: 'Przykładowy Wynajem Ciężarówek sp. z o.o.', city: 'Poznań' },
    needs: [
      ['Termin i typ pojazdu razem', 'Klient zaznacza dni w wierszu wybranego typu.'],
      ['Uprawnienia w zapytaniu', 'Od razu wiesz, jaką kategorię ma kierowca.'],
      ['Warunki dla firm', 'Kaucja, limity, ładunek i tachograf w jednym miejscu.'],
      ['Zapytanie, nie rezerwacja', 'Dostępność potwierdzasz sam, po sprawdzeniu floty.'],
    ],
    faq: [
      ['Czy mogę pokazać ładowność i wymiary?', 'Tak. Wpisujemy dane pojazdów, które podasz.'],
      ['Czy strona pokazuje wolne pojazdy na żywo?', 'Nie w tej wersji. Klient pyta o termin, a Ty odpisujesz po sprawdzeniu floty.'],
    ],
  },
];

/** PKD 2025 prefix to variant. */
export const PKD_MAP: Record<string, string> = {
  '77.11': 'rental_cars',
  '77.12': 'rental_trucks',
};
