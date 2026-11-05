'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, ExternalLink, Monitor, Smartphone } from 'lucide-react';
import ConceptSite from '../ConceptSite';
import { Scaled } from '../studio/motion';
import { knownVariant, nicheForVariant } from '@/lib/tovernet/niches';
import { track } from '@/lib/tovernet/analytics';
import { day, say } from './model';
import type { ViewProps } from './view';
import p from './panel.module.css';

const SIZE = { desktop: { w: 1280, h: 800 }, phone: { w: 390, h: 800 } } as const;

/** The site on a computer and a phone, then one decision: approve or a counted round of changes. */
export default function Preview({ ws, api, go, setWs }: ViewProps) {
  const [device, setDevice] = useState<'desktop' | 'phone'>('desktop');
  const [body, setBody] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const left = Math.max(0, ws.revision_rounds_limit - ws.revision_rounds_used);
  const inReview = ws.status === 'client_review';
  const url = ws.production_url ?? ws.preview_url;
  const variant = knownVariant(ws.prefill.variant);
  const company = { krs: ws.prefill.krs ?? null, city: ws.prefill.city, legal_name: ws.prefill.legal_name ?? ws.prefill.company_name ?? '', display_name: ws.prefill.company_name ?? '' };

  const decide = async (decision: 'approve' | 'revise', e?: FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await api.review(decision, decision === 'revise' ? body : null);
      setWs(r);
      setBody('');
      track(decision === 'approve' ? 'project_approved' : 'revision_requested', { project_id: ws.id, round: ws.revision_rounds_used + 1, over_limit: left === 0 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) { setError(say(err)); } finally { setBusy(false); }
  };

  const size = SIZE[device];
  const frame = (
    <div className={p.screen} style={{ aspectRatio: `${size.w} / ${size.h}` }}>
      {url ? (
        <Scaled width={size.w} className={p.scaled}>
          <iframe src={url} title="Podgląd strony" width={size.w} height={size.h} loading="lazy" style={{ width: size.w, height: size.h }} />
        </Scaled>
      ) : (
        <>
          <div style={{ position: 'absolute', inset: 0 }}>
            <Scaled width={size.w} className={p.scaled}><ConceptSite company={company} variant={variant} embedded preview /></Scaled>
          </div>
          <span className={p.conceptTag}>Koncept, od którego zaczynamy</span>
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className={p.head}>
        <div>
          <span className={p.l}>Podgląd strony{url ? (ws.production_url ? ' · online' : ' · wersja robocza') : ' · koncept'}</span>
          <h1 className={p.h1}>{ws.approved_at ? 'Strona zaakceptowana' : inReview ? 'Obejrzyj i zdecyduj' : url ? 'Wprowadzamy poprawki' : 'Tak zaczynamy'}</h1>
          <p className={p.lead}>
            {ws.approved_at ? `Zaakceptowałeś stronę ${day(ws.approved_at)}. ${ws.status === 'completed' ? 'Strona jest opublikowana.' : 'Przygotowujemy publikację.'}`
              : inReview ? 'Sprawdź stronę na komputerze i na telefonie, kliknij w przyciski, przeczytaj teksty. Potem zaakceptuj albo zgłoś poprawki.'
              : url ? 'Gdy skończymy, podgląd znów będzie czekał na Twoją decyzję. Dostaniesz e-mail.'
              : 'To koncept, który widziałeś przed zamówieniem. Gotową stronę z Twoimi treściami i zdjęciami zobaczysz tutaj, zanim cokolwiek opublikujemy.'}
          </p>
        </div>
      </div>

      <div className={p.btnRow} style={{ justifyContent: 'space-between' }}>
        <div className={p.devices} role="group" aria-label="Urządzenie">
          <button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><Monitor size={16} aria-hidden="true" />Komputer</button>
          <button type="button" aria-pressed={device === 'phone'} onClick={() => setDevice('phone')}><Smartphone size={16} aria-hidden="true" />Telefon</button>
        </div>
        <span className={p.btnRow}>
          {ws.revision_rounds_limit > 0 && (
            <span className={p.rounds} aria-label={`Rundy poprawek: wykorzystane ${ws.revision_rounds_used} z ${ws.revision_rounds_limit}`}>
              Rundy poprawek
              {Array.from({ length: ws.revision_rounds_limit }).map((_, i) => <i key={i} className={i < ws.revision_rounds_used ? p.used : ''} aria-hidden="true" />)}
              <b>{ws.revision_rounds_used} z {ws.revision_rounds_limit}</b>
            </span>
          )}
          {url && <a className={p.btnLine} href={url} target="_blank" rel="noreferrer"><ExternalLink size={16} aria-hidden="true" />Otwórz w nowej karcie</a>}
          {!url && company.display_name && <a className={p.btnLine} href={nicheForVariant(variant).path} target="_blank" rel="noreferrer"><ExternalLink size={16} aria-hidden="true" />Przykładowa strona branży</a>}
        </span>
      </div>

      <div className={p.stage}>
        {device === 'desktop' ? (
          <div className={p.browser}>
            <div className={p.chrome} aria-hidden="true"><i /><i /><i /><span>{url ? url.replace(/^https?:\/\//, '') : ws.domain || ws.brief.domain || 'twojafirma.pl'}</span></div>
            {frame}
          </div>
        ) : (
          <div className={p.phone} style={{ position: 'relative' }}>
            <span className={p.notch} aria-hidden="true" />
            {frame}
          </div>
        )}
      </div>

      {error && <p role="alert" className={p.alert} style={{ marginTop: 16 }}>{error}</p>}

      {inReview && !ws.approved_at && (
        <div className={p.decide}>
          <form className={p.card} onSubmit={(e) => void decide('revise', e)}>
            <span className={p.l}>Opcja 1 · {left ? `zostało rund: ${left}` : 'rundy wykorzystane'}</span>
            <h2 className={p.h2} style={{ margin: '6px 0 4px' }}>Zgłoś poprawki</h2>
            <p className={`${p.small} ${p.muted}`} style={{ margin: '0 0 10px' }}>Wszystkie uwagi w jednej wiadomości: jedna wiadomość to jedna runda. Pisz, gdzie i co: „Usługi: zamień kolejność, pierwsza ma być…”.</p>
            <label className={p.field} style={{ marginBottom: 10 }}>
              <span className={p.sr}>Co poprawić?</span>
              <textarea className={p.input} rows={6} value={body} onChange={(e) => setBody(e.target.value)} required maxLength={5000} placeholder="Co poprawić?" />
            </label>
            {left === 0 && <p className={p.small} style={{ fontWeight: 600 }}>Rundy z pakietu są wykorzystane. Te uwagi wycenimy i prześlemy wycenę, zanim cokolwiek zmienimy.</p>}
            <p className={`${p.tiny} ${p.muted}`}>Jeśli gotowa strona odbiega od zaakceptowanego konceptu, poprawimy ją bez liczenia rund. Napisz wtedy, czego dotyczy różnica.</p>
            <button type="submit" className={p.btnLine} disabled={busy || !body.trim()}>{left === 0 ? 'Poproś o wycenę zmian' : 'Wyślij poprawki'}</button>
          </form>

          <div className={p.card} style={{ borderColor: 'var(--ink)' }}>
            <span className={p.l}>Opcja 2</span>
            <h2 className={p.h2} style={{ margin: '6px 0 4px' }}>Akceptuję do publikacji</h2>
            <p className={`${p.small} ${p.muted}`} style={{ margin: '0 0 14px' }}>Po akceptacji ustalimy domenę i termin publikacji. Datę akceptacji zapiszemy w projekcie.</p>
            <label className={p.tick} style={{ alignItems: 'flex-start', marginTop: 0 }}>
              <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} style={{ marginTop: 2 }} />
              <span>Sprawdziłem stronę i akceptuję ją do publikacji. Późniejsze zmiany zgłaszam w ramach planu albo jako zlecenie.</span>
            </label>
            <button type="button" className={`${p.btn} ${p.gap16}`} style={{ width: '100%' }} disabled={busy || !confirm} onClick={() => void decide('approve')}>
              <Check size={18} aria-hidden="true" />Akceptuję do publikacji
            </button>
          </div>
        </div>
      )}

      {!inReview && !ws.approved_at && (
        <div className={`${p.card} ${p.gap16}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <p className={p.small} style={{ margin: 0 }}>{url ? 'Masz uwagę, zanim skończymy? Napisz, dołączymy ją do tej rundy.' : !ws.brief_submitted_at ? 'Im pełniejszy start strony, tym bliżej konceptu będzie pierwsza wersja.' : 'Pracujemy nad pierwszą wersją. Damy znać e-mailem.'}</p>
          <button type="button" className={p.btnLine} onClick={() => go(!ws.brief_submitted_at ? 'start' : 'wiadomosci')}>
            {!ws.brief_submitted_at ? 'Uzupełnij start strony' : 'Napisz do nas'}<ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
