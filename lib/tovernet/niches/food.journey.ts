import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Offer journey copy for the food service concept (FoodSite). Facts about the concept and
// the catalogue only: no promised results, timings, figures, prices or platforms.

const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST_IMPRESSION_VENUE: [string, string] = ['Pierwsze wrażenie, kiedy gość Cię sprawdza', 'Co podajesz, gdzie jesteś, kiedy jest otwarte i jak się skontaktować, w jednym miejscu. Bez opinii i zdjęć to strona pokazuje, że lokal jest poukładany.'];
const FIRST_IMPRESSION_CATERING: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Czym się zajmujesz, gdzie działasz i jak poprosić o wycenę, w jednym miejscu. Bez opinii i zdjęć z przyjęć to strona pokazuje, że jesteś poukładaną firmą.'];
const EMPTY_SLOTS_VENUE: [string, string] = ['Puste miejsca są celowe', 'Karty, cen, godzin otwarcia, adresu i numeru telefonu nie znamy, więc ich nie wymyślamy. Dania w koncepcie są oznaczone jako przykłady. Uzupełnisz to przed publikacją.'];
const PHONE: [string, string] = ['Działa tam, gdzie gość szuka: na telefonie', 'Numer i przycisk rezerwacji zostają pod kciukiem przez całą stronę, a karta czyta się bez powiększania.'];

const VENUE_FIT: Record<string, string> = {
  'tovernet.web.firma': 'Koncept ma kartę, formularz rezerwacji, godziny i dojazd. Strona Firma obejmuje to wszystko, a karta może mieć osobną podstronę.',
  'tovernet.web.start': 'Jedna strona: karta, godziny i dojazd się zmieszczą, ale zamiast formularza rezerwacji jest zwykły formularz kontaktowy.',
  'tovernet.web.pro': PRO,
};

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  food_restaurant: {
    welcome: {
      lead: 'To strona, na której gość od razu widzi kartę, sprawdza, czy dziś jest otwarte, i prosi o stolik prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Karta lokalu', 'Rezerwacja stolika'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić ktoś, kto wybiera, gdzie zjeść: co podajesz, czy dziś jest otwarte, jak trafić i jak zarezerwować stolik.',
      slots: ['Numer telefonu i adres', 'Karta z cenami', 'Godziny otwarcia'],
      notes: [
        ['Karta jako tekst, nie PDF', 'Dania i ceny czyta się na telefonie bez powiększania, a zmiana pozycji nie wymaga nowego pliku.'],
        ['Dziś na pierwszym ekranie', 'Strona sama zaznacza dzisiejszy dzień, więc gość od razu widzi godziny na dziś, zanim przewinie dalej.'],
        ['Stolik w kilku dotknięciach', 'Dzień, godzina i liczba osób. Przy większej grupie formularz od razu mówi, że oddzwonisz, żeby ustalić stół i menu.'],
        EMPTY_SLOTS_VENUE,
      ],
      jobs: [
        FIRST_IMPRESSION_VENUE,
        ['Rezerwacje z konkretami', 'Dzień, godzina, liczba osób i numer telefonu przychodzą razem. Oddzwaniasz, wiedząc, o co chodzi.'],
        PHONE,
      ],
      fit: VENUE_FIT,
      compare: 'Porównaj tę kwotę z wartością jednego przyjęcia dla większej grupy.',
    },
  },
  food_cafe: {
    welcome: {
      lead: 'To strona, na której gość od razu widzi menu, sprawdza, do której jest otwarte, i rezerwuje miejsce dla grupy prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Menu kawiarni', 'Godziny na dziś'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić ktoś, kto szuka miejsca po drodze: co podajesz, do której jest otwarte i jak do Ciebie trafić.',
      slots: ['Numer telefonu i adres', 'Menu z cenami', 'Godziny otwarcia'],
      notes: [
        ['Menu jako tekst, nie zdjęcie tablicy', 'Kawa, napoje i jedzenie czytelnie na telefonie, łatwe do zmiany.'],
        ['Dziś na pierwszym ekranie', 'Strona sama zaznacza dzisiejszy dzień, więc gość od razu widzi godziny na dziś.'],
        ['Miejsce dla grupy', 'Krótki formularz: kiedy i ile osób. Na spotkanie albo urodziny bez dzwonienia.'],
        EMPTY_SLOTS_VENUE,
      ],
      jobs: [
        FIRST_IMPRESSION_VENUE,
        ['Rezerwacje dla grup', 'Dzień, godzina i liczba osób przychodzą razem z numerem telefonu.'],
        PHONE,
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma menu, formularz rezerwacji, godziny i dojazd. Strona Firma obejmuje to wszystko, a menu może mieć osobną podstronę.',
        'tovernet.web.start': 'Jedna strona: menu, godziny i dojazd się zmieszczą, ale zamiast formularza rezerwacji jest zwykły formularz kontaktowy.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego spotkania dla grupy, które trafi do Ciebie przez stronę.',
    },
  },
  food_catering: {
    welcome: {
      lead: 'To strona, na której organizator przyjęcia podaje okazję, datę i liczbę gości, a zapytanie gotowe do wyceny wysyła prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Bon z zapytaniem', 'Przykład propozycji menu'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić organizator przyjęcia albo spotkania firmowego: czy obsłużysz jego wydarzenie, gdzie działasz i jak poprosić o wycenę.',
      slots: ['Numer telefonu', 'Okazje i sposoby podania, które naprawdę oferujesz', 'Przykładowe menu i zakres usługi'],
      notes: [
        ['Zapytanie jak bon kuchenny', 'Każda odpowiedź organizatora drukuje się na bonie obok formularza. Widzi, co wysyła, a Ty dostajesz komplet.'],
        ['Przykład propozycji przed zapytaniem', 'Organizator widzi, jak wygląda menu z ceną za osobę, które dostanie po rozmowie. Wie, na co się umawia.'],
        ['Rysunek zamiast cudzych zdjęć', 'Bon, szyna i karta są typografią, nie zdjęciem cudzego przyjęcia. Nikt nie pomyli ich z Twoją pracą.'],
        ['Puste miejsca są celowe', 'Menu, cen, zakresu usługi i numeru telefonu nie znamy, więc ich nie wymyślamy. Okazje i dania są oznaczone jako przykłady. Uzupełnisz je przed publikacją.'],
      ],
      jobs: [
        FIRST_IMPRESSION_CATERING,
        ['Zapytania gotowe do wyceny', 'Okazja, data, liczba gości, sposób podania i diety przychodzą razem. Oddzwaniasz z propozycją, a nie z listą pytań.'],
        ['Działa tam, gdzie klient szuka: na telefonie', 'Formularz wypełnia się palcem, a numer zostaje pod kciukiem przez całą stronę.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma formularz zapytania z bonem, przykład propozycji menu i opis współpracy. Strona Firma obejmuje to wszystko. Formularz w Firmie ma do 8 pól, więc z konceptu wybierzemy razem najważniejsze.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez formularza zapytania z bonem i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego zamówienia, na przykład cateringu na spotkanie firmowe.',
    },
  },
};
