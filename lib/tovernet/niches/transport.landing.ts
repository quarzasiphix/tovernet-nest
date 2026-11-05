import type { Niche } from '../niches';

// Landing entries for the road transport concept, in the `Niche` shape. `key` and `variant`
// are plain strings until the integrator adds them to `NicheKey` and `VariantKey`.
// `faq` holds only the niche question; the integrator appends COMMON_FAQ.

export type TransportLanding = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

const PHOTOS: [string, string] = ['Czy pokażecie zdjęcia moich aut?', 'Tak, jeśli je dostarczysz. Do tego czasu używamy grafiki poglądowej, opisanej jako poglądowa, która nie udaje Twojej floty.'];

export const LANDING: TransportLanding[] = [
  {
    key: 'transport', path: '/strony-dla-firm-transportowych/', variant: 'transport_freight', label: 'Transport i spedycja',
    title: 'Strony internetowe dla firm transportowych i spedycji | Tovernet',
    description: 'Strona dla przewoźnika i spedytora: zapytanie o transport z trasą, terminem, ładunkiem i rodzajem auta. Zobacz przykład strony.',
    h1: 'Strona dla firmy transportowej, przez którą zleceniodawca wyśle zapytanie z trasą i ładunkiem',
    intro: 'Spedytor albo firma z towarem do wysłania sprawdza przewoźnika szybko: czy weźmiesz ten ładunek i jak wysłać zapytanie. Strona zaczyna od trasy, zbiera termin, ładunek i rodzaj auta w jednym formularzu, a dane firmy pokazuje w jednym miejscu.',
    sample: { display_name: 'Przykładowy Transport', legal_name: 'Przykładowy Transport sp. z o.o.', city: 'Łódź' },
    needs: [
      ['Zapytanie jak zlecenie', 'Załadunek, rozładunek, daty, ładunek i rodzaj auta w jednej wiadomości. Mniej dopytywania o podstawy.'],
      ['Dane firmy w jednym miejscu', 'Licencja, ubezpieczenie OC, auta i kierunki. Wpisujesz tylko to, co masz.'],
      ['Przewoźnik albo spedycja', 'Tekst nie zakłada własnej floty, więc pasuje do obu.'],
      ['Trasa na pierwszym ekranie', 'Zleceniodawca wpisuje skąd i dokąd od razu, także w telefonie.'],
    ],
    faq: [['Czy na stronie będzie numer licencji i OCP?', 'Tak, jeśli je masz i podasz. Nie wpisujemy licencji, ubezpieczeń ani uprawnień ADR, których nie potwierdzisz.'], PHOTOS],
  },
  {
    key: 'przeprowadzki', path: '/strony-dla-firm-przeprowadzkowych/', variant: 'transport_moving', label: 'Przeprowadzki',
    title: 'Strony internetowe dla firm przeprowadzkowych | Tovernet',
    description: 'Strona dla firmy przeprowadzkowej: prośba o wycenę z adresami, piętrami, windą i terminem. Zobacz przykład strony.',
    h1: 'Strona dla firmy przeprowadzkowej, przez którą klient poprosi o wycenę z adresami i piętrami',
    intro: 'Kto planuje przeprowadzkę, porównuje kilka firm, zwykle w telefonie. Chce wiedzieć, z kim ma do czynienia i jak dostać wycenę. Strona pyta o to, co i tak padnie w rozmowie: skąd, dokąd, piętro, winda, co jedzie i kiedy.',
    sample: { display_name: 'Przykładowe Przeprowadzki', legal_name: 'Przykładowe Przeprowadzki sp. z o.o.', city: 'Warszawa' },
    needs: [
      ['Wycena z konkretami', 'Adresy, piętra, winda, zakres i termin w jednym zgłoszeniu.'],
      ['Dane firmy na wierzchu', 'Klient wpuszcza ekipę do domu, więc widzi pełną nazwę firmy i dane z rejestru.'],
      ['Co przygotować do wyceny', 'Lista rzeczy, które ją przyspieszają: większe meble, zdjęcia pokoi, dojazd.'],
      ['Telefon pod kciukiem', 'Numer i formularz zawsze pod ręką w telefonie.'],
    ],
    faq: [['Czy pokażecie zdjęcia moich aut i ekipy?', 'Tak, jeśli je dostarczysz. Do tego czasu używamy grafiki poglądowej, opisanej jako poglądowa, która nie udaje Twojej firmy.']],
  },
  {
    key: 'kurierzy', path: '/strony-dla-firm-kurierskich/', variant: 'transport_courier', label: 'Kurierzy i dostawy',
    title: 'Strony internetowe dla firm kurierskich | Tovernet',
    description: 'Strona dla firmy kurierskiej: zapytanie o odbiór z dwoma adresami, rodzajem przesyłki i częstotliwością. Zobacz przykład.',
    h1: 'Strona dla firmy kurierskiej: adres odbioru, adres doręczenia i zapytanie w jednym miejscu',
    intro: 'Sklep albo biuro, które potrzebuje kuriera, chce podać dwa adresy i dowiedzieć się, kiedy i za ile. Strona zaczyna od trasy, a przy stałych dostawach pyta, jak często.',
    sample: { display_name: 'Przykładowy Kurier', legal_name: 'Przykładowy Kurier sp. z o.o.', city: 'Poznań' },
    needs: [
      ['Trasa na start', 'Adres odbioru i doręczenia od razu na pierwszym ekranie.'],
      ['Jednorazowo albo stale', 'Formularz odróżnia pojedynczą przesyłkę od stałej współpracy.'],
      ['Obszar doręczeń', 'Miejsce na miasta i dzielnice, w których jeździsz.'],
      ['Działa w telefonie', 'Numer i formularz zawsze pod ręką.'],
    ],
    faq: [PHOTOS],
  },
];

/**
 * PKD 2025 prefix to variant. KRS Radar stores PKD 2025 codes: forwarding is 52.31 there
 * (52.29 in PKD 2007 does not occur). Not mapped on purpose: 52.21, 52.24, 52.25 and 52.26
 * (handling, logistics, customs agencies) and passenger transport 49.3x.
 */
export const PKD_MAP: Record<string, string> = {
  '49.41': 'transport_freight',
  '52.31': 'transport_freight',
  '49.42': 'transport_moving',
  '53.20': 'transport_courier',
};
