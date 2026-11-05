// Journey copy that depends on the concept. Facts about the concept and the catalogue
// only: no promised results, timings or figures. Templates without an entry fall back
// to `general`.
import type { VariantKey } from './api';
import { NICHE_JOURNEY } from './niches/index';

export type FunnelCopy = {
  /** Intro letter, second paragraph: what this trade's customers check. */
  intro: string;
  /** What we fill in with the owner (stage 1). */
  slots: string[];
  /** "Dlaczego tak?" notes on the concept (stage 2). */
  notes: [string, string][];
  /** What the site does for the business (stage 3). */
  jobs: [string, string][];
  /** Why each package fits, or how it differs from, this concept. */
  fit: Record<string, string>;
  /** Price compared with the value of one job, in words, never a number. */
  compare: string;
};

const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST_IMPRESSION: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Czym się zajmujesz, gdzie działasz i jak się skontaktować, w jednym miejscu. Bez opinii i zdjęć z realizacji to strona pokazuje, że jesteś poukładaną firmą.'];
const EMPTY_SLOTS: [string, string] = ['Puste miejsca są celowe', 'Numeru telefonu i zdjęć z realizacji nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'];

const COPY: Partial<Record<VariantKey, FunnelCopy>> & { general: FunnelCopy } = {
  electrical: {
    intro: 'Zaczęliśmy od tego, co chce szybko sprawdzić ktoś, kto szuka elektryka: czym się zajmujesz, czy działasz w jego okolicy i jak się z Tobą skontaktować.',
    slots: ['Numer telefonu', 'Usługi, które naprawdę wykonujesz', 'Zdjęcia i numer uprawnień'],
    notes: [
      ['Tablica zamiast listy usług', 'Klient przełącza obwód ze swoim problemem. Formularz od razu pyta o to, co trzeba wiedzieć, żeby oddzwonić.'],
      ['Pilne osobno, planowane osobno', 'Ktoś bez prądu chce szybkiego kontaktu, ktoś przed remontem chce wyceny. Każdy dostaje inny formularz i inny przycisk.'],
      ['Kontakt pod kciukiem', 'Na telefonie pasek z numerem i przyciskiem zostaje na dole ekranu przez całą stronę.'],
      ['Puste miejsca są celowe', 'Numeru telefonu i uprawnień nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'],
    ],
    jobs: [
      FIRST_IMPRESSION,
      ['Zgłoszenia, z którymi da się coś zrobić', 'Klient wybiera problem, mówi, jak to pilne, i zostawia numer. Oddzwaniasz, wiedząc, o co chodzi.'],
      ['Działa tam, gdzie klient szuka: na telefonie', 'Kontakt jest pod kciukiem na każdym ekranie, a formularz wypełnia się jedną ręką.'],
    ],
    fit: {
      'tovernet.web.firma': 'Koncept ma formularz zgłoszeń z wyborem problemu i miejsce na osobne strony usług. Strona Firma obejmuje jedno i drugie.',
      'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez formularza zgłoszeń z konceptu i bez podstron usług.',
      'tovernet.web.pro': PRO,
    },
    compare: 'Porównaj tę kwotę z wartością jednego zlecenia, na przykład wymiany instalacji w mieszkaniu.',
  },
  finishing: {
    intro: 'Zaczęliśmy od tego, co chce sprawdzić ktoś przed remontem: czy robisz to, czego potrzebuje, czy działasz w jego okolicy i jak poprosić Cię o wycenę.',
    slots: ['Numer telefonu', 'Usługi i materiały, z którymi pracujesz', 'Zdjęcia z realizacji'],
    notes: [
      ['Plan zamiast listy usług', 'Klient zaznacza pomieszczenia, które chce wykończyć. Wie, o co pyta, a Ty od razu widzisz zakres.'],
      ['Zakres przed rozmową', 'Pomieszczenia, metraż, stan wnętrza i termin przychodzą w jednym zapytaniu. Na pomiar jedziesz przygotowany.'],
      ['Materiały narysowane, nie skopiowane', 'Płytki, drewno i farba są rysunkiem, nie zdjęciem cudzej realizacji. Nikt nie pomyli ich z Twoją pracą.'],
      EMPTY_SLOTS,
    ],
    jobs: [
      FIRST_IMPRESSION,
      ['Zapytania z zakresem, nie tylko „ile za remont?”', 'Klient zaznacza pomieszczenia, podaje metraż i termin. Oddzwaniasz, wiedząc, czego chce.'],
      ['Działa tam, gdzie klient szuka: na telefonie', 'Kontakt jest pod kciukiem na każdym ekranie, a plan da się zaznaczać palcem.'],
    ],
    fit: {
      'tovernet.web.firma': 'Koncept ma formularz wyceny z wyborem pomieszczeń i miejsce na osobne strony usług, np. łazienek i podłóg. Strona Firma obejmuje jedno i drugie.',
      'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez formularza wyceny z planem i bez podstron usług.',
      'tovernet.web.pro': PRO,
    },
    compare: 'Porównaj tę kwotę z wartością jednego zlecenia, na przykład wykończenia łazienki.',
  },
  general: {
    intro: 'Zaczęliśmy od tego, co chce szybko sprawdzić Twój przyszły klient: czym się zajmujesz, czy działasz w jego okolicy i jak się z Tobą skontaktować.',
    slots: ['Numer telefonu', 'Usługi, które naprawdę wykonujesz', 'Zdjęcia z realizacji'],
    notes: [],
    jobs: [
      FIRST_IMPRESSION,
      ['Zapytania, z którymi da się coś zrobić', 'Formularz pyta o to, czego potrzebujesz do wyceny. Oddzwaniasz, wiedząc, o co chodzi.'],
      ['Działa tam, gdzie klient szuka: na telefonie', 'Kontakt jest pod kciukiem na każdym ekranie.'],
    ],
    fit: {
      'tovernet.web.firma': 'Koncept ma formularz wyceny i miejsce na osobne strony usług. Strona Firma obejmuje jedno i drugie.',
      'tovernet.web.start': 'Jedna strona z formularzem kontaktowym, bez podstron usług.',
      'tovernet.web.pro': PRO,
    },
    compare: 'Porównaj tę kwotę z wartością jednego zlecenia.',
  },
};

// Niches added 2026-11-03 keep their copy in lib/tovernet/niches/<key>.journey.ts.
export const funnelCopy = (variant: VariantKey): FunnelCopy =>
  COPY[variant] ?? (NICHE_JOURNEY as Record<string, { funnel: FunnelCopy }>)[variant]?.funnel ?? COPY.general;
