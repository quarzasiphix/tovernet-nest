import type { Niche } from '../niches';
import type { LocalVariant } from './local';

// Landing-page entries for the local-services concept, in the `Niche` shape of
// lib/tovernet/niches.ts. `key` and `variant` are plain strings until the integrator adds
// them to `NicheKey` and `VariantKey`. FAQ entries here are niche-specific only; the
// integrator appends COMMON_FAQ. Every variant has its own entry, because nicheForVariant()
// falls back to the construction page for an unknown variant.

export type LocalLanding = Omit<Niche, 'key' | 'variant'> & { key: string; variant: LocalVariant };

const PHONE: [string, string] = ['Telefon pod kciukiem', 'Na telefonie numer i przycisk wyceny są zawsze na dole ekranu, bo tam klient szuka wykonawcy.'];
const PHOTOS: [string, string] = ['Czy pokażecie moje realizacje?', 'Tak, jeśli je masz. Nie wstawiamy cudzych zdjęć udających Twoje prace: do czasu zdjęć od Ciebie strona używa rysunków poglądowych.'];

export const LANDING: LocalLanding[] = [
  {
    key: 'sprzatanie', path: '/strony-dla-firm-sprzatajacych/', variant: 'local_cleaning', label: 'Firmy sprzątające',
    title: 'Strony internetowe dla firm sprzątających | Tovernet',
    description: 'Strona dla firmy sprzątającej: klient jednym zdaniem podaje rodzaj miejsca, metraż i częstotliwość, a potem prosi o wycenę z telefonu. Zobacz przykład.',
    h1: 'Strona dla firmy sprzątającej, z której zapytanie przychodzi z metrażem i częstotliwością',
    intro: 'Mieszkania, biura, klatki schodowe, sprzątanie po remoncie. Klient chce wiedzieć, czy to robisz i czy dojedziesz, a Ty potrzebujesz metrażu i rytmu, żeby podać cenę. Strona zbiera jedno i drugie w jednym zdaniu.',
    sample: { display_name: 'Przykładowe Sprzątanie', legal_name: 'Przykładowe Sprzątanie sp. z o.o.', city: 'Warszawa' },
    needs: [
      ['Zapytanie jednym zdaniem', 'Rodzaj miejsca, metraż, zakres, częstotliwość i termin klient wybiera palcem, bez pisania.'],
      ['Jednorazowo albo na stałe', 'Od razu widać, czy to sprzątanie po remoncie, czy stała współpraca z biurem albo wspólnotą.'],
      ['Obszar dojazdu', 'Dzielnice i miejscowości, do których dojeżdżasz, jasno na stronie.'],
      PHONE,
    ],
    faq: [['Czy na stronie będzie cennik?', 'Tylko jeśli chcesz. W koncepcie zamiast cen jest „wycena po opisie”, bo cena zależy od metrażu i częstotliwości. Stawki „od” dodamy, kiedy je podasz.']],
  },
  {
    key: 'ogrody', path: '/strony-dla-firm-ogrodniczych/', variant: 'local_garden', label: 'Ogrody i tereny zielone',
    title: 'Strony internetowe dla firm ogrodniczych | Tovernet',
    description: 'Strona dla firmy ogrodniczej: koszenie, żywopłoty, pielęgnacja i zakładanie ogrodów. Zapytanie z powierzchnią, zakresem i porą roku. Zobacz przykład.',
    h1: 'Strona dla firmy ogrodniczej: teren, zakres i sezon w jednym zapytaniu',
    intro: 'Koszenie, żywopłoty, pielęgnacja rabat i zakładanie ogrodów. Klient chce wiedzieć, czy zajmiesz się jego terenem i kiedy. Strona pyta o powierzchnię, zakres i porę roku, więc oddzwaniasz z konkretami.',
    sample: { display_name: 'Przykładowe Ogrody', legal_name: 'Przykładowe Ogrody sp. z o.o.', city: 'Poznań' },
    needs: [
      ['Plan ogrodu zamiast listy usług', 'Klient wskazuje trawnik, żywopłot, rabaty albo liście i od razu widzi, o co pyta.'],
      ['Sezon w zapytaniu', 'Wiosna, lato, jesień albo stała opieka: wiesz, kiedy klient chce zacząć.'],
      ['Obszar dojazdu', 'Miejscowości, do których dojeżdżasz, jasno na stronie.'],
      PHONE,
    ],
    faq: [PHOTOS],
  },
  {
    key: 'warsztaty', path: '/strony-dla-warsztatow-samochodowych/', variant: 'local_auto', label: 'Warsztaty samochodowe',
    title: 'Strony internetowe dla warsztatów samochodowych | Tovernet',
    description: 'Strona dla warsztatu samochodowego: kierowca podaje auto, zakres naprawy, stan auta i termin, zanim zadzwoni. Zobacz przykład strony.',
    h1: 'Strona dla warsztatu, przez którą kierowca zgłasza auto razem z opisem problemu',
    intro: 'Mechanika, przeglądy, hamulce, klimatyzacja, opony, blacharka. Kierowca chce wiedzieć, czy zajmiesz się jego autem, gdzie jest warsztat i kiedy może przyjechać. Strona pyta o auto, zakres i termin, zanim zadzwoni telefon.',
    sample: { display_name: 'Przykładowy Serwis Aut', legal_name: 'Przykładowy Serwis Aut sp. z o.o.', city: 'Gdańsk' },
    needs: [
      ['Auto i problem w zapytaniu', 'Model, rocznik, zakres, stan auta i termin przychodzą razem z numerem.'],
      ['Rysunek auta zamiast listy usług', 'Kierowca wskazuje silnik, hamulce, zawieszenie, klimatyzację albo nadwozie.'],
      ['Adres i godziny', 'Miejsce na adres warsztatu i godziny otwarcia, widoczne bez szukania.'],
      PHONE,
    ],
    faq: [['Czy klient może zarezerwować termin przez stronę?', 'W koncepcie klient prosi o termin, a Ty potwierdzasz go telefonicznie. Narzędzie do rezerwacji możemy omówić osobno.']],
  },
  {
    key: 'detailing', path: '/strony-dla-studiow-detailingu/', variant: 'local_detailing', label: 'Detailing samochodowy',
    title: 'Strony internetowe dla studiów detailingu | Tovernet',
    description: 'Strona dla studia detailingu: klient podaje auto, zakres i stan lakieru i prosi o wycenę z telefonu. Zobacz przykład strony.',
    h1: 'Strona dla studia detailingu: klient opisuje auto i zakres, Ty wyceniasz',
    intro: 'Mycie wnętrza, pranie tapicerki, korekta lakieru, powłoki ochronne. Klient chce wiedzieć, co robisz, gdzie jest studio i ile to może kosztować. Strona zbiera auto, zakres i stan lakieru w jednym zapytaniu.',
    sample: { display_name: 'Przykładowy Detailing', legal_name: 'Przykładowy Detailing sp. z o.o.', city: 'Katowice' },
    needs: [
      ['Zakres w jednym zdaniu', 'Wnętrze, tapicerka, lakier, powłoka: klient wybiera, a stan lakieru opisuje sam.'],
      ['Auto na rysunku', 'Klient wskazuje lakier, wnętrze, tapicerkę albo reflektory.'],
      ['Miejsce na zdjęcia przed i po', 'Galeria czeka na Twoje zdjęcia. Cudzych nie wstawiamy.'],
      PHONE,
    ],
    faq: [PHOTOS],
  },
];

/**
 * PKD 2025 prefix to variant, longest prefix wins. Codes checked against
 * admin.krs_companies on 2026-11-03 (primary PKD counts in brackets).
 * Left out on purpose, they go to the general `business` concept:
 *   81.10 facility support (51), 81.22.A chimney sweeping (2), 81.23.A pest control (7),
 *   95.32 motorcycles (7), 45.31 / 45.32 parts trade (2).
 */
export const PKD_MAP: Record<string, string> = {
  '81.21': 'local_cleaning', // niespecjalistyczne sprzątanie budynków (130)
  '81.22.B': 'local_cleaning', // pozostałe sprzątanie budynków i obiektów przemysłowych (57)
  '81.23.B': 'local_cleaning', // pozostała działalność związana ze sprzątaniem (17)
  '81.22.Z': 'local_cleaning', // PKD 2007 code, in case older records appear
  '81.29': 'local_cleaning', // PKD 2007 "pozostałe sprzątanie"
  '81.30': 'local_garden', // tereny zieleni (79)
  '95.31.A': 'local_auto', // naprawa mechaniczna i serwisowa (213)
  '95.31.B': 'local_auto', // blacharsko-lakiernicza (52)
  '95.31.C': 'local_detailing', // detailing (45)
  '45.20': 'local_auto', // PKD 2007 konserwacja i naprawa pojazdów (2)
};
