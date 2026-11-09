// Template content for the energy concept (`energy_project`, `energy_coop`).
// Concept card: ksiegai docs/plans/tovernet/23-niche-round-2.md. We know registry facts only, so
// the page names no installation, capacity, location, tariff, saving, grant, licence or member.
// Questions and stages are labelled as examples; every answer is an empty slot the owner fills.

export type Feeder = { key: string; label: string; who: string; questions: [string, string, string]; placeholder: string };
export type EnergyContent = {
  kicker: string;
  lead: string;
  boardTitle: string;
  questionsNote: string;
  answerSlot: string;
  feeders: [Feeder, Feeder, Feeder, Feeder];
  stagesTitle: string;
  stagesNote: string;
  stages: [string, string][];
  slotsTitle: string;
  slots: { title: string; text: string }[];
  closeTitle: string;
  closeText: string;
};

const PROJECT: EnergyContent = {
  kicker: 'Wytwarzanie energii',
  lead: 'Mieszkasz w okolicy, masz grunt, pracujesz w urzędzie albo chcesz z nami współpracować? Wybierz swoją sprawę i zadaj pytanie.',
  boardTitle: 'Kim jesteś?',
  questionsNote: 'Przykładowe pytania. Przed publikacją zastąpimy je tymi, które naprawdę słyszysz.',
  answerSlot: 'Tu Twoja odpowiedź. Napiszemy ją razem przed publikacją.',
  feeders: [
    { key: 'sasiad', label: 'Sąsiad', who: 'Mieszkasz w pobliżu instalacji.', questions: ['Gdzie dokładnie powstaje instalacja?', 'Czy jej praca będzie odczuwalna w okolicy?', 'Do kogo zgłosić się w trakcie budowy?'], placeholder: 'Np. mieszkam przy tej drodze i chcę wiedzieć, kiedy ruszają prace.' },
    { key: 'grunt', label: 'Właściciel gruntu', who: 'Masz działkę i chcesz porozmawiać.', questions: ['Jakich gruntów szukacie?', 'Jak wygląda rozmowa o dzierżawie?', 'Co dzieje się z gruntem po zakończeniu umowy?'], placeholder: 'Np. gmina, obręb i przybliżona powierzchnia działki.' },
    { key: 'urzad', label: 'Urząd', who: 'Prowadzisz sprawę w gminie lub instytucji.', questions: ['Kto jest osobą kontaktową w sprawie projektu?', 'Na jakim etapie są formalności?', 'Gdzie znaleźć dokumenty?'], placeholder: 'Np. nazwa urzędu i numer sprawy.' },
    { key: 'partner', label: 'Partner', who: 'Jesteś wykonawcą, dostawcą lub inwestorem.', questions: ['Kto zajmuje się wyborem wykonawców?', 'Gdzie wysłać ofertę?', 'Jakich dokumentów potrzebujecie?'], placeholder: 'Np. czym się zajmujesz i w czym możesz pomóc.' },
  ],
  stagesTitle: 'Na jakim etapie jest projekt',
  stages: [
    ['Lokalizacja', 'Wybór miejsca i rozmowy z właścicielami gruntów.'],
    ['Formalności', 'Decyzje, uzgodnienia i warunki przyłączenia.'],
    ['Budowa', 'Prace w terenie i kontakt dla okolicy.'],
    ['Uruchomienie', 'Odbiory i włączenie do sieci.'],
    ['Praca', 'Bieżąca obsługa instalacji.'],
  ],
  stagesNote: 'Przykładowe etapy. Lampkę zapalimy przy tym, na którym naprawdę jesteś.',
  slotsTitle: 'Co dopiszemy przed publikacją',
  slots: [
    { title: 'Lokalizacja', text: 'Tu mapa i opis miejsca, jeśli chcesz je pokazać.' },
    { title: 'Dokumenty', text: 'Tu decyzje i materiały, które można udostępnić.' },
    { title: 'Osoba do kontaktu', text: 'Tu imię, nazwisko i telefon osoby, która odpowiada na pytania.' },
  ],
  closeTitle: 'Masz inną sprawę?',
  closeText: 'Napisz, nawet jeśli nie wiesz, do kogo się zwrócić.',
};

const COOP: EnergyContent = {
  kicker: 'Spółdzielnia energetyczna',
  lead: 'Chcesz dołączyć, jesteś członkiem albo reprezentujesz gminę? Wybierz swoją sprawę i zadaj pytanie.',
  boardTitle: 'Kim jesteś?',
  questionsNote: 'Przykładowe pytania. Przed publikacją zastąpimy je tymi, które naprawdę słyszysz.',
  answerSlot: 'Tu odpowiedź spółdzielni. Napiszemy ją razem przed publikacją.',
  feeders: [
    { key: 'mieszkaniec', label: 'Mieszkaniec', who: 'Chcesz dowiedzieć się więcej albo dołączyć.', questions: ['Kto może dołączyć do spółdzielni?', 'Jakie są koszty przystąpienia?', 'Od czego zacząć?'], placeholder: 'Np. miejscowość i czy pytasz jako osoba, firma czy rolnik.' },
    { key: 'czlonek', label: 'Członek', who: 'Należysz już do spółdzielni.', questions: ['Gdzie znajdę dokumenty spółdzielni?', 'Kiedy jest najbliższe walne zgromadzenie?', 'Komu zgłosić zmianę danych?'], placeholder: 'Np. czego dotyczy Twoja sprawa.' },
    { key: 'gmina', label: 'Gmina', who: 'Reprezentujesz urząd lub jednostkę gminną.', questions: ['Kto reprezentuje spółdzielnię?', 'Jakie instalacje są planowane?', 'Jak umówić spotkanie?'], placeholder: 'Np. nazwa jednostki i temat spotkania.' },
    { key: 'partner', label: 'Partner', who: 'Jesteś wykonawcą, dostawcą lub doradcą.', questions: ['Z kim rozmawiać o współpracy?', 'Gdzie wysłać ofertę?', 'Czy spółdzielnia szuka wykonawców?'], placeholder: 'Np. czym się zajmujesz i w czym możesz pomóc.' },
  ],
  stagesTitle: 'Na jakim etapie jest spółdzielnia',
  stages: [
    ['Założenie', 'Statut i wpis do rejestru.'],
    ['Członkowie', 'Zbieranie członków i pierwsze ustalenia.'],
    ['Przygotowanie', 'Instalacje i formalności.'],
    ['Uruchomienie', 'Początek wytwarzania i rozliczeń.'],
    ['Działanie', 'Bieżące sprawy członków i walne.'],
  ],
  stagesNote: 'Przykładowe etapy. Lampkę zapalimy przy tym, na którym naprawdę jesteście.',
  slotsTitle: 'Co dopiszemy przed publikacją',
  slots: [
    { title: 'Dokumenty spółdzielni', text: 'Tu statut, regulaminy i uchwały, które można udostępnić.' },
    { title: 'Obszar działania', text: 'Tu gmina lub gminy, w których działa spółdzielnia.' },
    { title: 'Zarząd', text: 'Tu osoby, które odpowiadają na pytania.' },
  ],
  closeTitle: 'Masz inną sprawę?',
  closeText: 'Napisz, nawet jeśli nie wiesz, do kogo się zwrócić.',
};

export const ENERGY_CONTENT: Record<string, EnergyContent> = { energy_project: PROJECT, energy_coop: COOP };

/**
 * PKD alone cannot tell a cooperative from a project company: 35.12.B holds both. The registry name
 * can, so a company mapped to `energy_project` that is a cooperative gets the cooperative page.
 */
export function energyVariant(variant: string, company: { legal_name: string; legal_form?: string | null }): string {
  if (variant !== 'energy_project') return variant;
  return /sp[oó]łdzielni/i.test(`${company.legal_form ?? ''} ${company.legal_name}`) ? 'energy_coop' : variant;
}
export const energyContent = (variant: string): EnergyContent => ENERGY_CONTENT[variant] ?? PROJECT;
