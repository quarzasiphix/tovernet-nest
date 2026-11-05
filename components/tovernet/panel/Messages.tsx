'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { track } from '@/lib/tovernet/analytics';
import { KIND_LABEL, day, openQuestions, say, when } from './model';
import type { Workspace } from './types';
import type { ViewProps } from './view';
import p from './panel.module.css';

const PLAN_MINUTES: Record<string, string> = {
  'tovernet.care.monthly': 'W planie Opieka masz do 30 minut drobnych zmian miesięcznie: teksty, zdjęcia, ceny, godziny, dane kontaktowe.',
  'tovernet.plan.growth': 'W planie Widoczność lokalna masz do 30 minut drobnych zmian miesięcznie i jedną nową podstronę lub artykuł.',
  'tovernet.plan.hosting': 'Plan Utrzymanie nie obejmuje zmian. Każdą zmianę wycenimy, zanim cokolwiek zrobimy.',
};

/** Conversation with Tovernet, change requests, and the project's history. */
export default function Messages({ ws, api, setWs, intent, seen }: ViewProps & { seen: string | null }) {
  const [tab, setTab] = useState<'rozmowa' | 'historia'>('rozmowa');
  const [kind, setKind] = useState<'message' | 'change_request'>(intent.kind ?? (ws.status === 'completed' ? 'change_request' : 'message'));
  const [body, setBody] = useState(intent.draft ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const end = useRef<HTMLLIElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const items = ws.items.filter((i) => i.kind !== 'internal_note');
  const questions = openQuestions(items);
  const firstNew = useMemo(() => items.find((i) => i.author_side === 'staff' && seen && i.created_at > seen)?.id, [items, seen]);

  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [items.length, tab]);
  useEffect(() => { if (intent.draft) { box.current?.focus(); box.current?.setSelectionRange(intent.draft.length, intent.draft.length); } }, [intent.draft]);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    setError('');
    try {
      const r = await api.post(kind, body.trim());
      setWs(r);
      setBody('');
      track('project_message_sent', { project_id: ws.id, kind });
    } catch (err) { setError(say(err)); } finally { setBusy(false); }
  };
  const key = (e: KeyboardEvent) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void send(); };

  return (
    <div>
      <div className={p.head}>
        <div>
          <span className={p.l}>Wiadomości{questions.length ? ` · czekamy na odpowiedź: ${questions.length}` : ''}</span>
          <h1 className={p.h1}>Rozmowa z Tovernet</h1>
          <p className={p.lead}>Pytania, zmiany na stronie, uwagi. Odpowiadamy w dni robocze, a o każdej odpowiedzi dostaniesz też e-mail.</p>
        </div>
      </div>

      <section className={p.chat} aria-label="Wiadomości">
        <div className={p.chatHead}>
          <div className={p.seg} role="group" aria-label="Widok">
            <button type="button" aria-pressed={tab === 'rozmowa'} onClick={() => setTab('rozmowa')}>Rozmowa</button>
            <button type="button" aria-pressed={tab === 'historia'} onClick={() => setTab('historia')}>Historia projektu</button>
          </div>
          <span className={p.l}>{items.length ? `wiadomości: ${items.length}` : ''}</span>
        </div>

        {tab === 'rozmowa' ? (
          items.length === 0 ? (
            <div className={p.empty}><b style={{ color: 'var(--ink)' }}>Jeszcze nic tu nie ma</b><span className={p.small}>Napisz pierwszą wiadomość. Możesz też zapytać o cokolwiek przed startem.</span></div>
          ) : (
            <ol className={p.thread}>
              {items.map((i) => (
                <FragmentRow key={i.id} newLine={i.id === firstNew}>
                  <li className={`${p.msg} ${i.author_side === 'staff' ? p.msgStaff : p.msgClient} ${i.kind === 'info_request' && i.status === 'open' ? p.msgAsk : ''}`}>
                    <header>
                      <b style={{ color: 'var(--ink)' }}>{i.author_side === 'staff' ? 'Tovernet' : 'Ty'}</b>
                      <span>{when(i.created_at)}</span>
                      {i.kind !== 'message' && <span className={p.chip} style={{ color: i.kind === 'info_request' ? 'var(--stamp)' : 'var(--soft)' }}>{KIND_LABEL[i.kind] ?? i.kind}</span>}
                      {i.status === 'resolved' && <span className={p.chip} style={{ color: 'var(--ok)' }}>załatwione</span>}
                    </header>
                    <p>{i.body}</p>
                  </li>
                </FragmentRow>
              ))}
              <li ref={end} aria-hidden="true" />
            </ol>
          )
        ) : <History ws={ws} />}

        <form className={p.composer} onSubmit={send}>
          <div className={p.seg} role="radiogroup" aria-label="Rodzaj wiadomości" style={{ marginBottom: 10 }}>
            <button type="button" role="radio" aria-checked={kind === 'message'} onClick={() => setKind('message')}>Wiadomość lub pytanie</button>
            <button type="button" role="radio" aria-checked={kind === 'change_request'} onClick={() => setKind('change_request')}>Zmiana na stronie</button>
          </div>
          {kind === 'change_request' && (
            <p className={`${p.tiny} ${p.muted}`} style={{ margin: '0 0 8px' }}>
              {ws.plan ? `${PLAN_MINUTES[ws.plan.key] ?? ''} ` : ''}Większe zmiany, np. nowa podstrona albo funkcja, wycenimy przed wykonaniem. Płacisz dopiero po akceptacji wyceny.
            </p>
          )}
          <label>
            <span className={p.sr}>Treść</span>
            <textarea ref={box} className={p.input} style={{ marginTop: 0 }} rows={3} value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={key} maxLength={5000}
                      placeholder={kind === 'change_request' ? 'Co i gdzie zmienić? Im konkretniej, tym szybciej.' : questions.length ? 'Twoja odpowiedź' : 'Napisz do nas'} />
          </label>
          {error && <p role="alert" className={p.alert} style={{ margin: '8px 0 0' }}>{error}</p>}
          <div className={p.composerFoot}>
            <span className={`${p.tiny} ${p.muted}`}>Pliki dodasz w Materiałach. Nie wysyłaj tu haseł.</span>
            <button type="submit" className={p.btn} disabled={busy || !body.trim()}><Send size={16} aria-hidden="true" />{busy ? 'Wysyłamy…' : 'Wyślij'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function FragmentRow({ newLine, children }: { newLine: boolean; children: React.ReactNode }) {
  return <>{newLine && <li className={p.newLine} aria-label="Nowe wiadomości">Nowe</li>}{children}</>;
}

type Ev = { at: string; text: string; tone: 'staff' | 'client' | 'mile' };

function History({ ws }: { ws: Workspace }) {
  const events = useMemo(() => {
    // Server timeline when the backend provides it; otherwise rebuilt from the workspace.
    if (ws.timeline?.length) {
      return ws.timeline.map((t): Ev => ({ at: t.at, text: t.label, tone: /message|request|staff/.test(t.type) ? 'staff' : /file|brief_|revision/.test(t.type) ? 'client' : 'mile' }))
        .sort((a, b) => (a.at < b.at ? 1 : -1));
    }
    const out: Ev[] = [];
    if (ws.created_at) out.push({ at: ws.created_at, text: 'Projekt założony po opłaceniu zamówienia', tone: 'mile' });
    const byDay = new Map<string, { at: string; photo: number; logo: number; document: number }>();
    for (const f of ws.files) {
      const k = f.created_at.slice(0, 10);
      const g = byDay.get(k) ?? { at: f.created_at, photo: 0, logo: 0, document: 0 };
      if (f.purpose === 'photo' || f.purpose === 'logo' || f.purpose === 'document') g[f.purpose] += 1;
      if (f.created_at > g.at) g.at = f.created_at;
      byDay.set(k, g);
    }
    for (const g of Array.from(byDay.values())) {
      const parts = [g.photo && `zdjęcia: ${g.photo}`, g.logo && 'logo', g.document && `dokumenty: ${g.document}`].filter(Boolean);
      out.push({ at: g.at, text: `Dodałeś pliki (${parts.join(', ')})`, tone: 'client' });
    }
    if (ws.brief_submitted_at) out.push({ at: ws.brief_submitted_at, text: 'Wysłałeś start strony', tone: 'mile' });
    for (const i of ws.items) {
      if (i.kind === 'internal_note') continue;
      const who = i.author_side === 'staff' ? 'Tovernet' : 'Ty';
      const what = i.kind === 'revision' ? 'zgłosiłeś rundę poprawek' : i.kind === 'change_request' ? 'zmiana na stronie' : i.kind === 'info_request' ? 'pytanie do Ciebie' : 'wiadomość';
      out.push({ at: i.created_at, text: `${who}: ${what}`, tone: i.author_side === 'staff' ? 'staff' : 'client' });
    }
    if (ws.approved_at) out.push({ at: ws.approved_at, text: 'Zaakceptowałeś stronę do publikacji', tone: 'mile' });
    return out.sort((a, b) => (a.at < b.at ? 1 : -1));
  }, [ws]);

  if (!events.length) return <div className={p.empty}>Historia pojawi się, gdy coś się wydarzy.</div>;
  return (
    <ol className={p.feed}>
      {events.map((e, i) => (
        <li key={i}><time dateTime={e.at}>{day(e.at).replace(/ \d{4}$/, '')}</time><i className={e.tone === 'staff' ? p.staff : e.tone === 'mile' ? p.mile : ''} aria-hidden="true" /><span>{e.text}</span></li>
      ))}
    </ol>
  );
}
