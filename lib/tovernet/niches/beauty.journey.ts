import type { FunnelCopy } from '@/lib/tovernet/funnelCopy';
import type { WelcomeCopy } from '@/components/tovernet/studio/copy';

// Journey copy for the beauty concept (BeautySite). Facts about the concept and the
// catalogue only: no promised results, timings or figures. Whether a plain link to the
// client's Booksy is part of Start and Firma is still open with the owner, so only Pro
// (one connection with an external tool) mentions a booking calendar.

const PRO = 'Więcej podstron, jedno połączenie z zewnętrznym narzędziem, np. kalendarzem rezerwacji, wizytówka Google i 3 miesiące pracy nad widocznością w okolicy.';
const FIRST_IMPRESSION: [string, string] = ['Pierwsze wrażenie, kiedy klient Cię sprawdza', 'Co robicie, gdzie jesteście i jak się umówić, w jednym miejscu. Bez opinii i zdjęć efektów to strona pokazuje, że salon jest zadbany i poukładany.'];
const EMPTY_SLOTS: [string, string] = ['Puste miejsca są celowe', 'Numeru telefonu, adresu, godzin, cen ani zdjęć wnętrza nie znamy, więc ich nie wymyślamy. Uzupełnisz je przed publikacją.'];
const NAME: [string, string] = ['Nazwa jak marka', 'Nazwa firmy jest największym elementem pierwszego ekranu. Salon wygląda jak marka, a nie jak wpis w katalogu.'];
const BOOKSY: [string, string] = ['Obok Booksy, nie zamiast', 'Przycisk „Umów wizytę” może prowadzić do kalendarza, którego już używasz. Kto go nie ma, dostaje krótką prośbę o termin z wybranymi zabiegami.'];
const ART: [string, string] = ['Grafika zamiast cudzych zdjęć', 'Obraz na pierwszym ekranie jest rysunkiem opisanym jako poglądowy. Kadry mają pionowy format, więc później wejdą w nie zdjęcia z Twojego telefonu.'];
const PHONE: [string, string] = ['Działa tam, gdzie klient sprawdza: na telefonie', 'Pasek z przyciskiem „Umów wizytę” zostaje na dole ekranu przez całą stronę.'];

const journey = (o: { lead: string; card: string; intro: string; slots: string[]; ask: [string, string]; firma: string; compare: string }): { welcome: WelcomeCopy; funnel: FunnelCopy } => ({
  welcome: { lead: `${o.lead} Zobacz, jak Twoja firma mogłaby wyglądać w sieci.`, features: [o.card, 'Umów wizytę pod kciukiem'] },
  funnel: {
    intro: o.intro,
    slots: o.slots,
    notes: [NAME, [o.card, 'Klient zaznacza zabiegi na liście, a one wpisują się do karty wizyty. Prośba o termin przychodzi z gotowym zakresem.'], BOOKSY, ART, EMPTY_SLOTS],
    jobs: [FIRST_IMPRESSION, o.ask, PHONE],
    fit: {
      'tovernet.web.firma': o.firma,
      'tovernet.web.start': 'Jedna strona z formularzem kontaktowym. Bez karty zabiegów z prośbą o termin i bez podstron.',
      'tovernet.web.pro': PRO,
    },
    compare: o.compare,
  },
});

export const JOURNEY: Record<string, { welcome: WelcomeCopy; funnel: FunnelCopy }> = {
  beauty_hair: journey({
    lead: 'To strona, na której klient sprawdza salon przed wizytą, zaznacza strzyżenie, kolor albo brodę i umawia się prosto z telefonu.',
    card: 'Karta zabiegów',
    intro: 'Zaczęliśmy od tego, co sprawdza ktoś przed pierwszą wizytą u fryzjera: jak wygląda salon, co robicie, gdzie jesteście i jak się umówić.',
    slots: ['Numer telefonu, adres i godziny', 'Usługi i ceny, które naprawdę macie', 'Zdjęcia wnętrza z telefonu'],
    ask: ['Prośby o termin z konkretami', 'Klient podaje zabiegi, długość włosów i porę dnia. Oddzwaniasz albo piszesz, wiedząc, ile czasu zarezerwować.'],
    firma: 'Koncept ma kartę zabiegów z prośbą o termin i miejsce na osobne strony, np. cennika i koloryzacji. Strona Firma obejmuje jedno i drugie.',
    compare: 'Porównaj tę kwotę z tym, co zostawia u Ciebie jedna stała klientka albo jeden stały klient przez rok.',
  }),
  beauty_salon: journey({
    lead: 'To strona, na której klientka sprawdza salon przed wizytą, zaznacza zabiegi i umawia się prosto z telefonu.',
    card: 'Karta zabiegów',
    intro: 'Zaczęliśmy od tego, co sprawdza ktoś przed pierwszą wizytą w salonie kosmetycznym: jak tam jest, jakie zabiegi robicie, gdzie jesteście i jak się umówić.',
    slots: ['Numer telefonu, adres i godziny', 'Zabiegi i ceny, które naprawdę macie', 'Zdjęcia wnętrza z telefonu'],
    ask: ['Prośby o termin z konkretami', 'Klientka podaje zabiegi, porę dnia i czy to pierwsza wizyta. Wiesz, ile czasu zarezerwować.'],
    firma: 'Koncept ma kartę zabiegów z prośbą o termin i miejsce na osobne strony, np. cennika i stylizacji paznokci. Strona Firma obejmuje jedno i drugie.',
    compare: 'Porównaj tę kwotę z tym, co zostawia u Ciebie jedna stała klientka przez rok.',
  }),
  beauty_spa: journey({
    lead: 'To strona, na której gość sprawdza miejsce, wybiera masaż albo bon podarunkowy i umawia się prosto z telefonu.',
    card: 'Karta zabiegów',
    intro: 'Zaczęliśmy od tego, co sprawdza ktoś przed wizytą w spa albo przed kupnem prezentu: jakie zabiegi robicie, jak tam jest, gdzie jesteście i jak się umówić.',
    slots: ['Numer telefonu, adres i godziny', 'Zabiegi i ceny, które naprawdę macie', 'Zdjęcia wnętrza z telefonu'],
    ask: ['Prośby o termin i o bony', 'Gość podaje zabiegi i od razu mówi, czy to dla niego, dla dwóch osób, czy na prezent.'],
    firma: 'Koncept ma kartę zabiegów z prośbą o termin lub bon i miejsce na osobne strony, np. cennika i bonów podarunkowych. Strona Firma obejmuje jedno i drugie.',
    compare: 'Porównaj tę kwotę z tym, co zostawia u Ciebie jeden stały gość przez rok.',
  }),
};
