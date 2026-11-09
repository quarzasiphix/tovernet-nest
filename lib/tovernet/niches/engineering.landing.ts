import type { Niche } from '../niches';

// Landing entries for architects and engineering firms, in the `Niche` shape.

type Landing = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

const QUALIFICATIONS_FAQ: [string, string] = ['Czy wpiszecie moje uprawnienia?', 'Tak, ale tylko te, które podasz. Numery i specjalności wpisujemy z Twoich dokumentów. Niczego nie dopisujemy za Ciebie.'];
const DRAWING_FAQ: [string, string] = ['Czy rysunek na stronie jest prawdziwy?', 'To grafika poglądowa, opisana jako poglądowa. Możemy dopasować ją do Twoich usług albo zastąpić Twoimi rysunkami.'];

export const LANDING: Landing[] = [
  {
    key: 'architekci', path: '/strony-dla-architektow/', variant: 'eng_architect', label: 'Architekci',
    title: 'Strony internetowe dla architektów | Tovernet',
    description: 'Strona dla architekta: klient zaznacza, co już ma, widzi, czego brakuje, i wysyła konkretny zakres do wyceny.',
    h1: 'Strona dla architekta, na której klient sam sprawdza, czego mu brakuje',
    intro: 'Klient rzadko wie, czy ma już wszystko, co potrzebne do projektu. Strona pyta o mapę, warunki zabudowy i koncepcję, a z brakujących pozycji układa zakres do wyceny.',
    sample: { display_name: 'Przykładowa Pracownia', legal_name: 'Przykładowa Pracownia sp. z o.o.', city: 'Gdańsk' },
    needs: [
      ['Zapytanie z zakresem', 'Od razu widzisz, co klient ma, a czego nie.'],
      ['Miejsce na uprawnienia', 'Numer, specjalność i izba wpisane z Twoich dokumentów.'],
      ['Zestawienie usług', 'Co klient dostaje i kiedy tego potrzebuje.'],
      ['Działa w telefonie', 'Rysunek zostaje na ekranie, gdy klient zaznacza odpowiedzi.'],
    ],
    faq: [QUALIFICATIONS_FAQ, DRAWING_FAQ, ['Czy mogę pokazać projekty?', 'Tak, jeśli je masz. Bez nich strona nadal zbiera zapytania z konkretnym zakresem.']],
  },
  {
    key: 'firmy-inzynierskie', path: '/strony-dla-firm-inzynierskich/', variant: 'eng_engineering', label: 'Firmy inżynierskie i doradztwo techniczne',
    title: 'Strony internetowe dla firm inżynierskich i doradztwa technicznego | Tovernet',
    description: 'Strona dla firmy inżynierskiej: klient zaznacza, co wie o obiekcie, i wysyła konkretny zakres ekspertyzy, badań lub projektu.',
    h1: 'Strona dla firmy inżynierskiej, która dostaje zapytania z konkretnym zakresem',
    intro: 'Ekspertyzy, badania, projekty i doradztwo techniczne. Klient często nie wie, co jest potrzebne. Strona pyta o dokumentację, pomiary i wymagania, a z braków układa zakres do wyceny.',
    sample: { display_name: 'Przykładowa Inżynieria', legal_name: 'Przykładowa Inżynieria sp. z o.o.', city: 'Lublin' },
    needs: [
      ['Zapytanie z zakresem', 'Dokumentacja, pomiary i wymagania w jednej wiadomości.'],
      ['Co dostaje klient', 'Opinia, raport albo projekt opisane wprost.'],
      ['Miejsce na uprawnienia i akredytacje', 'Tylko te, które faktycznie posiadasz.'],
      ['Działa w telefonie', 'Rysunek zostaje na ekranie, gdy klient zaznacza odpowiedzi.'],
    ],
    faq: [QUALIFICATIONS_FAQ, DRAWING_FAQ, ['Co, jeśli moje opracowania są poufne?', 'Opiszemy je bez nazw albo zostawimy same usługi i sposób pracy.']],
  },
];

/** PKD 2025 prefix to variant. */
export const PKD_MAP: Record<string, string> = { '71.11': 'eng_architect', '71.12': 'eng_engineering' };
