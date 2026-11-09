// Journey copy for the business consulting concept. Facts about the concept and catalogue only.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Same wording as PRO in lib/tovernet/funnelCopy.ts (not exported there).
const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  consult_business: {
    welcome: {
      lead: 'To strona, na której klient w dwóch wyborach dochodzi od objawu do pytania na pierwszą rozmowę. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Drzewo problemów', 'Dane spółki dla kontrahentów'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, z czym przychodzi klient firmy doradczej: wie, że coś nie działa, ale rzadko umie to nazwać.',
      slots: ['Telefon i e-mail', 'Osoba prowadząca rozmowy', 'Specjalizacje i sprawy opisane bez nazw klientów'],
      notes: [
        ['Drzewo problemów zamiast listy usług', 'Nie znamy Twojej specjalizacji, więc zaczynamy od problemów klienta. Gałęzie ułożymy pod to, czym naprawdę się zajmujesz.'],
        ['Wzór notatki po rozmowie', 'Pokazuje sposób myślenia, kiedy nie ma jeszcze listy klientów. Dopasujemy go do tego, jak pracujesz.'],
        ['Osobna część z danymi spółki', 'Bank albo kontrahent często chce tylko sprawdzić, z kim ma do czynienia.'],
        ['Puste miejsca są celowe', 'Twoich klientów, spraw i zespołu nie znamy, więc ich nie wymyślamy. Każde takie miejsce jest opisane.'],
      ],
      jobs: [
        ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Polecony klient i tak zajrzy na stronę, zanim zadzwoni. Nawet bez listy klientów widać, że jesteś poukładaną firmą.'],
        ['Rozmowy, które zaczynają się od konkretu', 'W wiadomości jest obszar, objaw i pytanie.'],
        ['Odpowiedź dla kontrahentów', 'Dane spółki są w jednym miejscu.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z drzewem problemów i osobne podstrony, np. dla oferty i opisanych spraw.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym. Bez drzewa problemów i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego zlecenia.',
    },
  },
};
