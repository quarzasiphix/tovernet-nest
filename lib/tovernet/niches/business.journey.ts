// Journey copy for the general company concept (`business`). Facts about the concept and
// the catalogue only: no promised results, timings or figures. The compare line names no
// trade and no amount, because this concept serves every PKD without a niche.
import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Same wording as PRO in lib/tovernet/funnelCopy.ts (not exported there).
const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
// Same idea as FIRST_IMPRESSION in lib/tovernet/funnelCopy.ts, worded for any company.
const FIRST_IMPRESSION: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Kim jesteś, czym się zajmujesz i jak do Ciebie napisać, w jednym miejscu. Bez opinii i portfolio to strona pokazuje, że jesteś poukładaną firmą.'];

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  business: {
    welcome: {
      lead: 'To strona, na której klient od razu widzi, kim jesteś i czym się zajmujesz, a potem pisze do Ciebie jako firma albo osoba prywatna, prosto z telefonu. Zobacz, jak Twoja firma mogłaby wyglądać w sieci.',
      features: ['Spis treści firmy', 'Formularz dla firm i osób'],
    },
    funnel: {
      intro: 'Zaczęliśmy od pytań, z którymi klient wchodzi na stronę każdej firmy: kim jesteś, czym się zajmujesz, jak pracujesz i jak do Ciebie napisać.',
      slots: ['Telefon i e-mail', 'Oferta opisana Twoimi słowami', 'Kilka zdań o firmie, logo i zdjęcia'],
      notes: [
        ['Strona ułożona jak spis treści', 'Cztery rozdziały odpowiadają na cztery pytania klienta. Na górze strony widać, który rozdział właśnie czyta.'],
        ['Fakty z rejestru jako fakty', 'Nazwa, forma prawna, siedziba, KRS i główna działalność są podane tak, jak w rejestrze. Nic do nich nie dopisujemy.'],
        ['Jeden formularz dla firm i osób prywatnych', 'Klient wybiera, jako kto pisze. Firma podaje nazwę i NIP, osoba prywatna tylko imię. Wystarczy e-mail albo telefon.'],
        ['Puste miejsca są celowe', 'Twojej oferty, telefonu i zdjęć nie znamy, więc ich nie wymyślamy. Każde takie miejsce jest opisane. Uzupełnisz je przed publikacją.'],
      ],
      jobs: [
        FIRST_IMPRESSION,
        ['Wiadomości, na które da się odpowiedzieć', 'Wiesz, czy pisze firma czy osoba prywatna, czego dotyczy sprawa i jak odpowiedzieć.'],
        ['Działa tam, gdzie klient sprawdza: na telefonie', 'Przycisk kontaktu jest pod kciukiem na każdym ekranie.'],
      ],
      fit: {
        'tovernet.web.firma': 'Koncept ma formularz z wyborem firma albo osoba prywatna i miejsce na ofertę. Strona Firma obejmuje ten formularz i osobne podstrony, np. dla oferty i o firmie.',
        'tovernet.web.start': 'Jedna strona w tym układzie z prostym formularzem kontaktowym. Bez formularza z wyborem firma albo osoba prywatna i bez podstron.',
        'tovernet.web.pro': PRO,
      },
      compare: 'Porównaj tę kwotę z wartością jednego nowego klienta albo jednego zamówienia.',
    },
  },
};
