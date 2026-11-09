// Journey copy for the energy concept. Facts about the concept and catalogue only. `energy_project`
// is also what a cooperative gets when the variant comes from PKD alone, so its copy stays true for both.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Same wording as PRO in lib/tovernet/funnelCopy.ts (not exported there).
const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST: [string, string] = ['Pierwsze wrażenie, kiedy ktoś Cię sprawdza', 'Kto usłyszy o Twojej nazwie, sprawdza ją w sieci. Nawet bez zdjęć i dokumentów widać, kim jesteś i gdzie można zapytać.'];
const EMPTY: [string, string] = ['Puste miejsca są celowe', 'Twoich instalacji, dokumentów i odpowiedzi nie znamy, więc ich nie wymyślamy. Każde takie miejsce jest opisane.'];
const BOARD: [string, string] = ['Tablica jak w rozdzielni', 'Wybór sprawy zamyka łącznik i zapala lampkę. To jeden gest, który ktoś z branży rozpozna od razu.'];

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  energy_project: {
    welcome: {
      lead: 'To strona, na której każdy, kto ma sprawę, np. ktoś z okolicy, gmina albo partner, wybiera ją na tablicy i od razu zadaje właściwe pytanie. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Tablica spraw', 'Etap pokazany lampką'],
    },
    funnel: {
      intro: 'Zaczęliśmy od ludzi, którzy pytają o Twoją działalność. Ktoś z okolicy, urzędnik i wykonawca potrzebują czego innego, więc każdy dostaje swoją drogę.',
      slots: ['Telefon i e-mail osoby do kontaktu', 'Pytania, które naprawdę słyszysz, i odpowiedzi', 'Lokalizacja i dokumenty, które można pokazać'],
      notes: [
        ['Osobna sprawa dla każdego', 'Każda osoba wybiera, kim jest, i widzi swoje pytania oraz formularz.'],
        ['Etap zamiast obietnic', 'Nie opisujemy efektów. Pokazujemy, na jakim etapie naprawdę jesteś.'],
        BOARD,
        EMPTY,
      ],
      jobs: [
        FIRST,
        ['Pytania trafiają do właściwej osoby', 'Od razu wiesz, kto pisze i w jakiej sprawie.'],
        ['Odpowiedzi opisane raz', 'To, o co ludzie pytają najczęściej, można opisać w jednym miejscu.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z tablicą spraw i osobne podstrony, np. dla dokumentów i etapów.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym. Bez tablicy spraw i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednej umowy albo jednej dobrze załatwionej sprawy.',
    },
  },
  energy_coop: {
    welcome: {
      lead: 'To strona, na której mieszkaniec, członek i gmina wybierają swoją sprawę na tablicy i od razu zadają właściwe pytanie. Zobacz, jak Twoja spółdzielnia mogłaby wyglądać w sieci.',
      features: ['Tablica spraw', 'Etap spółdzielni pokazany lampką'],
    },
    funnel: {
      intro: 'Zaczęliśmy od ludzi wokół spółdzielni. Mieszkaniec chce wiedzieć, jak dołączyć, członek szuka dokumentów, a gmina osoby do rozmowy.',
      slots: ['Telefon i e-mail osoby do kontaktu', 'Zasady przystąpienia i odpowiedzi na pytania', 'Dokumenty, które można pokazać'],
      notes: [
        ['Osobna sprawa dla każdego', 'Mieszkaniec, członek, gmina i partner widzą swoje pytania i formularz.'],
        ['Bez obietnic oszczędności', 'Niczego nie obiecujemy w Twoim imieniu. Korzyści wpiszemy tylko takie, które potwierdzisz.'],
        BOARD,
        EMPTY,
      ],
      jobs: [
        ['Pierwsze wrażenie, kiedy ktoś Was sprawdza', 'Mieszkaniec, który usłyszy o spółdzielni, sprawdza ją w sieci. Widać, czym jest i gdzie zapytać.'],
        ['Jasna droga dla chętnych', 'Kto chce dołączyć, wie, od czego zacząć.'],
        ['Dokumenty w jednym miejscu', 'Statut i regulaminy można pokazać bez wysyłania ich osobno.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z tablicą spraw i osobne podstrony, np. dla dokumentów i zasad przystąpienia.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym. Bez tablicy spraw i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z tym, ile znaczy dla spółdzielni jeden nowy członek.',
    },
  },
};
