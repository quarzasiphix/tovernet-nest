'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { track } from '@/lib/tovernet/analytics';
import { dismissPushPrompt, pushPromptDismissed, pushState, type PushState } from '@/lib/tovernet/push';
import type { PushApi } from './types';
import p from './panel.module.css';

/**
 * Browser notifications for this device. 'prompt': the card after a purchase, until the client
 * turns push on or dismisses it. 'settings': the row in Konto, always shown.
 * E-mail goes out either way; push only adds the instant alert.
 */
export default function PushCard({ push, variant }: { push: PushApi; variant: 'prompt' | 'settings' }) {
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [hidden, setHidden] = useState(false);

  useEffect(() => { pushState().then(setState).catch(() => setState('unsupported')); }, []);

  if (!state) return null;
  // The prompt stays after a successful enable to show the confirmation, then goes for good.
  const justEnabled = state === 'on' && Boolean(msg);
  if (variant === 'prompt' && !justEnabled && (hidden || (state !== 'off' && state !== 'ios-home-screen') || pushPromptDismissed())) return null;

  const enable = async () => {
    setBusy(true); setMsg('');
    const r = await push.enable();
    setBusy(false);
    track('push_enable', { ok: r.ok, reason: r.reason ?? null, placement: variant });
    if (r.ok) { setState('on'); setMsg('Gotowe. Powiadomimy Cię tutaj o każdej nowości w projekcie.'); return; }
    if (r.reason === 'denied') { setState('denied'); return; }
    setMsg('Nie udało się włączyć powiadomień. Spróbuj ponownie za chwilę.');
  };
  const disable = async () => {
    setBusy(true);
    await push.disable();
    setBusy(false);
    setState('off');
    track('push_disable');
  };
  const dismiss = () => { dismissPushPrompt(); setHidden(true); track('push_prompt_dismissed'); };

  const text: Record<PushState, string> = {
    off: 'Włącz powiadomienia, a damy znać od razu, gdy dodamy podgląd strony, ustawimy domenę albo napiszemy do Ciebie. E-maile wysyłamy tak czy inaczej.',
    on: 'Powiadomienia są włączone na tym urządzeniu.',
    denied: 'Powiadomienia są zablokowane w przeglądarce. Odblokuj je w ustawieniach strony (ikona kłódki przy adresie), a potem odśwież panel.',
    'ios-home-screen': 'Na iPhonie powiadomienia działają, gdy dodasz panel do ekranu głównego: przycisk Udostępnij, potem „Do ekranu początkowego”. Otwórz panel z ikony i włącz powiadomienia tutaj.',
    unsupported: 'Ta przeglądarka nie obsługuje powiadomień. Wiadomości o projekcie dostaniesz e-mailem.',
  };

  return (
    <section className={variant === 'prompt' ? p.banner : p.section} aria-labelledby={`push-${variant}`} data-testid={`push-${variant}`}>
      {variant === 'prompt' && <Bell size={20} aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />}
      <div style={{ flex: 1 }}>
        <h2 id={`push-${variant}`} className={p.h2} style={{ margin: '0 0 6px', fontSize: variant === 'prompt' ? 17 : undefined }}>
          {variant === 'prompt' ? 'Powiadomienia o Twojej stronie' : 'Powiadomienia na tym urządzeniu'}
        </h2>
        <p className={p.small} style={{ margin: 0 }}>{msg || text[state]}</p>
        {(state === 'off' || state === 'on') && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
            {state === 'off' && <button type="button" className={p.btn} disabled={busy} onClick={() => void enable()}><Bell size={16} aria-hidden="true" />{busy ? 'Włączamy…' : 'Włącz powiadomienia'}</button>}
            {state === 'on' && variant === 'settings' && <button type="button" className={p.btnGhost} disabled={busy} onClick={() => void disable()}><BellOff size={16} aria-hidden="true" />Wyłącz na tym urządzeniu</button>}
            {state === 'off' && variant === 'prompt' && <button type="button" className={p.btnGhost} onClick={dismiss}>Nie teraz</button>}
          </div>
        )}
        {state === 'ios-home-screen' && variant === 'prompt' && (
          <button type="button" className={p.btnGhost} style={{ marginTop: 8 }} onClick={dismiss}>Rozumiem</button>
        )}
      </div>
    </section>
  );
}
