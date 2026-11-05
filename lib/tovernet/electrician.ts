// Template content for the electrician concept (PKD 43.21). Services are examples for the
// company to confirm, and the page says so. Nothing here may state availability hours,
// arrival times, qualifications, reviews, completed jobs or years in business.

export type CircuitGroup = 'pilne' | 'planowane';

export type Circuit = {
  key: string;
  group: CircuitGroup;
  label: string;
  text: string;
  placeholder: string;
};

export const CIRCUITS: Circuit[] = [
  { key: 'brak-pradu', group: 'pilne', label: 'Nie ma prądu', text: 'Szukamy przyczyny w mieszkaniu, domu albo lokalu.', placeholder: 'Np. nie działają gniazdka w kuchni, reszta mieszkania ma prąd.' },
  { key: 'bezpiecznik', group: 'pilne', label: 'Wybija bezpiecznik', text: 'Sprawdzamy obwód i odbiorniki, żeby usunąć przyczynę, a nie tylko objaw.', placeholder: 'Np. wybija po włączeniu piekarnika.' },
  { key: 'iskrzy', group: 'pilne', label: 'Iskrzy lub czuć spaleniznę', text: 'Gniazdka, łączniki i przewody. Najpierw bezpieczeństwo, potem naprawa.', placeholder: 'Np. gniazdko w salonie jest nadpalone.' },
  { key: 'wymiana', group: 'planowane', label: 'Wymiana instalacji', text: 'Stare przewody i zabezpieczenia w mieszkaniach i domach.', placeholder: 'Np. mieszkanie 60 m², stara instalacja, remont od marca.' },
  { key: 'nowa', group: 'planowane', label: 'Nowy dom lub lokal', text: 'Rozkład obwodów i osprzętu według projektu.', placeholder: 'Np. dom 140 m², stan surowy, mam projekt.' },
  { key: 'tablica', group: 'planowane', label: 'Nowa tablica', text: 'Montaż i modernizacja rozdzielnic.', placeholder: 'Np. stara tablica na bezpiecznikach topikowych.' },
];

export const BUILDINGS = ['Mieszkanie', 'Dom', 'Lokal', 'Inny'];

export const FORM_COPY: Record<CircuitGroup | 'none', { sub: string; cta: string; timeLabel: string; times: string[] }> = {
  none: { sub: 'Przełącz obwód na tablicy albo po prostu opisz sprawę.', cta: 'Wyślij zgłoszenie', timeLabel: 'Na kiedy?', times: ['Dziś', 'W tym tygodniu', 'Później'] },
  pilne: { sub: 'Zostaw numer. Oddzwonimy z terminem.', cta: 'Zgłoś usterkę', timeLabel: 'Jak pilne?', times: ['Dziś', 'W tym tygodniu', 'Może poczekać'] },
  planowane: { sub: 'Odezwiemy się, żeby ustalić zakres i wycenę przed pracą.', cta: 'Poproś o wycenę', timeLabel: 'Kiedy planujesz prace?', times: ['W tym miesiącu', 'Za 1–3 miesiące', 'Jeszcze nie wiem'] },
};

export const SAFETY = 'Czujesz spaleniznę albo widzisz iskry? Wyłącz zasilanie na tablicy, jeśli możesz to zrobić bezpiecznie. Przy dymie lub ogniu dzwoń pod 112.';

export const PREPARE = ['Metraż i rodzaj budynku', 'Rzut albo szkic układu pomieszczeń', 'Zdjęcie obecnej tablicy', 'Planowany termin prac'];

export const STEPS: [string, string][] = [
  ['Opisujesz sprawę', 'Kilka pól albo telefon.'],
  ['Ustalamy termin', 'Mówimy, kiedy możemy przyjechać.'],
  ['Wycena przed pracą', 'Znasz koszt, zanim zaczniemy.'],
  ['Wykonanie', 'Jedna osoba do kontaktu przez cały czas.'],
];
