// Journey copy for the engineering and design concept. Facts about the concept and catalogue only.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Same wording as PRO in lib/tovernet/funnelCopy.ts (not exported there).
const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Kto szuka projektanta albo inżyniera, sprawdza stronę, zanim napisze. Nawet bez portfolio widać, że jesteś poukładaną firmą.'];
const EMPTY: [string, string] = ['Puste miejsca są celowe', 'Twoich uprawnień, projektów i danych osób nie znamy, więc ich nie wymyślamy. Każde takie miejsce jest opisane i wypełnimy je z Twoich dokumentów.'];
const DRAWING: [string, string] = ['Rysunek jest poglądowy', 'Pokazuje mechanizm i jest opisany jako poglądowy. Dopasujemy go do tego, czym naprawdę się zajmujesz.'];

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  eng_architect: {
    welcome: {
      lead: 'To strona, na której klient zaznacza, co już ma do swojej inwestycji, a rysunek działki pokazuje, czego brakuje. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Rysunek rysowany odpowiedziami', 'Zakres do wyceny'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, czego klient często nie wie przed pierwszą rozmową: czy ma mapę, warunki zabudowy i koncepcję, i co jeszcze trzeba przygotować.',
      slots: ['Telefon i e-mail', 'Uprawnienia, specjalność i izba', 'Usługi i projekty'],
      notes: [
        ['Pytamy, co klient już ma', 'Każda odpowiedź rysuje jedną warstwę planu działki. Tuszem to, co jest, czerwoną kredką to, czego brakuje.'],
        ['Braki stają się zapytaniem', 'Dostajesz listę tego, czego klientowi brakuje, zamiast „proszę o kontakt”.'],
        ['„Nie wiem” to też odpowiedź', 'Klient, który nie zna nazw dokumentów, nadal może wysłać zapytanie.'],
        DRAWING,
        EMPTY,
      ],
      jobs: [
        FIRST,
        ['Zapytania, które da się wycenić', 'Od razu widać, co jest gotowe, a co trzeba jeszcze przygotować.'],
        ['Mniej tłumaczenia od zera', 'Klient widzi kolejne dokumenty, zanim do Ciebie napisze.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z rysunkiem i zakresem do wyceny oraz osobne podstrony, np. dla usług i projektów.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym. Bez rysunku zmienianego odpowiedziami i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego projektu.',
    },
  },
  eng_engineering: {
    welcome: {
      lead: 'To strona, na której klient zaznacza, co wie o swoim obiekcie, a rysunek przekroju pokazuje, czego jeszcze brakuje. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Rysunek rysowany odpowiedziami', 'Zakres do wyceny'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, czego potrzebujesz, żeby wycenić usługę techniczną: jaki jest obiekt, jaka dokumentacja istnieje, jakie są pomiary i kto czego wymaga.',
      slots: ['Telefon i e-mail', 'Uprawnienia, akredytacje, metody', 'Usługi i opracowania'],
      notes: [
        ['Pytamy, co klient już ma', 'Każda odpowiedź rysuje jedną warstwę przekroju. Tuszem to, co jest, czerwoną kredką to, czego brakuje.'],
        ['Braki stają się zapytaniem', 'Dostajesz zakres z dokumentacją, badaniami i wymaganiami, zamiast „proszę o kontakt”.'],
        ['Usługi opisane przez wynik', 'Klient widzi, jaki dokument dostanie i kiedy go potrzebuje.'],
        DRAWING,
        EMPTY,
      ],
      jobs: [
        FIRST,
        ['Zapytania, które da się wycenić', 'Od razu widać, co klient ma, a czego nie.'],
        ['Kwalifikacje w jednym miejscu', 'Uprawnienia i akredytacje, które faktycznie masz, tam, gdzie klient ich szuka.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z rysunkiem i zakresem do wyceny oraz osobne podstrony, np. dla usług i opracowań.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym. Bez rysunku zmienianego odpowiedziami i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego zlecenia.',
    },
  },
};
