'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { publicAction } from '@/lib/tovernet/api';
import s from './brand.module.css';

type DocRow = {
  order_id: string;
  order_number: string;
  company: string;
  accepted_at: string;
  signatory: string;
  authority_status: string;
  work_not_before: string | null;
  protected_buyer: boolean;
  spec_sha256: string | null;
  documents: { key: string; title: string; version: string; pdf: string | null; sha256: string }[] | null;
};

const AUTHORITY: Record<string, string> = {
  verified: 'umocowanie potwierdzone w KRS',
  co_signatory_required: 'czeka na akceptację drugiej osoby uprawnionej',
  poa_required: 'czeka na pełnomocnictwo',
  not_in_registry: 'czeka na pełnomocnictwo albo potwierdzenie osoby uprawnionej',
  staff_review: 'umocowanie sprawdzamy',
};
const date = (iso: string) => new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

/** "Dokumenty": what each order was accepted under (14-legal-operations-audit.md §9.2). */
export default function PanelDocuments({ token }: { token: string }) {
  const [rows, setRows] = useState<DocRow[] | null>(null);
  useEffect(() => {
    publicAction<{ documents: DocRow[] }>('tovernetPanel.documents', {}, token)
      .then((r) => setRows(r.documents))
      .catch(() => setRows([]));
  }, [token]);
  if (!rows?.length) return null;

  return (
    <section className="mt-8 space-y-3" aria-label="Dokumenty">
      <h2 className="font-bold text-lg">Dokumenty</h2>
      {rows.map((r) => (
        <div key={r.order_id} className={s.card}>
          <p className="font-semibold">Zamówienie {r.order_number} · {r.company}</p>
          <p className="text-sm mt-1">Zaakceptowane {date(r.accepted_at)} przez {r.signatory}; {AUTHORITY[r.authority_status] ?? r.authority_status}.</p>
          {r.protected_buyer && r.work_not_before && new Date(r.work_not_before) > new Date() && (
            <p className="text-sm mt-1">Prace zaczniemy {date(r.work_not_before)}, po upływie terminu do odstąpienia od umowy.</p>
          )}
          <ul className="mt-3 space-y-1 text-sm">
            {(r.documents ?? []).map((d) => (
              <li key={d.key}>
                {d.pdf
                  ? <a className="inline-flex items-center gap-1.5 underline" href={d.pdf} target="_blank" rel="noreferrer"><FileText size={14} aria-hidden="true" />{d.title}, wersja {d.version}</a>
                  : <span>{d.title}, wersja {d.version}</span>}
              </li>
            ))}
          </ul>
          {r.spec_sha256 && <p className="mt-2 text-xs opacity-70 break-all">Specyfikacja zamówienia, SHA-256 {r.spec_sha256}. Pełna treść jest w potwierdzeniu zamówienia na Twoim e-mailu.</p>}
        </div>
      ))}
    </section>
  );
}
