'use client';

import { useEffect, useMemo, useState } from 'react';
import PanelWorkspace from './PanelWorkspace';
import { FIXTURE_STATES, fixtureApi, type FixtureState } from './fixture';

/** /podglad-panelu/?stan=…: the panel on fixture data, every state, no server. `?czysto` hides the switcher. */
export default function PanelPreview() {
  const [state, setState] = useState<FixtureState | null>(null);
  const [clean, setClean] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get('stan') as FixtureState;
    setState(FIXTURE_STATES.some((x) => x.key === s) ? s : 'materialy');
    setClean(q.has('czysto'));
    try { localStorage.removeItem('tv-panel-project'); } catch { /* ignore */ }
  }, []);
  const api = useMemo(() => (state ? fixtureApi(state) : null), [state]);
  if (!api || !state) return null;
  return (
    <>
      <PanelWorkspace key={state} api={api} email="biuro@voltera.example" onSignOut={() => undefined} />
      {!clean && (
        <nav aria-label="Stan podglądu" style={{ position: 'fixed', right: 12, top: 64, zIndex: 90, display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 260, padding: 8, background: '#15161A', color: '#fff', font: '500 11px monospace' }}>
          <span style={{ width: '100%', opacity: 0.7 }}>Podgląd panelu · dane fikcyjne</span>
          {FIXTURE_STATES.map((x) => (
            <a key={x.key} href={`?stan=${x.key}`} style={{ padding: '3px 6px', border: '1px solid #fff', color: '#fff', textDecoration: 'none', background: x.key === state ? '#2536C4' : 'transparent' }}>{x.label}</a>
          ))}
        </nav>
      )}
    </>
  );
}
