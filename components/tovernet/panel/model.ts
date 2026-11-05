// Derived panel state: what the client still has to give (onboarding), how far the build is
// (development), whose move it is, and the one next action. Onboarding and development are
// separate tracks on purpose: a finished brief is not a finished website.

import type { Brief, FileRow, Item, Workspace } from './types';

export type View = 'pulpit' | 'start' | 'materialy' | 'podglad' | 'wiadomosci' | 'domena' | 'platnosci' | 'konto';
export const VIEWS: View[] = ['pulpit', 'start', 'materialy', 'podglad', 'wiadomosci', 'domena', 'platnosci', 'konto'];

export type StepKey = 'kontakt' | 'obszar' | 'uslugi' | 'zdjecia' | 'logo' | 'domena' | 'uwagi';
export const STEPS: { key: StepKey; label: string; short: string; optional?: boolean }[] = [
  { key: 'kontakt', label: 'Kontakt na stronie', short: 'Kontakt' },
  { key: 'obszar', label: 'Gdzie pracujesz', short: 'Obszar' },
  { key: 'uslugi', label: 'Twoje usługi', short: 'Usługi' },
  { key: 'zdjecia', label: 'Zdjęcia', short: 'Zdjęcia' },
  { key: 'logo', label: 'Logo', short: 'Logo' },
  { key: 'domena', label: 'Domena', short: 'Domena' },
  { key: 'uwagi', label: 'Na koniec', short: 'Uwagi', optional: true },
];

export const photosOf = (files: FileRow[]) => files.filter((f) => f.purpose === 'photo');
export const logosOf = (files: FileRow[]) => files.filter((f) => f.purpose === 'logo');
export const docsOf = (files: FileRow[]) => files.filter((f) => f.purpose === 'document');

export function stepDone(key: StepKey, b: Brief, files: FileRow[]): boolean {
  switch (key) {
    case 'kontakt': return Boolean(b.phone?.trim());
    case 'obszar': return Boolean(b.area?.trim());
    case 'uslugi': return (b.services ?? []).some((x) => x.trim());
    case 'zdjecia': return photosOf(files).length > 0 || Boolean(b.no_photos);
    case 'logo': return logosOf(files).length > 0 || Boolean(b.no_logo);
    case 'domena': return b.domain_choice === 'new' || b.domain_choice === 'unsure' || (b.domain_choice === 'have' && Boolean(b.domain?.trim()));
    case 'uwagi': return Boolean(b.notes?.trim());
  }
}

export function onboarding(b: Brief, files: FileRow[], submitted: boolean) {
  const required = STEPS.filter((s) => !s.optional);
  const done = required.filter((s) => stepDone(s.key, b, files)).length;
  return { done: submitted ? required.length : done, total: required.length, submitted };
}

/** Development track, from the order to a live site. */
export const BUILD = [
  { key: 'materials', label: 'Materiały', status: ['new', 'awaiting_information'] },
  { key: 'build', label: 'Projektujemy', status: ['in_production'] },
  { key: 'review', label: 'Twój przegląd', status: ['client_review'] },
  { key: 'launch', label: 'Publikacja', status: ['ready_to_launch'] },
  { key: 'live', label: 'Online', status: ['completed'] },
] as const;

export function buildIndex(status: string): number {
  const i = BUILD.findIndex((b) => (b.status as readonly string[]).includes(status));
  return i < 0 ? 0 : i;
}

export const STATUS_LABEL: Record<string, string> = {
  new: 'Czeka na materiały',
  awaiting_information: 'Czeka na materiały',
  in_production: 'Projektujemy',
  client_review: 'Czeka na Twoją ocenę',
  ready_to_launch: 'Przygotowujemy publikację',
  completed: 'Strona online',
  cancelled: 'Projekt anulowany',
};

export const openQuestions = (items: Item[]) => items.filter((i) => i.kind === 'info_request' && i.status === 'open');

export type Turn = 'client' | 'tovernet' | 'done';
export type Next = { turn: Turn; title: string; text: string; cta?: { label: string; view: View } ; until?: string };

export function nextAction(ws: Workspace): Next {
  const questions = openQuestions(ws.items).length;
  const roundsLeft = Math.max(0, ws.revision_rounds_limit - ws.revision_rounds_used);
  if (ws.status === 'cancelled') return { turn: 'done', title: 'Projekt anulowany', text: 'Jeśli to pomyłka, napisz do nas: contact@tovernet.online.' };
  if (!ws.brief_submitted_at && ['new', 'awaiting_information'].includes(ws.status)) {
    return {
      turn: 'client', title: 'Uzupełnij start strony',
      text: 'Kilka krótkich pytań, zdjęcia i logo. Około 5 minut, wystarczy telefon. Wszystko zapisuje się samo.',
      cta: { label: 'Zaczynamy', view: 'start' },
    };
  }
  if (questions > 0) {
    return {
      turn: 'client', title: questions === 1 ? 'Mamy do Ciebie jedno pytanie' : `Mamy do Ciebie pytania: ${questions}`,
      text: 'Odpowiedz w wiadomościach. Bez tego nie możemy iść dalej.',
      cta: { label: 'Odpowiedz', view: 'wiadomosci' },
    };
  }
  if (ws.status === 'client_review') {
    return {
      turn: 'client', title: 'Strona czeka na Twoją ocenę',
      text: `Obejrzyj ją na komputerze i telefonie. Zaakceptuj albo zgłoś poprawki${roundsLeft ? ` (zostało rund: ${roundsLeft})` : ''}.`,
      cta: { label: 'Otwórz podgląd', view: 'podglad' },
    };
  }
  if (ws.status === 'ready_to_launch') return { turn: 'tovernet', title: 'Przygotowujemy publikację', text: 'Zaakceptowałeś stronę. Ustalamy domenę i termin. Nic nie musisz robić.', cta: { label: 'Zobacz domenę', view: 'domena' } };
  if (ws.status === 'completed') return { turn: 'done', title: 'Strona jest online', text: 'Zmianę na stronie zgłosisz w wiadomościach, jednym zdaniem.', cta: { label: 'Zgłoś zmianę', view: 'wiadomosci' } };
  if (ws.status === 'in_production' && ws.revision_rounds_used > 0) {
    return { turn: 'tovernet', title: `Wprowadzamy poprawki, runda ${ws.revision_rounds_used}`, text: 'Gdy skończymy, podgląd znów będzie czekał na Twoją decyzję. Dostaniesz e-mail.' };
  }
  if (ws.status === 'in_production') return { turn: 'tovernet', title: 'Projektujemy Twoją stronę', text: 'Mamy wszystko, czego potrzebujemy. Damy znać, gdy podgląd będzie gotowy do oceny.' };
  return { turn: 'tovernet', title: 'Sprawdzamy Twoje materiały', text: 'Dotarły do nas. Jeśli czegoś zabraknie, zapytamy w wiadomościach.' };
}

export const KIND_LABEL: Record<string, string> = {
  message: 'Wiadomość', change_request: 'Zmiana na stronie', info_request: 'Pytanie od nas', revision: 'Runda poprawek',
};

export const ERRORS: Record<string, string> = {
  phone_required: 'Podaj numer telefonu, który ma być na stronie.',
  brief_already_submitted: 'Materiały zostały już wysłane. Jeśli chcesz coś zmienić, napisz w wiadomościach.',
  not_in_review: 'Podgląd nie czeka teraz na Twoją decyzję.',
  revision_body_required: 'Opisz, co chcesz zmienić.',
  file_type_not_allowed: 'Tego pliku nie przyjmiemy. Prześlij zdjęcie (JPG, PNG, HEIC, WebP), logo (SVG, PNG) lub PDF.',
  file_too_large: 'Plik jest za duży. Maksymalnie 15 MB.',
  too_many_files: 'W projekcie jest już limit 60 plików. Usuń zbędne albo napisz do nas.',
  file_locked: 'Pliki są już w realizacji. Jeśli chcesz coś podmienić, napisz w wiadomościach.',
  project_closed: 'Projekt jest zamknięty.',
  upload_failed: 'Nie udało się wysłać pliku. Sprawdź połączenie i spróbuj ponownie.',
  invalid_body: 'Wiadomość jest pusta albo za długa.',
};
export const say = (e: unknown) => ERRORS[e instanceof Error ? e.message : ''] ?? 'Nie udało się. Spróbuj ponownie.';

export const when = (iso: string) => new Date(iso).toLocaleString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
export const day = (iso: string) => new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
export const size = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
