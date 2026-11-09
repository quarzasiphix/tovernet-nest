import type { Niche } from '../niches';

// Landing entries for software houses and game studios, in the `Niche` shape.

type Landing = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

export const LANDING: Landing[] = [
  {
    key: 'firmy-it', path: '/strony-dla-firm-it/', variant: 'tech_software', label: 'Firmy IT i software house\'y',
    title: 'Strony internetowe dla firm IT i software house\'ów | Tovernet',
    description: 'Strona dla firmy IT: klient opisuje projekt i etap, a strona układa z tego brief gotowy do rozmowy.',
    h1: 'Strona dla firmy IT, na której klient od razu składa konkretny brief',
    intro: 'Aplikacje, integracje i rozwój istniejących produktów. Klient szukający wykonawcy chce wiedzieć, czy zrozumiesz jego problem. Strona prowadzi go przez kilka pytań i układa z odpowiedzi brief, od którego zaczynasz rozmowę.',
    sample: { display_name: 'Przykładowy Software', legal_name: 'Przykładowy Software sp. z o.o.', city: 'Wrocław' },
    needs: [
      ['Brief zamiast „proszę o kontakt”', 'Rodzaj projektu, etap i priorytet w jednej wiadomości.'],
      ['Realizacje także pod NDA', 'Projekt opisany jako problem i rozwiązanie, bez nazwy klienta.'],
      ['Sposób pracy na wierzchu', 'Etapy, zakres i odbiór opisane prosto.'],
      ['Działa w telefonie', 'Formularz i kontakt są pod ręką na każdym ekranie.'],
    ],
    faq: [
      ['Czy mogę pokazać stos technologiczny?', 'Tak. Wpisujemy tylko technologie, które podasz.'],
      ['Co, jeśli nie mogę pokazać klientów?', 'Opiszemy projekty bez nazw albo zostawimy samą ofertę i sposób pracy.'],
    ],
  },
  {
    key: 'studia-gier', path: '/strony-dla-studiow-gier/', variant: 'tech_games', label: 'Studia gier',
    title: 'Strony internetowe dla studiów gier | Tovernet',
    description: 'Strona dla studia gier: tytuły, materiały prasowe i osobna ścieżka kontaktu dla wydawców, prasy i graczy.',
    h1: 'Strona dla studia gier, która kieruje wydawcę, prasę i gracza tam, gdzie trzeba',
    intro: 'Wydawca, dziennikarz i gracz szukają na stronie studia czegoś innego. Strona pyta, kto pisze i w jakiej sprawie, a tytuły i pakiet prasowy są w jednym miejscu.',
    sample: { display_name: 'Przykładowe Studio', legal_name: 'Przykładowe Studio sp. z o.o.', city: 'Kraków' },
    needs: [
      ['Kontakt według nadawcy', 'Wydawca, prasa i gracz wybierają swoją sprawę.'],
      ['Miejsce na tytuły', 'Gatunek, platformy, zwiastun i link do sklepu.'],
      ['Pakiet prasowy', 'Logotypy i grafiki do pobrania.'],
      ['Działa bez premiery', 'Zanim wydasz grę, strona zbiera kontakty od partnerów.'],
    ],
    faq: [
      ['Czy mogę osadzić zwiastun?', 'Tak, jeśli podasz link lub plik.'],
      ['Czy strona pokaże listę życzeń na Steam?', 'Tak, jako link do Twojej strony w sklepie.'],
    ],
  },
];

/** PKD 2025 prefix to variant. 26.20 (hardware) and 60.39 (content distribution) stay on `business`. */
export const PKD_MAP: Record<string, string> = {
  '62.10': 'tech_software',
  '62.20': 'tech_software',
  '58.29': 'tech_software',
  '58.21': 'tech_games',
};
