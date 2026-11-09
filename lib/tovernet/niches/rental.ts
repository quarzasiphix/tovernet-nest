// Template content for the vehicle rental concept (`rental_cars`, `rental_trucks`).
// We know registry facts only, so the page names no fleet, model, price, deposit, insurance term,
// staff or years. Vehicle classes are labelled examples; every rental term is an empty slot.

export type VehicleShape = 'city' | 'compact' | 'estate' | 'minibus' | 'van' | 'box' | 'curtain' | 'reefer' | 'tipper' | 'semi';
export type RentalClass = { name: string; use: string; shape: VehicleShape };
export type RentalContent = {
  kicker: string;
  lead: string;
  boardTitle: string;
  /** Column label in the enquiry summary and the fleet button: cars have classes, trucks have types. */
  rowLabel: string;
  rowCta: string;
  classes: RentalClass[];
  /** One extra question for the enquiry, the one this rental cannot answer without. */
  extra: { label: string; options: string[] };
  placeholder: string;
  fleetTitle: string;
  fleetNote: string;
  termsTitle: string;
  termsLead: string;
  terms: [string, string, string][];
  stepsTitle: string;
  steps: [string, string][];
  slots: { title: string; text: string }[];
};

export const BOARD_NOTE = 'Tablica nie pokazuje wolnych pojazdów. Zaznaczasz termin, o który pytasz, a my sprawdzamy i odpisujemy. To zapytanie, nie rezerwacja.';
export const TERMS_NOTE = 'Nie znamy Twoich warunków, więc ich nie wpisujemy. Uzupełnimy je przed publikacją.';
export const STEPS_NOTE = 'Przykładowy przebieg. Dopasujemy go do tego, jak naprawdę wydajesz pojazdy.';

const CARS: RentalContent = {
  kicker: 'Wynajem samochodów',
  lead: 'Potrzebujesz auta na konkretne dni? Zaznacz termin i wyślij zapytanie. Odpiszemy, czy mamy wolny pojazd i ile to będzie kosztować.',
  boardTitle: 'Na kiedy potrzebujesz auta?',
  rowLabel: 'Klasa',
  rowCta: 'Zapytaj o tę klasę',
  classes: [
    { name: 'Miejskie', use: 'Po mieście i na krótkie trasy', shape: 'city' },
    { name: 'Kompaktowe', use: 'Na co dzień i w dłuższą drogę', shape: 'compact' },
    { name: 'Kombi', use: 'Więcej miejsca na bagaż', shape: 'estate' },
    { name: '9-osobowe', use: 'Rodzina, drużyna, ekipa', shape: 'minibus' },
    { name: 'Dostawcze', use: 'Przeprowadzka, towar, sprzęt', shape: 'van' },
  ],
  extra: { label: 'Wyjazd za granicę?', options: ['Nie', 'Tak', 'Jeszcze nie wiem'] },
  placeholder: 'Np. godzina odbioru, liczba osób, co chcesz przewieźć.',
  fleetTitle: 'Klasy pojazdów, w jednej skali',
  fleetNote: 'Przykładowe klasy i rysunki poglądowe. Przed publikacją wpiszemy Twoją flotę i ceny.',
  termsTitle: 'Warunki, o które i tak zapytasz',
  termsLead: 'Przed wynajmem wszyscy pytają o to samo. Tutaj odpowiedzi będą wypisane wprost.',
  terms: [
    ['Kaucja', 'Ile wynosi i kiedy wraca?', 'Tu kwota i termin zwrotu'],
    ['Limit kilometrów', 'Czy jest limit na dobę?', 'Tu limit i cena za dodatkowe kilometry'],
    ['Ubezpieczenie', 'Co obejmuje i ile wynosi udział własny?', 'Tu zakres ochrony'],
    ['Paliwo', 'W jakim stanie oddać auto?', 'Tu zasada tankowania'],
    ['Wyjazd za granicę', 'Czy można i do jakich krajów?', 'Tu kraje i warunki'],
    ['Kierowca', 'Jaki wiek i staż prawa jazdy?', 'Tu wymagania'],
  ],
  stepsTitle: 'Jak przebiega wynajem',
  steps: [
    ['Zapytanie', 'Termin, klasa pojazdu i miejsce odbioru.'],
    ['Odpowiedź', 'Sprawdzamy, czy mamy wolne auto, i podajemy cenę.'],
    ['Odbiór', 'Umowa i protokół ze stanem auta.'],
    ['Zwrot', 'Oglądamy auto i rozliczamy najem.'],
  ],
  slots: [
    { title: 'Zdjęcia aut', text: 'Tu Twoje auta. Wystarczą dobre zdjęcia z telefonu.' },
    { title: 'Gdzie odebrać', text: 'Tu adres, mapa i godziny wydawania aut.' },
    { title: 'Najem dla firm', text: 'Tu warunki najmu długoterminowego, jeśli go oferujesz.' },
  ],
};

const TRUCKS: RentalContent = {
  kicker: 'Wynajem samochodów ciężarowych',
  lead: 'Potrzebujesz ciężarówki na konkretne dni? Zaznacz termin i typ pojazdu, a potem wyślij zapytanie. Odpiszemy, czy mamy wolne auto i ile to będzie kosztować.',
  boardTitle: 'Na kiedy potrzebujesz pojazdu?',
  rowLabel: 'Typ',
  rowCta: 'Zapytaj o ten typ',
  classes: [
    { name: 'Kontener', use: 'Do 3,5 t: dostawy i przeprowadzki', shape: 'box' },
    { name: 'Plandeka', use: 'Palety i towar na trasie', shape: 'curtain' },
    { name: 'Chłodnia', use: 'Towar w kontrolowanej temperaturze', shape: 'reefer' },
    { name: 'Wywrotka', use: 'Budowa, kruszywo, ziemia', shape: 'tipper' },
    { name: 'Ciągnik z naczepą', use: 'Pełne ładunki', shape: 'semi' },
  ],
  extra: { label: 'Kategoria prawa jazdy kierowcy', options: ['B', 'C', 'C+E', 'Jeszcze nie wiem'] },
  placeholder: 'Np. co przewozisz, ile waży ładunek, jaka trasa.',
  fleetTitle: 'Typy pojazdów, w jednej skali',
  fleetNote: 'Przykładowe typy i rysunki poglądowe. Przed publikacją wpiszemy Twoją flotę, ładowność i ceny.',
  termsTitle: 'Warunki, o które i tak zapytasz',
  termsLead: 'Firma, która bierze ciężarówkę na termin, musi to wiedzieć przed podpisaniem umowy. Tutaj odpowiedzi będą wypisane wprost.',
  terms: [
    ['Kaucja', 'Ile wynosi i kiedy wraca?', 'Tu kwota i termin zwrotu'],
    ['Limit kilometrów', 'Czy jest limit na dobę lub miesiąc?', 'Tu limit i cena za dodatkowe kilometry'],
    ['Ubezpieczenie', 'Co obejmuje i ile wynosi udział własny?', 'Tu zakres ochrony'],
    ['Ładunek', 'Czego nie wolno przewozić?', 'Tu ograniczenia'],
    ['Tachograf', 'Kto odpowiada za dane i kartę kierowcy?', 'Tu zasady'],
    ['Kierowca', 'Jakie uprawnienia są wymagane?', 'Tu wymagania'],
  ],
  stepsTitle: 'Jak przebiega wynajem',
  steps: [
    ['Zapytanie', 'Termin, typ pojazdu i miejsce odbioru.'],
    ['Odpowiedź', 'Sprawdzamy, czy mamy wolny pojazd, i podajemy cenę.'],
    ['Odbiór', 'Umowa i protokół ze stanem pojazdu.'],
    ['Zwrot', 'Oglądamy pojazd i rozliczamy najem.'],
  ],
  slots: [
    { title: 'Zdjęcia pojazdów', text: 'Tu Twoje ciężarówki. Wystarczą dobre zdjęcia z telefonu.' },
    { title: 'Gdzie odebrać', text: 'Tu plac, mapa i godziny wydawania pojazdów.' },
    { title: 'Najem długoterminowy', text: 'Tu warunki dla firm, jeśli oferujesz dłuższy najem.' },
  ],
};

export const RENTAL_CONTENT: Record<string, RentalContent> = { rental_cars: CARS, rental_trucks: TRUCKS };
export const rentalContent = (variant: string): RentalContent => RENTAL_CONTENT[variant] ?? CARS;
