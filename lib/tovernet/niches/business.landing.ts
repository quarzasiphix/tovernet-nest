import type { Niche } from '../niches';

// Landing entry for the general company concept. `key` and `variant` sit outside the
// current unions until the integrator adds them to `NicheKey` and `VariantKey`.

type Landing = Omit<Niche, 'key' | 'variant'> & { key: 'firmy'; variant: 'business' };

export const LANDING: Landing[] = [
  {
    key: 'firmy',
    path: '/strony-dla-firm/',
    variant: 'business',
    label: 'Strona firmowa',
    title: 'Strona internetowa dla firmy i spółki | Tovernet',
    description: 'Strona firmowa: kim jesteś, czym się zajmujesz, jak pracujesz i jak do Ciebie napisać. Jeden formularz dla firm i klientów prywatnych. Zobacz przykład.',
    h1: 'Strona firmowa, z której klient w kilka sekund wie, kim jesteś i jak do Ciebie napisać',
    intro: 'Handel, produkcja, IT, doradztwo, edukacja, usługi dla firm. Jeśli Twoja działalność nie mieści się w jednej branżowej szufladzie, strona i tak musi odpowiedzieć na te same pytania: kim jesteś, czym się zajmujesz i jak zacząć rozmowę.',
    sample: { display_name: 'Przykładowa Spółka', legal_name: 'Przykładowa Spółka sp. z o.o.', city: 'Wrocław' },
    needs: [
      ['Kim jesteś, od pierwszego ekranu', 'Nazwa, siedziba i główna działalność podane czytelnie, bez szukania po podstronach.'],
      ['Oferta Twoimi słowami', 'Usługi lub produkty opisujemy razem z Tobą. Nie wstawiamy ogólników ani pozycji, których nie prowadzisz.'],
      ['Jeden formularz dla firm i osób prywatnych', 'Klient wybiera, jako kto pisze, a formularz pyta tylko o to, czego potrzebujesz do odpowiedzi.'],
      ['Działa w telefonie', 'Przycisk kontaktu jest pod ręką na każdym ekranie telefonu.'],
    ],
    faq: [
      ['Moja firma działa w innej branży. Czy ta strona do niej pasuje?', 'Tak. Ten koncept nie zakłada konkretnej branży. Układ zostaje, a treści, zdjęcia i formularz dopasowujemy do tego, czym faktycznie się zajmujesz.'],
      ['Czy to może być sklep internetowy?', 'Nie. Sklep internetowy nie wchodzi w nasze pakiety. Strona może pokazać Twoją ofertę i zbierać zapytania przez formularz.'],
    ],
  },
];

/**
 * PKD prefix to variant. `business` is the fallback: `tovernet.niche_for_pkd` returns it
 * for every PKD that no niche table claims, so it needs no prefixes of its own. The `*`
 * key documents that rule for the integrator; it is not a PKD prefix.
 */
export const PKD_MAP: Record<string, string> = { '*': 'business' };
