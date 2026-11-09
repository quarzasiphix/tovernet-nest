// Template content for the law firm concept (`law_firm`, PKD 69.10).
// Legal constraint: advocates and legal advisers may inform but not advertise, so every line is
// third-person information about the firm. No claims, comparisons, outcomes or client names.
// We know registry facts only: titles, entries on professional lists, people and areas of
// practice are not known. Areas are labelled examples; the rest are labelled empty slots.
// The lawyer must review this copy before any send (see the concept card).

export type LawContent = {
  lead: string;
  /** Articles, in order. The last one is the contact form. */
  toc: string[];
  areasNote: string;
  areas: string[];
  stepsNote: string;
  steps: [string, string][];
  practical: [string, string][];
  whoAsk: string[];
  when: string[];
  warning: string;
};

const FIRM: LawContent = {
  lead: 'Podstawowe informacje o kancelarii: dane rejestrowe, zakres działalności, osoby i sposób kontaktu.',
  toc: ['Dane kancelarii', 'Zakres działalności', 'Osoby', 'Pierwszy kontakt', 'Informacje praktyczne', 'Kontakt z kancelarią'],
  areasNote: 'Przykładowe obszary. Kancelaria zastąpi je własnym zakresem działalności.',
  areas: ['Prawo cywilne i umowy', 'Prawo gospodarcze i spółki', 'Prawo pracy', 'Prawo podatkowe', 'Sprawy rodzinne i spadkowe', 'Postępowania administracyjne'],
  stepsNote: 'Przykładowy przebieg. Kancelaria opisze tu swój sposób pracy.',
  steps: [
    ['Prośba o kontakt', 'Telefonicznie albo przez formularz na tej stronie, bez opisu sprawy.'],
    ['Odpowiedź kancelarii', 'Kancelaria kontaktuje się w sposób wskazany w prośbie.'],
    ['Rozmowa', 'Ustalenie przedmiotu sprawy i tego, czy kancelaria może się nią zająć.'],
    ['Warunki na piśmie', 'Zakres zlecenia i wynagrodzenie, jeśli strony zdecydują się na współpracę.'],
  ],
  practical: [
    ['Godziny pracy', 'Tu godziny, w których kancelaria odbiera telefon'],
    ['Spotkania', 'Tu adres, dojazd i informacja o spotkaniach zdalnych'],
    ['Wynagrodzenie', 'Tu ogólne zasady ustalania wynagrodzenia'],
    ['Języki', 'Tu języki, w których kancelaria prowadzi sprawy'],
  ],
  whoAsk: ['osoba prywatna', 'przedsiębiorca', 'przedstawiciel firmy', 'przedstawiciel organizacji'],
  when: ['przed południem', 'po południu', 'o dowolnej porze'],
  warning: 'Do czasu nawiązania kontaktu nie przesyłaj przez formularz opisu sprawy, dokumentów ani danych poufnych.',
};

export const LAW_CONTENT: Record<string, LawContent> = { law_firm: FIRM };
export const lawContent = (variant: string): LawContent => LAW_CONTENT[variant] ?? FIRM;
