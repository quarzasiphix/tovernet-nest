import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Offer-journey copy for the local-services concept (LocalSite). Facts about the concept and
// the catalogue only: no promised results, timings, prices or figures. Wording of PRO and
// FIRST_IMPRESSION copied from lib/tovernet/funnelCopy.ts, where they are not exported.

const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST_IMPRESSION: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Czym się zajmujesz, gdzie działasz i jak się skontaktować, w jednym miejscu. Bez opinii i zdjęć z realizacji to strona pokazuje, że jesteś poukładaną firmą.'];
const SENTENCE_IS_ENQUIRY: [string, string] = ['Zdanie, które od razu jest zapytaniem', 'To, co klient wybrał, trafia do Ciebie jako jedno czytelne zdanie, razem z numerem telefonu.'];
const DRAWN: [string, string] = ['Rysunek, nie cudze zdjęcie', 'Grafika jest narysowana i podpisana jako poglądowa. Nikt nie pomyli jej z Twoją pracą.'];
const EMPTY_TRAVEL: [string, string] = ['Puste miejsca są celowe', 'Numeru telefonu, obszaru dojazdu i godzin nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'];
const EMPTY_PREMISES: [string, string] = ['Puste miejsca są celowe', 'Numeru telefonu, adresu i godzin otwarcia nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'];
const PHONE_JOB: [string, string] = ['Działa tam, gdzie klient szuka: na telefonie', 'Luki w zdaniu wypełnia się palcem, a numer i przycisk wyceny są na dole każdego ekranu.'];

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  local_cleaning: {
    welcome: {
      lead: 'To strona, na której klient dokańcza jedno zdanie: co trzeba posprzątać, jaki metraż i jak często, i prosi o wycenę prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Zapytanie jednym zdaniem', 'Kontakt pod kciukiem'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić ktoś, kto szuka sprzątania: czy robisz to, czego potrzebuje, czy dojedziesz w jego okolicę i jak poprosić o wycenę.',
      slots: ['Numer telefonu', 'Usługi, które naprawdę wykonujesz', 'Dzielnice i miejscowości, do których dojeżdżasz'],
      notes: [
        ['Zdanie zamiast długiego formularza', 'Klient wybiera rodzaj miejsca, metraż, zakres, częstotliwość i termin. Tyle zwykle trzeba, żeby podać cenę.'],
        ['Każda odpowiedź czyści szybę', 'Z każdą wybraną odpowiedzią ściągaczka zbiera jeden pas brudu z okna. Klient widzi, ile jeszcze brakuje.'],
        ['Cennik bez cen', 'Usługi wyglądają jak cennik, ale zamiast kwot jest „wycena po opisie”, bo cena zależy od metrażu i rytmu.'],
        EMPTY_TRAVEL,
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Zapytania z metrażem i częstotliwością', 'Od razu wiesz, czy to jednorazowe sprzątanie po remoncie, czy stała współpraca. Oddzwaniasz z konkretami.'],
        PHONE_JOB,
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma zapytanie w formie zdania i miejsce na osobne strony usług, np. sprzątania po remoncie i mycia okien. Strona Firma obejmuje jedno i drugie.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez zapytania w formie zdania z konceptu i bez podstron usług.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego stałego klienta, na przykład biura sprzątanego co tydzień.',
    },
  },
  local_garden: {
    welcome: {
      lead: 'To strona, na której klient wskazuje na planie ogrodu, czego potrzebuje, podaje powierzchnię i porę roku i prosi o wycenę prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Plan ogrodu', 'Zapytanie jednym zdaniem'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić ktoś, kto szuka pomocy w ogrodzie: czy zajmiesz się jego terenem, kiedy możesz zacząć i jak poprosić o wycenę.',
      slots: ['Numer telefonu', 'Usługi, które naprawdę wykonujesz', 'Miejscowości, do których dojeżdżasz'],
      notes: [
        ['Plan ogrodu zamiast listy usług', 'Klient wskazuje trawnik, żywopłot, rabaty albo liście, a zdanie zapytania samo się uzupełnia.'],
        ['Każda odpowiedź kosi pas trawnika', 'Z każdą wybraną odpowiedzią na planie pojawia się jeden skoszony pas. Klient widzi, ile jeszcze brakuje.'],
        ['Sezon w zapytaniu', 'Ogród ma swój rytm, więc klient od razu mówi, czy chodzi o wiosnę, jesień, czy stałą opiekę.'],
        EMPTY_TRAVEL,
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Zapytania z powierzchnią, zakresem i sezonem', 'Wiesz, jaki teren, co jest do zrobienia i kiedy. Na oględziny jedziesz przygotowany.'],
        PHONE_JOB,
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma zapytanie w formie zdania z planem ogrodu i miejsce na osobne strony usług, np. koszenia i zakładania ogrodów. Strona Firma obejmuje jedno i drugie.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez zapytania z planem ogrodu z konceptu i bez podstron usług.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego klienta, który powierzy Ci ogród na cały sezon.',
    },
  },
  local_auto: {
    welcome: {
      lead: 'To strona, na której kierowca wskazuje na rysunku auta, gdzie jest problem, podaje model i termin i pyta o wizytę prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Rysunek auta', 'Karta zlecenia'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić kierowca z problemem: czy zajmiesz się jego autem, gdzie jest warsztat i kiedy może przyjechać.',
      slots: ['Numer telefonu', 'Usługi, które naprawdę wykonujesz', 'Adres warsztatu i godziny otwarcia'],
      notes: [
        ['Rysunek auta zamiast listy usług', 'Kierowca wskazuje silnik, hamulce, zawieszenie, klimatyzację albo nadwozie, a zdanie zapytania samo się uzupełnia.'],
        ['Karta zlecenia, zanim zadzwoni telefon', 'Obok rysunku zapytanie układa się w kartę: auto, zakres, stan i termin. Z każdą odpowiedzią rysunek auta jest pełniejszy.'],
        ['Koszt po diagnozie', 'Strona nie podaje cen. Mówi, że zakres i koszt ustalasz z klientem przed naprawą.'],
        EMPTY_PREMISES,
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Zgłoszenia z autem i objawem', 'Model, rocznik, zakres, stan auta i termin przychodzą razem z numerem. Oddzwaniasz, wiedząc, o co chodzi.'],
        PHONE_JOB,
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma zapytanie z rysunkiem auta i kartą zlecenia oraz miejsce na osobne strony usług, np. klimatyzacji i opon. Strona Firma obejmuje jedno i drugie.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez zapytania z rysunkiem auta z konceptu i bez podstron usług.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego zlecenia, na przykład naprawy hamulców.',
    },
  },
  local_detailing: {
    welcome: {
      lead: 'To strona, na której klient wskazuje na rysunku auta, czym masz się zająć, opisuje stan lakieru i prosi o wycenę prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
      features: ['Auto w studiu', 'Zapytanie jednym zdaniem'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce sprawdzić ktoś, kto chce zadbać o auto: czym się zajmujesz, gdzie jest studio i jak poprosić o wycenę.',
      slots: ['Numer telefonu', 'Usługi, które naprawdę wykonujesz', 'Adres studia i godziny otwarcia'],
      notes: [
        ['Auto w studiu zamiast listy usług', 'Klient wskazuje lakier, wnętrze, tapicerkę albo reflektory pod światłem studia, a zdanie zapytania samo się uzupełnia.'],
        ['Stan lakieru w zapytaniu', 'Klient sam mówi, czy lakier jest zmatowiały, czy porysowany. Wiesz, o co chodzi, zanim oddzwonisz.'],
        DRAWN,
        EMPTY_PREMISES,
      ],
      jobs: [
        FIRST_IMPRESSION,
        SENTENCE_IS_ENQUIRY,
        PHONE_JOB,
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma zapytanie z rysunkiem auta i miejsce na osobne strony usług, np. korekty lakieru i powłok, a także na zdjęcia przed i po. Strona Firma obejmuje jedno i drugie.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez zapytania z rysunkiem auta z konceptu i bez podstron usług.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego zlecenia, na przykład korekty lakieru z powłoką ochronną.',
    },
  },
};
