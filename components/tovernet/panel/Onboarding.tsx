'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Plus, X } from 'lucide-react';
import { CONSTRUCTION_VARIANTS, presentCity, presentName } from '@/lib/tovernet/construction';
import type { VariantKey } from '@/lib/tovernet/api';
import { track } from '@/lib/tovernet/analytics';
import { STEPS, day, logosOf, photosOf, say, stepDone, when, type StepKey } from './model';
import Uploader from './Uploader';
import type { Brief, Workspace } from './types';
import type { ViewProps } from './view';
import p from './panel.module.css';

type Key = StepKey | 'wyslij';
const ORDER: Key[] = [...STEPS.map((s) => s.key), 'wyslij'];

function defaultServices(variant: string | null): string[] {
  const v = variant ? (CONSTRUCTION_VARIANTS as Record<string, (typeof CONSTRUCTION_VARIANTS)['general'] | undefined>)[variant] : undefined;
  return v ? v.services.map((x) => x.title) : [];
}

function initialBrief(ws: Workspace): Brief {
  return {
    email: ws.prefill.email ?? '',
    domain_choice: ws.prefill.website ? 'have' : undefined,
    domain: ws.prefill.website ? ws.prefill.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : '',
    ...ws.brief,
    services: ws.brief.services ?? defaultServices(ws.prefill.variant),
  };
}

const clean = (b: Brief): Brief => ({ ...b, services: (b.services ?? []).map((x) => x.trim()).filter(Boolean).slice(0, 30) });

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/** "Start strony": the guided brief. One question per screen, everything autosaves. */
export default function Onboarding({ ws, api, go, setWs, refresh, intent }: ViewProps) {
  const locked = Boolean(ws.brief_submitted_at);
  const [b, setB] = useState<Brief>(() => initialBrief(ws));
  const [step, setStep] = useState<Key>(() => {
    if (intent.step && ORDER.includes(intent.step as Key)) return intent.step as Key;
    const start = initialBrief(ws);
    return STEPS.find((s) => !s.optional && !stepDone(s.key, start, ws.files))?.key ?? 'wyslij';
  });
  const [dir, setDir] = useState<'fwd' | 'back' | ''>('');
  const [save, setSave] = useState<SaveState>(Object.keys(ws.brief ?? {}).length ? 'saved' : 'idle');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);

  const latest = useRef(b);
  latest.current = b;
  const dirty = useRef(false);
  const inflight = useRef<Promise<void> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const trackedDraft = useRef(false);

  const flush = useCallback(async (): Promise<void> => {
    if (locked) return;
    if (inflight.current) { await inflight.current; }
    if (!dirty.current) return;
    dirty.current = false;
    setSave('saving');
    const run = (async () => {
      try {
        const r = await api.saveBrief(clean(latest.current), false);
        setWs((cur) => (cur ? { ...cur, brief: r.brief } : r));
        setSave('saved');
        setSavedAt(new Date().toISOString());
        if (!trackedDraft.current) { trackedDraft.current = true; track('brief_draft_saved', { project_id: ws.id, photos: photosOf(r.files).length }); }
      } catch (e) {
        dirty.current = true;
        setSave('error');
        if (e instanceof Error && e.message === 'brief_already_submitted') void refresh();
      }
    })();
    inflight.current = run;
    await run;
    inflight.current = null;
  }, [api, locked, refresh, setWs, ws.id]);

  const set = (patch: Partial<Brief>) => {
    setB((x) => ({ ...x, ...patch }));
    dirty.current = true;
    setSave('saving');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { void flush(); }, 900);
  };

  // Services prefilled from the concept count as an answer: store them right away.
  useEffect(() => {
    if (!locked && !ws.brief.services && (latest.current.services ?? []).length) { dirty.current = true; void flush(); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save when the tab hides or the view closes: nothing typed is lost.
  useEffect(() => {
    const hide = () => { if (document.visibilityState === 'hidden') void flush(); };
    document.addEventListener('visibilitychange', hide);
    return () => { document.removeEventListener('visibilitychange', hide); clearTimeout(timer.current); void flush(); };
  }, [flush]);

  const move = (k: Key) => {
    clearTimeout(timer.current);
    void flush();
    setDir(ORDER.indexOf(k) < ORDER.indexOf(step) ? 'back' : 'fwd');
    setStep(k);
    setTried(false);
    track('brief_step_opened', { step: k });
    requestAnimationFrame(() => document.getElementById('wizard-top')?.scrollIntoView({ block: 'nearest' }));
  };
  const idx = ORDER.indexOf(step);
  const nextStep = () => {
    if (step === 'kontakt' && !b.phone?.trim()) { setTried(true); return; }
    move(ORDER[Math.min(ORDER.length - 1, idx + 1)]);
  };

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      clearTimeout(timer.current);
      dirty.current = false;
      const r = await api.saveBrief(clean(latest.current), true);
      setWs(r);
      track('brief_submitted', { project_id: ws.id, photos: photosOf(r.files).length });
      window.scrollTo({ top: 0 });
    } catch (e) { setError(say(e)); } finally { setBusy(false); }
  };

  const city = presentCity(ws.prefill.city);
  const done = useMemo(() => Object.fromEntries(STEPS.map((s) => [s.key, stepDone(s.key, b, ws.files)])) as Record<StepKey, boolean>, [b, ws.files]);
  const missing = STEPS.filter((s) => !s.optional && !done[s.key]);

  if (locked) return <Submitted ws={ws} b={b} go={go} />;

  const saveLabel = save === 'saving' ? 'Zapisujemy…' : save === 'error' ? 'Nie zapisano. Spróbujemy ponownie.' : save === 'saved' ? `Zapisano${savedAt ? ` ${new Date(savedAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}` : ''}` : 'Zapisuje się samo';

  return (
    <div>
      <div className={p.head} id="wizard-top">
        <div>
          <span className={p.l}>Start strony · Twoja część</span>
          <h1 className={p.h1}>Powiedz nam to, czego nie ma w rejestrze</h1>
          <p className={p.lead}>Dane firmy już mamy. Potrzebujemy kontaktu, obszaru, usług i zdjęć. Możesz przerwać w każdej chwili: wszystko zapisuje się samo.</p>
        </div>
      </div>

      <div className={p.wizard}>
        <ol className={p.wsteps} aria-label="Kroki">
          {ORDER.map((k, i) => {
            const s = STEPS.find((x) => x.key === k);
            const ok = k !== 'wyslij' && done[k as StepKey];
            return (
              <li key={k}>
                <button type="button" aria-current={step === k ? 'step' : undefined} className={ok ? p.wdone : ''} onClick={() => move(k)}>
                  <i>{ok ? <Check size={11} aria-hidden="true" /> : i + 1}</i>
                  <span>{s ? s.short : 'Sprawdź i wyślij'}{s?.optional ? <span className={p.muted}> · opcja</span> : null}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className={p.wcard}>
          <div className={p.wbar} aria-hidden="true" style={{ padding: '12px 16px 0' }}>
            {ORDER.map((k, i) => <i key={k} className={i < idx || (k !== 'wyslij' && done[k as StepKey] && i !== idx) ? p.d : i === idx ? p.n : ''} />)}
          </div>
          <div key={step} className={p.wbody} data-dir={dir || undefined}>
            <span className={p.l}>Krok {idx + 1} z {ORDER.length}</span>

            {step === 'kontakt' && (
              <>
                <h2 className={p.wq}>Jak klienci mają się z Tobą kontaktować?</h2>
                <p className={p.whelp}>Ten numer i e-mail pokażemy na stronie i w formularzu zapytań.</p>
                <div className={p.prefill}>
                  <span className={p.l} style={{ width: '100%' }}>Z rejestru, wpiszemy sami</span>
                  {ws.prefill.company_name && <b>{presentName(ws.prefill.company_name)}</b>}
                  {city && <span>{city}</span>}
                  {ws.prefill.nip && <span>NIP {ws.prefill.nip}</span>}
                </div>
                <label className={p.field}>
                  <span>Telefon na stronę</span>
                  <small>Wymagany. Najlepiej ten, który odbierasz w pracy.</small>
                  <input className={p.input} inputMode="tel" autoComplete="tel" value={b.phone ?? ''} placeholder="np. 600 700 800"
                         aria-invalid={tried && !b.phone?.trim()} aria-describedby={tried && !b.phone?.trim() ? 'phone-err' : undefined}
                         onChange={(e) => set({ phone: e.target.value })} />
                  {tried && !b.phone?.trim() && <small id="phone-err" style={{ color: 'var(--err)' }}>Podaj numer, żeby przejść dalej.</small>}
                </label>
                <label className={p.field}>
                  <span>E-mail do zapytań</span>
                  <small>Tu będą przychodzić wiadomości z formularza.</small>
                  <input className={p.input} type="email" autoComplete="email" value={b.email ?? ''} onChange={(e) => set({ email: e.target.value })} />
                </label>
              </>
            )}

            {step === 'obszar' && (
              <>
                <h2 className={p.wq}>Gdzie przyjmujesz zlecenia?</h2>
                <p className={p.whelp}>Klient od razu zobaczy, czy do niego dojedziesz. Wybierz albo wpisz własnymi słowami.</p>
                <div className={p.btnRow} style={{ marginBottom: 14 }}>
                  {[city && `${city} i okolice`, city && `${city} i 30 km wokół`, city && `${city} i całe województwo`, 'Cała Polska'].filter(Boolean).map((x) => (
                    <button key={x as string} type="button" className={p.btnLine} aria-pressed={b.area === x} onClick={() => set({ area: x as string })}
                            style={b.area === x ? { background: 'var(--ink)', color: 'var(--sheet)' } : undefined}>{x}</button>
                  ))}
                </div>
                <label className={p.field}>
                  <span>Obszar działania</span>
                  <input className={p.input} value={b.area ?? ''} onChange={(e) => set({ area: e.target.value })} placeholder={`np. ${city ?? 'Łódź'} i 30 km wokół`} />
                </label>
              </>
            )}

            {step === 'uslugi' && <Services b={b} set={set} />}

            {step === 'zdjecia' && (
              <>
                <h2 className={p.wq}>Zdjęcia z Twoich realizacji</h2>
                <p className={p.whelp}>Z telefonu wystarczą. Wybierz kilka, na których widać efekt pracy. Bez zdjęć zostawimy grafiki poglądowe, opisane jako poglądowe.</p>
                <Uploader ws={ws} api={api} purpose="photo" refresh={refresh} onError={setError} hint="JPG, PNG, HEIC lub WebP, do 15 MB. Możesz wybrać kilka naraz." />
                {photosOf(ws.files).length === 0 && (
                  <label className={p.tick}><input type="checkbox" checked={Boolean(b.no_photos)} onChange={(e) => set({ no_photos: e.target.checked })} />Nie mam teraz zdjęć</label>
                )}
              </>
            )}

            {step === 'logo' && (
              <>
                <h2 className={p.wq}>Logo firmy</h2>
                <p className={p.whelp}>Najlepiej SVG albo PNG z przezroczystym tłem. Bez logo użyjemy nazwy firmy, tak jak w koncepcie.</p>
                <Uploader ws={ws} api={api} purpose="logo" refresh={refresh} onError={setError} hint="SVG, PNG, JPG lub PDF, do 15 MB." />
                {logosOf(ws.files).length === 0 && (
                  <label className={p.tick}><input type="checkbox" checked={Boolean(b.no_logo)} onChange={(e) => set({ no_logo: e.target.checked })} />Nie mam logo</label>
                )}
              </>
            )}

            {step === 'domena' && (
              <>
                <h2 className={p.wq}>Pod jakim adresem ma działać strona?</h2>
                <p className={p.whelp}>Domena to adres strony, np. twojafirma.pl. Jeśli nie wiesz, zaznacz „Nie wiem”, sprawdzimy to.</p>
                <div className={p.choices} role="radiogroup" aria-label="Domena">
                  {([['have', 'Mam domenę', 'Podasz adres, a przed publikacją ustalimy, jak ją podpiąć.'], ['new', 'Potrzebuję nowej', 'Zaproponujemy kilka wolnych adresów. Domenę .pl zarejestrujemy na Twoją firmę.'], ['unsure', 'Nie wiem', 'Sprawdzimy to za Ciebie i napiszemy, co znaleźliśmy.']] as const).map(([k, label, hint]) => (
                    <label key={k} className={p.choice}>
                      <input type="radio" name={`domain-${ws.id}`} checked={b.domain_choice === k} onChange={() => set({ domain_choice: k })} />
                      <i aria-hidden="true" />
                      <span><b>{label}</b><small>{hint}</small></span>
                    </label>
                  ))}
                </div>
                {b.domain_choice === 'have' && (
                  <label className={p.field} style={{ marginTop: 16 }}>
                    <span>Adres domeny</span>
                    <input className={p.input} value={b.domain ?? ''} onChange={(e) => set({ domain: e.target.value.trim() })} placeholder="np. twojafirma.pl" inputMode="url" autoCapitalize="none" spellCheck={false} />
                  </label>
                )}
                <p className={`${p.tiny} ${p.muted}`} style={{ marginTop: 14 }}>Nie wysyłaj nam haseł. Jeśli będzie potrzebny dostęp, powiemy dokładnie, jak go bezpiecznie przekazać.</p>
              </>
            )}

            {step === 'uwagi' && (
              <>
                <h2 className={p.wq}>Co klient powinien wiedzieć, zanim zadzwoni?</h2>
                <p className={p.whelp}>Nieobowiązkowe. Jedno, dwa zdania, które oszczędzą Ci telefonów nie na temat.</p>
                <label className={p.field}>
                  <span className={p.sr}>Uwagi</span>
                  <textarea className={p.input} rows={4} value={b.notes ?? ''} onChange={(e) => set({ notes: e.target.value })} placeholder="np. nie robimy drobnych napraw, wyceny w ciągu 2 dni, faktura VAT" maxLength={2000} />
                </label>
              </>
            )}

            {step === 'wyslij' && (
              <>
                <h2 className={p.wq}>Sprawdź i wyślij</h2>
                <p className={p.whelp}>{missing.length ? 'Brakujące punkty możesz uzupełnić teraz albo pominąć. Dopytamy w wiadomościach.' : 'Wszystko gotowe. Po wysłaniu zaczynamy pracę nad stroną.'}</p>
                <Summary ws={ws} b={b} onEdit={move} />
                {error && <p role="alert" className={p.alert} style={{ marginTop: 16 }}>{error}</p>}
                <div className={p.gap24}>
                  <button type="button" className={`${p.btn} ${p.nextCta}`} disabled={busy || !b.phone?.trim()} onClick={() => void submit()}>
                    {busy ? 'Wysyłamy…' : 'Wyślij materiały'}<ArrowRight size={18} aria-hidden="true" />
                  </button>
                  {!b.phone?.trim() && <p className={`${p.small}`} style={{ color: 'var(--err)', margin: '8px 0 0' }}>Brakuje telefonu na stronę. <button type="button" className={p.btnGhost} onClick={() => move('kontakt')}>Uzupełnij</button></p>}
                  <p className={`${p.tiny} ${p.muted}`} style={{ marginTop: 12 }}>Po wysłaniu materiałów zaczynamy pracę. Do tego momentu możesz zrezygnować i odzyskać całą wpłatę. Zdjęcia i pliki możesz dosyłać także później.</p>
                </div>
              </>
            )}
          </div>

          <div className={p.wfoot}>
            <span className={p.saved} data-s={save} role="status" aria-live="polite"><i aria-hidden="true" />{saveLabel}</span>
            <span className={p.btnRow}>
              {idx > 0 && <button type="button" className={p.btnLine} onClick={() => move(ORDER[idx - 1])} aria-label="Wstecz"><ArrowLeft size={16} aria-hidden="true" /><span className={p.hideSm}>Wstecz</span></button>}
              {step !== 'wyslij' && (
                <button type="button" className={p.btn} onClick={nextStep}>
                  {STEPS.find((s) => s.key === step)?.optional && !done[step as StepKey] ? 'Pomiń' : 'Dalej'}<ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Services({ b, set }: { b: Brief; set: (x: Partial<Brief>) => void }) {
  const list = b.services ?? [];
  const [draft, setDraft] = useState('');
  const put = (next: string[]) => set({ services: next });
  const swap = (i: number, j: number) => { const n = [...list]; [n[i], n[j]] = [n[j], n[i]]; put(n); };
  const add = () => { if (!draft.trim()) return; put([...list, draft.trim()]); setDraft(''); };
  return (
    <>
      <h2 className={p.wq}>Usługi, które naprawdę wykonujesz</h2>
      <p className={p.whelp}>Wpisaliśmy przykłady z konceptu. Popraw, usuń, dopisz. Trzy pierwsze pokażemy najwyżej, więc ustaw je strzałkami.</p>
      <ol className={p.svc}>
        {list.map((x, i) => (
          <li key={i} className={i < 3 ? p.top : ''}>
            <em>{String(i + 1).padStart(2, '0')}</em>
            <input value={x} aria-label={`Usługa ${i + 1}`} onChange={(e) => { const n = [...list]; n[i] = e.target.value; put(n); }} maxLength={120} />
            <span className={p.svcAct}>
              <button type="button" className={p.icon} aria-label="Wyżej" disabled={i === 0} onClick={() => swap(i, i - 1)}><ArrowUp size={16} /></button>
              <button type="button" className={p.icon} aria-label="Niżej" disabled={i === list.length - 1} onClick={() => swap(i, i + 1)}><ArrowDown size={16} /></button>
              <button type="button" className={p.icon} aria-label={`Usuń ${x || 'usługę'}`} onClick={() => put(list.filter((_, k) => k !== i))}><X size={16} /></button>
            </span>
          </li>
        ))}
      </ol>
      <form className={p.btnRow} style={{ marginTop: 12, flexWrap: 'nowrap' }} onSubmit={(e) => { e.preventDefault(); add(); }}>
        <input className={p.input} style={{ marginTop: 0 }} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Dopisz usługę" aria-label="Nowa usługa" maxLength={120} />
        <button type="submit" className={p.btnLine} style={{ minHeight: 48 }} disabled={!draft.trim()}><Plus size={16} aria-hidden="true" />Dodaj</button>
      </form>
    </>
  );
}

const DOMAIN: Record<string, string> = { have: 'Mam domenę', new: 'Potrzebuję nowej', unsure: 'Nie wiem, sprawdźcie' };

function Summary({ ws, b, onEdit }: { ws: Workspace; b: Brief; onEdit?: (k: Key) => void }) {
  const photos = photosOf(ws.files).length;
  const logos = logosOf(ws.files).length;
  const rows: [StepKey, string, string | null][] = [
    ['kontakt', 'Kontakt', [b.phone, b.email].filter((x) => x?.trim()).join(' · ') || null],
    ['obszar', 'Obszar', b.area?.trim() || null],
    ['uslugi', 'Usługi', (b.services ?? []).filter((x) => x.trim()).join(', ') || null],
    ['zdjecia', 'Zdjęcia', photos ? `${photos} ${photos === 1 ? 'zdjęcie' : photos < 5 ? 'zdjęcia' : 'zdjęć'}` : b.no_photos ? 'Bez zdjęć, zostaną grafiki poglądowe' : null],
    ['logo', 'Logo', logos ? 'Dodane' : b.no_logo ? 'Bez logo, nazwa firmy' : null],
    ['domena', 'Domena', b.domain_choice ? `${DOMAIN[b.domain_choice]}${b.domain_choice === 'have' && b.domain ? `: ${b.domain}` : ''}` : null],
    ['uwagi', 'Uwagi', b.notes?.trim() || null],
  ];
  return (
    <dl className={p.summary}>
      {rows.map(([k, label, value]) => (
        <div key={k}>
          <dt>{label}</dt>
          <dd>{value ?? <span className={p.missing}>{k === 'uwagi' ? 'brak, to nieobowiązkowe' : 'do uzupełnienia'}</span>}</dd>
          {onEdit ? <button type="button" className={p.btnGhost} onClick={() => onEdit(k)}>Zmień</button> : <span />}
        </div>
      ))}
    </dl>
  );
}

function Submitted({ ws, b, go }: { ws: Workspace; b: Brief; go: ViewProps['go'] }) {
  return (
    <div>
      <div className={p.head}>
        <div>
          <span className={p.l}>Start strony · Twoja część</span>
          <h1 className={p.h1}>Materiały wysłane</h1>
          <p className={p.lead}>Dotarły do nas {day(ws.brief_submitted_at!)}, o {when(ws.brief_submitted_at!).split(', ').pop()}. Poniżej to, co od Ciebie dostaliśmy.</p>
        </div>
        <span className={`${p.stamp} ${p.stampOk}`} style={{ fontSize: 12, padding: '5px 10px' }}><Check size={14} aria-hidden="true" />Wysłane</span>
      </div>
      <div className={p.card}>
        <Summary ws={ws} b={b} />
        <div className={`${p.btnRow} ${p.gap16}`}>
          <button type="button" className={p.btn} onClick={() => go('pulpit')}>Wróć na pulpit<ArrowRight size={16} aria-hidden="true" /></button>
          <button type="button" className={p.btnLine} onClick={() => go('materialy')}>Doślij zdjęcia lub pliki</button>
          <button type="button" className={p.btnGhost} onClick={() => go('wiadomosci', { kind: 'message', draft: 'Chcę poprawić w materiałach: ' })}>Chcę coś zmienić</button>
        </div>
      </div>
    </div>
  );
}
