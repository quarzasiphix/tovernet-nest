'use client';

import { useEffect, useState } from 'react';
import { KSIEGAI_APP_URL } from '@/lib/tovernet/ksiegai';
import { track } from '@/lib/tovernet/analytics';

// "Wróć do KsięgaI": visitors who opened the offer from the KsięgaI app (ksiegai-workspace
// tovernet.offerLink adds ?ksiegai_ret=formalnosci|podmiot&ksiegai_bp=<company id>) get a way
// back to the same company and page. KsięgaI keeps its own session and progress in the
// database, so the return needs no sign-in and no purchase. Kept per tab (sessionStorage), so
// it survives moving around the offer; only ever links to the configured KsięgaI app.
// ksiegai docs/plans/tovernet/21-ksiegai-offer-card.md.

const KEY = 'tovernet_ksiegai_return';
const PATHS: Record<string, string> = { formalnosci: '/podmiot/checklist', podmiot: '/podmiot' };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readReturn(): string | null {
  const params = new URLSearchParams(window.location.search);
  const ret = params.get('ksiegai_ret');
  const bp = params.get('ksiegai_bp');
  if (ret && PATHS[ret] && bp && UUID_RE.test(bp)) {
    const url = `${KSIEGAI_APP_URL.replace(/\/$/, '')}${PATHS[ret]}?business=${bp}`;
    try { sessionStorage.setItem(KEY, url); } catch { /* storage blocked */ }
    params.delete('ksiegai_ret');
    params.delete('ksiegai_bp');
    const qs = params.toString();
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`);
    return url;
  }
  try {
    const saved = sessionStorage.getItem(KEY);
    return saved && new URL(saved).origin === new URL(KSIEGAI_APP_URL).origin ? saved : null;
  } catch { return null; }
}

export default function KsiegaiReturnLink() {
  const [href, setHref] = useState<string | null>(null);
  useEffect(() => { setHref(readReturn()); }, []);
  if (!href) return null;
  return (
    <a
      href={href}
      onClick={() => track('ksiegai_return_clicked', { page: window.location.pathname }, { beforeNavigation: true })}
      style={{
        position: 'fixed', left: 12, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)', zIndex: 60,
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999,
        background: 'rgba(15,23,42,0.82)', color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: 1,
        textDecoration: 'none', boxShadow: '0 6px 20px rgba(2,6,23,0.25)', backdropFilter: 'blur(6px)',
      }}
    >
      <span aria-hidden>←</span> Wróć do KsięgaI
    </a>
  );
}
