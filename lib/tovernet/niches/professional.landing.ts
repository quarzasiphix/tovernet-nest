import type { Niche } from '../niches';

// Landing entries for the professional services niche, in the `Niche` shape of
// lib/tovernet/niches.ts. `key` and `variant` widen the current unions until the integrator
// adds them to NicheKey and VariantKey. COMMON_FAQ is appended by the integrator.

type Landing = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

export const LANDING: Landing[] = [
  {
    key: 'biura-rachunkowe', path: '/strony-dla-biur-rachunkowych/', variant: 'pro_accounting', label: 'Biura rachunkowe',
    title: 'Strony internetowe dla biur rachunkowych | Tovernet',
    description: 'Strona dla biura rachunkowego: zakres obsługi, miesiąc współpracy rozpisany na terminy i zapytanie o wycenę z formą firmy i liczbą dokumentów.',
    h1: 'Strona dla biura rachunkowego, z której przedsiębiorca od razu wie, co robicie i jak poprosić o wycenę',
    intro: 'KPiR, pełna księgowość, kadry i płace, VAT i KSeF. Przedsiębiorca wybierający biuro chce zobaczyć zakres, sposób współpracy i wysłać zapytanie z konkretami. Tak projektujemy strony dla biur rachunkowych.',
    sample: { display_name: 'Przykładowe Biuro Rachunkowe', legal_name: 'Przykładowe Biuro Rachunkowe sp. z o.o.', city: 'Łódź' },
    needs: [
      ['Zakres bez zgadywania', 'Klient zaznacza formę firmy, VAT i pracowników, a strona pokazuje, czym biuro zajmie się co miesiąc.'],
      ['Zapytanie, z którego da się wycenić', 'Forma prawna, ewidencja, liczba dokumentów i pracowników w jednym formularzu.'],
      ['Kto co robi', 'Współpraca rozpisana na zadania klienta i biura, od umowy po rozliczenie roczne.'],
      ['Działa w telefonie', 'Przycisk wyceny i kontakt są pod ręką na każdym ekranie telefonu.'],
    ],
    faq: [
      ['Czy strona może pokazywać uprawnienia i ubezpieczenie OC?', 'Tak, jeśli je posiadasz i podasz dane. Nie wpisujemy uprawnień, certyfikatów ani polis, których nie potwierdzisz.'],
      ['Czy na stronie mogą być ceny obsługi?', 'Tak, jeśli chcesz je pokazać. Możemy też zostawić samą wycenę na zapytanie.'],
    ],
  },
  {
    key: 'biura-nieruchomosci', path: '/strony-dla-biur-nieruchomosci/', variant: 'pro_realestate', label: 'Biura nieruchomości',
    title: 'Strony internetowe dla biur nieruchomości | Tovernet',
    description: 'Strona dla biura nieruchomości: osobne ścieżki dla sprzedających, wynajmujących i szukających, szkic oferty klienta i miejsce na oferty.',
    h1: 'Strona dla biura nieruchomości, która prowadzi sprzedającego, wynajmującego i kupującego do rozmowy',
    intro: 'Sprzedaż, wynajem i poszukiwanie nieruchomości. Każdy z tych klientów chce wiedzieć, jak pracujesz i co przygotować. Strona prowadzi każdego osobną ścieżką do zapytania.',
    sample: { display_name: 'Przykładowe Nieruchomości', legal_name: 'Przykładowe Nieruchomości sp. z o.o.', city: 'Kraków' },
    needs: [
      ['Trzy ścieżki', 'Sprzedający, wynajmujący i szukający dostają inny formularz i inny opis współpracy.'],
      ['Szkic oferty klienta', 'Sprzedający opisuje nieruchomość i widzi, jak będzie wyglądać w ofercie.'],
      ['Sekcja ofert', 'Gotowa na Twoje oferty. Dopóki ich nie dodasz, zbiera zlecenia poszukiwania.'],
      ['Przebieg współpracy', 'Od rozmowy i umowy pośrednictwa po akt notarialny albo umowę najmu.'],
    ],
    faq: [
      ['Czy oferty mogą się pobierać z mojego systemu?', 'To zależy od systemu i dostępu do jego danych. Sprawdzimy to przy wycenie, zanim cokolwiek obiecamy.'],
      ['Czy strona pokaże numer polisy OC?', 'Tak, jeśli go podasz. Nie wpisujemy danych, których nie potwierdzisz.'],
    ],
  },
  {
    key: 'zarzadcy-nieruchomosci', path: '/strony-dla-zarzadcow-nieruchomosci/', variant: 'pro_property', label: 'Zarządcy nieruchomości',
    title: 'Strony internetowe dla zarządców nieruchomości | Tovernet',
    description: 'Strona dla zarządcy nieruchomości: wspólnoty, mieszkania na wynajem i lokale, zakres zarządu i zapytanie o ofertę z liczbą lokali.',
    h1: 'Strona dla zarządcy nieruchomości, przez którą wspólnota albo właściciel poprosi o ofertę zarządu',
    intro: 'Wspólnoty mieszkaniowe, najem i nieruchomości komercyjne. Zarząd wspólnoty albo właściciel chce wiedzieć, co obejmuje zarząd i jak wygląda przejęcie. Strona odpowiada na to i zbiera dane do oferty.',
    sample: { display_name: 'Przykładowy Zarządca', legal_name: 'Przykładowy Zarządca sp. z o.o.', city: 'Gdańsk' },
    needs: [
      ['Trzy rodzaje zleceń', 'Wspólnota, mieszkanie na wynajem i lokal użytkowy, każde z własnym formularzem.'],
      ['Dane do oferty', 'Liczba lokali, metraż, okolica i obecny zarządca w jednym zapytaniu.'],
      ['Zakres zarządu', 'Rozliczenia, przeglądy, zebrania i usterki opisane prosto.'],
      ['Przejęcie krok po kroku', 'Od rozmowy, przez uchwałę i umowę, po bieżący zarząd.'],
    ],
    faq: [
      ['Czy można dodać panel dla mieszkańców?', 'Strona może prowadzić do systemu, którego już używasz. Sam panel nie wchodzi w zakres pakietów strony.'],
      ['Czy strona pokaże licencję lub polisę OC?', 'Tak, jeśli je podasz. Nie wpisujemy danych, których nie potwierdzisz.'],
    ],
  },
];

/** PKD 2025 prefix to variant. Longest matching prefix wins. 69.20.B (audit) is left out on
 *  purpose: bookkeeping copy does not fit auditors, so they fall back to `business`. */
export const PKD_MAP: Record<string, string> = {
  '69.20.A': 'pro_accounting',
  '69.20.C': 'pro_accounting',
  '69.20.Z': 'pro_accounting',
  '68.31': 'pro_realestate',
  '68.32': 'pro_property',
};
