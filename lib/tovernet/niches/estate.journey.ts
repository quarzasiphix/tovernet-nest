// Journey copy for the real estate concept. Facts about the concept and catalogue only.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Same wording as PRO in lib/tovernet/funnelCopy.ts (not exported there).
const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Nieruchomość to duża decyzja. Klient chce zobaczyć poukładaną firmę, zanim napisze.'];
const EMPTY: [string, string] = ['Puste miejsca są celowe', 'Twoich lokali, cen i dokumentów nie znamy, więc ich nie wymyślamy. Układ na stronie jest poglądowy.'];

const entry = (lead: string, picker: string, why: string, compare: string): { welcome: WelcomeCopy; funnel: FunnelCopy } => ({
  welcome: { lead: `${lead} Zobacz, jak Twoja firma mogłaby wyglądać w sieci.`, features: [picker, 'Zapytanie o konkretną sprawę'] },
  funnel: {
    intro: why,
    slots: ['Telefon i e-mail', 'Oferty, ceny i zdjęcia', 'Dokumenty i dane firmy'],
    notes: [
      [picker, 'Klient wybiera bezpośrednio na stronie, a jego wybór trafia do zapytania.'],
      ['Jedno zapytanie, jasna sprawa', 'Od razu wiesz, czego dotyczy wiadomość.'],
      ['Przebieg krok po kroku', 'Klient widzi, co wydarzy się po wysłaniu zapytania.'],
      EMPTY,
    ],
    jobs: [FIRST, ['Zapytania z konkretem', 'Wiadomość mówi, o co dokładnie chodzi.'], ['Działa na telefonie', 'Wybór i zapytanie mieszczą się na małym ekranie.']],
    fit: {
      'tovernet.web.firma': `Koncept z elementem „${picker}” i osobne podstrony, np. dla ofert i kontaktu.`,
      'tovernet.web.start': `Jedna strona w tym układzie z prostym formularzem. Bez elementu „${picker}” i bez podstron.`,
      'tovernet.web.pro': PRO,
    },
    compare,
  },
});

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  estate_developer: entry('To strona, na której klient wskazuje lokal na układzie budynku i pyta o szczegóły.', 'Wybór lokalu na układzie budynku', 'Zaczęliśmy od pytania kupującego: który lokal i co muszę o nim wiedzieć.', 'Porównaj tę kwotę z wartością jednego sprzedanego lokalu.'),
  estate_trade: entry('To strona, na której sprzedający i kupujący od razu trafiają do właściwej sprawy.', 'Wybór rodzaju nieruchomości', 'Zaczęliśmy od rozdzielenia dwóch spraw: ktoś chce sprzedać albo kupić.', 'Porównaj tę kwotę z wartością jednej transakcji.'),
  estate_rental: entry('To strona, na której najemca wskazuje lokal i pyta o dostępność.', 'Wybór lokalu', 'Zaczęliśmy od pytań najemcy: co jest dostępne, od kiedy i na jakich warunkach.', 'Porównaj tę kwotę z czynszem za jeden miesiąc najmu.'),
};
