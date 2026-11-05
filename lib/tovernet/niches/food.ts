// Template content for the food service concept (PKD 56). Two pages share one material
// language but not one structure:
//   food_restaurant, food_cafe: the page is the venue's menu card, with today's hours,
//     a table request and the way to get there.
//   food_catering: the page is a kitchen order ticket that the organiser fills in.
// Dishes, prices, hours, address and services are examples or empty slots, and the page
// says so. Nothing here may state opening hours, delivery, platforms, reviews, awards,
// years in business, prices or alcohol.

export type FoodVariant = 'food_restaurant' | 'food_cafe' | 'food_catering';

export function foodVariant(variant: string): FoodVariant {
  return variant === 'food_catering' || variant === 'food_cafe' ? variant : 'food_restaurant';
}

export type Dish = { name: string; note: string; veg?: boolean };
export type Course = { title: string; dishes: Dish[] };

type VenueCopy = {
  kind: string;
  lead: string;
  menuTitle: string;
  menuCta: string;
  courses: Course[];
  table: { title: string; sub: string; cta: string; big: string; notePlaceholder: string };
  takeaway: { title: string; text: string };
  groups: { title: string; text: string; cta: string } | null;
};

export const VENUE: Record<'food_restaurant' | 'food_cafe', VenueCopy> = {
  food_restaurant: {
    kind: 'Restauracja',
    lead: 'Karta, godziny otwarcia i dojazd w jednym miejscu. Stolik zarezerwujesz bez dzwonienia.',
    menuTitle: 'Karta',
    menuCta: 'Zobacz kartę',
    courses: [
      { title: 'Na początek', dishes: [
        { name: 'Żurek na zakwasie', note: 'z jajkiem, białą kiełbasą i chrzanem' },
        { name: 'Krem z pieczonej dyni', note: 'z prażonymi pestkami', veg: true },
        { name: 'Śledź w oleju', note: 'z cebulą, jabłkiem i ziemniakiem z wody' },
      ] },
      { title: 'Dania główne', dishes: [
        { name: 'Pierogi z kaszą i twarogiem', note: 'okrasa z cebuli, kwaśna śmietana', veg: true },
        { name: 'Kotlet schabowy', note: 'młode ziemniaki z koperkiem, mizeria' },
        { name: 'Pieczony dorsz', note: 'puree z selera, masło z szałwią' },
        { name: 'Risotto z leśnymi grzybami', note: 'parmezan, natka pietruszki', veg: true },
      ] },
      { title: 'Na słodko', dishes: [
        { name: 'Szarlotka na ciepło', note: 'z lodami waniliowymi', veg: true },
        { name: 'Sernik pieczony', note: 'z sosem z czarnej porzeczki', veg: true },
      ] },
      { title: 'Do picia', dishes: [
        { name: 'Kompot domowy', note: 'dzbanek albo szklanka', veg: true },
        { name: 'Lemoniada', note: 'cytryna, mięta', veg: true },
        { name: 'Kawa i herbata', note: 'espresso, cappuccino, herbata liściasta', veg: true },
      ] },
    ],
    table: {
      title: 'Zarezerwuj stolik',
      sub: 'Wybierz dzień, godzinę i liczbę osób. Rezerwację potwierdzimy telefonicznie.',
      cta: 'Poproś o rezerwację',
      big: 'Przy większej grupie zadzwonimy, żeby ustalić stół i menu.',
      notePlaceholder: 'Np. krzesełko dla dziecka, stolik przy oknie, alergia na orzechy.',
    },
    takeaway: { title: 'Na wynos', text: 'Zadzwoń, zamów i odbierz na miejscu.' },
    groups: {
      title: 'Urodziny, chrzciny, spotkanie firmowe?',
      text: 'Napisz, ilu będzie gości i na kiedy. Oddzwonimy, żeby ustalić stół i menu dla grupy.',
      cta: 'Zapytaj o grupę',
    },
  },
  food_cafe: {
    kind: 'Kawiarnia',
    lead: 'Co dziś pijemy, do której jesteśmy otwarci i jak do nas trafić. Miejsce dla grupy zarezerwujesz bez dzwonienia.',
    menuTitle: 'Menu',
    menuCta: 'Zobacz menu',
    courses: [
      { title: 'Kawa', dishes: [
        { name: 'Espresso', note: 'pojedyncze albo podwójne' },
        { name: 'Flat white', note: 'podwójne espresso, mleko' },
        { name: 'Cappuccino', note: 'na mleku krowim albo roślinnym' },
        { name: 'Kawa przelewowa', note: 'parzona na zamówienie' },
      ] },
      { title: 'Nie tylko kawa', dishes: [
        { name: 'Herbata liściasta', note: 'czarna, zielona, owocowa' },
        { name: 'Czekolada na gorąco', note: 'gęsta, z bitą śmietaną' },
        { name: 'Lemoniada sezonowa', note: 'z owocami z sezonu' },
      ] },
      { title: 'Coś do kawy', dishes: [
        { name: 'Sernik', note: 'kawałek' },
        { name: 'Drożdżówka z kruszonką', note: 'z owocami z sezonu' },
        { name: 'Croissant', note: 'z masłem i dżemem' },
      ] },
      { title: 'Na śniadanie', dishes: [
        { name: 'Jajecznica na maśle', note: 'ze szczypiorkiem i chlebem na zakwasie' },
        { name: 'Owsianka', note: 'z owocami i orzechami' },
        { name: 'Kanapka na zakwasie', note: 'z pastą z pieczonej papryki i rukolą' },
      ] },
    ],
    table: {
      title: 'Zarezerwuj miejsce',
      sub: 'Spotkanie, urodziny, nauka w grupie? Daj znać, kiedy i ilu was będzie. Potwierdzimy telefonicznie.',
      cta: 'Poproś o rezerwację',
      big: 'Przy większej grupie zadzwonimy, żeby ustalić szczegóły.',
      notePlaceholder: 'Np. przyjdziemy z laptopami, potrzebujemy miejsca na wózek.',
    },
    takeaway: { title: 'Na wynos', text: 'Kawę i ciasto zamówisz przy barze albo telefonicznie.' },
    groups: null,
  },
};

export const DAYS = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

export const WHEN = ['Dziś', 'Jutro', 'Inny dzień'];

// Catering: the organiser fills in a kitchen ticket.

export const CATERING = {
  kind: 'Catering',
  h1: 'Ilu gości i na kiedy?',
  lead: 'Przyjęcia rodzinne, spotkania firmowe i wydarzenia w plenerze. Opisz wydarzenie, a przygotujemy propozycję menu z wyceną.',
  occasions: ['Wesele', 'Komunia lub chrzciny', 'Urodziny lub rocznica', 'Spotkanie firmowe', 'Konferencja lub szkolenie', 'Inna okazja'],
  styles: ['Bufet', 'Serwowane do stołu', 'Przekąski na stojąco', 'Zestawy w pudełkach'],
  places: ['Wynajęta sala', 'Dom lub ogród', 'Biuro', 'Plener'],
  diets: ['Wegetariańska', 'Wegańska', 'Bez glutenu', 'Dla dzieci'],
  quick: [20, 50, 100, 150],
  notePlaceholder: 'Np. godzina rozpoczęcia, budżet na osobę, czy potrzebna jest zastawa.',
  cta: 'Wyślij zapytanie',
};

export const PROPOSAL: { title: string; meta: string; courses: Course[] } = {
  title: 'Propozycja menu',
  meta: 'Spotkanie firmowe · 60 osób · bufet',
  courses: [
    { title: 'Na powitanie', dishes: [
      { name: 'Tartinki z pastą z pieczonej papryki', note: '', veg: true },
      { name: 'Mini tarty z porem i serem', note: '', veg: true },
    ] },
    { title: 'Zimny bufet', dishes: [
      { name: 'Deska wędlin i serów', note: '' },
      { name: 'Sałatka z pęczakiem i pieczonymi warzywami', note: '', veg: true },
    ] },
    { title: 'Dania ciepłe', dishes: [
      { name: 'Polędwiczka w sosie grzybowym', note: '' },
      { name: 'Pierogi z kapustą i grzybami', note: '', veg: true },
      { name: 'Pieczone warzywa sezonowe', note: '', veg: true },
    ] },
    { title: 'Na słodko', dishes: [
      { name: 'Sernik i owoce sezonowe', note: '', veg: true },
    ] },
  ],
};

export const CATERING_STEPS: [string, string][] = [
  ['Wysyłasz szczegóły', 'Okazja, data i liczba gości. Resztę można dopisać później.'],
  ['Propozycja i wycena', 'Dostajesz menu z ceną, zanim cokolwiek potwierdzisz.'],
  ['Ustalamy szczegóły', 'Ostateczna liczba gości, diety, godzina i miejsce.'],
  ['Dzień wydarzenia', 'Wszystko według ustaleń. Przez cały czas jedna osoba do kontaktu.'],
];

export const CATERING_PREPARE = [
  'Przybliżona liczba gości',
  'Adres i godzina wydarzenia',
  'Diety i alergie gości',
  'Budżet na osobę, jeśli już go znasz',
];
