// Journey copy for the road transport concept (TransportSite). Facts about the concept and
// the catalogue only: no promised results, timings or figures, and nothing about a fleet,
// licence, insurance or routes the company has not given us.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST_IMPRESSION: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Czym się zajmujesz, gdzie działasz i jak się skontaktować, w jednym miejscu. Bez opinii i zdjęć to strona pokazuje, że jesteś poukładaną firmą.'];
const ROAD: [string, string] = ['Trasa najpierw', 'Pierwsze, co klient robi na stronie, to wpisanie skąd i dokąd. Reszta zapytania idzie za tym, a ciężarówka na marginesie pokazuje, ile zostało.'];
const DRAWN: [string, string] = ['Auto narysowane, nie sfotografowane', 'Pojazd z Twoją nazwą to grafika poglądowa i tak jest opisany. Nikt nie pomyli go z Twoją flotą, a zdjęcia swoich aut dodasz, kiedy zechcesz.'];
const PHONE: [string, string] = ['Działa tam, gdzie klient szuka: na telefonie', 'Trasę wpisuje się na pierwszym ekranie, a przycisk zapytania zostaje pod kciukiem przez całą stronę.'];

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  transport_freight: {
    welcome: {
      lead: 'To strona, na której spedytor albo firma z towarem wpisuje trasę, termin, ładunek i rodzaj auta, a potem wysyła zapytanie prosto z telefonu. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Trasa na pierwszym ekranie', 'Zapytanie jak zlecenie'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co sprawdza zleceniodawca, zanim da Ci ładunek: czy weźmiesz tę trasę, z kim ma do czynienia i jak szybko wysłać zapytanie.',
      slots: ['Numer telefonu', 'Numer licencji i ubezpieczenie OC', 'Auta, kierunki i rodzaje ładunków'],
      notes: [
        ROAD,
        ['Zapytanie jak zlecenie', 'Załadunek, rozładunek, daty, ładunek i auto w numerowanych polach, jak w liście przewozowym. Wyceniasz bez dopytywania o podstawy.'],
        ['Dane firmy obok formularza', 'Licencja, OC, auta, kierunki i ADR mają swoje miejsce. Dane z KRS są już wpisane, resztę uzupełnisz tym, co naprawdę masz.'],
        ['Puste miejsca są celowe', 'Numeru telefonu, licencji, ubezpieczenia ani floty nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'],
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Zapytania, które da się wycenić', 'Trasa, termin, ładunek i auto przychodzą w jednej wiadomości. Odpowiadasz, wiedząc, o co chodzi.'],
        ['Pasuje do przewoźnika i do spedycji', 'Tekst nie zakłada własnej floty. Opisuje to, co robisz, a nie to, co masz na placu.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma zapytanie o transport z trasą, ładunkiem i autem oraz miejsce na podstrony, np. kierunków i rodzajów ładunków. Strona Firma obejmuje jedno i drugie.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez zapytania o transport z konceptu i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego zlecenia, na przykład jednego pełnego transportu.',
    },
  },
  transport_moving: {
    welcome: {
      lead: 'To strona, na której klient przed przeprowadzką podaje skąd, dokąd, piętra, windę i termin, a potem prosi o wycenę prosto z telefonu. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Trasa przeprowadzki', 'Wycena z piętrami'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co chce wiedzieć ktoś przed przeprowadzką: z kim ma do czynienia, czy dojedziesz pod jego adres i jak dostać wycenę bez długiej rozmowy.',
      slots: ['Numer telefonu', 'Auta i obszar, w którym działasz', 'Ubezpieczenie mienia, jeśli je masz'],
      notes: [
        ROAD,
        ['Pytania, które i tak padną', 'Piętro, winda, co jedzie, największe rzeczy i termin. Klient odpowiada raz, a Ty dzwonisz z konkretną wyceną.'],
        ['Dane firmy na wierzchu', 'Klient wpuszcza ekipę do domu, więc widzi pełną nazwę firmy i dane z rejestru.'],
        DRAWN,
        ['Puste miejsca są celowe', 'Numeru telefonu, aut ani ubezpieczenia nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'],
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Prośby o wycenę z konkretami', 'Adresy, piętra, winda i zakres przychodzą w jednym zgłoszeniu. Wiesz, ilu ludzi i jakiego auta potrzeba.'],
        PHONE,
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma formularz wyceny z adresami, piętrami i zakresem oraz miejsce na podstrony, np. przeprowadzek biur. Strona Firma obejmuje jedno i drugie.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez formularza wyceny z konceptu i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego zlecenia, na przykład przeprowadzki mieszkania.',
    },
  },
  transport_courier: {
    welcome: {
      lead: 'To strona, na której sklep albo biuro podaje adres odbioru i doręczenia, rodzaj przesyłki i to, jak często potrzebuje kuriera, prosto z telefonu. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Odbiór i doręczenie', 'Jednorazowo albo stale'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co sprawdza ktoś, kto szuka kuriera: czy jeździsz w jego okolicy, kiedy odbierzesz przesyłkę i jak szybko o to zapytać.',
      slots: ['Numer telefonu', 'Obszar doręczeń i godziny przyjmowania zleceń', 'Auta i ubezpieczenie przesyłek, jeśli je masz'],
      notes: [
        ROAD,
        ['Jednorazowo albo stale', 'Formularz pyta, jak często. Od razu widzisz, czy to pojedyncza paczka, czy stały klient.'],
        DRAWN,
        ['Puste miejsca są celowe', 'Numeru telefonu, obszaru ani godzin nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'],
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Zapytania z adresami', 'Odbiór, doręczenie, rodzaj przesyłki i termin w jednej wiadomości. Oddzwaniasz z ceną, wiedząc, o co chodzi.'],
        PHONE,
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma zapytanie o odbiór z adresami i częstotliwością oraz miejsce na podstrony, np. dla stałych klientów. Strona Firma obejmuje jedno i drugie.',
        'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez zapytania o odbiór z konceptu i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego stałego klienta z regularnymi odbiorami.',
    },
  },
};
