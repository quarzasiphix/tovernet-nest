// Journey copy for the software and games concept. Facts about the concept and catalogue only.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Same wording as PRO in lib/tovernet/funnelCopy.ts (not exported there).
const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Kto szuka wykonawcy albo partnera, sprawdza stronę, zanim napisze. Nawet bez portfolio widać, że jesteś poukładaną firmą.'];
const EMPTY: [string, string] = ['Puste miejsca są celowe', 'Twoich projektów, technologii i zespołu nie znamy, więc ich nie wymyślamy. Każde takie miejsce jest opisane.'];

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  tech_software: {
    welcome: {
      lead: 'To strona, na której klient odpowiada na kilka pytań, a obok powstaje brief jego projektu. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Brief pisany na żywo', 'Sposób pracy jak historia commitów'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, czego potrzebujesz przed pierwszą rozmową: co klient chce zbudować, na jakim jest etapie i co jest dla niego najważniejsze.',
      slots: ['Telefon i e-mail', 'Realizacje, także bez nazw klientów', 'Technologie i zespół'],
      notes: [
        ['Brief zamiast formularza kontaktowego', 'Każda odpowiedź dopisuje wiersz do dokumentu obok. Klient widzi, co wyśle.'],
        ['Pierwszy krok zależy od etapu', 'Inaczej rozmawia się o pomyśle, a inaczej o działającym produkcie.'],
        ['Sposób pracy jako historia zmian', 'Etapy układają się w linię, którą programista rozpozna od razu.'],
        EMPTY,
      ],
      jobs: [
        FIRST,
        ['Zapytania, od których da się zacząć', 'Rodzaj projektu, etap i priorytet są w wiadomości od razu.'],
        ['Oferta bez nazw klientów', 'Projekty pod NDA opiszesz jako problem i rozwiązanie.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z briefem pisanym na żywo i osobne podstrony, np. dla oferty i realizacji.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym. Bez briefu pisanego na żywo i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego projektu.',
    },
  },
  tech_games: {
    welcome: {
      lead: 'To strona, na której wydawca, prasa i gracz od razu trafiają do właściwej sprawy, a tytuły i materiały są w jednym miejscu. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Kontakt według nadawcy', 'Miejsce na tytuły i pakiet prasowy'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, kto pisze do studia: wydawca, inne studio, prasa albo gracz. Każdy szuka czegoś innego.',
      slots: ['Telefon i e-mail', 'Tytuły, zwiastuny i linki do sklepów', 'Pakiet prasowy i społeczność'],
      notes: [
        ['Wiadomość zależy od nadawcy', 'Każda odpowiedź dopisuje wiersz do wiadomości, a pierwszy krok zależy od tego, kto pisze.'],
        ['Tytuły w jednym miejscu', 'Gatunek, platformy, zwiastun i sklep.'],
        ['Działa przed premierą', 'Bez wydanej gry strona nadal zbiera kontakty.'],
        EMPTY,
      ],
      jobs: [
        FIRST,
        ['Sprawy trafiają do właściwej osoby', 'Od razu wiesz, czy pisze wydawca, prasa czy gracz.'],
        ['Materiały bez wymiany maili', 'Pakiet prasowy czeka na stronie.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z kontaktem według nadawcy i osobne podstrony, np. dla tytułów i pakietu prasowego.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym. Bez wyboru nadawcy i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednej współpracy.',
    },
  },
};
