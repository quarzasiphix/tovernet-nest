// Fictional data for the POK office demo. No real dogs, people or kennels; mirrors the
// shapes of the real program (/p/pok src/shared/types.ts) closely enough to show how it works.

export type Sex = 'pies' | 'suka';
export type DogDoc = 'none' | 'P' | 'R';
export type Dog = {
  id: string; name: string; breed: string; sex: Sex; born: string; owner: string; kennel: string;
  kr: string | null; doc: DogDoc; ready: boolean; pedigreeNo: string | null; chip: string;
};
export type Role = 'hodowca' | 'wlasciciel' | 'czlonek';
export type Person = { id: string; name: string; city: string; email: string; roles: Role[]; fee: 'oplacona' | 'brak' | 'wygasla'; dogs: number; kennel: string | null };
export type ReqStatus = 'oczekuje' | 'zatwierdzone' | 'odrzucone';
export type Req = { id: string; dogId: string; breeder: string; kind: string; date: string; status: ReqStatus; note: string };

export const BREEDER = 'Maria Wiśniewska';
export const BREEDER_KENNEL = 'Złota Łąka';

export const DOGS: Dog[] = [
  { id: 'd1', name: 'Ares Srebrny Las', breed: 'Owczarek niemiecki', sex: 'pies', born: '2024-03-10', owner: 'Piotr Nowak', kennel: 'Srebrny Las', kr: 'POK/PKR/0001/2026', doc: 'R', ready: false, pedigreeNo: 'POK/666/0001/I/26', chip: '616093900000111' },
  { id: 'd2', name: 'Luna Srebrny Las', breed: 'Owczarek niemiecki', sex: 'suka', born: '2022-08-21', owner: 'Anna Kowalska', kennel: 'Srebrny Las', kr: 'POK/PKR/0002/2026', doc: 'none', ready: true, pedigreeNo: null, chip: '616093900000222' },
  { id: 'd3', name: 'Bella Złota Łąka', breed: 'Yorkshire terrier', sex: 'suka', born: '2019-01-10', owner: 'Tomasz Zieliński', kennel: 'Złota Łąka', kr: 'POK/PKR/0010/2026', doc: 'none', ready: true, pedigreeNo: null, chip: '616093900010000' },
  { id: 'd4', name: 'Max Biały Brzeg', breed: 'Szpic miniaturowy', sex: 'pies', born: '2020-02-11', owner: 'Katarzyna Wójcik', kennel: 'Biały Brzeg', kr: 'POK/PKR/0011/2026', doc: 'P', ready: false, pedigreeNo: null, chip: '616093900010001' },
  { id: 'd5', name: 'Figa Nad Wartą', breed: 'Labrador retriever', sex: 'suka', born: '2021-03-12', owner: 'Jan Lewandowski', kennel: 'Nad Wartą', kr: 'POK/PKR/0012/2026', doc: 'none', ready: true, pedigreeNo: null, chip: '616093900010002' },
  { id: 'd6', name: 'Kora Złota Łąka', breed: 'Maltańczyk', sex: 'suka', born: '2022-04-13', owner: BREEDER, kennel: 'Złota Łąka', kr: 'POK/PKR/0013/2026', doc: 'R', ready: false, pedigreeNo: 'POK/666/0013/I/26', chip: '616093900010003' },
  { id: 'd7', name: 'Rex Wrzosowe Wzgórze', breed: 'Border collie', sex: 'pies', born: '2023-05-14', owner: 'Tomasz Zieliński', kennel: 'Wrzosowe Wzgórze', kr: null, doc: 'none', ready: false, pedigreeNo: null, chip: '616093900010004' },
  { id: 'd8', name: 'Nela Nad Wartą', breed: 'Golden retriever', sex: 'suka', born: '2024-06-15', owner: 'Katarzyna Wójcik', kennel: 'Nad Wartą', kr: 'POK/PKR/0015/2026', doc: 'none', ready: true, pedigreeNo: null, chip: '616093900010005' },
  { id: 'd9', name: 'Pola Złota Łąka', breed: 'Szpic miniaturowy', sex: 'suka', born: '2026-01-10', owner: BREEDER, kennel: 'Złota Łąka', kr: 'POK/PKR/0019/2026', doc: 'none', ready: false, pedigreeNo: null, chip: '616093900010009' },
  { id: 'd10', name: 'Atos Wrzosowe Wzgórze', breed: 'Bernardyn', sex: 'pies', born: '2025-09-18', owner: 'Jan Lewandowski', kennel: 'Wrzosowe Wzgórze', kr: 'POK/PKR/0018/2026', doc: 'none', ready: true, pedigreeNo: null, chip: '616093900010008' },
];

export const PEOPLE: Person[] = [
  { id: 'p1', name: 'Anna Kowalska', city: 'Warszawa', email: 'anna@example.pl', roles: ['hodowca', 'wlasciciel'], fee: 'oplacona', dogs: 1, kennel: 'Srebrny Las' },
  { id: 'p2', name: BREEDER, city: 'Poznań', email: 'maria@example.pl', roles: ['hodowca', 'wlasciciel'], fee: 'oplacona', dogs: 2, kennel: BREEDER_KENNEL },
  { id: 'p3', name: 'Tomasz Zieliński', city: 'Łódź', email: 'tomasz@example.pl', roles: ['hodowca', 'wlasciciel'], fee: 'wygasla', dogs: 2, kennel: 'Wrzosowe Wzgórze' },
  { id: 'p4', name: 'Katarzyna Wójcik', city: 'Gdańsk', email: 'katarzyna@example.pl', roles: ['czlonek', 'wlasciciel'], fee: 'brak', dogs: 2, kennel: null },
  { id: 'p5', name: 'Piotr Nowak', city: 'Kraków', email: 'piotr@example.pl', roles: ['czlonek', 'wlasciciel'], fee: 'brak', dogs: 1, kennel: null },
  { id: 'p6', name: 'Jan Lewandowski', city: 'Wrocław', email: 'jan@example.pl', roles: ['wlasciciel'], fee: 'oplacona', dogs: 2, kennel: null },
];

export const REQUESTS: Req[] = [
  { id: 'r1', dogId: 'd9', breeder: BREEDER, kind: 'Rodowód dla szczenięcia', date: '2026-11-14', status: 'oczekuje', note: 'Szczenię z miotu B, komplet dokumentów od lekarza.' },
  { id: 'r2', dogId: 'd7', breeder: 'Tomasz Zieliński', kind: 'Nadanie numeru KR', date: '2026-11-12', status: 'oczekuje', note: 'Pies przejęty z innej organizacji, skan rodowodu w załączniku.' },
  { id: 'r3', dogId: 'd6', breeder: BREEDER, kind: 'Rodowód dla szczenięcia', date: '2026-10-30', status: 'zatwierdzone', note: '' },
];

export const ROLE_LABEL: Record<Role, string> = { hodowca: 'Hodowca', wlasciciel: 'Właściciel', czlonek: 'Członek' };
export const FEE_LABEL: Record<Person['fee'], string> = { oplacona: 'opłacona', brak: 'brak składki', wygasla: 'wygasła' };
export const STATUS_LABEL: Record<ReqStatus, string> = { oczekuje: 'Oczekuje', zatwierdzone: 'Zatwierdzone', odrzucone: 'Odrzucone' };

export const plDate = (iso: string) => iso.split('-').reverse().join('.');
export const isPuppy = (d: Dog) => Date.parse('2026-11-17') - Date.parse(d.born) < 365 * 864e5;
