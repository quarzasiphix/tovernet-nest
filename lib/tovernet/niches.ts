import type { VariantKey } from './api';
import { NICHE_LANDINGS, familyOf } from './niches/index';
import { CONSTRUCTION_VARIANTS } from './construction';

// One indexable landing page per niche. Opened with a demo id in the fragment, the same
// page shows that company's concept and pricing. Keep the path map in sync with
// tovernet.offer_path() in the KsięgaI database.

/** Construction landing keys, plus the keys of the niches in lib/tovernet/niches/. */
export type NicheKey = 'budowlane' | 'elektrycy' | 'hydraulicy' | 'wykonczenia' | 'drogowe' | (string & {});

export type Niche = {
  key: NicheKey;
  path: string;
  variant: VariantKey;
  label: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sample: { display_name: string; legal_name: string; city: string };
  needs: [string, string][];
  faq: [string, string][];
};

const COMMON_FAQ: [string, string][] = [
  ['Ile trwa przygotowanie strony?', 'Zależnie od pakietu: szacunkowo od 5 do 20 dni roboczych od otrzymania kompletu materiałów. Termin dla wybranego pakietu widzisz w ofercie przed zamówieniem.'],
  ['Czy domena i strona będą moje?', 'Domenę .pl rejestrujemy na Twoją firmę, a jej odnowienie jest w planie miesięcznym. Treści i projekt strony przenosimy na Twoją firmę po opłaceniu zamówienia, a nasze komponenty dostajesz w bezterminowej licencji. Pliki strony możesz pobrać w każdej chwili w trakcie planu i do 90 dni po jego zakończeniu, bez opłat.'],
  ['Czy obiecujecie pozycję w Google?', 'Nie. Przygotowujemy stronę technicznie pod wyszukiwarkę i pomagamy z wizytówką Google, ale na pozycję wpływa wiele czynników poza naszą kontrolą.'],
  ['Czy muszę mieć gotowe teksty i zdjęcia?', 'Nie muszą być gotowe. Pomożemy je zebrać z krótkiego formularza, a zdjęcia możesz dosłać z telefonu.'],
];

export const NICHES: Niche[] = [
  {
    key: 'budowlane', path: '/strony-dla-firm-budowlanych/', variant: 'general', label: 'Firmy budowlane',
    title: 'Strony internetowe dla firm budowlanych | Tovernet',
    description: 'Strona dla firmy budowlanej: zakres prac, obszar działania i formularz wyceny pod telefon. Zobacz przykład i zapytaj o wycenę.',
    h1: 'Strona dla firmy budowlanej, z której klient od razu wie, czy robisz to, czego szuka',
    intro: 'Budowa domów, remonty, prace wykończeniowe. Klient chce szybko zobaczyć zakres, obszar działania i wysłać zapytanie z telefonu. Tak projektujemy strony dla firm budowlanych.',
    sample: { display_name: 'Przykładowa Budowlanka', legal_name: 'Przykładowa Budowlanka sp. z o.o.', city: 'Łódź' },
    needs: [
      ['Zakres prac na pierwszym ekranie', 'Budowa, remont czy wykończenie: klient od razu widzi, czy pasujesz do jego inwestycji.'],
      ['Zapytanie z konkretami', 'Formularz prosi o lokalizację, rodzaj prac i termin, żeby łatwiej było wycenić.'],
      ['Obszar działania', 'Strona jasno mówi, gdzie pracujesz. Pomaga to klientom z okolicy trafić pod właściwy adres.'],
      ['Działa w telefonie', 'Większość zapytań przychodzi z telefonu, więc numer i formularz są zawsze pod ręką.'],
    ],
    faq: [['Czy pokażecie moje realizacje?', 'Tak, jeśli je masz. Nie wstawiamy cudzych zdjęć udających Twoje realizacje: do czasu zdjęć od Ciebie używamy grafik poglądowych.'], ...COMMON_FAQ],
  },
  {
    key: 'elektrycy', path: '/strony-dla-elektrykow/', variant: 'electrical', label: 'Elektrycy',
    title: 'Strony internetowe dla elektryków | Tovernet',
    description: 'Strona dla elektryka: instalacje, modernizacje i usterki, szybkie zgłoszenie z telefonu. Zobacz przykład strony.',
    h1: 'Strona dla elektryka, przez którą klient zgłosi zlecenie w minutę',
    intro: 'Nowe instalacje, wymiana starej instalacji, tablice i awarie. Klient szuka elektryka zwykle w pośpiechu, więc strona musi szybko powiedzieć, co robisz, gdzie, i jak się skontaktować.',
    sample: { display_name: 'Przykładowy Elektryk', legal_name: 'Przykładowy Elektryk sp. z o.o.', city: 'Kraków' },
    needs: [
      ['Zgłoszenie zlecenia', 'Krótki formularz: rodzaj budynku, okolica, pilność. Mniej telefonów bez konkretów.'],
      ['Usterki i planowane prace osobno', 'Inaczej mówimy do kogoś z awarią, inaczej do inwestora z projektem instalacji.'],
      ['Telefon na wierzchu', 'Numer klikalny na każdym ekranie telefonu.'],
      ['Obszar działania', 'Miasto i okolice jasno w nagłówku i treści strony.'],
    ],
    faq: [['Czy strona może pokazywać uprawnienia SEP?', 'Tak, jeśli je posiadasz i podasz numer. Nie wpisujemy uprawnień ani certyfikatów, których nie potwierdzisz.'], ...COMMON_FAQ],
  },
  {
    key: 'hydraulicy', path: '/strony-dla-hydraulikow/', variant: 'plumbing_hvac', label: 'Hydraulika i ogrzewanie',
    title: 'Strony internetowe dla hydraulików i instalatorów | Tovernet',
    description: 'Strona dla hydraulika i firmy instalacyjnej: woda, kanalizacja, ogrzewanie, klimatyzacja. Zgłoszenia awarii i wyceny z telefonu.',
    h1: 'Strona dla hydraulika i instalatora: awarie, montaże i serwis w jednym miejscu',
    intro: 'Instalacje wodno-kanalizacyjne, ogrzewanie, klimatyzacja i wentylacja. Klienci przychodzą z awarią albo z planem montażu, a strona prowadzi każdego do właściwego zgłoszenia.',
    sample: { display_name: 'Przykładowe Instalacje', legal_name: 'Przykładowe Instalacje sp. z o.o.', city: 'Poznań' },
    needs: [
      ['Awaria czy montaż', 'Dwa jasne wejścia: pilne zgłoszenie i zapytanie o montaż lub wymianę.'],
      ['Usługi sezonowe', 'Przeglądy ogrzewania i klimatyzacji łatwo dodać jako osobne podstrony.'],
      ['Telefon i formularz', 'Klikalny numer i krótki formularz z pytaniem o pilność.'],
      ['Obszar działania', 'Klient od razu widzi, czy dojeżdżasz w jego okolicę.'],
    ],
    faq: [['Czy można dodać rezerwację przeglądów?', 'Tak, jako dodatek podłączamy wybrane narzędzie do rezerwacji wizyt.'], ...COMMON_FAQ],
  },
  {
    key: 'wykonczenia', path: '/strony-dla-firm-wykonczeniowych/', variant: 'finishing', label: 'Wykończenia wnętrz',
    title: 'Strony internetowe dla firm wykończeniowych i remontowych | Tovernet',
    description: 'Strona dla firmy wykończeniowej: malowanie, płytki, podłogi, zabudowy. Zapytanie z metrażem i terminem. Zobacz przykład.',
    h1: 'Strona dla firmy wykończeniowej, która pokazuje zakres i zbiera zapytania z metrażem',
    intro: 'Mieszkania, domy i lokale. Klient chce wiedzieć, co robisz, jak wygląda współpraca i ile to potrwa. Strona porządkuje to w kilku sekcjach i prosi o metraż i termin.',
    sample: { display_name: 'Przykładowe Wnętrza', legal_name: 'Przykładowe Wnętrza sp. z o.o.', city: 'Łódź' },
    needs: [
      ['Usługi z podziałem', 'Malowanie, płytki, podłogi, zabudowy: każda usługa z krótkim opisem.'],
      ['Jak pracujecie', 'Pomiar, wycena z podziałem na prace i termin rozpoczęcia, opisane prosto.'],
      ['Miejsce na zdjęcia', 'Galeria gotowa na zdjęcia Twoich realizacji, kiedy je dostarczysz.'],
      ['Zapytanie z metrażem', 'Formularz zbiera metraż, pomieszczenia i termin, żeby wycena była szybsza.'],
    ],
    faq: [['Czy mogę sam dodawać zdjęcia realizacji?', 'W planie Opieka dodamy je za Ciebie w ramach miesięcznych zmian. Możesz też zamówić podstronę z galerią.'], ...COMMON_FAQ],
  },
  {
    key: 'drogowe', path: '/strony-dla-firm-drogowych/', variant: 'infrastructure', label: 'Roboty ziemne i drogowe',
    title: 'Strony internetowe dla firm drogowych i robót ziemnych | Tovernet',
    description: 'Strona dla firmy drogowej i wykonawcy robót ziemnych: zakres, sprzęt, zapytania ofertowe od inwestorów. Zobacz przykład.',
    h1: 'Strona dla wykonawcy robót ziemnych i drogowych, gotowa na zapytania ofertowe',
    intro: 'Roboty ziemne, drogi, nawierzchnie, sieci i przyłącza. Inwestor szuka konkretów: zakresu, możliwości i kontaktu do ofert. Strona daje mu to bez szukania.',
    sample: { display_name: 'Przykładowe Roboty Drogowe', legal_name: 'Przykładowe Roboty Drogowe sp. z o.o.', city: 'Wrocław' },
    needs: [
      ['Zakres robót', 'Roboty ziemne, nawierzchnie, sieci i przyłącza opisane rzeczowo.'],
      ['Zapytanie ofertowe', 'Formularz z rodzajem inwestycji, lokalizacją i dokumentacją.'],
      ['Dla inwestorów i generalnych wykonawców', 'Ton i układ pod klientów firmowych i podwykonawstwo.'],
      ['Obszar działania', 'Region pracy jasno na stronie.'],
    ],
    faq: [['Czy strona może zawierać listę sprzętu?', 'Tak, przygotujemy sekcję z parkiem maszynowym na podstawie danych od Ciebie.'], ...COMMON_FAQ],
  },
];

// Niches added 2026-11-03: their entries live with each niche; COMMON_FAQ is appended here.
NICHES.push(...NICHE_LANDINGS.map((n) => ({ ...n, variant: n.variant as VariantKey, faq: [...n.faq, ...COMMON_FAQ] })));

export const NICHE_BY_KEY = Object.fromEntries(NICHES.map((n) => [n.key, n])) as Record<NicheKey, Niche>;

/** Landing page of a variant. Unknown construction variants go to construction, anything else to the general page. */
export function nicheForVariant(variant: VariantKey | string | undefined): Niche {
  return NICHES.find((n) => n.variant === variant)
    ?? (familyOf(variant) ? NICHES.find((n) => n.variant === 'business')! : NICHE_BY_KEY.budowlane);
}

/** Trade label shown in the offer frame (Karta, journey bar). The general concept has none. */
export function tradeOf(variant: VariantKey | string | null | undefined): string | null {
  if (!variant || variant === 'business') return null;
  const construction = (CONSTRUCTION_VARIANTS as Record<string, { trade: string } | undefined>)[variant];
  if (construction) return construction.trade;
  return NICHES.find((n) => n.variant === variant)?.label ?? null;
}

/** A variant some concept can render; anything else becomes construction `general`. */
export function knownVariant(variant: string | null | undefined): VariantKey {
  if (variant && (variant in CONSTRUCTION_VARIANTS || familyOf(variant))) return variant as VariantKey;
  return 'general';
}
