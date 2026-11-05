'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { openKsiegaiInvoice } from '@/lib/tovernet/ksiegai';
import p from './panel.module.css';

/**
 * "Faktura F/…" as a link into Księgai: signs the customer in there (one-time handoff, no second
 * login) and opens that invoice in the buyer's Wydatki. Owned by the Księgai integration
 * (docs/plans/tovernet/17-ksiegai-integration.md in ksiegai).
 */
export default function InvoiceLink({ orderId, number, placement }: { orderId: string; number: string; placement: string }) {
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState('');
  return (
    <span>
      <button type="button" className={p.btnGhost} disabled={opening} style={{ padding: 0 }}
              title="Otwórz fakturę w Księgai (nowa karta)"
              onClick={() => {
                setOpening(true); setError('');
                // New tab: the panel stays here, so the button resets once the tab has its URL.
                openKsiegaiInvoice({ orderId, placement }).then(() => setOpening(false), (e) => {
                  setError(e instanceof Error && e.message ? e.message : 'Nie udało się otworzyć faktury. Spróbuj ponownie.');
                  setOpening(false);
                });
              }}>
        {opening ? 'Otwieramy Księgai…' : `Faktura ${number}`}<ExternalLink size={14} aria-hidden="true" />
      </button>
      {error && <span role="alert" className={p.small} style={{ display: 'block', color: 'var(--err)' }}>{error}</span>}
    </span>
  );
}
