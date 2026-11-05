'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { publicAction } from '@/lib/tovernet/api';
import { authClient } from '@/lib/tovernet/supabase';
import { CONSTRUCTION_VARIANTS, presentCity, presentName } from '@/lib/tovernet/construction';
import type { VariantKey } from '@/lib/tovernet/api';
import { track } from '@/lib/tovernet/analytics';
import s from './brand.module.css';

// The client's project workspace: one next action, then materials (brief and files),
// preview with approval or a revision round, and the message thread with change requests.
// Every call goes through public-api tovernetProject.*, which runs under the session.

type Item = { id: string; kind: string; author_side: 'client' | 'staff'; body: string; status: string; created_at: string };
type FileRow = { id: string; file_name: string; mime_type: string; size_bytes: number; purpose: string; created_at: string };
export type Brief = {
  phone?: string; email?: string; area?: string; services?: string[];
  no_photos?: boolean; no_logo?: boolean; domain_choice?: 'have' | 'new' | 'unsure'; domain?: string; notes?: string;
};
type Workspace = {
  id: string; name: string; status: string; domain: string | null; preview_url: string | null;
  brief: Brief; brief_submitted_at: string | null;
  revision_rounds_used: number; revision_rounds_limit: number; approved_at: string | null;
  package: { key: string; name: string; limits: Record<string, number> } | null;
  plan: { key: string; name: string } | null;
  prefill: { company_name: string | null; email: string | null; city: string | null; website: string | null; variant: string | null };
  items: Item[]; files: FileRow[];
};
type Tab = 'materialy' | 'podglad' | 'wiadomosci';

const ERRORS: Record<string, string> = {
  phone_required: 'Podaj numer telefonu, który ma być na stronie.',
  brief_already_submitted: 'Materiały zostały już wysłane. Jeśli chcesz coś zmienić, napisz w wiadomościach.',
  not_in_review: 'Podgląd nie czeka teraz na Twoją decyzję.',
  revision_body_required: 'Opisz, co chcesz zmienić.',
  file_type_not_allowed: 'Ten typ pliku nie jest obsługiwany. Prześlij zdjęcie (JPG, PNG, HEIC, WebP), logo (SVG, PNG) lub PDF.',
  file_too_large: 'Plik jest za duży. Maksymalnie 15 MB.',
  too_many_files: 'Osiągnięto limit plików w projekcie.',
  file_locked: 'Pliki są już w realizacji. Jeśli chcesz coś podmienić, napisz w wiadomościach.',
  project_closed: 'Projekt jest zamknięty.',
};
const say = (e: unknown) => {
  const m = e instanceof Error ? e.message : '';
  return ERRORS[m] ?? 'Nie udało się. Spróbuj ponownie.';
};
const date = (iso: string) => new Date(iso).toLocaleString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const KIND_LABEL: Record<string, string> = {
  message: 'Wiadomość', change_request: 'Zlecenie zmiany', info_request: 'Prośba o informacje', revision: 'Runda poprawek',
};
const PLAN_MINUTES: Record<string, string> = {
  'tovernet.care.monthly': 'W planie Opieka masz do 30 minut drobnych zmian miesięcznie: teksty, zdjęcia, ceny, godziny, dane kontaktowe.',
  'tovernet.plan.growth': 'W planie Widoczność lokalna masz do 30 minut drobnych zmian miesięcznie i jedną nową podstronę lub artykuł.',
  'tovernet.plan.hosting': 'Plan Utrzymanie nie obejmuje zmian. Każdą zmianę wycenimy, zanim cokolwiek zrobimy.',
};

const input = 'mt-1 w-full border border-[#C8C9C2] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#15161A]';
const primary = 'bg-[#15161A] px-4 py-2.5 text-sm font-semibold text-[#FAFAF7] disabled:opacity-50';

export default function ProjectWorkspace({ projectId, token, onChanged }: { projectId: string; token: string; onChanged?: () => void }) {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [tab, setTab] = useState<Tab>('materialy');
  const [error, setError] = useState('');

  const call = useCallback(async <T,>(action: string, payload: Record<string, unknown>) =>
    publicAction<T>(action, { projectId, ...payload }, token), [projectId, token]);

  const apply = useCallback((p: Workspace) => { setWs(p); setError(''); }, []);

  useEffect(() => {
    call<{ project: Workspace }>('tovernetProject.get', {})
      .then((r) => {
        apply(r.project);
        setTab(r.project.status === 'client_review' ? 'podglad' : !r.project.brief_submitted_at ? 'materialy' : 'wiadomosci');
      })
      .catch((e) => setError(say(e)));
  }, [call, apply]);

  if (!ws) return error ? <p role="alert" className="mt-4 text-red-700">{error}</p> : <p className="mt-4 text-sm text-[#5A5C60]">Ładowanie projektu…</p>;

  const openInfo = ws.items.filter((i) => i.kind === 'info_request' && i.status === 'open');
  const next = nextAction(ws, openInfo.length);
  const changed = (p: Workspace) => { apply(p); onChanged?.(); };

  return (
    <div className="mt-5">
      <div className="border-l-4 border-[#2536C4] bg-[#F1F2ED] p-4">
        <p className={s.l}>Twój następny krok</p>
        <p className="mt-1 font-semibold">{next.text}</p>
        {next.tab && next.tab !== tab && (
          <button type="button" className="mt-2 text-sm underline" onClick={() => setTab(next.tab!)}>{next.cta}</button>
        )}
      </div>

      <div role="tablist" aria-label="Projekt" className="mt-5 flex gap-1 border-b border-[#C8C9C2]">
        {([['materialy', 'Materiały'], ['podglad', 'Podgląd i akceptacja'], ['wiadomosci', 'Wiadomości i zmiany']] as [Tab, string][]).map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k}
                  className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold ${tab === k ? 'border-[#15161A]' : 'border-transparent text-[#5A5C60]'}`}
                  onClick={() => { setTab(k); track('workspace_tab_opened', { tab: k }); }}>
            {label}
            {k === 'wiadomosci' && openInfo.length > 0 && <span className="ml-1.5 bg-[#2536C4] px-1.5 text-xs text-white">{openInfo.length}</span>}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="pt-5">
        {tab === 'materialy' && <Materials ws={ws} call={call} onSaved={changed} onError={setError} />}
        {tab === 'podglad' && <Review ws={ws} call={call} onSaved={changed} onError={setError} />}
        {tab === 'wiadomosci' && <Thread ws={ws} call={call} onSaved={changed} onError={setError} />}
      </div>
    </div>
  );
}

function nextAction(ws: Workspace, openInfo: number): { text: string; tab?: Tab; cta?: string } {
  if (ws.status === 'cancelled') return { text: 'Projekt anulowany.' };
  if (!ws.brief_submitted_at && ['new', 'awaiting_information'].includes(ws.status)) {
    return { text: 'Uzupełnij materiały do strony. To zajmie około 5 minut, wystarczy telefon.', tab: 'materialy', cta: 'Przejdź do materiałów' };
  }
  if (openInfo > 0) return { text: `Mamy do Ciebie ${openInfo === 1 ? 'jedno pytanie' : `${openInfo} pytania`}. Odpowiedz w wiadomościach.`, tab: 'wiadomosci', cta: 'Przejdź do wiadomości' };
  if (ws.status === 'client_review') {
    const left = Math.max(0, ws.revision_rounds_limit - ws.revision_rounds_used);
    return { text: `Strona czeka na Twoją decyzję: zaakceptuj ją albo zgłoś poprawki${left ? ` (zostało rund: ${left})` : ''}.`, tab: 'podglad', cta: 'Przejdź do podglądu' };
  }
  if (ws.status === 'ready_to_launch') return { text: 'Zaakceptowałeś stronę. Ustalamy publikację i domenę. Nic nie musisz robić.' };
  if (ws.status === 'completed') return { text: 'Strona jest opublikowana. Zmiany zgłaszasz w wiadomościach.', tab: 'wiadomosci', cta: 'Zgłoś zmianę' };
  if (ws.brief_submitted_at && ws.status === 'awaiting_information') return { text: 'Materiały dotarły. Sprawdzamy je i zaczynamy pracę. Napiszemy, jeśli czegoś zabraknie.' };
  return { text: 'Pracujemy nad stroną. Damy znać, gdy podgląd będzie gotowy do Twojej oceny.' };
}

type Props = {
  ws: Workspace;
  call: <T>(action: string, payload: Record<string, unknown>) => Promise<T>;
  onSaved: (p: Workspace) => void;
  onError: (m: string) => void;
};

function defaultServices(variant: string | null): string[] {
  const v = variant ? (CONSTRUCTION_VARIANTS as Record<string, (typeof CONSTRUCTION_VARIANTS)['general'] | undefined>)[variant] : undefined;
  return v ? v.services.map((x) => x.title) : [];
}

function Materials({ ws, call, onSaved, onError }: Props) {
  const locked = Boolean(ws.brief_submitted_at);
  const initial = useMemo<Brief>(() => ({
    email: ws.prefill.email ?? '',
    domain_choice: ws.prefill.website ? 'have' : undefined,
    domain: ws.prefill.website ? ws.prefill.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : '',
    ...ws.brief,
    services: ws.brief.services ?? defaultServices(ws.prefill.variant),
  }), [ws]);
  const [b, setB] = useState<Brief>(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState('');
  const set = (patch: Partial<Brief>) => { setB((x) => ({ ...x, ...patch })); setSaved(''); };

  const save = async (submit: boolean) => {
    setBusy(true);
    try {
      const answers = { ...b, services: (b.services ?? []).map((x) => x.trim()).filter(Boolean).slice(0, 30) };
      const r = await call<{ project: Workspace }>('tovernetProject.saveBrief', { answers, submit });
      onSaved(r.project);
      setSaved(submit ? '' : 'Zapisano szkic.');
      track(submit ? 'brief_submitted' : 'brief_draft_saved', { project_id: ws.id, photos: ws.files.filter((f) => f.purpose === 'photo').length });
    } catch (e) { onError(say(e)); } finally { setBusy(false); }
  };

  const photos = ws.files.filter((f) => f.purpose === 'photo');
  const logos = ws.files.filter((f) => f.purpose === 'logo');

  return (
    <div className="space-y-6">
      {locked && <p className="border border-[#C8C9C2] bg-[#FAFAF7] p-3 text-sm">Materiały wysłane {date(ws.brief_submitted_at!)}. Poniżej to, co od Ciebie dostaliśmy. Zmiany zgłoś w wiadomościach.</p>}

      <fieldset disabled={locked} className="space-y-5">
        <div>
          <p className={s.l}>Co już wiemy</p>
          <p className="mt-1 text-sm">{[ws.prefill.company_name && presentName(ws.prefill.company_name), ws.prefill.city && presentCity(ws.prefill.city)].filter(Boolean).join(' · ')}. Dane firmy z rejestru wpiszemy sami.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">Telefon na stronę *
            <input className={input} inputMode="tel" autoComplete="tel" value={b.phone ?? ''} onChange={(e) => set({ phone: e.target.value })} placeholder="np. 600 700 800" />
          </label>
          <label className="block text-sm font-semibold">E-mail do zapytań
            <input className={input} type="email" value={b.email ?? ''} onChange={(e) => set({ email: e.target.value })} />
          </label>
        </div>
        <label className="block text-sm font-semibold">Gdzie pracujesz?
          <input className={input} value={b.area ?? ''} onChange={(e) => set({ area: e.target.value })} placeholder={`np. ${ws.prefill.city ? presentCity(ws.prefill.city) : 'Łódź'} i 30 km wokół`} />
        </label>
        <label className="block text-sm font-semibold">Usługi, które naprawdę wykonujesz
          <span className="block font-normal text-[#5A5C60]">Jedna w linii. Wpisaliśmy te z konceptu: usuń, popraw lub dopisz. Pierwsze trzy będą najważniejsze.</span>
          <textarea className={input} rows={6} value={(b.services ?? []).join('\n')} onChange={(e) => set({ services: e.target.value.split('\n') })} />
        </label>

        <Uploads ws={ws} purpose="photo" title="Zdjęcia z realizacji" hint="Z telefonu wystarczą. Bez zdjęć zostawimy grafiki poglądowe." files={photos} call={call} onSaved={onSaved} onError={onError} locked={locked} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(b.no_photos)} onChange={(e) => set({ no_photos: e.target.checked })} />Nie mam teraz zdjęć</label>

        <Uploads ws={ws} purpose="logo" title="Logo" hint="SVG lub PNG. Bez logo użyjemy nazwy firmy, tak jak w koncepcie." files={logos} call={call} onSaved={onSaved} onError={onError} locked={locked} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(b.no_logo)} onChange={(e) => set({ no_logo: e.target.checked })} />Nie mam logo</label>

        <div>
          <p className="text-sm font-semibold">Domena</p>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            {([['have', 'Mam domenę'], ['new', 'Potrzebuję nowej'], ['unsure', 'Nie wiem']] as const).map(([k, label]) => (
              <label key={k} className="flex items-center gap-2"><input type="radio" name={`domain-${ws.id}`} checked={b.domain_choice === k} onChange={() => set({ domain_choice: k })} />{label}</label>
            ))}
          </div>
          {b.domain_choice === 'have' && (
            <input className={input} value={b.domain ?? ''} onChange={(e) => set({ domain: e.target.value })} placeholder="np. twojafirma.pl" aria-label="Twoja domena" />
          )}
          {b.domain_choice === 'new' && <p className="mt-2 text-sm text-[#5A5C60]">Zaproponujemy kilka wolnych adresów. Domenę .pl zarejestrujemy na Twoją firmę.</p>}
          {b.domain_choice === 'unsure' && <p className="mt-2 text-sm text-[#5A5C60]">Sprawdzimy to za Ciebie i napiszemy, co znaleźliśmy.</p>}
        </div>

        <label className="block text-sm font-semibold">Co klient powinien wiedzieć, zanim zadzwoni?
          <textarea className={input} rows={3} value={b.notes ?? ''} onChange={(e) => set({ notes: e.target.value })} placeholder="np. nie robimy drobnych napraw, wyceny w ciągu 2 dni, faktura VAT" />
        </label>
      </fieldset>

      {!locked && (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={primary} disabled={busy} onClick={() => void save(true)}>Wyślij materiały</button>
          <button type="button" className={s.btnLine} disabled={busy} onClick={() => void save(false)}>Zapisz szkic</button>
          {saved && <span role="status" className="text-sm text-[#5A5C60]">{saved}</span>}
          <p className="w-full text-xs text-[#5A5C60]">Po wysłaniu materiałów zaczynamy pracę. Do tego momentu możesz zrezygnować i odzyskać całą wpłatę.</p>
        </div>
      )}
    </div>
  );
}

function Uploads({ ws, purpose, title, hint, files, call, onSaved, onError, locked }: Props & {
  purpose: 'photo' | 'logo'; title: string; hint: string; files: FileRow[]; locked: boolean;
}) {
  const [busy, setBusy] = useState(0);

  const upload = async (list: FileList | null) => {
    const supabase = authClient();
    if (!list || !supabase) return;
    const chosen = Array.from(list).slice(0, purpose === 'logo' ? 2 : 20);
    setBusy(chosen.length);
    for (const file of chosen) {
      try {
        const r = await call<{ fileId: string; bucket: string; path: string; token: string }>('tovernetProject.upload', {
          fileName: file.name, mimeType: file.type || 'application/octet-stream', size: file.size, purpose,
        });
        const { error } = await supabase.storage.from(r.bucket).uploadToSignedUrl(r.path, r.token, file, { contentType: file.type });
        if (error) throw new Error('upload_failed');
        await call('tovernetProject.fileDone', { fileId: r.fileId });
      } catch (e) { onError(say(e)); }
      setBusy((n) => n - 1);
    }
    const r = await call<{ project: Workspace }>('tovernetProject.get', {});
    onSaved(r.project);
    track('files_uploaded', { project_id: ws.id, purpose, count: chosen.length });
  };

  const open = async (f: FileRow) => {
    try {
      const r = await call<{ path: string }>('tovernetProject.fileUrl', { fileId: f.id });
      window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}${r.path}`, '_blank', 'noopener');
    } catch (e) { onError(say(e)); }
  };

  const remove = async (f: FileRow) => {
    try {
      await call('tovernetProject.fileRemove', { fileId: f.id });
      const r = await call<{ project: Workspace }>('tovernetProject.get', {});
      onSaved(r.project);
    } catch (e) { onError(say(e)); }
  };

  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm text-[#5A5C60]">{hint}</p>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 border-b border-[#C8C9C2] py-1">
              <button type="button" className="truncate text-left underline" onClick={() => void open(f)}>{f.file_name}</button>
              {!locked && <button type="button" className="text-[#5A5C60] underline" onClick={() => void remove(f)}>Usuń</button>}
            </li>
          ))}
        </ul>
      )}
      {!locked && (
        <label className={`${s.btnLine} mt-2 inline-block`}>
          {busy > 0 ? `Wysyłamy… (${busy})` : purpose === 'logo' ? 'Dodaj logo' : 'Dodaj zdjęcia'}
          <input type="file" className="sr-only" multiple={purpose === 'photo'} disabled={busy > 0}
                 accept={purpose === 'logo' ? 'image/svg+xml,image/png,image/jpeg,image/webp,application/pdf' : 'image/*'}
                 onChange={(e) => { void upload(e.target.files); e.target.value = ''; }} />
        </label>
      )}
    </div>
  );
}

function Review({ ws, call, onSaved, onError }: Props) {
  const [body, setBody] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const left = Math.max(0, ws.revision_rounds_limit - ws.revision_rounds_used);
  const inReview = ws.status === 'client_review';

  const decide = async (decision: 'approve' | 'revise') => {
    setBusy(true);
    try {
      const r = await call<{ project: Workspace }>('tovernetProject.review', { decision, body: decision === 'revise' ? body : null });
      onSaved(r.project);
      setBody('');
      track(decision === 'approve' ? 'project_approved' : 'revision_requested', { project_id: ws.id, round: ws.revision_rounds_used + 1, over_limit: left === 0 });
    } catch (e) { onError(say(e)); } finally { setBusy(false); }
  };

  if (ws.approved_at) {
    return <p>Zaakceptowałeś stronę {date(ws.approved_at)}. {ws.status === 'completed' ? 'Strona jest opublikowana.' : 'Przygotowujemy publikację.'}</p>;
  }
  if (!ws.preview_url) {
    return <p className="text-sm">Podgląd pojawi się tutaj, gdy strona będzie gotowa do Twojej oceny. Dostaniesz też wiadomość e-mail.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a href={ws.preview_url} target="_blank" rel="noreferrer" className={primary}>Otwórz podgląd strony</a>
        <p className="text-sm">Rundy poprawek: <b>{ws.revision_rounds_used} z {ws.revision_rounds_limit}</b> wykorzystane</p>
      </div>
      <p className="text-sm text-[#5A5C60]">Jeśli gotowa strona odbiega od zaakceptowanego konceptu, poprawimy ją bez liczenia rund. Napisz wtedy, czego dotyczy różnica.</p>

      {!inReview ? (
        <p className="text-sm">Wprowadzamy poprawki. Gdy skończymy, podgląd znów będzie czekał na Twoją decyzję.</p>
      ) : (
        <>
          <form className="space-y-2" onSubmit={(e: FormEvent) => { e.preventDefault(); void decide('revise'); }}>
            <label className="block text-sm font-semibold">Co poprawić?
              <span className="block font-normal text-[#5A5C60]">Wszystkie uwagi w jednej wiadomości: jedna wiadomość to jedna runda.</span>
              <textarea className={input} rows={5} value={body} onChange={(e) => setBody(e.target.value)} required maxLength={5000} />
            </label>
            {left === 0 && <p className="text-sm font-semibold">Rundy z pakietu są wykorzystane. Te uwagi wycenimy i prześlemy wycenę, zanim cokolwiek zmienimy.</p>}
            <button type="submit" className={s.btnLine} disabled={busy || !body.trim()}>{left === 0 ? 'Poproś o wycenę zmian' : 'Zgłoś poprawki'}</button>
          </form>
          <div className="border-t border-[#C8C9C2] pt-5">
            <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
              Sprawdziłem stronę i akceptuję ją do publikacji. Późniejsze zmiany zgłaszam w ramach planu albo jako zlecenie.</label>
            <button type="button" className={`${primary} mt-3`} disabled={busy || !confirm} onClick={() => void decide('approve')}>Akceptuję do publikacji</button>
          </div>
        </>
      )}
    </div>
  );
}

function Thread({ ws, call, onSaved, onError }: Props) {
  const [body, setBody] = useState('');
  const [kind, setKind] = useState<'message' | 'change_request'>('message');
  const [busy, setBusy] = useState(false);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await call<{ project: Workspace }>('tovernetProject.post', { kind, body });
      onSaved(r.project);
      setBody('');
      track('project_message_sent', { project_id: ws.id, kind });
    } catch (err) { onError(say(err)); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      {ws.items.length === 0 ? <p className="text-sm text-[#5A5C60]">Brak wiadomości.</p> : (
        <ol className="space-y-3">
          {ws.items.map((i) => (
            <li key={i.id} className={`p-3 text-sm ${i.author_side === 'staff' ? 'border-l-4 border-[#2536C4] bg-[#F1F2ED]' : 'border border-[#C8C9C2]'}`}>
              <p className="text-xs text-[#5A5C60]">
                {i.author_side === 'staff' ? 'Tovernet' : 'Ty'} · {KIND_LABEL[i.kind] ?? i.kind} · {date(i.created_at)}
                {i.status === 'resolved' && ' · załatwione'}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{i.body}</p>
            </li>
          ))}
        </ol>
      )}

      <form onSubmit={send} className="space-y-2">
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="radio" checked={kind === 'message'} onChange={() => setKind('message')} />Wiadomość lub pytanie</label>
          <label className="flex items-center gap-2"><input type="radio" checked={kind === 'change_request'} onChange={() => setKind('change_request')} />Zmiana na stronie</label>
        </div>
        {kind === 'change_request' && (
          <p className="text-sm text-[#5A5C60]">
            {ws.plan ? PLAN_MINUTES[ws.plan.key] ?? '' : ''} Większe zmiany, np. nowa podstrona albo funkcja, wycenimy przed wykonaniem. Płacisz dopiero po akceptacji wyceny.
          </p>
        )}
        <textarea className={input} rows={4} value={body} onChange={(e) => setBody(e.target.value)} required maxLength={5000}
                  placeholder={kind === 'change_request' ? 'Co i gdzie zmienić? Im konkretniej, tym szybciej.' : 'Napisz do nas'} aria-label="Treść" />
        <button type="submit" className={primary} disabled={busy || !body.trim()}>Wyślij</button>
      </form>
    </div>
  );
}
