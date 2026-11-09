import type { Niche } from '../niches';

// Landing entry for business consulting firms, in the `Niche` shape.

type Landing = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

export const LANDING: Landing[] = [
  {
    key: 'firmy-doradcze', path: '/strony-dla-firm-doradczych/', variant: 'consult_business', label: 'Firmy doradcze',
    title: 'Strony internetowe dla firm doradczych | Tovernet',
    description: 'Strona dla firmy doradczej: klient w dwóch wyborach dochodzi do pytania na pierwszą rozmowę, a kontrahent od razu znajduje dane spółki.',
    h1: 'Strona dla firmy doradczej, na której klient sam dochodzi do właściwego pytania',
    intro: 'Właściciel firmy rzadko wie od razu, czego potrzebuje. Wie, że coś nie działa. Drzewo problemów prowadzi go od objawu do jednego pytania, od którego zaczniesz rozmowę, a osobna część z danymi spółki odpowiada kontrahentom i bankom.',
    sample: { display_name: 'Przykładowe Doradztwo', legal_name: 'Przykładowe Doradztwo sp. z o.o.', city: 'Poznań' },
    needs: [
      ['Pytanie zamiast „proszę o kontakt”', 'Klient przysyła konkretną sprawę, także wtedy, gdy nie umie jej jeszcze nazwać.'],
      ['Działa bez listy klientów', 'Zaufanie budują sposób myślenia i jasne zasady pierwszej rozmowy.'],
      ['Dane spółki w jednym miejscu', 'Kontrahent i bank znajdą to, czego szukają, bez dzwonienia.'],
      ['Działa w telefonie', 'Drzewo składa się do jednej ścieżki, a kontakt jest pod ręką.'],
    ],
    faq: [
      ['Nie mam jednej specjalizacji. Czy to zadziała?', 'Tak. Gałęzie drzewa ułożymy pod sprawy, którymi naprawdę się zajmujesz, a resztę pominiemy.'],
      ['Moi klienci nie chcą być wymieniani. Co wtedy?', 'Opiszemy sprawy bez nazw albo zostawimy sam sposób pracy.'],
      ['Moja spółka głównie zarządza własnymi udziałami. Czy potrzebuję takiej strony?', 'Wtedy ważniejsza będzie część z danymi spółki i kontaktem dla partnerów. Drzewo można pominąć.'],
    ],
  },
];

/** PKD 2025 prefix to variant. */
export const PKD_MAP: Record<string, string> = {
  '70.20': 'consult_business',
};
