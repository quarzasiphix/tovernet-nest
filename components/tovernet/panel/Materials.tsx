'use client';

import { useState } from 'react';
import { docsOf, logosOf, photosOf } from './model';
import Uploader, { canRemoveFiles, canUpload } from './Uploader';
import type { ViewProps } from './view';
import p from './panel.module.css';

/** Library of everything the client sent: photos, logo, documents. */
export default function Materials({ ws, api, go, refresh }: ViewProps) {
  const [error, setError] = useState('');
  const total = ws.files.length;
  const locked = !canRemoveFiles(ws);

  return (
    <div>
      <div className={p.head}>
        <div>
          <span className={p.l}>Materiały · {total ? `plików: ${total} z 60` : 'jeszcze pusto'}</span>
          <h1 className={p.h1}>Zdjęcia, logo i pliki</h1>
          <p className={p.lead}>
            {canUpload(ws) ? 'Dosyłaj w dowolnej chwili. Każdy plik od razu widzimy po naszej stronie.' : 'Projekt jest zamknięty. Pliki zostają do wglądu i pobrania.'}
            {locked && canUpload(ws) ? ' Strona jest w realizacji, więc usunięcie pliku zgłoś w wiadomościach.' : ''}
          </p>
        </div>
        {!ws.brief_submitted_at && <button type="button" className={p.btn} onClick={() => go('start')}>Dokończ start strony</button>}
      </div>
      {error && <p role="alert" className={p.alert}>{error}</p>}

      <div className={p.stack}>
        <section className={p.card} aria-labelledby="m-photos">
          <div className={p.cardHead}><h2 id="m-photos" className={p.h2}>Zdjęcia</h2><span className={p.l}>{photosOf(ws.files).length}</span></div>
          <Uploader ws={ws} api={api} purpose="photo" refresh={refresh} onError={setError} hint="Przeciągnij tutaj albo wybierz z telefonu. JPG, PNG, HEIC, WebP, do 15 MB." />
          {!photosOf(ws.files).length && ws.brief.no_photos && <p className={`${p.small} ${p.muted} ${p.gap8}`}>Zaznaczyłeś, że nie masz zdjęć. Na stronie będą grafiki poglądowe, opisane jako poglądowe.</p>}
        </section>

        <div className={p.grid2}>
          <section className={p.card} aria-labelledby="m-logo">
            <div className={p.cardHead}><h2 id="m-logo" className={p.h2}>Logo</h2><span className={p.l}>{logosOf(ws.files).length || (ws.brief.no_logo ? 'bez logo' : 'brak')}</span></div>
            <Uploader ws={ws} api={api} purpose="logo" refresh={refresh} onError={setError} hint="SVG lub PNG z przezroczystym tłem najlepiej." />
          </section>
          <section className={p.card} aria-labelledby="m-docs">
            <div className={p.cardHead}><h2 id="m-docs" className={p.h2}>Dokumenty</h2><span className={p.l}>{docsOf(ws.files).length}</span></div>
            <Uploader ws={ws} api={api} purpose="document" refresh={refresh} onError={setError} hint="PDF, np. cennik, ulotka albo stara oferta, z której mamy wziąć tekst." />
          </section>
        </div>
      </div>
    </div>
  );
}
