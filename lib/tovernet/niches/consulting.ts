// Template content for the business consulting concept (`consult_business`, PKD 70.20).
// Concept card: ksiegai docs/plans/tovernet/23-niche-round-2.md. Many 70.20 firms are vague or
// holding-like and we never know the specialism, so the tree is built from problems any owner
// recognises and is labelled as an example. Clients, cases, people and results are slots.

export type TreeLeaf = { label: string; question: string };
export type TreeBranch = { label: string; leaves: TreeLeaf[] };
export type ConsultingContent = {
  kicker: string;
  lead: string;
  rootTitle: string;
  rootNote: string;
  branchHead: string;
  leafHead: string;
  questionHead: string;
  questionEmpty: string;
  placeholder: string;
  send: string;
  promise: string;
  treeNote: string;
  registryJump: string;
  tree: TreeBranch[];
  memoTitle: string;
  memoLead: string;
  memoPoints: string[];
  memoHead: string;
  memoWarn: string;
  memoExample: string;
  memoRows: [string, string][];
  memoNote: string;
  formsTitle: string;
  formsNote: string;
  forms: { title: string; text: string; cta: string }[];
  peopleTitle: string;
  person: string;
  slots: { title: string; text: string }[];
  registryTitle: string;
  registryLead: string;
  registryNote: string;
};

const BUSINESS: ConsultingContent = {
  kicker: 'Doradztwo dla firm',
  lead: 'Zanim zaproponujemy rozwiązanie, ustalamy, co naprawdę jest do rozwiązania.',
  rootTitle: 'Co trzeba rozstrzygnąć?',
  rootNote: 'Dwa wybory i masz pytanie na pierwszą rozmowę.',
  branchHead: 'Obszar',
  leafHead: 'Co widać na co dzień',
  questionHead: 'Pytanie na pierwszą rozmowę',
  questionEmpty: 'Wskaż jeszcze, co widać na co dzień, a pytanie ułoży się tutaj.',
  placeholder: 'Np. od kiedy to trwa i co już próbowano zrobić.',
  send: 'Wyślij pytanie',
  promise: 'Rozmowa jest poufna. Jeśli sprawa nie jest dla nas, powiemy to od razu.',
  treeNote: 'Gałęzie są przykładowe. Przed publikacją ułożymy je pod sprawy, którymi naprawdę się zajmujesz.',
  registryJump: 'Szukasz danych spółki?',
  tree: [
    {
      label: 'Sprzedaż i klienci',
      leaves: [
        { label: 'Za mało nowych klientów', question: 'Skąd mają przychodzić nowi klienci i na jakim etapie dziś ich tracimy?' },
        { label: 'Klienci odchodzą', question: 'Dlaczego klienci odchodzą i których z nich warto zatrzymać?' },
        { label: 'Sprzedajemy, ale bez zysku', question: 'Którym klientom i za które usługi sprzedajemy poniżej opłacalności?' },
      ],
    },
    {
      label: 'Pieniądze i rentowność',
      leaves: [
        { label: 'Przychody rosną, zysk nie', question: 'Gdzie po drodze znika marża i co można z tym zrobić najpierw?' },
        { label: 'Stale brakuje gotówki', question: 'Skąd biorą się luki w gotówce i które z nich da się przewidzieć?' },
        { label: 'Nie wiem, co się opłaca', question: 'Które produkty i usługi naprawdę zarabiają na firmę?' },
      ],
    },
    {
      label: 'Organizacja i ludzie',
      leaves: [
        { label: 'Wszystko przechodzi przez właściciela', question: 'Które decyzje można oddać, komu i na jakich zasadach?' },
        { label: 'Praca utyka między ludźmi', question: 'Gdzie praca się zatrzymuje i kto powinien za to odpowiadać?' },
        { label: 'Ludzie odchodzą', question: 'Dlaczego ludzie odchodzą i co trzeba zmienić jako pierwsze?' },
      ],
    },
    {
      label: 'Duża zmiana w firmie',
      leaves: [
        { label: 'Sukcesja lub sprzedaż', question: 'Co trzeba uporządkować, żeby firmę dało się przekazać albo sprzedać?' },
        { label: 'Inwestor lub finansowanie', question: 'Co inwestor albo bank będzie chciał zobaczyć i czego dziś brakuje?' },
        { label: 'Nowy rynek lub produkt', question: 'Jak sprawdzić nowy kierunek, zanim pochłonie budżet?' },
      ],
    },
    {
      label: 'Nie wiem, od czego zacząć',
      leaves: [
        { label: 'Wyniki słabną', question: 'Co się ostatnio zmieniło i która z tych zmian szkodzi najbardziej?' },
        { label: 'Mam decyzję do podjęcia', question: 'Jakich informacji brakuje, żeby tę decyzję podjąć?' },
        { label: 'Coś nie gra, trudno to nazwać', question: 'Od czego zacząć, żeby w ogóle nazwać problem?' },
      ],
    },
  ],
  memoTitle: 'Po pierwszej rozmowie zostaje jedna strona na piśmie',
  memoLead: 'Bez slajdów. Tyle, ile trzeba, żeby podjąć decyzję, co dalej.',
  memoPoints: [
    'Zanim padnie cena, wiesz, co dokładnie jest wyceniane.',
    'Oddzielamy to, co wiemy, od tego, co dopiero trzeba sprawdzić.',
    'Piszemy też, czego nie warto dziś robić.',
  ],
  memoHead: 'Notatka po rozmowie',
  memoWarn: 'Wzór. To nie jest opis prawdziwej sprawy.',
  memoExample: 'Gdzie po drodze znika marża i co można z tym zrobić najpierw?',
  memoRows: [
    ['Co już wiemy', 'Fakty z rozmowy, bez interpretacji.'],
    ['Czego nie wiemy', 'Co trzeba sprawdzić i gdzie są te dane.'],
    ['Pierwszy krok', 'Jedna rzecz, od której warto zacząć.'],
    ['Czego nie robić', 'Co na tym etapie byłoby stratą pieniędzy.'],
    ['Czy jesteśmy potrzebni', 'Jeśli nie, piszemy to wprost.'],
  ],
  memoNote: 'Przykładowy wzór. Dopasujemy go do tego, jak naprawdę pracujesz.',
  formsTitle: 'Trzy sposoby współpracy',
  formsNote: 'Przykładowe formy. Zostawimy te, które naprawdę oferujesz.',
  forms: [
    { title: 'Jedna rozmowa', text: 'Sprawa jest konkretna i potrzebne jest drugie zdanie.', cta: 'Zapytaj o rozmowę' },
    { title: 'Projekt z zakresem', text: 'Określony problem, a zakres i termin ustalone z góry.', cta: 'Zapytaj o projekt' },
    { title: 'Stałe wsparcie', text: 'Regularny przegląd spraw z kimś, kto zna firmę.', cta: 'Zapytaj o wsparcie' },
  ],
  peopleTitle: 'Kto prowadzi sprawy',
  person: 'Tu zdjęcie i kilka zdań o osobie, która prowadzi rozmowy. W doradztwie klient wybiera przede wszystkim człowieka.',
  slots: [
    { title: 'Branże i specjalizacje', text: 'Tu tylko te, w których masz doświadczenie.' },
    { title: 'Opisane sprawy', text: 'Tu sprawy bez nazw klientów: punkt wyjścia, co zrobiono, co się zmieniło.' },
  ],
  registryTitle: 'Dane spółki',
  registryLead: 'Dla kontrahentów, banków i partnerów, którzy sprawdzają firmę przed rozmową.',
  registryNote: 'Dane z rejestru. Pozostałe wiersze uzupełnimy razem.',
};

export const CONSULTING_CONTENT: Record<string, ConsultingContent> = { consult_business: BUSINESS };
export const consultingContent = (variant: string): ConsultingContent => CONSULTING_CONTENT[variant] ?? BUSINESS;
