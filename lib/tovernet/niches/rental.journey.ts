// Journey copy for the vehicle rental concept. Facts about the concept and catalogue only.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Same wording as PRO in lib/tovernet/funnelCopy.ts (not exported there).
const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Kto wynajmuje pojazd, powierza firmie swój termin. Zanim napisze, sprawdza stronę. Nawet nowa firma może wyglądać na poukładaną.'];
const EMPTY: [string, string] = ['Puste miejsca są celowe', 'Twojej floty, cen, kaucji i warunków nie znamy, więc ich nie wymyślamy. Każde takie miejsce jest opisane.'];
const BOARD: [string, string] = ['Tablica nie udaje rezerwacji', 'Nie pokazuje wolnych pojazdów i nikogo nie zapewnia o terminie. Klient pyta, a dostępność potwierdzasz Ty.'];

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  rental_cars: {
    welcome: {
      lead: 'To strona, na której klient zaznacza swój termin i klasę auta jednym ruchem na tablicy dni. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Tablica dni i klas aut', 'Warunki najmu na wierzchu'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, z czym przychodzi klient wypożyczalni: ma konkretne dni i wie mniej więcej, jakiego auta potrzebuje.',
      slots: ['Telefon i e-mail', 'Auta, zdjęcia i ceny', 'Kaucja, limity, ubezpieczenie i paliwo'],
      notes: [
        ['Termin i klasa w jednym ruchu', 'Wiersz to klasa auta, kolumny to dni. Jeden pasek odpowiada na oba pytania.'],
        BOARD,
        ['Warunki zamiast telefonów', 'Kaucja, kilometry i ubezpieczenie to pytania, które zadaje prawie każdy. Dostały własne miejsce.'],
        EMPTY,
      ],
      jobs: [
        FIRST,
        ['Zapytania, na które da się odpowiedzieć', 'Daty, klasa auta i miejsce odbioru są w wiadomości od razu.'],
        ['Mniej tych samych pytań', 'Warunki najmu klient czyta, zanim zadzwoni.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z tablicą terminów i zapytaniem oraz osobne podstrony, np. dla floty i warunków najmu.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym i polami na daty. Bez tablicy terminów i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego dłuższego wynajmu.',
    },
  },
  rental_trucks: {
    welcome: {
      lead: 'To strona, na której firma zaznacza termin i typ ciężarówki jednym ruchem na tablicy dni. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Tablica dni i typów pojazdów', 'Pojazdy pokazane w jednej skali'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co musisz wiedzieć przed odpowiedzią: termin, typ pojazdu, uprawnienia kierowcy i to, co będzie przewożone.',
      slots: ['Telefon i e-mail', 'Pojazdy, ładowność i ceny', 'Kaucja, limity i zasady dla ładunku'],
      notes: [
        ['Termin i typ w jednym ruchu', 'Wiersz to typ pojazdu, kolumny to dni. Jeden pasek odpowiada na oba pytania.'],
        BOARD,
        ['Pojazdy w jednej skali', 'Rysunki mają te same proporcje, więc różnica między kontenerem a zestawem jest widoczna od razu. To rysunki poglądowe.'],
        EMPTY,
      ],
      jobs: [
        FIRST,
        ['Uprawnienia znane od początku', 'Kategoria prawa jazdy jest w zapytaniu, zanim zaczniesz sprawdzać flotę.'],
        ['Warunki dla firm w jednym miejscu', 'Kaucja, limity, ładunek i tachograf przed rozmową.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z tablicą terminów i zapytaniem oraz osobne podstrony, np. dla pojazdów i warunków najmu.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym i polami na daty. Bez tablicy terminów i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego dłuższego wynajmu.',
    },
  },
};
