import type { Niche } from '../niches';

// Landing entries for the beauty concept, in the `Niche` shape. `key` and `variant` are
// plain strings here because `NicheKey` and `VariantKey` get the beauty values only at
// integration. The integrator appends COMMON_FAQ to each `faq`.

type BeautyLanding = Omit<Niche, 'key' | 'variant'> & { key: string; variant: string };

const BOOKSY_FAQ: [string, string] = [
  'Mam już Booksy. Po co mi strona?',
  'Strona nie zastępuje systemu rezerwacji. Pokazuje salon jako markę: nazwę, usługi, wnętrze, adres i godziny, a przycisk «Umów wizytę» prowadzi tam, gdzie już przyjmujesz rezerwacje: do Booksy lub innego kalendarza, na telefon albo do prośby o termin.',
];
const PHOTOS_FAQ: [string, string] = [
  'Nie mam jeszcze dobrych zdjęć salonu.',
  'Wystarczą zdjęcia z telefonu. Miejsca na zdjęcia mają pionowy kadr, taki jak w telefonie, a wszystkie zdjęcia dostają jeden spójny styl. Do tego czasu zostają grafiki opisane jako poglądowe. Nie wstawiamy cudzych zdjęć udających Twój salon ani Twoje efekty.',
];
const PRICES_FAQ: [string, string] = [
  'Czy na stronie będzie cennik?',
  'Tak, jeśli chcesz. Ceny i czas zabiegów wpisujesz Ty, a my układamy je czytelnie. Nie wstawiamy przykładowych cen, opinii ani wolnych terminów.',
];

const needs = (what: string): [string, string][] => [
  ['Najpierw wrażenie', `Klient sprawdza ${what} w telefonie, zanim się umówi. Nazwa, klimat i zdjęcia od razu wyglądają jak marka, a nie jak wpis w katalogu.`],
  ['Umów wizytę jednym kciukiem', 'Przycisk zawsze pod ręką. Prowadzi tam, gdzie przyjmujesz rezerwacje: do Booksy lub innego kalendarza, na telefon albo do prośby o termin.'],
  ['Usługi jak karta zabiegów', 'Klient zaznacza, na co chce przyjść, i z tą listą prosi o termin.'],
  ['Adres i godziny', 'Gdzie jesteście, kiedy otwarte i jak dojechać, bez szukania po profilach.'],
];

export const LANDING: BeautyLanding[] = [
  {
    key: 'fryzjerzy', path: '/strony-dla-fryzjerow/', variant: 'beauty_hair', label: 'Fryzjerzy i barberzy',
    title: 'Strony internetowe dla salonów fryzjerskich i barberów | Tovernet',
    description: 'Strona dla salonu fryzjerskiego i barbera: nazwa jak marka, usługi, adres i przycisk «Umów wizytę» prowadzący do Booksy, telefonu albo formularza.',
    h1: 'Strona dla salonu fryzjerskiego, która działa razem z Booksy',
    intro: 'Strzyżenie, koloryzacja, broda. Zanim ktoś się umówi, sprawdza salon w telefonie: jak wygląda, co robicie, gdzie jesteście i jak zarezerwować. Strona odpowiada na to, a rezerwację zostawia narzędziu, którego już używasz.',
    sample: { display_name: 'Przykładowy Salon', legal_name: 'Przykładowy Salon sp. z o.o.', city: 'Wrocław' },
    needs: needs('salon'),
    faq: [BOOKSY_FAQ, PHOTOS_FAQ, PRICES_FAQ],
  },
  {
    key: 'kosmetyka', path: '/strony-dla-salonow-kosmetycznych/', variant: 'beauty_salon', label: 'Salony kosmetyczne',
    title: 'Strony internetowe dla salonów kosmetycznych i stylizacji paznokci | Tovernet',
    description: 'Strona dla salonu kosmetycznego: paznokcie, brwi i rzęsy, twarz, makijaż. Karta zabiegów i przycisk «Umów wizytę» do Booksy, telefonu albo formularza.',
    h1: 'Strona dla salonu kosmetycznego, która wygląda jak marka i prowadzi do rezerwacji',
    intro: 'Paznokcie, brwi i rzęsy, twarz, makijaż. Klientka sprawdza salon w telefonie, zanim wybierze termin. Strona pokazuje, co robicie i gdzie jesteście, a rezerwację prowadzi tam, gdzie już ją przyjmujesz.',
    sample: { display_name: 'Przykładowe Studio', legal_name: 'Przykładowe Studio sp. z o.o.', city: 'Gdańsk' },
    needs: needs('salon'),
    faq: [BOOKSY_FAQ, PHOTOS_FAQ, PRICES_FAQ],
  },
  {
    key: 'spa', path: '/strony-dla-gabinetow-masazu-i-spa/', variant: 'beauty_spa', label: 'Masaż i spa',
    title: 'Strony internetowe dla gabinetów masażu i spa | Tovernet',
    description: 'Strona dla gabinetu masażu i spa: zabiegi, bony podarunkowe, adres i godziny, przycisk «Umów wizytę» do Booksy, telefonu albo formularza.',
    h1: 'Strona dla gabinetu masażu i spa, przez którą łatwo się umówić albo poprosić o bon',
    intro: 'Masaż, sauna, rytuały. Gość sprawdza miejsce w telefonie, zanim się umówi albo kupi komuś prezent. Strona pokazuje zabiegi i klimat, a prośba o termin albo o bon podarunkowy przychodzi z gotowymi szczegółami.',
    sample: { display_name: 'Przykładowe Spa', legal_name: 'Przykładowe Spa sp. z o.o.', city: 'Poznań' },
    needs: needs('miejsce'),
    faq: [BOOKSY_FAQ, PHOTOS_FAQ, PRICES_FAQ],
  },
];

/**
 * PKD prefix to variant. Primary PKD only, longest prefix wins. 96.21/96.22/96.23 are
 * PKD 2025; 96.02 and 96.04 are their PKD 2007 predecessors still present in KRS.
 * Not mapped (fall back to `business`): 96.10 laundry, 96.30 funeral, 96.40 intermediation,
 * 96.09 and 96.99 other personal services (tattoo, pet grooming, mixed).
 */
export const PKD_MAP: Record<string, string> = {
  '96.21': 'beauty_hair',
  '96.22': 'beauty_salon',
  '96.23': 'beauty_spa',
  '96.02': 'beauty_salon',
  '96.04': 'beauty_spa',
};
