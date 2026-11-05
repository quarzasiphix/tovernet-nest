// Template content for the finishing concept (PKD 43.3x). The plan is an example layout,
// the works per room are examples for the company to confirm, and the page says so.
// Nothing here may state timing, warranties, reviews, completed jobs or years in business.

export type Material = 'tile' | 'oak' | 'paint';

export type Room = {
  key: string;
  label: string;
  material: Material;
  works: string[];
  /** Plan geometry in a 600 × 380 box. */
  x: number; y: number; w: number; h: number;
};

export const ROOMS: Room[] = [
  { key: 'salon', label: 'Salon', material: 'oak', works: ['Gładzie i malowanie', 'Podłoga', 'Listwy'], x: 0, y: 0, w: 340, h: 230 },
  { key: 'kuchnia', label: 'Kuchnia', material: 'tile', works: ['Płytki nad blatem', 'Ściany', 'Podłoga'], x: 340, y: 0, w: 260, h: 140 },
  { key: 'przedpokoj', label: 'Przedpokój', material: 'paint', works: ['Malowanie', 'Podłoga', 'Zabudowa'], x: 340, y: 140, w: 130, h: 240 },
  { key: 'lazienka', label: 'Łazienka', material: 'tile', works: ['Płytki', 'Biały montaż', 'Sufit'], x: 470, y: 140, w: 130, h: 240 },
  { key: 'sypialnia', label: 'Sypialnia', material: 'oak', works: ['Malowanie', 'Podłoga'], x: 0, y: 230, w: 200, h: 150 },
  { key: 'pokoj', label: 'Pokój', material: 'oak', works: ['Malowanie', 'Podłoga'], x: 200, y: 230, w: 140, h: 150 },
];

export const STATES = ['Od dewelopera', 'Do remontu', 'Odświeżenie'];
export const TIMES = ['W tym miesiącu', 'Za 1–3 miesiące', 'Jeszcze nie wiem'];

export const MATERIALS: { key: Material | 'concrete'; label: string }[] = [
  { key: 'paint', label: 'Farba' },
  { key: 'tile', label: 'Płytki' },
  { key: 'oak', label: 'Drewno' },
  { key: 'concrete', label: 'Beton' },
];

export const SCHEDULE: [string, string][] = [
  ['Pomiar', 'Oglądamy wnętrze i spisujemy zakres.'],
  ['Kosztorys', 'Wycena z podziałem na prace i materiały.'],
  ['Prace', 'Według ustalonego harmonogramu.'],
  ['Odbiór', 'Sprawdzamy razem każde pomieszczenie.'],
];

export const PREPARE = ['Rzut albo wymiary pomieszczeń', 'Zdjęcia obecnego stanu', 'Inspiracje, jeśli je masz', 'Planowany termin'];
