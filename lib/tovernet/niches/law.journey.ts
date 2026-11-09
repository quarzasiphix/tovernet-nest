// Journey copy for the law firm concept. Facts about the concept and catalogue only.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Same wording as PRO in lib/tovernet/funnelCopy.ts (not exported there).
const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  law_firm: {
    welcome: {
      lead: 'To strona ułożona jak akt: artykuły, paragrafy i dane, bez haseł reklamowych. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Układ artykułów i paragrafów', 'Prośba o kontakt bez opisu sprawy'],
    },
    funnel: {
      intro: 'Zaczęliśmy od tego, co ktoś sprawdza o kancelarii: kto ją prowadzi, czym się zajmuje i jak się z nią skontaktować. Forma jest informacyjna, a ostateczną treść zatwierdzasz Ty.',
      slots: ['Tytuły zawodowe i numery wpisów', 'Telefon, e-mail i adres', 'Rzeczywisty zakres działalności'],
      notes: [
        ['Forma aktu zamiast reklamy', 'Numerowane artykuły i spis treści, które pomagają znaleźć konkretną informację.'],
        ['Formularz nie pyta o sprawę', 'Zamiast pola na opis jest zaczerniony wiersz i ostrzeżenie, żeby nie wysyłać danych poufnych przed nawiązaniem kontaktu.'],
        ['Jedno zdanie zamiast pól', 'Prośba o kontakt to zdanie z kilkoma wyborami, które działa też na telefonie.'],
        ['Puste miejsca są celowe', 'Tytułów, wpisów, osób i obszarów działalności nie znamy, więc ich nie wymyślamy. Każde takie miejsce jest opisane.'],
      ],
      jobs: [
        ['Pierwsze wrażenie, kiedy ktoś Cię sprawdza', 'Dane rejestrowe i osoby są widoczne od razu. Nawet nowa kancelaria wygląda na poukładaną.'],
        ['Prośby o kontakt, które da się obsłużyć', 'Wiesz, kto pisze, jak i kiedy się z nim skontaktować.'],
        ['Mniej poufnych treści w skrzynce', 'Formularz nie zbiera opisu sprawy.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept z prośbą o kontakt w formie zdania i osobne podstrony, np. dla zakresu działalności i osób.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym. Bez prośby w formie zdania i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego zlecenia.',
    },
  },
};
