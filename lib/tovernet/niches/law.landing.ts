import type { Niche } from '../niches';

// Landing entry for law firms, in the `Niche` shape. The page never says a site is compliant
// with professional rules: that assessment belongs to the firm and the lawyer.

type Landing = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

export const LANDING: Landing[] = [
  {
    key: 'kancelarie-prawne', path: '/strony-dla-kancelarii-prawnych/', variant: 'law_firm', label: 'Kancelarie prawne',
    title: 'Strony internetowe dla kancelarii prawnych | Tovernet',
    description: 'Strona kancelarii ułożona jak akt: dane z rejestru, zakres działalności, osoby i prosta prośba o kontakt bez opisu sprawy.',
    h1: 'Strona kancelarii napisana jak informacja, a nie jak reklama',
    intro: 'Kto sprawdza kancelarię, szuka danych: kim są ludzie, czym się zajmują i jak się skontaktować. Układamy stronę jak akt, artykułami i paragrafami, bez haseł. Treść zatwierdzasz przed publikacją.',
    sample: { display_name: 'Przykładowa Kancelaria', legal_name: 'Przykładowa Kancelaria sp.k.', city: 'Poznań' },
    needs: [
      ['Dane zamiast haseł', 'Firma, siedziba, KRS i tytuły zawodowe w jednym miejscu.'],
      ['Kontakt bez opisu sprawy', 'Formularz prosi o sposób kontaktu i ostrzega przed wysyłaniem danych poufnych.'],
      ['Osoby i tytuły', 'Imię, nazwisko, tytuł zawodowy i numer wpisu, tak jak je podasz.'],
      ['Działa w telefonie', 'Numer i prośba o kontakt są pod ręką na każdym ekranie.'],
    ],
    faq: [
      ['Czy taka strona spełnia zasady mojego samorządu?', 'Układamy ją jako informację o kancelarii, ale tej oceny nie wydajemy. Za treść odpowiada kancelaria, dlatego zatwierdzasz ją przed publikacją.'],
      ['Skąd wezmą się tytuły i obszary działalności?', 'Wpisujemy tylko to, co podasz. Do tego czasu widać opisane puste miejsca i przykłady oznaczone jako przykłady.'],
      ['Czy klient może przysłać dokumenty przez stronę?', 'Nie w tym układzie. Formularz służy tylko do prośby o kontakt, a sprawę omawiasz z klientem bezpośrednio.'],
    ],
  },
];

/** PKD 2025 prefix to variant. */
export const PKD_MAP: Record<string, string> = {
  '69.10': 'law_firm',
};
