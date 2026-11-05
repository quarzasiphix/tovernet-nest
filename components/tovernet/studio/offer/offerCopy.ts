// Offer copy keyed by catalogue system_key (ksiegai/docs/plans/tovernet/16-offer-redesign.md).
// Prices never live here: they come from demo.packages. Quantities repeat the catalogue limits
// (pages, revision rounds, delivery targets) and must change with them.
// Lines marked [owner] or [lawyer] are awaiting that decision; see doc 16, "Decisions".
import type { VariantKey } from '@/lib/tovernet/api';

export const PKG = { start: 'tovernet.web.start', firma: 'tovernet.web.firma', pro: 'tovernet.web.pro' } as const;
export const PLAN = {
  hosting: 'tovernet.plan.hosting',
  care: 'tovernet.care.monthly',
  growth: 'tovernet.plan.growth',
  /** [owner] Proposed plan Rozwój. Not in the catalogue; shown only where a catalogue has it. */
  develop: 'tovernet.plan.develop',
} as const;

export type Journey = 'new' | 'migration';

export type PackageCopy = {
  /** Outcome, one line. */
  headline: string;
  forWho: Record<Journey, string>;
  /** Three to five most valuable deliverables for the card. */
  top: string[];
  /** Page structure, explicit about the homepage. */
  pages: string;
  /** Number of pages drawn in the page stack, homepage included. */
  sheets: number;
  rounds: number;
  /** Target, not a contractual deadline. */
  days: number;
  weDo: string[];
  youDo: string[];
  migration: string;
};

export const PACKAGES: Record<string, PackageCopy> = {
  [PKG.start]: {
    headline: 'Wyglądasz poważnie, kiedy klient Cię sprawdza.',
    forWho: {
      new: 'Dla firmy, która potrzebuje jednej porządnej strony: kim jesteś, co robisz, gdzie działasz i jak się skontaktować.',
      migration: 'Dla firmy, której obecna strona to jedna wizytówka. Odświeżamy ją w nowym projekcie, na Twoich materiałach.',
    },
    top: ['Strona główna do 6 sekcji, na komputer i telefon', 'Przycisk „Zadzwoń” i formularz kontaktowy', 'Domena .pl rejestrowana na Twoją firmę', '1 runda poprawek przed publikacją'],
    pages: 'Jedna strona główna, do 6 sekcji. Bez podstron.',
    sheets: 1,
    rounds: 1,
    days: 5,
    weDo: ['Dopracowujemy koncept z Twoimi danymi, kolorami i zdjęciami', 'Redagujemy Twoje teksty, żeby były krótkie i jasne', 'Rejestrujemy domenę .pl na Twoją firmę i uruchamiamy stronę', 'Ustawiamy tytuły, opisy, mapę witryny i Google Search Console', 'Podłączamy formularz, żeby wiadomości trafiały na Twój e-mail'],
    youDo: ['Wypełniasz krótką ankietę w panelu: numer, e-mail, obszar działania', 'Piszesz kilka zdań o firmie i usługach, my je redagujemy', 'Przesyłasz zdjęcia z telefonu i logo, jeśli je masz', 'Oglądasz gotową stronę i zgłaszasz uwagi'],
    migration: 'Przenosimy treść i zdjęcia z obecnej strony na jedną nową stronę główną.',
  },
  [PKG.firma]: {
    headline: 'Klient widzi każdą usługę i od razu prosi o wycenę.',
    forWho: {
      new: 'Dla firmy z kilkoma usługami, która chce dostawać zapytania z konkretami: co, gdzie i na kiedy.',
      migration: 'Dla firmy, która ma stronę z kilkoma podstronami i chce ją przenieść do nowego projektu bez pisania wszystkiego od zera.',
    },
    top: ['Strona główna + do 5 podstron, np. osobno każda usługa', 'Formularz wyceny dopasowany do Twojej branży', 'Teksty piszemy za Ciebie, Ty tylko akceptujesz', 'Poczta w Twojej domenie, np. kontakt@twojafirma.pl', '2 rundy poprawek przed publikacją'],
    pages: 'Strona główna i do 5 podstron, razem do 6 stron.',
    sheets: 6,
    rounds: 2,
    days: 10,
    weDo: ['Wszystko, co w Start', 'Piszemy teksty wszystkich stron na podstawie ankiety', 'Projektujemy formularz wyceny z polami, których potrzebujesz do wyceny', 'Konfigurujemy domenę do poczty firmowej u wybranego dostawcy', 'Układamy podstrony tak, żeby każda usługa miała swój adres'],
    youDo: ['Odpowiadasz na pytania w ankiecie w panelu, zamiast pisać teksty', 'Zaznaczasz, które usługi są najważniejsze', 'Przesyłasz zdjęcia i logo, jeśli je masz', 'Czytasz teksty i zgłaszasz uwagi w dwóch rundach'],
    migration: 'Przenosimy treści, zdjęcia i usługi z obecnej strony, do 5 podstron, i ustawiamy przekierowania ze starych adresów.',
  },
  [PKG.pro]: {
    headline: 'Większa strona i 3 miesiące pracy nad tym, żeby znaleźli Cię klienci z okolicy.',
    forWho: {
      new: 'Dla firmy, która działa w kilku miastach albo od początku chce budować obecność w Google.',
      migration: 'Dla firmy z rozbudowaną stroną: wiele podstron, integracja i adresy, które warto zachować w Google.',
    },
    top: ['Strona główna + do 12 podstron, np. usługi w miastach', 'Jedna integracja: rezerwacje, mapa zasięgu lub CRM', 'Wizytówka Google założona i uzupełniona', '3 miesiące pracy nad widocznością w cenie pakietu', '3 rundy poprawek i pierwszeństwo w kolejce'],
    pages: 'Strona główna i do 12 podstron, razem do 13 stron.',
    sheets: 13,
    rounds: 3,
    days: 20,
    weDo: ['Wszystko, co w Firma', 'Projektujemy podstrony usług dla poszczególnych miast', 'Podłączamy jedną integrację i sprawdzamy, czy działa', 'Zakładamy i uzupełniamy wizytówkę Google', 'Przez 3 miesiące po publikacji: 3 nowe podstrony lub artykuły i comiesięczny raport'],
    youDo: ['Odpowiadasz na pytania w ankiecie i wskazujesz miasta', 'Dajesz dostęp do narzędzia, które mamy podłączyć', 'Potwierdzasz wizytówkę Google kodem od Google', 'Akceptujesz tematy nowych treści'],
    migration: 'Przenosimy rozbudowaną stronę, do 12 podstron, odtwarzamy uzgodnione funkcje i ustawiamy przekierowania ze starych adresów.',
  },
};

/** Shown in the scope sheet for every package. */
export const REVISIONS = [
  'Runda poprawek to jedna lista uwag do całej strony. Wprowadzamy ją w całości i pokazujemy nową wersję.',
  'Jeśli coś odbiega od ustaleń z zamówienia, poprawiamy to bez zużywania rundy.',
  'Nowy układ, nowe sekcje albo nowe teksty po akceptacji wyceniamy osobno, zanim cokolwiek zrobimy.',
];

export type PlanCopy = { headline: string; boundary: string };

export const PLANS: Record<string, PlanCopy> = {
  [PLAN.hosting]: { headline: 'Twoja strona zawsze działa.', boundary: 'Bez zmian w treści. Gdy czegoś potrzebujesz, wyceniamy to przed wykonaniem.' },
  [PLAN.care]: { headline: 'Nie musisz sam zajmować się stroną.', boundary: '30 minut na drobne zmiany na istniejących stronach: teksty, zdjęcia, ceny, godziny, dane kontaktowe. Minuty nie przechodzą na kolejny miesiąc.' },
  [PLAN.growth]: { headline: 'Pomagamy klientom z Twojej okolicy znaleźć Twoją firmę.', boundary: 'Jedna nowa podstrona lub artykuł w miesiącu, temat ustalamy razem. Nie obiecujemy pozycji w Google ani liczby zapytań.' },
  [PLAN.develop]: { headline: 'Co miesiąc aktywnie rozwijamy Twoją stronę.', boundary: 'Do 2 godzin prac rozwojowych w miesiącu, bez przenoszenia na kolejny. Większe zmiany wyceniamy osobno.' },
};

/** Plans shown first for each package. Every plan stays selectable behind "Zobacz wszystkie plany". */
export const RECOMMENDED: Record<string, string[]> = {
  [PKG.start]: [PLAN.hosting, PLAN.care, PLAN.growth],
  [PKG.firma]: [PLAN.care, PLAN.growth, PLAN.develop],
  [PKG.pro]: [PLAN.care, PLAN.growth, PLAN.develop],
};

/** Why a plan fits the chosen package. Missing pair: no reason shown. */
export const REASONS: Record<string, Record<string, string>> = {
  [PKG.start]: {
    [PLAN.hosting]: 'Najtańsza opcja. Wystarczy, jeśli treść strony rzadko się zmienia.',
    [PLAN.care]: 'Gdy zmieni się numer, cennik albo godziny, piszesz w panelu, a my poprawiamy.',
    [PLAN.growth]: 'Jeśli obok strony głównej co miesiąc ma przybywać nowa treść o Twoich usługach.',
  },
  [PKG.firma]: {
    [PLAN.hosting]: 'Jeśli zmiany zdarzają się rzadko i wolisz zamawiać je osobno.',
    [PLAN.care]: 'Przy kilku podstronach zawsze coś się zmienia: usługa, zdjęcie, cena. Masz na to 30 minut co miesiąc.',
    [PLAN.growth]: 'Co miesiąc nowa podstrona lub artykuł i prowadzenie wizytówki Google.',
    [PLAN.develop]: 'Gdy strona ma się co miesiąc zmieniać: nowe sekcje, lepszy formularz, kolejne poprawki.',
  },
  [PKG.pro]: {
    [PLAN.hosting]: 'Jeśli treścią zajmuje się ktoś u Ciebie, a od nas potrzebujesz tylko działającej strony.',
    [PLAN.care]: 'Pierwsze 3 miesiące pracy nad widocznością masz już w pakiecie. Na ten czas wystarczy Opieka.',
    [PLAN.growth]: 'Kontynuacja pracy nad widocznością po 3 miesiącach z pakietu.',
    [PLAN.develop]: 'Dla rozbudowanej strony, która ma się dalej rozwijać po publikacji.',
  },
};

/** Pro already includes 3 months of visibility work: these plans overlap with it at first. */
export const OVERLAPS_PRO: string[] = [PLAN.growth, PLAN.develop];

export type AddonCopy = { get: string; you: string; outside?: string };

export const ADDONS: Record<string, AddonCopy> = {
  'tovernet.addon.page': { get: 'Jedna podstrona w stylu Twojej strony, z Twoich tekstów i zdjęć.', you: 'Tekst i zdjęcia do podstrony.', outside: 'Napisanie tekstu od zera wyceniamy osobno.' },
  'tovernet.addon.email': { get: 'Domena ustawiona do poczty u wybranego dostawcy, do 3 skrzynek, z rekordami, które chronią przed trafianiem do spamu.', you: 'Wybór dostawcy poczty i opłacenie jego abonamentu.', outside: 'Abonament dostawcy poczty, np. Google Workspace lub Microsoft 365.' },
  'tovernet.addon.gsc': { get: 'Weryfikacja strony w Google i przesłanie mapy witryny.', you: 'Nic. Dostęp przekażemy na Twoje konto Google.' },
  'tovernet.addon.booking': { get: 'Podłączenie jednego narzędzia do rezerwacji wizyt.', you: 'Konto w narzędziu do rezerwacji.', outside: 'Abonament narzędzia do rezerwacji.' },
};

/** Services with variable scope: priced individually, never added to the cart. */
export const QUOTED: { group: string; items: { name: string; note: string; inPro?: boolean }[] }[] = [
  { group: 'Domena i poczta', items: [
    { name: 'Przeniesienie istniejącej domeny', note: 'Przeprowadzimy Cię przez przekazanie domeny i ustawienia DNS, bez przerwy w poczcie.' },
    { name: 'Przeniesienie poczty', note: 'Nowy dostawca, przeniesienie wiadomości, zmiana planowana tak, żeby nic nie zginęło.' },
    { name: 'Nowe skrzynki pocztowe', note: 'Zakładamy kolejne adresy. Abonament płacisz dostawcy poczty.' },
  ] },
  { group: 'Rozbudowa strony', items: [
    { name: 'Podstrona z tekstem od nas', note: 'Piszemy treść na podstawie kilku Twoich odpowiedzi.' },
    { name: 'Dodatkowa runda poprawek', note: 'Gdy rundy z pakietu się skończą.' },
    { name: 'Strona pod kampanię', note: 'Osobna strona pod jedną usługę albo reklamę.' },
    { name: 'Wersja w innym języku', note: 'Tłumaczenie i osobne adresy dla drugiego języka.' },
  ] },
  { group: 'Integracje', items: [
    { name: 'Formularz do CRM', note: 'Zapytania trafiają prosto do Twojego systemu.', inPro: true },
    { name: 'Mapa obszaru działania', note: 'Klient sprawdza, czy dojeżdżasz do jego miejscowości.', inPro: true },
    { name: 'Rozbudowany formularz', note: 'Kilka kroków, załączniki, warunki zależne od odpowiedzi.' },
    { name: 'Kolejne integracje', note: 'Każda wyceniana osobno, po sprawdzeniu narzędzia.' },
  ] },
  { group: 'Widoczność w okolicy', items: [
    { name: 'Założenie wizytówki Google', note: 'Profil firmy w Mapach Google, uzupełniony i potwierdzony.', inPro: true },
    { name: 'Uporządkowanie istniejącej wizytówki', note: 'Kategorie, opis, usługi, godziny i zdjęcia.' },
    { name: 'Konfiguracja statystyk', note: 'Liczenie odwiedzin i wysłanych formularzy, z banerem zgód.' },
    { name: 'Dodatkowe treści', note: 'Artykuły i podstrony ponad to, co jest w planie.' },
  ] },
];

/** Third-party costs never paid to Tovernet. Shown only when the selection needs them. */
export const THIRD_PARTY = {
  mail: 'Skrzynki pocztowe: abonament u dostawcy poczty, jeśli chcesz pełne skrzynki.',
  tool: 'Narzędzie do rezerwacji lub CRM: abonament u jego dostawcy, jeśli jest płatne.',
  domain: 'Domeny inne niż .pl, .com.pl i .eu: odnowienie według cennika rejestratora.',
};

export const GUARANTEE: [string, string][] = [
  ['Zobaczysz gotową stronę przed publikacją', 'Zgłaszasz uwagi, a my dopracowujemy stronę w rundach poprawek z pakietu. Nic nie trafia do sieci bez Twojej akceptacji.'],
  ['Zgodnie z ustaleniami, bez liczenia rund', 'Jeśli coś odbiega od tego, co zapisaliśmy w zamówieniu, poprawiamy to bez zużywania rundy poprawek.'],
  ['Uczciwe rozliczenie, jeśli zrezygnujesz', 'Dopóki nie prześlesz materiałów, zwracamy całą wpłatę. Później rozliczamy tylko wykonane etapy i zwracamy resztę.'],
];
// [lawyer] Draft wording; settlement stages per 14-legal-operations-audit.md §7.2.
export const GUARANTEE_FINE = 'Ta obietnica nie ogranicza Twoich praw wynikających z przepisów.';

export const FREEDOM: [string, string][] = [
  ['Bez umowy na rok', 'Plan opłacasz co miesiąc. Rezygnujesz w panelu klienta, bez kar i bez dzwonienia do nas. Plan działa do końca opłaconego miesiąca.'],
  ['Plan zmieniasz, kiedy chcesz', 'Wyższy plan działa od razu. Niższy od kolejnego okresu rozliczeniowego.'],
  ['Domena na Twoją firmę', 'To Ty jesteś abonentem domeny, nie my. Odchodząc, dostajesz kod do jej przeniesienia.'],
  ['Pliki strony do zabrania', 'Pliki strony pobierzesz w każdej chwili w trakcie planu i do 90 dni po jego zakończeniu. Uruchomisz je u innego dostawcy albo przekażesz innemu wykonawcy. Bez opłat.'],
];
// Rights model: Regulamin § 21; export: § 23. "Plan zmieniasz": § 15 ust. 4, done by staff until the panel has plan switching (D8).
export const OWNERSHIP_FINE = 'Treści i projekt Twojej strony przenosimy na Twoją firmę po opłaceniu zamówienia. Nasze komponenty i narzędzia dostajesz w bezterminowej licencji, więc stronę możesz hostować i zmieniać, gdzie chcesz. Czcionki, zdjęcia i narzędzia zewnętrzne zostają na licencjach ich dostawców.';

export const PAUSE: [string, string][] = [
  ['Tryb poza sezonem', 'Strona działa dalej na najtańszym planie. Wyświetlasz na niej informację o sezonie i wyłączasz to, czego nie potrzebujesz.'],
  ['Pełna pauza', 'Wyłączamy stronę, a projekt, ustawienia i dotychczasową pracę przechowujemy przez 12 miesięcy, na Twoją prośbę dłużej. Wracasz bez opłaty za ponowne uruchomienie.'],
];
// Retention and reactivation: Regulamin § 16 (owner decision 2026-11-03, option A).
export const PAUSE_FINE = 'W czasie pełnej pauzy domenę i pocztę u zewnętrznego dostawcy nadal trzeba odnawiać i opłacać.';

/** Trades whose work follows the season get the pause message first. */
export const SEASONAL: VariantKey[] = ['finishing', 'infrastructure', 'general', 'specialist'];

export const MIGRATION_KEEP: string[] = [
  'Zdjęcia, logo i kolory firmy',
  'Teksty i opisy usług, które warto zachować',
  'Ważne dane: adres, godziny, obszar działania',
  'Adresy podstron, które klienci znają z Google, z przekierowaniami',
  'Stara strona działa, dopóki nie zaakceptujesz nowej',
];

export const MIGRATION_NOT = 'Nie przenosimy starej instalacji WordPressa ani jej wtyczek. Budujemy nową stronę w naszej technologii, na Twoich materiałach. Wygląd możesz zachować podobny albo wybrać zupełnie nowy kierunek.';

export type DomainState = 'own' | 'agency_access' | 'agency_holder' | 'unknown';

export const DOMAIN_STATES: { key: DomainState; label: string; answer: string }[] = [
  { key: 'own', label: 'Domena jest na moją firmę i mam do niej dostęp', answer: 'Najprostsza sytuacja. Podpowiemy, jakie ustawienia zmienić, albo dodasz nas jako kontakt techniczny. Haseł nie potrzebujemy.' },
  { key: 'agency_access', label: 'Domena jest na moją firmę, ale dostęp ma dawna agencja', answer: 'Przygotujemy prośbę o przekazanie dostępu albo kodu do przeniesienia domeny. Zwykle to standardowa procedura u rejestratora.' },
  { key: 'agency_holder', label: 'Domena jest zarejestrowana na agencję', answer: 'To trzeba wyjaśnić przed zmianami. Przygotujemy opis techniczny, ale zmiana abonenta zależy od dotychczasowego dostawcy. Pomoc w trudniejszych sprawach wyceniamy osobno.' },
  { key: 'unknown', label: 'Nie wiem, kto jest właścicielem domeny', answer: 'Sprawdzimy to razem w ankiecie po zamówieniu, zanim cokolwiek zmienimy.' },
];

export const MAIL_SAFE = 'Pocztę firmową zostawiamy tam, gdzie działa. Zmiany w domenie planujemy tak, żeby nie przerwać poczty.';
