// Copy for the redesigned journey that depends on the concept. Facts about the concept
// only: no promised results, timings or figures. Per-concept notes, jobs and package
// reasons stay in lib/tovernet/funnelCopy.ts and are reused as they are.
import type { VariantKey } from '@/lib/tovernet/api';
import { NICHE_JOURNEY } from '@/lib/tovernet/niches/index';

export type WelcomeCopy = {
  /** Welcome lead: what the concept lets this trade's customer do. */
  lead: string;
  /** Two features of the concept, shown as labels on the welcome preview. */
  features: [string, string];
};

const WELCOME: Partial<Record<VariantKey, WelcomeCopy>> & { general: WelcomeCopy } = {
  electrical: {
    lead: 'To strona, na której klient od razu widzi, czym się zajmujesz, wybiera swój problem i zgłasza usterkę albo zlecenie prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
    features: ['Tablica zgłoszeń', 'Kontakt pod kciukiem'],
  },
  finishing: {
    lead: 'To strona, na której klient przed remontem sprawdza, czy robisz to, czego potrzebuje, zaznacza pomieszczenia i prosi o wycenę prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
    features: ['Plan pomieszczeń', 'Formularz wyceny'],
  },
  general: {
    lead: 'To strona, na której przyszły klient od razu widzi, czym się zajmujesz, i wysyła zapytanie prosto z telefonu. Wygląd, kolory i zdjęcia dopasujemy do Ciebie.',
    features: ['Formularz zapytań', 'Wersja na telefon'],
  },
};

export const welcomeCopy = (variant: VariantKey): WelcomeCopy =>
  WELCOME[variant] ?? (NICHE_JOURNEY as Record<string, { welcome: WelcomeCopy }>)[variant]?.welcome ?? WELCOME.general;

/** What is inside the presentation (welcome screen). */
export const INSIDE: [string, string][] = [
  ['Szybki przykład', 'Pokaz tego, co możemy zrobić. Twoja strona może wyglądać zupełnie inaczej.'],
  ['Stała cena', 'Zakres i kwotę znasz przed zamówieniem.'],
  ['Twoja akceptacja', 'Nic nie publikujemy, dopóki nie zatwierdzisz strony.'],
];

/** After the order: what we do and what the customer does. */
export const AFTER: [string, string, string][] = [
  ['Płatność i faktura', 'Wystawiamy fakturę automatycznie.', 'Nic więcej nie robisz.'],
  ['Krótka ankieta', 'Podpowiadamy, czego potrzeba.', 'Podajesz numer, usługi i zdjęcia. Wystarczą z telefonu.'],
  ['Projekt do akceptacji', 'Dopracowujemy koncept z Twoimi danymi.', 'Oglądasz stronę i zgłaszasz poprawki.'],
  ['Publikacja', 'Publikujemy stronę pod Twoją domeną.', 'Dostajesz dostęp do panelu klienta.'],
];

export const FAQ: [string, string][] = [
  ['Nie mam jeszcze zdjęć ani opinii. Czy to ma sens?', 'Tak. Koncept jest zaprojektowany tak, żeby dobrze wyglądał bez nich. Zdjęcia z telefonu możesz przesłać w ankiecie po zamówieniu.'],
  ['Czy mogę zmienić usługi, teksty i kolory?', 'Tak. Usługi w koncepcie są przykładowe. Ustalimy je w ankiecie, a całą stronę zobaczysz przed publikacją.'],
  ['Dlaczego plan miesięczny jest obowiązkowy?', 'Strona musi gdzieś działać: serwer, certyfikat SSL, kopie zapasowe i aktualizacje. Plan to obejmuje. Nie ma umowy na rok: rezygnujesz w panelu klienta, a plan działa do końca opłaconego miesiąca.'],
  ['Czy domena i strona będą moje?', 'Domenę .pl rejestrujemy na Twoją firmę, a jej odnowienie jest w planie. Treści i projekt strony przenosimy na Twoją firmę po opłaceniu zamówienia. Pliki strony pobierzesz w każdej chwili w trakcie planu i do 90 dni po jego zakończeniu, a kod do przeniesienia domeny dostaniesz w 3 dni robocze. Bez opłat.'],
  ['Mam już stronę. Co z nią będzie?', 'Działa dalej, dopóki nie zaakceptujesz nowej. Bierzemy z niej zdjęcia, logo, teksty i ważne adresy podstron, a nową stronę budujemy w naszej technologii. Poczty firmowej nie ruszamy bez planu przeniesienia.'],
  ['Mogę zmienić plan albo zrobić przerwę?', 'Tak. Wyższy plan działa od razu, niższy od kolejnego okresu. Poza sezonem możesz przejść na najtańszy plan albo wstrzymać stronę całkowicie i wrócić bez budowania jej od nowa.'],
  ['Kto wystawia fakturę?', 'Tovernet sp. z o.o., automatycznie po płatności, na firmę z KRS. Jesteśmy zwolnieni z VAT, więc kwoty na stronie są ostateczne.'],
  ['Mogę najpierw o coś zapytać?', 'Tak. Napisz poniżej, odpowiemy e-mailem.'],
];

// Risk reversal moved to offer/offerCopy.ts (GUARANTEE): the concept is an example, so the
// promise is conformity with the order, not with the concept (14-legal-operations-audit.md A10, A11).
