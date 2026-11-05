'use client';

import { useEffect, useState, type DragEvent } from 'react';
import { Download, FileText, Trash2, X } from 'lucide-react';
import { track } from '@/lib/tovernet/analytics';
import { say, size } from './model';
import type { FileRow, ProjectApi, Workspace } from './types';
import p from './panel.module.css';

type Purpose = 'photo' | 'logo' | 'document';

const ACCEPT: Record<Purpose, string> = {
  photo: 'image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif',
  logo: 'image/svg+xml,image/png,image/jpeg,image/webp,application/pdf',
  document: 'application/pdf,image/jpeg,image/png',
};
const MAX: Record<Purpose, number> = { photo: 20, logo: 2, document: 10 };

// Signed download URLs live 5 minutes; reuse one for 4.
const urls = new Map<string, { url: string; at: number }>();
const previewable = (f: FileRow) => /^image\/(jpeg|png|webp|svg\+xml)$/.test(f.mime_type);

/** Signed URL for a file, cached briefly. */
export function useFileUrl(api: ProjectApi, f: FileRow | null) {
  const [url, setUrl] = useState<string | null>(() => (f && urls.get(f.id)?.url) || null);
  useEffect(() => {
    if (!f || !previewable(f)) return;
    const hit = urls.get(f.id);
    if (hit && Date.now() - hit.at < 240000) { setUrl(hit.url); return; }
    let live = true;
    api.fileUrl(f.id).then((u) => { urls.set(f.id, { url: u, at: Date.now() }); if (live) setUrl(u); }).catch(() => undefined);
    return () => { live = false; };
  }, [api, f]);
  return url;
}

export function canRemoveFiles(ws: Workspace) {
  return !['completed', 'cancelled'].includes(ws.status) && (!ws.brief_submitted_at || ['new', 'awaiting_information'].includes(ws.status));
}
export const canUpload = (ws: Workspace) => !['completed', 'cancelled'].includes(ws.status);

type Props = {
  ws: Workspace; api: ProjectApi; purpose: Purpose; refresh: () => Promise<void>; onError: (m: string) => void;
  title?: string; hint: string;
};

export default function Uploader({ ws, api, purpose, refresh, onError, title, hint }: Props) {
  const files = ws.files.filter((f) => f.purpose === purpose);
  const [busy, setBusy] = useState(0);
  const [over, setOver] = useState(false);
  const [open, setOpen] = useState<FileRow | null>(null);
  const removable = canRemoveFiles(ws);
  const allowed = canUpload(ws);

  const upload = async (list: FileList | File[] | null) => {
    if (!list || !allowed) return;
    const chosen = Array.from(list).slice(0, MAX[purpose]);
    if (!chosen.length) return;
    setBusy(chosen.length);
    let ok = 0;
    for (const file of chosen) {
      try { await api.upload(file, purpose); ok += 1; } catch (e) { onError(say(e)); }
      setBusy((n) => n - 1);
    }
    await refresh();
    if (ok) track('files_uploaded', { project_id: ws.id, purpose, count: ok });
  };

  const remove = async (f: FileRow) => {
    try { await api.fileRemove(f.id); urls.delete(f.id); await refresh(); setOpen(null); } catch (e) { onError(say(e)); }
  };

  const drop = (e: DragEvent) => { e.preventDefault(); setOver(false); void upload(e.dataTransfer.files); };
  const grid = purpose !== 'document';

  return (
    <div>
      {title && <p className={p.h3} style={{ marginBottom: 4 }}>{title}</p>}
      {allowed && (
        <label className={p.drop} data-over={over} aria-disabled={busy > 0}
               onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={drop}>
          <b>{busy > 0 ? `Wysyłamy… zostało ${busy}` : purpose === 'photo' ? 'Dodaj zdjęcia' : purpose === 'logo' ? 'Dodaj logo' : 'Dodaj plik'}</b>
          <small>{hint}</small>
          <input type="file" multiple={purpose !== 'logo'} accept={ACCEPT[purpose]} disabled={busy > 0}
                 onChange={(e) => { void upload(e.target.files ? Array.from(e.target.files) : null); e.target.value = ''; }} />
        </label>
      )}
      {(files.length > 0 || busy > 0) && (grid ? (
        <ul className={p.gallery}>
          {files.map((f) => <Tile key={f.id} f={f} api={api} onOpen={() => setOpen(f)} onRemove={removable ? () => void remove(f) : undefined} />)}
          {Array.from({ length: busy }).map((_, i) => <li key={`b${i}`} className={`${p.tile} ${p.busy}`} aria-label="Wysyłanie" />)}
        </ul>
      ) : (
        <ul className={p.flist}>
          {files.map((f) => (
            <li key={f.id}>
              <button type="button" onClick={() => setOpen(f)}><FileText size={14} aria-hidden="true" style={{ verticalAlign: -2, marginRight: 6 }} />{f.file_name}</button>
              <span className={`${p.tiny} ${p.muted}`}>{size(f.size_bytes)}</span>
              {removable ? <button type="button" className={p.icon} aria-label={`Usuń ${f.file_name}`} onClick={() => void remove(f)}><Trash2 size={16} /></button> : <span />}
            </li>
          ))}
        </ul>
      ))}
      {open && <Lightbox f={open} api={api} onClose={() => setOpen(null)} onRemove={removable ? () => void remove(open) : undefined} />}
    </div>
  );
}

function Tile({ f, api, onOpen, onRemove }: { f: FileRow; api: ProjectApi; onOpen: () => void; onRemove?: () => void }) {
  const url = useFileUrl(api, f);
  return (
    <li className={p.tile}>
      <button type="button" className={p.open} onClick={onOpen} aria-label={`Otwórz ${f.file_name}`}>
        {url ? <img src={url} alt="" loading="lazy" /> : <span className={p.ph}>{f.file_name}</span>}
      </button>
      {onRemove && <button type="button" className={p.del} aria-label={`Usuń ${f.file_name}`} onClick={onRemove}><Trash2 size={15} /></button>}
    </li>
  );
}

function Lightbox({ f, api, onClose, onRemove }: { f: FileRow; api: ProjectApi; onClose: () => void; onRemove?: () => void }) {
  const url = useFileUrl(api, f);
  const [link, setLink] = useState<string | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  useEffect(() => { if (!previewable(f)) api.fileUrl(f.id).then(setLink).catch(() => undefined); }, [api, f]);
  const href = url ?? link;
  return (
    <div className={p.lightbox} role="dialog" aria-modal="true" aria-label={f.file_name} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <header>
        <b>{f.file_name} · {size(f.size_bytes)}</b>
        <span className={p.btnRow}>
          {href && <a className={p.btnLine} href={href} target="_blank" rel="noreferrer"><Download size={16} aria-hidden="true" />Pobierz</a>}
          {onRemove && <button type="button" className={p.btnLine} onClick={onRemove}><Trash2 size={16} aria-hidden="true" />Usuń</button>}
          <button type="button" className={p.btnLine} onClick={onClose} aria-label="Zamknij"><X size={16} /></button>
        </span>
      </header>
      {url ? <img src={url} alt={f.file_name} onClick={onClose} /> : (
        <p style={{ margin: 'auto', color: '#fff', textAlign: 'center', padding: 24 }}>
          {previewable(f) ? 'Ładowanie…' : 'Podgląd tego pliku otworzysz po pobraniu.'}
        </p>
      )}
    </div>
  );
}
