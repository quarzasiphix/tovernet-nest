import type { Niche } from '../niches';

// Landing entries for energy project companies and energy cooperatives, in the `Niche` shape.

type Landing = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

export const LANDING: Landing[] = [
  {
    key: 'projekty-energetyczne', path: '/strony-dla-projektow-energetycznych/', variant: 'energy_project', label: 'Projekty energetyczne',
    title: 'Strony internetowe dla projektów energetycznych | Tovernet',
    description: 'Strona dla projektu energetycznego: sąsiad, właściciel gruntu, urząd i partner od razu trafiają do swojej sprawy.',
    h1: 'Strona dla projektu energetycznego, na której każdy wie, kogo zapytać',
    intro: 'O projekt energetyczny pytają różni ludzie: ktoś z okolicy, właściciel gruntu, urzędnik, wykonawca. Strona pozwala każdemu wybrać swoją sprawę, zobaczyć odpowiedzi na typowe pytania i napisać do właściwej osoby.',
    sample: { display_name: 'Przykładowy Projekt Energetyczny', legal_name: 'Przykładowy Projekt Energetyczny sp. z o.o.', city: 'Poznań' },
    needs: [
      ['Osobna droga dla każdego', 'Sąsiad, właściciel gruntu, urząd i partner wybierają swoją sprawę.'],
      ['Odpowiedzi w jednym miejscu', 'Pytania, które naprawdę słyszysz, i Twoje odpowiedzi.'],
      ['Etap projektu na wierzchu', 'Widać, na czym stoi projekt, bez obietnic i terminów.'],
      ['Działa w telefonie', 'Pytanie można zadać z każdego ekranu.'],
    ],
    faq: [
      ['Czy muszę pokazywać lokalizację?', 'Nie. Pokazujemy tylko to, co chcesz i możesz ujawnić.'],
      ['Czy strona zastępuje obowiązki informacyjne lub konsultacje?', 'Nie. To Twoje miejsce kontaktu i informacji, nie procedura urzędowa.'],
    ],
  },
  {
    key: 'spoldzielnie-energetyczne', path: '/strony-dla-spoldzielni-energetycznych/', variant: 'energy_coop', label: 'Spółdzielnie energetyczne',
    title: 'Strony internetowe dla spółdzielni energetycznych | Tovernet',
    description: 'Strona dla spółdzielni energetycznej: mieszkaniec, członek, gmina i partner od razu trafiają do swojej sprawy.',
    h1: 'Strona dla spółdzielni energetycznej, do której łatwo dołączyć i łatwo zapytać',
    intro: 'Mieszkaniec chce wiedzieć, jak dołączyć. Członek szuka dokumentów. Gmina potrzebuje osoby do rozmowy. Strona prowadzi każdego do jego sprawy, a dokumenty są w jednym miejscu.',
    sample: { display_name: 'Przykładowa Spółdzielnia Energetyczna', legal_name: 'Przykładowa Spółdzielnia Energetyczna', city: 'Lublin' },
    needs: [
      ['Pytania według osoby', 'Mieszkaniec, członek, gmina i partner wybierają swoją sprawę.'],
      ['Jak dołączyć', 'Kolejne kroki opisane prosto. Wpisujemy tylko Twoje zasady.'],
      ['Dokumenty dla członków', 'Statut, regulaminy i uchwały, które można udostępnić.'],
      ['Etap spółdzielni', 'Widać, na czym stoicie, także przed uruchomieniem instalacji.'],
    ],
    faq: [
      ['Czy podacie na stronie korzyści dla członków?', 'Tylko te, które potwierdzisz. Nie obiecujemy oszczędności ani niższych rachunków.'],
      ['Czy dokumenty mogą być tylko dla członków?', 'Na stronie umieszczamy tylko dokumenty, które można pokazać publicznie. Dostęp wyłącznie dla członków trzeba ustalić osobno.'],
    ],
  },
];

/**
 * PKD 2025 prefix to variant. PKD cannot separate cooperatives from project companies inside 35.12,
 * so every prefix maps to `energy_project`; the site reads the registry name and shows the
 * cooperative page, and the `energy_project` journey and e-mail are worded to be true for both.
 * Left on `business`: 35.13, 35.14 and 35.22 (network operators), 35.15 and 35.23 (retail trade,
 * sells tariffs), 35.30 (heat utilities), 35.40 (brokers selling to businesses).
 */
export const PKD_MAP: Record<string, string> = {
  '35.11': 'energy_project',
  '35.12': 'energy_project',
  '35.16': 'energy_project',
  '35.21': 'energy_project',
};
