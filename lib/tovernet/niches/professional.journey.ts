// Journey copy for the professional services concept (welcome screen, concept notes, offer
// stage), one entry per variant. Facts about the concept and the catalogue only: no promised
// results, timings, figures, licences or insurance. Firma's quote form has up to 8 fields
// (02-package-scope.md), and the concept forms are built to that limit.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Same wording as PRO and FIRST_IMPRESSION in lib/tovernet/funnelCopy.ts.
const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST_IMPRESSION: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Czym się zajmujesz, gdzie działasz i jak się skontaktować, w jednym miejscu. Bez opinii i zdjęć z realizacji to strona pokazuje, że jesteś poukładaną firmą.'];

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  pro_accounting: {
    welcome: {
      lead: 'To strona, na której przedsiębiorca zaznacza, jaką ma firmę, widzi, czym zajmiesz się co miesiąc, i prosi o wycenę prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Miesiąc z biurem', 'Zapytanie o wycenę'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić przedsiębiorca, który wybiera biuro: czy obsługujesz firmy takie jak jego, co dokładnie robisz co miesiąc i jak poprosić o wycenę.',
      slots: ['Numer telefonu i e-mail biura', 'Zakres usług, które naprawdę prowadzisz', 'Uprawnienia, polisa OC i zespół, jeśli chcesz je pokazać'],
      notes: [
        ['Miesiąc zamiast listy usług', 'Klient zaznacza formę firmy, VAT i pracowników. Terminy, które go dotyczą, podkreśla zakreślacz, a pozostałe są skreślone z podaniem powodu.'],
        ['Zaufanie z jasności, nie z deklaracji', 'Zamiast haseł o doświadczeniu strona pokazuje zakres, terminy i tabelę: co robi klient, a co biuro.'],
        ['Formularz jak druk urzędowy', 'Numerowane pola i kratki do zaznaczenia. Forma prawna, ewidencja, liczba dokumentów i pracowników przychodzą w jednym zapytaniu.'],
        ['Puste miejsca są celowe', 'Numeru telefonu, uprawnień, polisy OC ani nazwy programu nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'],
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Zapytania, z których da się wycenić', 'Zanim odpiszesz, znasz formę firmy, ewidencję, liczbę dokumentów i pracowników.'],
        ['Działa tam, gdzie klient szuka: na telefonie', 'Przycisk wyceny jest pod kciukiem na każdym ekranie, a formularz wypełnia się palcem.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma miesiąc z biurem, zapytanie o wycenę z ośmioma polami i miejsce na osobne strony usług, np. kadr i płac. Strona Firma obejmuje to wszystko.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez zapytania o wycenę z konceptu i bez podstron usług.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością rocznej obsługi jednego klienta.',
    },
  },
  pro_realestate: {
    welcome: {
      lead: 'To strona, na której sprzedający, wynajmujący i szukający od razu widzą, jak pracujesz, a sprzedający ogląda szkic swojej oferty i umawia rozmowę prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Szkic oferty klienta', 'Trzy ścieżki klienta'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić ktoś, kto sprzedaje, wynajmuje albo szuka nieruchomości: jak pracujesz, czy działasz w jego okolicy i co zostawić w zapytaniu.',
      slots: ['Numer telefonu', 'Zasady wynagrodzenia biura', 'Oferty, numer polisy OC i zespół, jeśli chcesz je pokazać'],
      notes: [
        ['Szkic oferty zamiast pustego formularza', 'Sprzedający opisuje nieruchomość, a obok układa się karta jego oferty. Widzi, jak przedstawisz jego mieszkanie, zanim zadzwoni.'],
        ['Każdy klient ma swoją ścieżkę', 'Sprzedaż, wynajem i poszukiwanie mają inny formularz, inny przycisk i inny przebieg współpracy.'],
        ['Sekcja ofert gotowa przed ofertami', 'Układ ofert jest oznaczony jako przykład. Dopóki go nie wypełnisz, zachęca szukających do zostawienia zlecenia.'],
        ['Puste miejsca są celowe', 'Numeru telefonu, polisy OC, zasad wynagrodzenia ani ofert nie znamy, więc ich nie wymyślamy. Rysunki budynków są poglądowe, nie udają zdjęć.'],
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Zgłoszenia z konkretami', 'Rodzaj nieruchomości, metraż, okolica i termin przychodzą razem z numerem telefonu.'],
        ['Działa tam, gdzie klient szuka: na telefonie', 'Przycisk zapytania jest pod kciukiem na każdym ekranie.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma trzy ścieżki z formularzem i szkicem oferty, sekcję ofert i miejsce na osobne strony, np. dla sprzedających. Strona Firma obejmuje to wszystko. Oferty wstawiamy z Twoich materiałów; automatyczne pobieranie ich z systemu biura nie wchodzi w pakiety.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez formularza ze szkicem oferty i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednej transakcji, na przykład sprzedaży mieszkania.',
    },
  },
  pro_property: {
    welcome: {
      lead: 'To strona, na której wspólnota albo właściciel sprawdza, co obejmuje zarząd, opisuje nieruchomość i prosi o ofertę prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Szkic zlecenia zarządu', 'Zapytanie o ofertę'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić zarząd wspólnoty albo właściciel, który szuka zarządcy: co obejmuje zarząd, jak wygląda przejęcie i jak poprosić o ofertę.',
      slots: ['Numer telefonu', 'Zakres zarządu i zasady wynagrodzenia', 'Licencja, polisa OC i zespół, jeśli chcesz je pokazać'],
      notes: [
        ['Trzy rodzaje zleceń', 'Wspólnota, mieszkanie na wynajem i lokal użytkowy mają osobne formularze, bo do oferty potrzebujesz innych danych.'],
        ['Szkic zlecenia obok formularza', 'Liczba lokali, metraż i okolica układają się w kartę zlecenia. Klient widzi, co już podał.'],
        ['Przejęcie krok po kroku', 'Od rozmowy, przez uchwałę i umowę, po bieżący zarząd. Wspólnota wie, czego się spodziewać.'],
        ['Puste miejsca są celowe', 'Numeru telefonu, licencji, polisy OC ani zasad wynagrodzenia nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'],
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Zapytania, z których da się przygotować ofertę', 'Liczba lokali, okolica i obecny zarządca przychodzą w jednym zgłoszeniu.'],
        ['Działa tam, gdzie klient szuka: na telefonie', 'Przycisk zapytania jest pod kciukiem na każdym ekranie.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma trzy formularze zleceń ze szkicem, zakres zarządu i miejsce na osobne strony, np. dla wspólnot. Strona Firma obejmuje to wszystko. Panel dla mieszkańców nie wchodzi w pakiety.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez formularzy ze szkicem zlecenia i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością zarządu jednym budynkiem przez rok.',
    },
  },
};
